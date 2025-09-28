import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleNavigateToOffice = () => {
    navigate("/office");
  };

  const handleNavigateToCorporate = () => {
    navigate("/corporate");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Address Management System</h1>
        <p className="text-lg text-gray-600 mb-12">Complete solution for address management and corporate registrations</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {/* Office Forms Card */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="text-blue-500 mb-4">
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Address Forms</h3>
            <p className="text-gray-600 mb-6">Manage sender and receiver address information with real-time pincode validation</p>
            <button
              onClick={handleNavigateToOffice}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 hover:shadow-lg transform hover:scale-105 w-full"
            >
              Go to Address Forms
            </button>
          </div>

          {/* Corporate Registration Card */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="text-green-500 mb-4">
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Corporate Registration</h3>
            <p className="text-gray-600 mb-6">Register your company with automatic ID generation and secure password protection</p>
            <button
              onClick={handleNavigateToCorporate}
              className="bg-green-500 hover:bg-green-600 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 hover:shadow-lg transform hover:scale-105 w-full"
            >
              Corporate Registration
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4">
            <div className="text-purple-500 mb-2">
            </div>
            <h4 className="font-semibold text-gray-800">Real-time Validation</h4>
            <p className="text-sm text-gray-600">Instant pincode verification with area suggestions</p>
          </div>
          
          <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4">
            <div className="text-orange-500 mb-2">
            </div>
            <h4 className="font-semibold text-gray-800">Secure Registration</h4>
            <p className="text-sm text-gray-600">Password protected corporate accounts with unique IDs</p>
          </div>
          
          <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4">
            <div className="text-red-500 mb-2">
            </div>
            <h4 className="font-semibold text-gray-800">Data Management</h4>
            <p className="text-sm text-gray-600">Comprehensive form tracking and statistics</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;