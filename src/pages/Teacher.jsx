




import React, { useState, useEffect } from "react";
import { socket } from "../socket";

function Teacher() {
  const [question, setQuestion] = useState("");
  const [duration, setDuration] = useState(60);
  const [results, setResults] = useState({});
  const [students, setStudents] = useState([]);

  useEffect(() => {
    socket.on("poll-update", setResults);
    socket.on("poll-ended", setResults);

    socket.on("students-list", (list) => {
      setStudents(list);
    });

    return () => {
      socket.off("poll-update");
      socket.off("poll-ended");
      socket.off("students-list");
    };
  }, []);
    const handleDelete=()=>{
    setResults({});
  }

  const askQuestion = () => {
    if (question.trim() && duration > 0) {
      socket.emit("ask-question", { question: question.trim(), duration });
      setQuestion("");
      setResults({});
    }
  };

  const kickStudent = (id) => {

    socket.emit("kick-student", id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-purple-100 to-white flex flex-col items-center p-6">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-xl p-6">
        <h2 className="text-3xl font-bold mb-4 text-purple-700">Ask a Question</h2>
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter your question..."
          className="w-full border p-3 rounded mb-4 border-purple-300 text-lg"
        />
        <div className="flex items-center gap-4 mb-4">
          <label className="text-lg">Duration (seconds):</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            min="10"
            className="border p-2 w-24 rounded border-purple-300"
          />
        </div>
        <button
          onClick={askQuestion}
          className="w-full bg-purple-600 text-white py-3 text-lg rounded hover:bg-purple-700 transition"
        >
          Send Poll
        </button>
{/* 
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Live Results</h3>
          {Object.entries(results).map(([opt, count]) => (
            <div key={opt} className="flex justify-between border-b py-2 text-lg">
              <span>{opt}</span>

              <div className="">

               <span className="font-bold">{count}</span>
              <button className="px-5 py-3 bg-red-400 ml-10 hover:bg-red-600 cursor-pointer rounded-2xl" onClick={handleDelete}>Delete</button>
              </div>
            
            </div>
          ))}
        </div> */}

        <div className="mt-8">
  <h3 className="text-xl font-semibold text-gray-800 mb-2">Live Results</h3>
  {Object.keys(results).length > 0 ? (
    Object.entries(results).map(([opt, count]) => (
      <div key={opt} className="flex justify-between border-b py-2 text-lg">
        <span>{opt}</span>
        <span className="font-bold text-purple-700">{count} vote{count > 1 ? 's' : ''}</span>
      </div>
    ))
  ) : (
    <p className="text-gray-500 italic">No responses yet.</p>
  )}
</div>


        <div className="mt-10">
          <h3 className="text-xl font-bold text-purple-700 mb-3">Connected Students</h3>
          <ul className="space-y-2">
            {students.map((s) => (
              <li key={s.id} className="flex justify-between items-center border p-3 rounded">
                <span>{s.name}</span>
                <button
                  onClick={() => kickStudent(s.id)}
                  className="text-red-600 hover:underline"
                >
                  Kick
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Teacher;
