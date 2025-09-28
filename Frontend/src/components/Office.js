import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddressForm from "./AddressForm";

const Office = () => {
  const navigate = useNavigate();
  const [senderEmail, setSenderEmail] = useState("");
  const [formData, setFormData] = useState(null);
  const [completionStatus, setCompletionStatus] = useState({
    senderCompleted: false,
    receiverCompleted: false,
    formCompleted: false,
    completionPercentage: 0
  });

  const handleNavigateHome = () => {
    navigate("/");
  };

  const handleFormSubmit = (formType, data) => {
    setFormData(data);
    
    if (formType === 'sender') {
      setSenderEmail(data.senderEmail);
      setCompletionStatus(prev => ({
        ...prev,
        senderCompleted: data.senderCompleted,
        formCompleted: data.formCompleted,
        completionPercentage: data.getCompletionPercentage ? data.getCompletionPercentage() : 50
      }));
    } else if (formType === 'receiver') {
      setCompletionStatus(prev => ({
        ...prev,
        receiverCompleted: data.receiverCompleted,
        formCompleted: data.formCompleted,
        completionPercentage: data.getCompletionPercentage ? data.getCompletionPercentage() : 100
      }));
    }
  };

  const getProgressColor = () => {
    if (completionStatus.formCompleted) return 'bg-green-500';
    if (completionStatus.completionPercentage >= 50) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const getStatusMessage = () => {
    if (completionStatus.formCompleted) {
      return "✅ Both forms completed successfully!";
    } else if (completionStatus.senderCompleted && !completionStatus.receiverCompleted) {
      return "📝 Sender form completed. Please fill receiver form.";
    } else if (!completionStatus.senderCompleted && completionStatus.receiverCompleted) {
      return "📝 Receiver form completed. Please fill sender form.";
    } else if (completionStatus.completionPercentage > 0) {
      return `📝 Form ${completionStatus.completionPercentage}% completed.`;
    }
    return "📝 Please fill both sender and receiver forms.";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={handleNavigateHome}
            className="mb-4 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            ← Back to Home
          </button>
          <h2 className="text-3xl font-bold text-gray-800">Address Management System</h2>
          <p className="text-gray-600 mt-2">Fill out sender and receiver information in a single form</p>
          
          {/* Progress Bar */}
          {completionStatus.completionPercentage > 0 && (
            <div className="mt-4 max-w-md mx-auto">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span>{completionStatus.completionPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
                  style={{ width: `${completionStatus.completionPercentage}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">{getStatusMessage()}</p>
            </div>
          )}
        </div>

        {/* Form Status Alert */}
        {formData && (
          <div className="mb-6 max-w-4xl mx-auto">
            <div className={`p-4 rounded-lg border ${
              completionStatus.formCompleted 
                ? 'bg-green-50 border-green-200' 
                : 'bg-blue-50 border-blue-200'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-800">Form Status</h4>
                  <p className="text-sm text-gray-600">{getStatusMessage()}</p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">
                    Sender: {completionStatus.senderCompleted ? '✅' : '❌'}
                  </div>
                  <div className="text-xs text-gray-500">
                    Receiver: {completionStatus.receiverCompleted ? '✅' : '❌'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Two Forms Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Sender Form (Left) */}
          <div className="flex justify-center">
            <div className="w-full">
              <div className="mb-4 text-center">
                <h4 className="text-lg font-medium text-gray-700 mb-2">Sender Information</h4>
                <div className="w-16 h-1 bg-blue-500 mx-auto rounded"></div>
              </div>
              <AddressForm 
                title="Sender Details" 
                formType="sender"
                onFormSubmit={handleFormSubmit}
              />
            </div>
          </div>

          {/* Receiver Form (Right) */}
          <div className="flex justify-center">
            <div className="w-full">
              <div className="mb-4 text-center">
                <h4 className="text-lg font-medium text-gray-700 mb-2">Receiver Information</h4>
                <div className="w-16 h-1 bg-green-500 mx-auto rounded"></div>
              </div>
              <AddressForm 
                title="Receiver Details" 
                formType="receiver"
                senderEmail={senderEmail}
                onFormSubmit={handleFormSubmit}
              />
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h5 className="font-medium text-gray-800 mb-3">Instructions:</h5>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">1.</span>
                <span>Fill out the <strong>Sender</strong> form (left) first with the person sending the package/document.</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">2.</span>
                <span>Then fill out the <strong>Receiver</strong> form (right) with the person who will receive it.</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">3.</span>
                <span>Both forms will be saved together in a single database record for easy management.</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 mr-2">4.</span>
                <span>You can see the completion progress at the top of the page.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Form Data Preview */}
        {formData && completionStatus.formCompleted && (
          <div className="mt-8 max-w-4xl mx-auto">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h5 className="font-medium text-green-800 mb-4">Complete Form Summary</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <h6 className="font-medium text-green-700 mb-2">Sender Details:</h6>
                  <div className="space-y-1 text-gray-700">
                    <p><strong>Name:</strong> {formData.senderName}</p>
                    <p><strong>Email:</strong> {formData.senderEmail}</p>
                    <p><strong>Phone:</strong> {formData.senderPhone}</p>
                    <p><strong>Address:</strong> {formData.senderFullAddress}</p>
                  </div>
                </div>
                <div>
                  <h6 className="font-medium text-green-700 mb-2">Receiver Details:</h6>
                  <div className="space-y-1 text-gray-700">
                    <p><strong>Name:</strong> {formData.receiverName}</p>
                    <p><strong>Email:</strong> {formData.receiverEmail}</p>
                    <p><strong>Phone:</strong> {formData.receiverPhone}</p>
                    <p><strong>Address:</strong> {formData.receiverFullAddress}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Office;