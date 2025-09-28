import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";

const AddressForm = ({ title, formType, senderEmail, onFormSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    pincode: "",
    state: "",
    city: "",
    district: "",
    area: "",
    addressLine1: "",
    addressLine2: "",
    landmark: ""
  });

  const [pincodeData, setPincodeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [responseTime, setResponseTime] = useState(null);
  const [existingFormData, setExistingFormData] = useState(null);

  // Check for existing form data on component mount (for receiver form)
  useEffect(() => {
    if (formType === 'receiver' && senderEmail) {
      checkExistingForm(senderEmail);
    }
  }, [formType, senderEmail]);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (submitSuccess) {
      const timer = setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [submitSuccess]);

  const checkExistingForm = async (email) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/form/check/${email}`);
      if (response.data.exists) {
        setExistingFormData(response.data.data);
        
        // If receiver data exists, populate the form
        if (formType === 'receiver' && response.data.data.receiverCompleted) {
          const receiverData = response.data.data;
          setFormData({
            name: receiverData.receiverName || "",
            email: receiverData.receiverEmail || "",
            phone: receiverData.receiverPhone || "",
            pincode: receiverData.receiverPincode || "",
            state: receiverData.receiverState || "",
            city: receiverData.receiverCity || "",
            district: receiverData.receiverDistrict || "",
            area: receiverData.receiverArea || "",
            addressLine1: receiverData.receiverAddressLine1 || "",
            addressLine2: receiverData.receiverAddressLine2 || "",
            landmark: receiverData.receiverLandmark || ""
          });
          
          if (receiverData.receiverPincode) {
            // Trigger pincode lookup for existing data
            handlePincodeChange({ target: { value: receiverData.receiverPincode } });
          }
        }
      }
    } catch (err) {
      console.error('Error checking existing form:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Only allow changes to editable fields
    if (['name', 'email', 'phone', 'area', 'addressLine1', 'addressLine2', 'landmark'].includes(name)) {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear submit success message when user starts editing
    if (submitSuccess) {
      setSubmitSuccess(false);
    }
  };

  const handlePincodeChange = useCallback(async (e) => {
    const pin = e.target.value;
    
    // Update pincode and reset dependent fields
    setFormData(prev => ({ 
      ...prev, 
      pincode: pin, 
      state: "", 
      city: "", 
      district: "",
      area: "" 
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
          district: firstDistrict
        }));
        
        setResponseTime({
          client: clientTime,
          server: serverTime,
          cached: cached,
          totalAreas: totalAreas
        });
        
        console.log(`Pincode lookup completed:`, {
          pincode: pin,
          clientTime: `${clientTime}ms`,
          serverTime: serverTime,
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
        setFormData(prev => ({ ...prev, state: "", city: "", district: "", area: "" }));
        setResponseTime({ client: clientTime, error: true });
      } finally {
        setLoading(false);
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name.trim()) {
      setError("Please enter your name");
      return;
    }
    
    if (!formData.email.trim()) {
      setError("Please enter your email");
      return;
    }
    
    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      setError("Please enter a valid email address");
      return;
    }

    if (!formData.phone.trim()) {
      setError("Please enter your phone number");
      return;
    }

    if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }
    
    if (!formData.pincode) {
      setError("Please enter a pincode");
      return;
    }
    
    if (!pincodeData) {
      setError("Please wait for pincode validation to complete");
      return;
    }
    
    if (!formData.city.trim()) {
      setError("Invalid pincode - no city data found");
      return;
    }
    
    if (!formData.district.trim()) {
      setError("Invalid pincode - no district data found");
      return;
    }
    
    if (!formData.area.trim()) {
      setError("Please select an area");
      return;
    }

    if (!formData.addressLine1.trim()) {
      setError("Please enter address line 1");
      return;
    }

    // For receiver form, check if sender email exists
    if (formType === 'receiver' && !senderEmail) {
      setError("Please submit sender form first");
      return;
    }

    setSubmitLoading(true);
    setError("");
    
    try {
      const response = await axios.post('http://localhost:5000/api/form', {
        ...formData,
        formType: formType,
        // Add sender email for receiver form submissions
        ...(formType === 'receiver' && senderEmail && { senderEmail })
      }, {
        timeout: 5000
      });
      
      console.log('Form submitted successfully:', response.data);
      setSubmitSuccess(true);
      
      // Update existing form data state
      setExistingFormData(response.data.data);
      
      // Notify parent component
      if (onFormSubmit) {
        onFormSubmit(formType, response.data.data);
      }
      
      // For sender form, reset after successful submission
      // For receiver form, keep data populated
      if (formType === 'sender') {
        setFormData({
          name: "",
          email: "",
          phone: "",
          pincode: "",
          state: "",
          city: "",
          district: "",
          area: "",
          addressLine1: "",
          addressLine2: "",
          landmark: ""
        });
        setPincodeData(null);
        setResponseTime(null);
      }
      
    } catch (err) {
      console.error('Form submission error:', err);
      if (err.code === 'ECONNREFUSED') {
        setError("Cannot connect to server. Please check if the server is running.");
      } else if (err.code === 'ECONNABORTED') {
        setError("Form submission timeout. Please try again.");
      } else if (err.response?.status === 409) {
        setError(err.response.data.error || "A form with this information already exists.");
      } else {
        setError(err.response?.data?.error || "Failed to submit form. Please try again.");
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  const getAvailableAreas = () => {
    if (!pincodeData || !formData.city || !formData.district) return [];
    return pincodeData.cities[formData.city]?.districts[formData.district]?.areas || [];
  };

  const getPerformanceColor = () => {
    if (!responseTime || responseTime.error) return 'text-gray-500';
    if (responseTime.cached) return 'text-green-600';
    if (responseTime.client < 500) return 'text-green-600';
    if (responseTime.client < 1000) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCompletionStatus = () => {
    if (!existingFormData) return null;
    
    if (formType === 'sender' && existingFormData.senderCompleted) {
      return { completed: true, message: "Sender form completed" };
    } else if (formType === 'receiver' && existingFormData.receiverCompleted) {
      return { completed: true, message: "Receiver form completed" };
    } else if (existingFormData.formCompleted) {
      return { completed: true, message: "Both forms completed" };
    }
    
    return { completed: false, message: `Completion: ${existingFormData.getCompletionPercentage || 0}%` };
  };

  const completionStatus = getCompletionStatus();

  // Show message for receiver form when no sender email is provided
  if (formType === 'receiver' && !senderEmail) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="p-6 border rounded-lg bg-yellow-50 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
          <div className="p-3 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded-lg text-sm">
            <strong>Notice:</strong> Please submit the sender form first before filling out the receiver form.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="p-6 border rounded-lg bg-white shadow-lg space-y-4">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
          {completionStatus && (
            <div className={`text-sm px-3 py-1 rounded-full ${
              completionStatus.completed 
                ? 'bg-green-100 text-green-700' 
                : 'bg-yellow-100 text-yellow-700'
            }`}>
              {completionStatus.message}
            </div>
          )}
        </div>
        
        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        {submitSuccess && (
          <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
            <strong>Success!</strong> Your {title.toLowerCase()} has been submitted successfully.
          </div>
        )}

        {/* Name Field */}
        <div>
          <input
            type="text"
            name="name"
            placeholder={`${formType === 'sender' ? 'Sender' : 'Receiver'} Full Name *`}
            value={formData.name}
            onChange={handleChange}
            className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Email Field */}
        <div>
          <input
            type="email"
            name="email"
            placeholder={`${formType === 'sender' ? 'Sender' : 'Receiver'} Email Address *`}
            value={formData.email}
            onChange={handleChange}
            className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={formType === 'receiver' && existingFormData?.receiverCompleted}
          />
        </div>

        {/* Phone Field */}
        <div>
          <input
            type="tel"
            name="phone"
            placeholder={`${formType === 'sender' ? 'Sender' : 'Receiver'} Phone Number *`}
            value={formData.phone}
            onChange={handleChange}
            className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Pincode Field */}
        <div className="relative">
          <input
            type="text"
            name="pincode"
            placeholder="Pin Code (6 digits) *"
            value={formData.pincode}
            onChange={handlePincodeChange}
            className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
            maxLength="6"
            required
          />
          {loading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
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
            {/* State Field */}
            <div>
              <input
                type="text"
                name="state"
                placeholder="State *"
                value={formData.state}
                disabled
                className="border border-gray-300 p-3 w-full bg-gray-100 rounded-lg text-gray-700"
                required
              />
            </div>

            {/* City Field */}
            <div>
              <input
                type="text"
                name="city"
                placeholder="City *"
                value={formData.city}
                disabled
                className="border border-gray-300 p-3 w-full bg-gray-100 rounded-lg text-gray-700"
                required
              />
            </div>

            {/* District Field */}
            <div>
              <input
                type="text"
                name="district"
                placeholder="District *"
                value={formData.district}
                disabled
                className="border border-gray-300 p-3 w-full bg-gray-100 rounded-lg text-gray-700"
                required
              />
            </div>

            {/* Area Field */}
            <div>
              <select
                name="area"
                value={formData.area}
                onChange={handleChange}
                className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Area *</option>
                {getAvailableAreas().map((areaObj, idx) => (
                  <option key={idx} value={areaObj.name}>
                    {areaObj.name}
                  </option>
                ))}
              </select>
              {getAvailableAreas().length > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  {getAvailableAreas().length} area{getAvailableAreas().length !== 1 ? 's' : ''} available
                </p>
              )}
            </div>
          </>
        )}

        {/* Address Line 1 */}
        <div>
          <input
            type="text"
            name="addressLine1"
            placeholder="Address Line 1 *"
            value={formData.addressLine1}
            onChange={handleChange}
            className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Address Line 2 */}
        <div>
          <input
            type="text"
            name="addressLine2"
            placeholder="Address Line 2"
            value={formData.addressLine2}
            onChange={handleChange}
            className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Landmark */}
        <div>
          <input
            type="text"
            name="landmark"
            placeholder="Landmark"
            value={formData.landmark}
            onChange={handleChange}
            className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <button 
          type="submit" 
          disabled={submitLoading || loading || !formData.area}
          className={`w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
            submitLoading || loading || !formData.area
              ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white hover:shadow-lg'
          }`}
        >
          {submitLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
              Submitting...
            </div>
          ) : (
            `Submit ${formType === 'sender' ? 'Sender' : 'Receiver'} Data`
          )}
        </button>
      </form>
    </div>
  );
};

export default AddressForm;