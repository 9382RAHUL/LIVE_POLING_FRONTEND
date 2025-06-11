

import React, { useEffect, useState } from "react";
import { socket } from "../socket";

function Student() {
  const [name, setName] = useState("");
  const [tempName, setTempName] = useState("");
  // const [tempName, setTempName] = useState(() => localStorage.getItem("name") || "");

  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState({});
  const [timeLeft, setTimeLeft] = useState(60);
  const [kicked, setKicked] = useState(false);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected.");
    });

    socket.on("new-question", (q) => {
      console.log("📩 Received new question:", q);
      setQuestion(q);
      setSubmitted(false);
      setAnswer("");
      setResults({});
      setTimeLeft(q.duration || 60); // 🕒 use custom duration
    });

    socket.on("poll-update", setResults);
    socket.on("poll-ended", setResults);

    socket.on("kicked", () => {
      alert("🚫 You have been removed by the teacher.");
      setKicked(true);
      localStorage.removeItem("name");
    });

    return () => {
      socket.off("new-question");
      socket.off("poll-update");
      socket.off("poll-ended");
      socket.off("kicked");
    };
  }, []);

  useEffect(() => {
    if (name) {
      socket.emit("student-join", name);
    }
  }, [name]);

  useEffect(() => {
    if (question && !submitted && timeLeft > 0) {
      const interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearInterval(interval);
    } else if (timeLeft === 0 && !submitted) {
      handleSubmit();
    }
  }, [question, submitted, timeLeft]);

  const handleSubmit = () => {
    if (!submitted && answer) {
      socket.emit("submit-answer", { answer });
      setSubmitted(true);
    }
  };

  if (kicked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-100 text-center px-4">
        <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
          <h2 className="text-3xl font-bold text-red-600 mb-4">
            You’ve been kicked out
          </h2>
          <p className="text-gray-700">
            Please contact the teacher or reload to rejoin.
          </p>
        </div>
      </div>
    );
  }

  if (!name) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple-50 px-4">
        <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
          <h2 className="text-3xl font-bold text-center text-purple-700 mb-4">
            Enter Your Name
          </h2>
          <input
            type="text"
            className="w-full border border-gray-300 p-3 rounded mb-4 text-lg"
            onChange={(e) => setTempName(e.target.value)}
            value={tempName}
          />
          <button
            onClick={() => {
              if (tempName.trim()) {
                localStorage.setItem("name", tempName.trim());
                setName(tempName.trim());
              }
            }}
            className="w-full bg-purple-600 text-white py-3 text-lg rounded hover:bg-purple-700 transition"
          >
            Join Poll
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-50 flex flex-col items-center p-6">
      <div className="w-full max-w-xl bg-white shadow-xl rounded-xl p-6">
        <h2 className="text-2xl font-bold text-purple-700 mb-4">
          Live Question{" "}
          {question ? (
            <span className="text-red-500">({timeLeft}s)</span>
          ) : null}
        </h2>
        {question && !submitted && (
          <>
            <p className="text-lg mb-4">{question.question}</p>
            <input
              value={answer}
              onChange={(e) => {
                if (timeLeft > 0) setAnswer(e.target.value);
              }}
              disabled={timeLeft === 0}
              className={`border p-3 rounded w-full mb-4 ${
                timeLeft === 0 ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
              placeholder={timeLeft === 0 ? "Time's up!" : "Your answer..."}
            />
            <button
              onClick={handleSubmit}
              className="bg-purple-600 text-white w-full py-3 rounded hover:bg-purple-700"
            >
              Submit Answer
            </button>
          </>
        )}
        {submitted && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-3">
              Live Results
            </h3>
            {Object.entries(results).map(([opt, count]) => (
              <div
                key={opt}
                className="flex justify-between border-b py-2 text-lg"
              >
                <span>{opt}</span>
                <span className="font-bold">{count}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Student;
