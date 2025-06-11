import React from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-purple-200 to-purple-50 text-center px-4">
      <h1 className="text-5xl font-extrabold mb-4 text-purple-700">Live Polling System</h1>
      <p className="mb-10 text-gray-700 text-lg">Choose your role to get started</p>
      <div className="flex flex-col md:flex-row gap-8">
        <div onClick={() => navigate("/student")} className="cursor-pointer border-2 border-purple-500 hover:bg-purple-100 p-8 rounded-xl shadow-lg transition-all w-72">
          <h2 className="text-2xl font-bold text-purple-700 mb-2">🎓 Student</h2>
          <p className="text-sm text-gray-600">Join and answer live polls in real-time.</p>
        </div>
        <div onClick={() => navigate("/teacher")} className="cursor-pointer border-2 border-purple-500 hover:bg-purple-100 p-8 rounded-xl shadow-lg transition-all w-72">
          <h2 className="text-2xl font-bold text-purple-700 mb-2">🧑‍🏫 Teacher</h2>
          <p className="text-sm text-gray-600">Create polls and view live results.</p>
        </div>
      </div>
    </div>
  );
}
export default HomePage;
