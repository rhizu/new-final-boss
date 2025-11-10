import React, { useState } from "react";

function DataCollector({ detectedSign }) {
  const [results, setResults] = useState([]);
  const [currentTrueLabel, setCurrentTrueLabel] = useState("");

  // Call this every time a prediction is made
  const logPrediction = (trueLabel, predictedLabel) => {
    if (!trueLabel || !predictedLabel) return;
    setResults((prev) => [...prev, { trueLabel, predictedLabel }]);
  };

  // Automatically log each detected sign
  React.useEffect(() => {
    if (detectedSign && currentTrueLabel) {
      logPrediction(currentTrueLabel, detectedSign);
    }
  }, [detectedSign]);

  // Export results as JSON
  const exportResults = () => {
    const blob = new Blob([JSON.stringify(results, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "asl_predictions.json";
    a.click();
  };

  return (
    <div className="p-4 bg-gray-100 rounded">
      <label>
        <b>Current True Label:</b>
        <input
          type="text"
          value={currentTrueLabel}
          onChange={(e) => setCurrentTrueLabel(e.target.value.toUpperCase())}
          placeholder="Enter sign letter (e.g., A)"
          maxLength={1}
          className="ml-2 border p-1"
        />
      </label>
      <button
        onClick={exportResults}
        className="ml-3 bg-blue-600 text-white px-3 py-1 rounded"
      >
        Export Results
      </button>

      <p className="mt-2 text-sm text-gray-600">
        Detected signs logged: {results.length}
      </p>
    </div>
  );
}

export default DataCollector;
