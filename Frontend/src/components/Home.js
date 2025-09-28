import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleNavigateToOffice = () => {
    navigate("/office");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Welcome to Address Management System</h1>
        <p className="text-lg text-gray-600 mb-8">Manage your office addresses efficiently</p>
        <button
          onClick={handleNavigateToOffice}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-8 py-4 rounded-lg transition-all duration-200 hover:shadow-lg transform hover:scale-105"
        >
          Go to Office Forms
        </button>
      </div>
    </div>
  );
};

export default Home;