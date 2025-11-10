import React, { useState, useRef, useEffect, useCallback } from "react";
import "./Quiz.css";
import { v4 as uuidv4 } from "uuid";
import { FilesetResolver, GestureRecognizer } from "@mediapipe/tasks-vision";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { HAND_CONNECTIONS } from "@mediapipe/hands";
import Webcam from "react-webcam";
import { useDispatch, useSelector } from "react-redux";
import { addSignData } from "../../redux/actions/signdataaction";
import ProgressBar from "../Detect/ProgressBar/ProgressBar"; // adjust path if different

/* suppress noisy warnings */
const originalWarn = console.warn;
console.warn = (...args) => {
  if (
    typeof args[0] === "string" &&
    (args[0].includes("Feedback manager") ||
      args[0].includes("Graph successfully") ||
      args[0].includes("WASM") ||
      args[0].includes("GL version"))
  )
    return;
  originalWarn.apply(console, args);
};

const CONFIDENCE_THRESHOLD = 0.9;

/* Example quiz set - replace or generate dynamically as needed */
const quizQuestions = [
  { id: 1, word: "BYE" },
  { id: 2, word: "DO" },
  { id: 3, word: "SEE" },
  { id: 4, word: "EYE" },
];

const Quiz = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const requestRef = useRef(null);
  const timerRef = useRef(null);

  const [gestureRecognizer, setGestureRecognizer] = useState(null);
  const [runningMode, setRunningMode] = useState("IMAGE");
  const [gestureOutput, setGestureOutput] = useState("");
  const [progress, setProgress] = useState(0);

  const [webcamRunning, setWebcamRunning] = useState(false);
  const recordedSequenceRef = useRef([]);
  const [recordedSequence, setRecordedSequence] = useState([]);

  // Quiz states
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20); // per-question timeout in seconds
  const [results, setResults] = useState([]);

  const user = useSelector((state) => state.auth?.user);
  const { accessToken } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // --- Helper: compare accuracy (simple positional match)
  const compareStringsAccuracy = (formed, target) => {
    let matches = 0;
    const len = Math.min(formed.length, target.length);
    for (let i = 0; i < len; i++) {
      if (formed[i] === target[i]) matches++;
    }
    return target.length === 0 ? 0 : matches / target.length;
  };

  // --- Timer effect per question
  useEffect(() => {
    if (!quizStarted || quizFinished || !webcamRunning) return;

    // ensure previous interval cleared
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // time expired -> mark incorrect and move on
          handleNextQuestion(false);
          return 20;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizStarted, currentQuestionIndex, quizFinished, webcamRunning]);

  // --- Core prediction loop
  const predictWebcam = useCallback(async () => {
    if (!gestureRecognizer) return;

    // Ensure webcam video exists and has dimensions
    const videoEl = webcamRef.current?.video;
    if (!videoEl) {
      if (webcamRunning)
        requestRef.current = requestAnimationFrame(predictWebcam);
      return;
    }

    // Wait until the video element has valid frames
    if (videoEl.readyState !== 4) {
      // Not enough data yet
      if (webcamRunning)
        requestRef.current = requestAnimationFrame(predictWebcam);
      return;
    }

    const videoWidth = videoEl.videoWidth || videoEl.width;
    const videoHeight = videoEl.videoHeight || videoEl.height;

    // If width or height are zero, skip this frame — this avoids ROI width/height <= 0 error
    if (!videoWidth || !videoHeight) {
      if (webcamRunning)
        requestRef.current = requestAnimationFrame(predictWebcam);
      return;
    }

    if (runningMode === "IMAGE") {
      setRunningMode("VIDEO");
      try {
        gestureRecognizer.setOptions({ runningMode: "VIDEO" });
      } catch (err) {
        // ignore setOptions race
      }
    }

    // Draw video size to canvas
    try {
      const nowInMs = Date.now();
      let results;
      try {
        // Wrap recognizeForVideo in try/catch to avoid crashing on occasional internal errors
        results = await gestureRecognizer.recognizeForVideo(videoEl, nowInMs);
      } catch (recErr) {
        // If recognition fails for this frame, skip gracefully
        console.warn("recognizeForVideo error (skipping frame):", recErr);
        if (webcamRunning)
          requestRef.current = requestAnimationFrame(predictWebcam);
        return;
      }

      const ctx = canvasRef.current.getContext("2d");
      ctx.save();
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      // set sizes
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // draw landmarks if present
      if (results?.landmarks && results.landmarks.length > 0) {
        for (const landmarks of results.landmarks) {
          drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {
            color: "#00FF00",
            lineWidth: 3,
          });
          drawLandmarks(ctx, landmarks, { color: "#FF0000", lineWidth: 2 });
        }
      }

      // gestures
      if (results?.gestures && results.gestures.length > 0) {
        const detectedGesture = results.gestures[0][0];
        const score = detectedGesture.score ?? 0;
        const sign = detectedGesture.categoryName ?? "";

        setGestureOutput(sign);
        setProgress(Math.round(score * 100));

        if (score >= CONFIDENCE_THRESHOLD) {
          // push only if different than previous (reduces duplicates)
          if (recordedSequenceRef.current.at(-1) !== sign) {
            recordedSequenceRef.current.push(sign);
            setRecordedSequence([...recordedSequenceRef.current]);
          }
        }
      } else {
        setGestureOutput("");
        setProgress(0);
      }

      // Check if user has produced required number of letters for current word
      // --- after you update recordedSequenceRef when a confident sign is detected
      const currentWord = quizQuestions[currentQuestionIndex]?.word || "";

      // Normalize target (remove spaces, force uppercase)
      const normalizedTarget = currentWord.replace(/\s+/g, "").toUpperCase();

      // Sometimes detector outputs tokens like "A", "a", or "A " — normalize recorded sequence too
      const normalizedRecorded = recordedSequenceRef.current
        .map((s) => (s || "").toString().trim().toUpperCase())
        // filter out empty tokens just in case
        .filter(Boolean);

      // Only check completion when we have at least as many normalized tokens as target length
      if (
        !quizFinished &&
        quizStarted &&
        normalizedRecorded.length >= normalizedTarget.length
      ) {
        // use only the needed number of letters (in case of extra noise)
        const formed = normalizedRecorded
          .slice(0, normalizedTarget.length)
          .join("");
        const isCorrect = formed === normalizedTarget;

        // call handler (debounce minor rapid repeats by ensuring we haven't already moved)
        // make sure to clear or set a flag inside handleNextQuestion to prevent double-calls
        handleNextQuestion(isCorrect);
      }

      ctx.restore();
    } catch (err) {
      // An unexpected error — log and continue
      console.error("Predict loop error:", err);
    }

    if (webcamRunning)
      requestRef.current = requestAnimationFrame(predictWebcam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    gestureRecognizer,
    runningMode,
    webcamRunning,
    currentQuestionIndex,
    quizFinished,
    quizStarted,
  ]);

  const animate = useCallback(() => {
    requestRef.current = requestAnimationFrame(animate);
    predictWebcam();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [predictWebcam]);

  // --- Move to next question (or finish quiz)
  const handleNextQuestion = (isCorrectFromCheck) => {
    // Prevent double runs
    if (timerRef.current === null && quizFinished) return;

    // stop per-question timer
    clearInterval(timerRef.current);
    timerRef.current = null;

    const currentWord = quizQuestions[currentQuestionIndex]?.word || "";
    const normalizedTarget = currentWord.replace(/\s+/g, "").toUpperCase();

    const normalizedRecorded = recordedSequenceRef.current
      .map((s) => (s || "").toString().trim().toUpperCase())
      .filter(Boolean);

    const formed = normalizedRecorded
      .slice(0, normalizedTarget.length)
      .join("");

    // Final correctness check (defensive)
    const isCorrect = isCorrectFromCheck || formed === normalizedTarget;

    // Compute positional accuracy (0..100)
    const accuracyPct = (() => {
      if (normalizedTarget.length === 0) return 0;
      let matches = 0;
      const len = Math.min(formed.length, normalizedTarget.length);
      for (let i = 0; i < len; i++) {
        if (formed[i] === normalizedTarget[i]) matches++;
      }
      return ((matches / normalizedTarget.length) * 100).toFixed(1);
    })();

    setResults((prev) => [
      ...prev,
      {
        word: currentWord,
        formedWord: formed || "-",
        isCorrect,
        accuracy: accuracyPct,
      },
    ]);

    // optional: save session data (if you already do this elsewhere)
    if (recordedSequenceRef.current.length > 0) {
      const sessionData = {
        id: uuidv4(),
        userId: user?.userId || "guest",
        username: user?.username || "Anonymous",
        createdAt: new Date().toString(),
        signsPerformed: recordedSequenceRef.current.map((s) => ({
          SignDetected: s,
          count: 1,
        })),
      };
      try {
        dispatch(addSignData(sessionData));
      } catch (e) {
        console.warn("Failed saving sign data:", e);
      }
    }

    // Prepare next question
    if (currentQuestionIndex + 1 < quizQuestions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      recordedSequenceRef.current = [];
      setRecordedSequence([]);
      setTimeLeft(20);
    } else {
      // finish quiz
      setQuizFinished(true);
      setQuizStarted(false);
      setWebcamRunning(false);
      cancelAnimationFrame(requestRef.current);
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // --- Start quiz
  const startQuiz = () => {
    if (!gestureRecognizer) {
      alert("Please wait for the gesture recognizer to load.");
      return;
    }

    // Reset state
    setResults([]);
    setCurrentQuestionIndex(0);
    recordedSequenceRef.current = [];
    setRecordedSequence([]);
    setQuizFinished(false);
    setQuizStarted(true);
    setWebcamRunning(true);
    setTimeLeft(20);

    // Start loop but ensure video has time to start; animate loop will guard with readyState tests
    if (!requestRef.current)
      requestRef.current = requestAnimationFrame(animate);
  };

  const stopQuizEarly = () => {
    setQuizFinished(true);
    setQuizStarted(false);
    setWebcamRunning(false);
    cancelAnimationFrame(requestRef.current);
    clearInterval(timerRef.current);
  };

  // --- Load Mediapipe gesture recognizer
  useEffect(() => {
    let mounted = true;
    async function loadRecognizer() {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );
        const recognizer = await GestureRecognizer.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "/models/sign_language_recognizer_25-04-2023.task",
          },
          numHands: 2,
          runningMode: runningMode,
        });
        if (mounted) {
          setGestureRecognizer(recognizer);
          console.log("GestureRecognizer loaded");
        } else {
          // cleanup if unmounted
          if (recognizer && recognizer.close) recognizer.close();
        }
      } catch (err) {
        console.error("Failed to load GestureRecognizer:", err);
      }
    }
    loadRecognizer();
    return () => {
      mounted = false;
      if (gestureRecognizer && gestureRecognizer.close) {
        try {
          gestureRecognizer.close();
        } catch (e) {}
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- UI: result screen
  if (quizFinished) {
    const totalCorrect = results.filter((r) => r.isCorrect).length;
    const avgAccuracy =
      results.length > 0
        ? results.reduce((sum, r) => sum + parseFloat(r.accuracy), 0) /
          results.length
        : 0;

    return (
      <div className="quiz-container">
        <h2>Quiz Results</h2>
        <p>
          Correct Answers: {totalCorrect}/{results.length}
        </p>
        <p>Average Accuracy: {avgAccuracy.toFixed(1)}%</p>

        <table className="quiz-table">
          <thead>
            <tr>
              <th>Word</th>
              <th>Your Answer</th>
              <th>Accuracy</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr key={i}>
                <td>{r.word}</td>
                <td>{r.formedWord || "-"}</td>
                <td>{r.accuracy}%</td>
                <td style={{ color: r.isCorrect ? "green" : "red" }}>
                  {r.isCorrect ? "✔" : "✘"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: 16 }}>
          <button className="quiz-btn" onClick={startQuiz}>
            Restart Quiz
          </button>
        </div>
      </div>
    );
  }

  // --- UI: main quiz display
  return (
    <div className="quiz-container">
      {!accessToken ? (
        <div className="not-logged-in">
          <h3>Please Login to save your progress</h3>
        </div>
      ) : null}

      {!quizStarted ? (
        <div className="quiz-prestart-card">
          <h2 className="quiz-prestart-title">
            Welcome to the ASL Spelling Quiz!
          </h2>
          <p className="quiz-prestart-desc">
            Practice spelling words using American Sign Language (ASL). Your
            webcam will detect each letter you form with your hands in
            real-time.
          </p>

          <div className="quiz-prestart-tips">
            <h3>Tips to Get Started:</h3>
            <ul>
              <li>Ensure your hands are fully visible to the camera.</li>
              <li>
                Form each letter clearly and hold for a moment until detected.
              </li>
              <li>
                Spell the word quickly and accurately for the best results.
              </li>
              <li>Maintain good lighting for better hand detection.</li>
            </ul>
          </div>

          <p className="quiz-prestart-ready">
            Are you ready to learn ASL while having fun?
          </p>

          <button className="quiz-btn" onClick={startQuiz}>
            Start Quiz
          </button>
        </div>
      ) : (
        <>
          <div className="quiz-video-wrapper">
            <Webcam
              audio={false}
              ref={webcamRef}
              mirrored
              className="quiz-webcam"
              screenshotFormat="image/jpeg"
            />
            <canvas ref={canvasRef} className="quiz-canvas" />
          </div>

          <div className="quiz-info">
            <h3>
              Question {currentQuestionIndex + 1}:{" "}
              <span>{quizQuestions[currentQuestionIndex]?.word || "-"}</span>
            </h3>
            <p>Time Left: {timeLeft}s</p>

            <div className="quiz-detected">
              <p>
                Detected: <strong>{gestureOutput || "-"}</strong>
              </p>
              {progress > 0 && <ProgressBar progress={progress} />}
            </div>

            <div className="quiz-formed">
              <h4>Word Formed:</h4>
              <p>{recordedSequence.join("") || "-"}</p>
            </div>

            <div style={{ marginTop: 12 }}>
              <button
                className="quiz-btn"
                onClick={() => {
                  recordedSequenceRef.current = [];
                  setRecordedSequence([]);
                }}
              >
                Reset Current Word
              </button>

              <button
                className="quiz-btn"
                style={{ marginLeft: 8 }}
                onClick={stopQuizEarly}
              >
                Stop Quiz
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Quiz;
