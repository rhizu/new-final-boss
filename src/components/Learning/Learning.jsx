import React from "react";
import "./Learning.css";

const signs = [
  {
    letter: "A",
    image: "/images/A.png",
    description:
      "Make a fist with your thumb resting along the outside of your fingers.",
  },
  {
    letter: "B",
    image: "/images/B.png",
    description:
      "Extend all fingers straight up, thumb across your palm. Keep your fingers together.",
  },
  {
    letter: "C",
    image: "/images/C.png",
    description:
      "Curve your fingers and thumb to form the shape of the letter 'C'.",
  },
  {
    letter: "D",
    image: "/images/D.png",
    description:
      "Raise your index finger and touch its tip to your thumb, keeping the other fingers curled down.",
  },
  {
    letter: "E",
    image: "/images/E.png",
    description:
      "Curl your fingers so the tips touch your thumb — like gently holding something small.",
  },
  {
    letter: "F",
    image: "/images/F.png",
    description:
      "Make a circle with your thumb and index finger; other fingers point up.",
  },
  {
    letter: "G",
    image: "/images/G.png",
    description:
      "Hold your index finger and thumb parallel, like you’re showing a small gap between them.",
  },
  {
    letter: "H",
    image: "/images/H.png",
    description:
      "Extend your index and middle finger together, palm facing sideways.",
  },
  {
    letter: "I",
    image: "/images/I.png",
    description: "Make a fist and extend your pinky finger straight up.",
  },
  {
    letter: "J",
    image: "/images/J.png",
    description:
      "Start with the 'I' handshape, then trace the letter 'J' in the air with your pinky.",
  },
  {
    letter: "K",
    image: "/images/K.png",
    description:
      "Raise your index and middle fingers like a peace sign, thumb touching the base of the middle finger.",
  },
  {
    letter: "L",
    image: "/images/L.png",
    description:
      "Extend your thumb and index finger to form an 'L' shape, other fingers folded down.",
  },
  {
    letter: "M",
    image: "/images/M.png",
    description:
      "Tuck your thumb under your first three fingers, resting against your palm.",
  },
  {
    letter: "N",
    image: "/images/N.png",
    description:
      "Tuck your thumb under your first two fingers, like a smaller version of 'M'.",
  },
  {
    letter: "O",
    image: "/images/O.png",
    description: "Form your fingers and thumb into a round 'O' shape.",
  },
  {
    letter: "P",
    image: "/images/P.png",
    description:
      "Form a 'K' handshape but tilt your hand downward like pointing at something.",
  },
  {
    letter: "Q",
    image: "/images/Q.png",
    description: "Make a 'G' handshape and point it downward.",
  },
  {
    letter: "R",
    image: "/images/R.png",
    description:
      "Cross your index and middle fingers while keeping others curled in.",
  },
  {
    letter: "S",
    image: "/images/S.png",
    description:
      "Make a tight fist with your thumb tucked in front of your fingers.",
  },
  {
    letter: "T",
    image: "/images/T.png",
    description:
      "Make a fist and tuck your thumb between your index and middle fingers.",
  },
  {
    letter: "U",
    image: "/images/U.png",
    description:
      "Hold your index and middle fingers together, pointing upward, palm forward.",
  },
  {
    letter: "V",
    image: "/images/V.png",
    description:
      "Raise your index and middle fingers apart to make a 'V' shape.",
  },
  {
    letter: "W",
    image: "/images/W.png",
    description:
      "Raise your index, middle, and ring fingers apart to make a 'W'.",
  },
  {
    letter: "X",
    image: "/images/X.png",
    description:
      "Make a hook shape with your index finger while other fingers are in a fist.",
  },
  {
    letter: "Y",
    image: "/images/Y.png",
    description:
      "Extend your thumb and pinky finger, fold the rest — like a phone gesture.",
  },
  {
    letter: "Z",
    image: "/images/Z.png",
    description: "Raise your index finger and draw a 'Z' shape in the air.",
  },
];

const speakText = (text) => {
  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  } else {
    alert("Sorry, your browser does not support speech synthesis.");
  }
};

const Learning = () => {
  return (
    <div className="learn-page">
      <header className="learn-header">
        <h1>Learn American Sign Language</h1>
        <p>
          Click on any sign card to hear how to perform the gesture clearly.
        </p>
      </header>

      <div className="sign-grid">
        {signs.map((sign, index) => (
          <div
            className="sign-card"
            key={index}
            onClick={() => speakText(sign.description)}
          >
            <div className="sign-image-container">
              <img src={sign.image} alt={sign.letter} className="sign-image" />
            </div>
            <div className="sign-info">
              <h2 className="sign-letter">{sign.letter}</h2>
              <p className="sign-desc">{sign.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Learning;
