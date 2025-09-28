import React, { useState, useCallback } from "react";
import axios from "axios";

const CorporateRegistration = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    companyAddress: "",
    pin: "",
    city: "",
    state: "",
    locality: "",
    flatNumber: "",
    landmark: "",
    gstNumber: "",
    birthday: "",
    anniversary: "",
    contactNumber: "",
    addressType: "corporate", // corporate, branch, firm, other
    password: "",
    confirmPassword: ""
  });

  const [pincodeData, setPincodeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [generatedId, setGeneratedId] = useState("");
  const [responseTime, setResponseTime] = useState(null);

  // Clear success message after 5 seconds
  React.useEffect(() => {
    if (submitSuccess) {
      const timer = setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [submitSuccess]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear submit success message when user starts editing
    if (submitSuccess) {
      setSubmitSuccess(false);
      setGeneratedId("");
    }
  };

  const handlePincodeChange = useCallback(async (e) => {
    const pin = e.target.value;
    
    // Update pincode and reset dependent fields
    setFormData(prev => ({ 
      ...prev, 
      pin: pin, 
      state: "", 
      city: "", 
      locality: "" 
    }));
    setPincodeData(null);
    setError("");
    setResponseTime(null);

    // Validate pincode format first
    if (pin.length > 0 && !/^\d+$/.test(pin)) {
      setError("Pincode should contain only numbers");
      return;
    }
    
    if (pin.length > 6) {
      setError("Pincode should be exactly 6 digits");
      return;
    }

    // Only proceed if pincode is exactly 6 digits
    if (pin.length === 6 && /^\d{6}$/.test(pin)) {
      setLoading(true);
      const startTime = performance.now();
      
      try {
        const res = await axios.get(`http://localhost:5000/api/pincode/${pin}`, {
          timeout: 10000
        });
        
        const endTime = performance.now();
        const clientTime = Math.round(endTime - startTime);
        
        const { state, cities, totalAreas, responseTime: serverTime, cached } = res.data;
        
        setPincodeData({ state, cities });
        
        // Auto-populate state and get the first available city and district
        const firstCity = Object.keys(cities)[0];
        const firstDistrict = Object.keys(cities[firstCity].districts)[0];
        
        setFormData(prev => ({ 
          ...prev, 
          state,
          city: firstCity,
          locality: firstDistrict
        }));
        
        setResponseTime({
          client: clientTime,
          server: serverTime,
          cached: cached,
          totalAreas: totalAreas
        });
        
      } catch (err) {
        console.error('Pincode lookup error:', err);
        
        const endTime = performance.now();
        const clientTime = Math.round(endTime - startTime);
        
        if (err.response?.status === 404) {
          setError("Pincode not found. Please check and try again.");
        } else if (err.response?.status === 400) {
          setError("Invalid pincode format. Please enter a 6-digit pincode.");
        } else if (err.code === 'ECONNABORTED') {
          setError("Request timeout. The pincode lookup is taking too long.");
        } else if (err.code === 'ECONNREFUSED') {
          setError("Cannot connect to server. Please check if the server is running.");
        } else {
          setError("Error fetching pincode data. Please try again.");
        }
        
        setPincodeData(null);
        setFormData(prev => ({ ...prev, state: "", city: "", locality: "" }));
        setResponseTime({ client: clientTime, error: true });
      } finally {
        setLoading(false);
      }
    }
  }, []);

  const validateForm = () => {
    // Basic validation
    if (!formData.companyName.trim()) {
      setError("Please enter company name");
      return false;
    }
    
    if (!formData.companyAddress.trim()) {
      setError("Please enter company address");
      return false;
    }

    if (!formData.pin) {
      setError("Please enter a pincode");
      return false;
    }
    
    if (!pincodeData) {
      setError("Please wait for pincode validation to complete");
      return false;
    }
    
    if (!formData.city.trim()) {
      setError("Invalid pincode - no city data found");
      return false;
    }
    
    if (!formData.locality.trim()) {
      setError("Please select locality/area");
      return false;
    }

    if (!formData.contactNumber.trim()) {
      setError("Please enter contact number");
      return false;
    }

    if (!/^\d{10}$/.test(formData.contactNumber.replace(/\D/g, ''))) {
      setError("Please enter a valid 10-digit contact number");
      return false;
    }

    if (formData.gstNumber && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gstNumber)) {
      setError("Please enter a valid GST number (15 characters)");
      return false;
    }

    if (!formData.password.trim()) {
      setError("Please enter a password");
      return false;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitLoading(true);
    setError("");
    
    try {
      const response = await axios.post('http://localhost:5000/api/corporate/register', {
        ...formData
      }, {
        timeout: 10000
      });
      
      console.log('Corporate registration successful:', response.data);
      setSubmitSuccess(true);
      setGeneratedId(response.data.corporateId);
      
      // Reset form after successful submission
      setFormData({
        companyName: "",
        companyAddress: "",
        pin: "",
        city: "",
        state: "",
        locality: "",
        flatNumber: "",
        landmark: "",
        gstNumber: "",
        birthday: "",
        anniversary: "",
        contactNumber: "",
        addressType: "corporate",
        password: "",
        confirmPassword: ""
      });
      setPincodeData(null);
      setResponseTime(null);
      
    } catch (err) {
      console.error('Corporate registration error:', err);
      if (err.code === 'ECONNREFUSED') {
        setError("Cannot connect to server. Please check if the server is running.");
      } else if (err.code === 'ECONNABORTED') {
        setError("Registration timeout. Please try again.");
      } else if (err.response?.status === 409) {
        setError(err.response.data.error || "A company with this information already exists.");
      } else {
        setError(err.response?.data?.error || "Failed to register company. Please try again.");
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  const getPerformanceColor = () => {
    if (!responseTime || responseTime.error) return 'text-gray-500';
    if (responseTime.cached) return 'text-green-600';
    if (responseTime.client < 500) return 'text-green-600';
    if (responseTime.client < 1000) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAvailableAreas = () => {
    if (!pincodeData || !formData.city || !formData.locality) return [];
    return pincodeData.cities[formData.city]?.districts[formData.locality]?.areas || [];
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Corporate Registration</h2>
          <p className="text-gray-600 mt-2">Register your company with our system</p>
        </div>

        {/* Success Message with Generated ID */}
        {submitSuccess && generatedId && (
          <div className="mb-6 p-6 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Registration Successful!</h3>
              <p className="text-green-700 mb-4">Your corporate registration has been completed.</p>
              <div className="bg-white p-4 rounded-lg border-2 border-green-300">
                <p className="text-sm text-green-600 mb-1">Your Corporate Customer ID:</p>
                <p className="text-2xl font-bold text-green-800">{generatedId}</p>
                <p className="text-xs text-green-600 mt-1">Please save this ID for future reference</p>
              </div>
            </div>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg space-y-6">
          {error && (
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
            <input
              type="text"
              name="companyName"
              placeholder="Enter your company name"
              value={formData.companyName}
              onChange={handleChange}
              className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Company Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company Address *</label>
            <textarea
              name="companyAddress"
              placeholder="Enter your company address"
              value={formData.companyAddress}
              onChange={handleChange}
              rows="3"
              className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Pincode */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Pin Code *</label>
            <input
              type="text"
              name="pin"
              placeholder="Enter 6-digit pincode"
              value={formData.pin}
              onChange={handlePincodeChange}
              className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
              maxLength="6"
              required
            />
            {loading && (
              <div className="absolute right-3 top-10 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent"></div>
              </div>
            )}
          </div>

          {responseTime && !responseTime.error && (
            <div className={`text-xs ${getPerformanceColor()}`}>
              <div className="flex justify-between">
                <span>
                  {responseTime.cached ? 'Cached' : 'Searched'}: {responseTime.client}ms
                </span>
                <span>Areas: {responseTime.totalAreas}</span>
              </div>
            </div>
          )}

          {pincodeData && (
            <>
              {/* State */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  disabled
                  className="border border-gray-300 p-3 w-full bg-gray-100 rounded-lg text-gray-700"
                  required
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  disabled
                  className="border border-gray-300 p-3 w-full bg-gray-100 rounded-lg text-gray-700"
                  required
                />
              </div>

              {/* Locality/Area/District */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Locality/Area/District *</label>
                <input
                  type="text"
                  name="locality"
                  value={formData.locality}
                  disabled
                  className="border border-gray-300 p-3 w-full bg-gray-100 rounded-lg text-gray-700"
                  required
                />
              </div>
            </>
          )}

          {/* Flat Number/Building Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Flat No./Building Name</label>
            <input
              type="text"
              name="flatNumber"
              placeholder="Enter flat number or building name"
              value={formData.flatNumber}
              onChange={handleChange}
              className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Landmark */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Landmark (Optional)</label>
            <input
              type="text"
              name="landmark"
              placeholder="Enter landmark"
              value={formData.landmark}
              onChange={handleChange}
              className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* GST Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">GST No. (Maximum 15 characters)</label>
            <input
              type="text"
              name="gstNumber"
              placeholder="Enter GST number (optional)"
              value={formData.gstNumber}
              onChange={handleChange}
              maxLength="15"
              className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Birthday and Anniversary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Birthday</label>
              <input
                type="date"
                name="birthday"
                value={formData.birthday}
                onChange={handleChange}
                className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Anniversary</label>
              <input
                type="date"
                name="anniversary"
                value={formData.anniversary}
                onChange={handleChange}
                className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Contact Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact No. *</label>
            <input
              type="tel"
              name="contactNumber"
              placeholder="Enter 10-digit contact number"
              value={formData.contactNumber}
              onChange={handleChange}
              className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Address Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type of Address *</label>
            <div className="flex flex-wrap gap-4">
              {['corporate', 'branch', 'firm', 'other'].map((type) => (
                <label key={type} className="flex items-center">
                  <input
                    type="radio"
                    name="addressType"
                    value={type}
                    checked={formData.addressType === type}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="capitalize">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password (minimum 6 characters)"
              value={formData.password}
              onChange={handleChange}
              className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={submitLoading || loading || !formData.city}
            className={`w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
              submitLoading || loading || !formData.city
                ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white hover:shadow-lg'
            }`}
          >
            {submitLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Registering...
              </div>
            ) : (
              'Submit Registration'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CorporateRegistration;