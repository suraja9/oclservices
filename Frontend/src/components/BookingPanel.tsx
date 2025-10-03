import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  X, 
  Phone, 
  User, 
  Building, 
  Mail, 
  MapPin,
  Upload,
  CreditCard,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Plus,
  Minus,
  Calendar,
  Clock,
  Package,
  Plane,
  Truck,
  Shield,
  FileText,
  Camera,
  DollarSign,
  Edit3,
  ArrowRight,
  Search,
  XCircle
} from 'lucide-react';
import ImageUploadWithPreview from './ImageUploadWithPreview';

const API_BASE: string = (import.meta as any).env?.VITE_API_BASE_URL || '';

// Floating Label Input Component
interface FloatingInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  maxLength?: number;
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

const FloatingInput: React.FC<FloatingInputProps> = ({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  maxLength,
  icon,
  disabled = false,
  className = ''
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value.length > 0;
  const shouldFloat = isFocused || hasValue;

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          maxLength={maxLength}
          disabled={disabled}
          className={`
            w-full h-14 px-4 ${icon ? 'pl-12' : 'pl-4'} pr-4 
            border-2 rounded-lg bg-white
            transition-all duration-200 ease-in-out
            ${isFocused 
              ? 'border-blue-500 ring-2 ring-blue-100' 
              : 'border-gray-300 hover:border-gray-400'
            }
            ${disabled ? 'bg-gray-50 cursor-not-allowed' : ''}
            focus:outline-none text-gray-900
          `}
          placeholder=""
        />
        <label
          className={`
            absolute ${icon ? 'left-12' : 'left-4'} 
            transition-all duration-200 ease-in-out
            pointer-events-none select-none
            ${shouldFloat
              ? 'top-0 -translate-y-1/2 text-xs bg-white px-2 text-blue-600 font-medium'
              : 'top-1/2 -translate-y-1/2 text-base text-gray-500'
            }
            ${isFocused && !hasValue ? 'text-blue-500' : ''}
          `}
        >
          {label}{required && <span className="text-red-500 ml-1">*</span>}
        </label>
      </div>
    </div>
  );
};

// Stepper Component
interface StepperProps {
  currentStep: number;
  steps: string[];
  completedSteps: boolean[];
}

const Stepper: React.FC<StepperProps> = ({ currentStep, steps, completedSteps }) => {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold
                  transition-all duration-300
                  ${completedSteps[index] 
                    ? 'bg-green-500 text-white' 
                    : currentStep === index 
                      ? 'bg-blue-500 text-white ring-4 ring-blue-100' 
                      : 'bg-gray-300 text-gray-600'
                  }
                `}
              >
                {completedSteps[index] ? <Check className="w-5 h-5" /> : index + 1}
              </div>
              <span
                className={`
                  mt-2 text-xs font-medium text-center max-w-20
                  ${currentStep === index ? 'text-blue-600 font-semibold' : 'text-gray-500'}
                `}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`
                  flex-1 h-1 mx-2 rounded-full transition-all duration-300
                  ${completedSteps[index] ? 'bg-green-500' : 'bg-gray-300'}
                `}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

// Floating Select Component
interface FloatingSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  required?: boolean;
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

const FloatingSelect: React.FC<FloatingSelectProps> = ({
  label,
  value,
  onChange,
  options,
  required = false,
  icon,
  disabled = false,
  className = ''
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value.length > 0;
  const shouldFloat = isFocused || hasValue;

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
            {icon}
          </div>
        )}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          className={`
            w-full h-14 px-4 ${icon ? 'pl-12' : 'pl-4'} pr-10
            border-2 rounded-lg bg-white
            transition-all duration-200 ease-in-out
            ${isFocused 
              ? 'border-blue-500 ring-2 ring-blue-100' 
              : 'border-gray-300 hover:border-gray-400'
            }
            ${disabled ? 'bg-gray-50 cursor-not-allowed' : ''}
            focus:outline-none text-gray-900 appearance-none
          `}
        >
          <option value="" disabled hidden></option>
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
        <label
          className={`
            absolute ${icon ? 'left-12' : 'left-4'}
            transition-all duration-200 ease-in-out
            pointer-events-none select-none
            ${shouldFloat
              ? 'top-0 -translate-y-1/2 text-xs bg-white px-2 text-blue-600 font-medium'
              : 'top-1/2 -translate-y-1/2 text-base text-gray-500'
            }
            ${isFocused && !hasValue ? 'text-blue-500' : ''}
          `}
        >
          {label}{required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

// Floating Textarea Component
interface FloatingTextareaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  rows?: number;
  className?: string;
}

const FloatingTextarea: React.FC<FloatingTextareaProps> = ({
  label,
  value,
  onChange,
  required = false,
  rows = 4,
  className = ''
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value.length > 0;
  const shouldFloat = isFocused || hasValue;

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          rows={rows}
          className={`
            w-full px-4 pt-6 pb-4
            border-2 rounded-lg bg-white resize-none
            transition-all duration-200 ease-in-out
            ${isFocused 
              ? 'border-blue-500 ring-2 ring-blue-100' 
              : 'border-gray-300 hover:border-gray-400'
            }
            focus:outline-none text-gray-900
          `}
          placeholder=""
        />
        <label
          className={`
            absolute left-4
            transition-all duration-200 ease-in-out
            pointer-events-none select-none
            ${shouldFloat
              ? 'top-0 -translate-y-1/2 text-xs bg-white px-2 text-blue-600 font-medium'
              : 'top-6 text-base text-gray-500'
            }
            ${isFocused && !hasValue ? 'text-blue-500' : ''}
          `}
        >
          {label}{required && <span className="text-red-500 ml-1">*</span>}
        </label>
      </div>
    </div>
  );
};

// Enhanced Confirmation Modal Component
interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onEdit: () => void;
  title: string;
  data: any;
  stepType: string;
  currentStep: number;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  onEdit,
  title,
  data,
  stepType,
  currentStep
}) => {
  if (!isOpen) return null;

  // Get step color based on current step
  const getStepColor = () => {
    switch (currentStep) {
      case 0: return 'blue';
      case 1: return 'green';
      case 2: return 'orange';
      case 3: return 'purple';
      case 4: return 'indigo';
      default: return 'emerald';
    }
  };

  const stepColor = getStepColor();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`bg-gradient-to-r from-${stepColor}-500 to-${stepColor}-600 px-8 py-6 text-white`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-1">{title}</h3>
                <p className="text-${stepColor}-100 text-sm">Please review and confirm your details</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-full p-3">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 overflow-y-auto max-h-96">
            <div className={`bg-gradient-to-r from-${stepColor}-50 to-${stepColor}-100 rounded-2xl p-6 border border-${stepColor}-200`}>
              <h4 className={`font-semibold text-${stepColor}-800 mb-4 text-lg flex items-center`}>
                <FileText className={`w-5 h-5 mr-2 text-${stepColor}-600`} />
                Step Details Summary
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(data).map(([key, value]) => {
                  if (value === null || value === undefined || value === '') return null;
                  
                  return (
                    <div key={key} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                      <div className="flex flex-col">
                        <span className={`text-${stepColor}-600 text-xs font-medium uppercase tracking-wide mb-1`}>
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </span>
                        <span className="text-gray-800 font-semibold text-sm break-words">
                          {Array.isArray(value) ? value.join(', ') : String(value)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Important Notice */}
            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h5 className="font-medium text-yellow-800 text-sm mb-1">Review Carefully</h5>
                  <p className="text-yellow-700 text-xs">
                    Please verify all information is correct before proceeding. You can edit details if needed.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
            <div className="flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onEdit}
                className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center justify-center"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Details
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onConfirm}
                className={`flex-1 px-6 py-3 bg-gradient-to-r from-${stepColor}-500 to-${stepColor}-600 text-white font-semibold rounded-xl hover:from-${stepColor}-600 hover:to-${stepColor}-700 transition-all duration-200 flex items-center justify-center shadow-lg`}
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Proceed to Next Step
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Final Confirmation Modal Component (Step 6a)
interface FinalConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: () => void;
  onBack: () => void;
  allData: any;
  loading?: boolean;
  errorMessage?: string | null;
}

const FinalConfirmationModal: React.FC<FinalConfirmationModalProps> = ({
  isOpen,
  onClose,
  onProceed,
  onBack,
  allData,
  loading = false,
  errorMessage = null
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-8 py-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-3xl font-bold mb-1">Final Review & Confirmation</h3>
                <p className="text-emerald-100 text-sm">Please review all details before finalizing your booking</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-full p-3">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 overflow-y-auto max-h-[60vh]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Origin Details */}
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                <h4 className="font-bold text-blue-800 text-lg mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Origin Details
                </h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Name:</span> {allData.originData?.name}</div>
                  <div><span className="font-medium">Mobile:</span> {allData.originData?.mobileNumber}</div>
                  <div><span className="font-medium">Address:</span> {allData.originData?.flatBuilding}, {allData.originData?.locality}</div>
                  <div><span className="font-medium">Pincode:</span> {allData.originData?.pincode}</div>
                  <div><span className="font-medium">City:</span> {allData.originData?.city}, {allData.originData?.state}</div>
                </div>
              </div>

              {/* Destination Details */}
              <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                <h4 className="font-bold text-green-800 text-lg mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Destination Details
                </h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Name:</span> {allData.destinationData?.name}</div>
                  <div><span className="font-medium">Mobile:</span> {allData.destinationData?.mobileNumber}</div>
                  <div><span className="font-medium">Address:</span> {allData.destinationData?.flatBuilding}, {allData.destinationData?.locality}</div>
                  <div><span className="font-medium">Pincode:</span> {allData.destinationData?.pincode}</div>
                  <div><span className="font-medium">City:</span> {allData.destinationData?.city}, {allData.destinationData?.state}</div>
                </div>
              </div>

              {/* Shipment Details */}
              <div className="bg-orange-50 rounded-2xl p-6 border border-orange-200">
                <h4 className="font-bold text-orange-800 text-lg mb-4 flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Shipment Details
                </h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Nature:</span> {allData.shipmentData?.natureOfConsignment}</div>
                  <div><span className="font-medium">Service:</span> {allData.shipmentData?.services}</div>
                  <div><span className="font-medium">Mode:</span> {allData.shipmentData?.mode}</div>
                  <div><span className="font-medium">Insurance:</span> {allData.shipmentData?.insurance}</div>
                  <div><span className="font-medium">Dimensions:</span> {allData.shipmentData?.dimensions}</div>
                  <div><span className="font-medium">Weight:</span> {allData.shipmentData?.chargeableWeight} kg</div>
                </div>
              </div>

              {/* Upload Details */}
              <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
                <h4 className="font-bold text-purple-800 text-lg mb-4 flex items-center">
                  <Upload className="w-5 h-5 mr-2" />
                  Package & Invoice Details
                </h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Total Packages:</span> {allData.uploadData?.totalPackages}</div>
                  <div><span className="font-medium">Content:</span> {allData.uploadData?.contentDescription}</div>
                  <div><span className="font-medium">Invoice No:</span> {allData.uploadData?.invoiceNumber}</div>
                  <div><span className="font-medium">Invoice Value:</span> ₹{allData.uploadData?.invoiceValue}</div>
                  <div><span className="font-medium">Package Images:</span> {allData.uploadData?.packageImages}</div>
                  <div><span className="font-medium">Invoice Images:</span> {allData.uploadData?.invoiceImages}</div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-200 lg:col-span-2">
                <h4 className="font-bold text-indigo-800 text-lg mb-4 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Payment Method
                </h4>
                <div className="text-center">
                  <div className="inline-flex items-center px-6 py-3 bg-indigo-100 text-indigo-800 rounded-full text-lg font-bold">
                    {allData.paymentData?.mode}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onBack}
                className="px-8 py-3 bg-gray-600 text-white font-semibold rounded-xl hover:bg-gray-700 transition-colors flex items-center"
              >
                <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                Back to Step 1
              </motion.button>

              {errorMessage && (
                <div className="text-red-600 text-sm mr-4">{errorMessage}</div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onProceed}
                className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 flex items-center shadow-lg disabled:opacity-60"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Finalize Booking'}
                <CheckCircle className="w-4 h-4 ml-2" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Final Document Display Component (Step 6b)
interface FinalDocumentDisplayProps {
  allData: any;
  customerId: string;
  onStartNew: () => void;
}

const FinalDocumentDisplay: React.FC<FinalDocumentDisplayProps> = ({
  allData,
  customerId,
  onStartNew
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed inset-0 bg-white z-50 overflow-auto"
    >
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="text-center mb-8 border-b-2 border-gray-200 pb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle className="w-16 h-16 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600 text-lg">Your shipment booking has been successfully created</p>
          <div className="mt-4 inline-block bg-green-100 px-6 py-3 rounded-lg border border-green-200">
            <p className="text-sm text-gray-600">Customer ID</p>
            <p className="text-2xl font-bold text-green-600">{customerId}</p>
          </div>
        </div>

        {/* Document Content */}
        <div className="bg-white shadow-2xl rounded-2xl border-2 border-gray-200 p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Origin Section */}
            <div className="border border-blue-200 rounded-xl p-6 bg-blue-50">
              <h3 className="text-xl font-bold text-blue-800 mb-4 border-b border-blue-200 pb-2">
                📍 ORIGIN DETAILS
              </h3>
              <div className="space-y-2">
                <div><strong>Name:</strong> {allData.originData?.name}</div>
                <div><strong>Mobile:</strong> {allData.originData?.mobileNumber}</div>
                <div><strong>Company:</strong> {allData.originData?.companyName || 'N/A'}</div>
                <div><strong>Email:</strong> {allData.originData?.email}</div>
                <div><strong>Address:</strong> {allData.originData?.flatBuilding}, {allData.originData?.locality}</div>
                <div><strong>Landmark:</strong> {allData.originData?.landmark || 'N/A'}</div>
                <div><strong>Pincode:</strong> {allData.originData?.pincode}</div>
                <div><strong>City:</strong> {allData.originData?.city}</div>
                <div><strong>District:</strong> {allData.originData?.district}</div>
                <div><strong>State:</strong> {allData.originData?.state}</div>
                <div><strong>GST:</strong> {allData.originData?.gstNumber || 'N/A'}</div>
                <div><strong>Type:</strong> {allData.originData?.addressType}</div>
              </div>
            </div>

            {/* Destination Section */}
            <div className="border border-green-200 rounded-xl p-6 bg-green-50">
              <h3 className="text-xl font-bold text-green-800 mb-4 border-b border-green-200 pb-2">
                🎯 DESTINATION DETAILS
              </h3>
              <div className="space-y-2">
                <div><strong>Name:</strong> {allData.destinationData?.name}</div>
                <div><strong>Mobile:</strong> {allData.destinationData?.mobileNumber}</div>
                <div><strong>Company:</strong> {allData.destinationData?.companyName || 'N/A'}</div>
                <div><strong>Email:</strong> {allData.destinationData?.email}</div>
                <div><strong>Address:</strong> {allData.destinationData?.flatBuilding}, {allData.destinationData?.locality}</div>
                <div><strong>Landmark:</strong> {allData.destinationData?.landmark || 'N/A'}</div>
                <div><strong>Pincode:</strong> {allData.destinationData?.pincode}</div>
                <div><strong>City:</strong> {allData.destinationData?.city}</div>
                <div><strong>District:</strong> {allData.destinationData?.district}</div>
                <div><strong>State:</strong> {allData.destinationData?.state}</div>
                <div><strong>GST:</strong> {allData.destinationData?.gstNumber || 'N/A'}</div>
                <div><strong>Type:</strong> {allData.destinationData?.addressType}</div>
              </div>
            </div>

            {/* Shipment Section */}
            <div className="border border-orange-200 rounded-xl p-6 bg-orange-50">
              <h3 className="text-xl font-bold text-orange-800 mb-4 border-b border-orange-200 pb-2">
                📦 SHIPMENT DETAILS
              </h3>
              <div className="space-y-2">
                <div><strong>Nature:</strong> {allData.shipmentData?.natureOfConsignment}</div>
                <div><strong>Service:</strong> {allData.shipmentData?.services}</div>
                <div><strong>Mode:</strong> {allData.shipmentData?.mode}</div>
                <div><strong>Insurance:</strong> {allData.shipmentData?.insurance}</div>
                <div><strong>Risk Coverage:</strong> {allData.shipmentData?.riskCoverage}</div>
                <div><strong>Dimensions:</strong> {allData.shipmentData?.dimensions}</div>
                <div><strong>Actual Weight:</strong> {allData.shipmentData?.actualWeight} kg</div>
                <div><strong>Volumetric Weight:</strong> {allData.shipmentData?.volumetricWeight} kg</div>
                <div><strong>Chargeable Weight:</strong> {allData.shipmentData?.chargeableWeight} kg</div>
              </div>
            </div>

            {/* Package & Payment Section */}
            <div className="space-y-6">
              {/* Package Details */}
              <div className="border border-purple-200 rounded-xl p-6 bg-purple-50">
                <h3 className="text-xl font-bold text-purple-800 mb-4 border-b border-purple-200 pb-2">
                  📋 PACKAGE DETAILS
                </h3>
                <div className="space-y-2">
                  <div><strong>Total Packages:</strong> {allData.uploadData?.totalPackages}</div>
                  <div><strong>Content:</strong> {allData.uploadData?.contentDescription}</div>
                  <div><strong>Invoice No:</strong> {allData.uploadData?.invoiceNumber}</div>
                  <div><strong>Invoice Value:</strong> ₹{allData.uploadData?.invoiceValue}</div>
                  {allData.uploadData?.eWaybillNumber && (
                    <div><strong>E-Waybill:</strong> {allData.uploadData.eWaybillNumber}</div>
                  )}
                </div>
              </div>

              {/* Payment Details */}
              <div className="border border-indigo-200 rounded-xl p-6 bg-indigo-50">
                <h3 className="text-xl font-bold text-indigo-800 mb-4 border-b border-indigo-200 pb-2">
                  💳 PAYMENT METHOD
                </h3>
                <div className="text-center">
                  <div className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-lg font-bold">
                    {allData.paymentData?.mode}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => window.print()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <FileText className="w-4 h-4 mr-2" />
              Print Document
            </button>
            <button
              onClick={onStartNew}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Booking
            </button>
          </div>
          <p className="text-gray-500 text-sm">
            Please save this document for your records. Your booking reference is: <strong>{customerId}</strong>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const BookingPanel: React.FC = () => {
  // Main flow state
  const [flowType, setFlowType] = useState<'public' | 'corporate'>('public');
  
  // Public flow states
  const [originPincode, setOriginPincode] = useState('');
  const [destinationPincode, setDestinationPincode] = useState('');
  const [originServiceable, setOriginServiceable] = useState<boolean | null>(null);
  const [destinationServiceable, setDestinationServiceable] = useState<boolean | null>(null);
  const [showNonServiceableMessage, setShowNonServiceableMessage] = useState(false);
  
  // Corporate flow states
  const [corporateId, setCorporateId] = useState('');
  const [corporateMobile, setCorporateMobile] = useState('');
  const [corporateData, setCorporateData] = useState<any>(null);
  const [corporateSearchType, setCorporateSearchType] = useState<'id' | 'mobile'>('id');
  
  // Stepper states
  const [showStepper, setShowStepper] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>([false, false, false, false, false, false]);
  
  const steps = ['Origin', 'Destination', 'Shipment Details', 'Upload', 'Mode of Payment', 'Successful'];

  // Form data states for all steps
  const [originData, setOriginData] = useState({
    mobileNumber: '',
    name: '',
    companyName: '',
    email: '',
    locality: '',
    flatBuilding: '',
    landmark: '',
    pincode: '',
    area: '',
    city: '',
    district: '',
    state: '',
    gstNumber: '',
    alternateNumbers: [''],
    addressType: 'Home'
  });

  const [destinationData, setDestinationData] = useState({
    mobileNumber: '',
    name: '',
    companyName: '',
    email: '',
    locality: '',
    flatBuilding: '',
    landmark: '',
    pincode: '',
    area: '',
    city: '',
    district: '',
    state: '',
    gstNumber: '',
    alternateNumbers: [''],
    addressType: 'Home'
  });

  const [shipmentData, setShipmentData] = useState({
    natureOfConsignment: 'BOX',
    services: 'Standard',
    mode: 'Air',
    insurance: 'Consignor not insured the shipment',
    riskCoverage: 'Carrier',
    dimensions: [{ length: '', breadth: '', height: '', unit: 'cm' }],
    actualWeight: '',
    volumetricWeight: 0,
    chargeableWeight: 0
  });

  const [uploadData, setUploadData] = useState({
    totalPackages: '',
    packageImages: [],
    contentDescription: '',
    invoiceNumber: '',
    invoiceValue: '',
    invoiceImages: [],
    eWaybillNumber: '',
    acceptTerms: false
  });

  const [paymentData, setPaymentData] = useState({
    mode: ''
  });

  // Modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalData, setModalData] = useState({});
  const [modalTitle, setModalTitle] = useState('');
  const [currentStepType, setCurrentStepType] = useState('');

  // Success state
  const [generatedCustomerId, setGeneratedCustomerId] = useState('');
  
  // Final confirmation and document states
  const [showFinalConfirmation, setShowFinalConfirmation] = useState(false);
  const [showFinalDocument, setShowFinalDocument] = useState(false);
  const [allFormData, setAllFormData] = useState({});
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Pincode lookup states
  const [originAreas, setOriginAreas] = useState<string[]>([]);
  const [destinationAreas, setDestinationAreas] = useState<string[]>([]);
  const [originPinError, setOriginPinError] = useState<string | null>(null);
  const [destinationPinError, setDestinationPinError] = useState<string | null>(null);

  // Utility functions
  const getCurrentDateTime = () => {
    const now = new Date();
    return {
      date: now.toLocaleDateString('en-IN'),
      time: now.toLocaleTimeString('en-IN', { hour12: true })
    };
  };

  // LocalStorage functions for data persistence
  const saveToLocalStorage = () => {
    const formData = {
      flowType,
      originData,
      destinationData,
      shipmentData,
      uploadData,
      paymentData,
      currentStep,
      completedSteps,
      originPincode,
      destinationPincode,
      originServiceable,
      destinationServiceable,
      corporateId,
      corporateMobile,
      corporateData,
      corporateSearchType,
      showStepper
    };
    localStorage.setItem('bookingFormData', JSON.stringify(formData));
  };

  const loadFromLocalStorage = () => {
    try {
      const savedData = localStorage.getItem('bookingFormData');
      if (savedData) {
        const formData = JSON.parse(savedData);
        setFlowType(formData.flowType || 'public');
        setOriginData(formData.originData || {
          mobileNumber: '', name: '', companyName: '', email: '', pincode: '', area: '',
          locality: '', flatBuilding: '', landmark: '', gstNumber: '', city: '', district: '',
          state: '', alternateNumbers: [''], addressType: 'Home'
        });
        setDestinationData(formData.destinationData || {
          mobileNumber: '', name: '', companyName: '', email: '', pincode: '', area: '',
          locality: '', flatBuilding: '', landmark: '', gstNumber: '', city: '', district: '',
          state: '', alternateNumbers: [''], addressType: 'Home'
        });
        setShipmentData(formData.shipmentData || {
          natureOfConsignment: 'BOX', services: 'Standard', mode: 'Air',
          insurance: 'Consignor not insured the shipment', riskCoverage: 'Carrier',
          dimensions: [{ length: '', breadth: '', height: '', unit: 'cm' }],
          actualWeight: '', volumetricWeight: 0, chargeableWeight: 0
        });
        setUploadData(formData.uploadData || {
          totalPackages: '', packageImages: [], contentDescription: '', invoiceNumber: '',
          invoiceValue: '', invoiceImages: [], eWaybillNumber: '', acceptTerms: false
        });
        setPaymentData(formData.paymentData || { mode: '' });
        setCurrentStep(formData.currentStep || 0);
        setCompletedSteps(formData.completedSteps || []);
        setOriginPincode(formData.originPincode || '');
        setDestinationPincode(formData.destinationPincode || '');
        setOriginServiceable(formData.originServiceable);
        setDestinationServiceable(formData.destinationServiceable);
        setCorporateId(formData.corporateId || '');
        setCorporateMobile(formData.corporateMobile || '');
        setCorporateData(formData.corporateData || null);
        setCorporateSearchType(formData.corporateSearchType || 'id');
        setShowStepper(formData.showStepper || false);
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  };

  const clearLocalStorage = () => {
    localStorage.removeItem('bookingFormData');
  };

  // Load data on component mount
  useEffect(() => {
    loadFromLocalStorage();
  }, []);

  // Save data whenever any form data changes
  useEffect(() => {
    saveToLocalStorage();
  }, [flowType, originData, destinationData, shipmentData, uploadData, paymentData, currentStep, completedSteps, originPincode, destinationPincode, originServiceable, destinationServiceable, corporateId, corporateMobile, corporateData, corporateSearchType, showStepper]);

  // GST validation function
  const validateGSTFormat = (value: string) => {
    // Remove any non-alphanumeric characters
    let cleanValue = value.replace(/[^A-Z0-9]/g, '').toUpperCase();
    
    // Limit to 15 characters
    cleanValue = cleanValue.slice(0, 15);
    
    // Apply GST format rules
    let formattedValue = '';
    
    for (let i = 0; i < cleanValue.length; i++) {
      const char = cleanValue[i];
      
      if (i < 2) {
        // First 2 digits: State code (numbers only)
        if (/[0-9]/.test(char)) {
          formattedValue += char;
        }
      } else if (i < 7) {
        // Next 5 characters: Alphabets only (positions 2-6)
        if (/[A-Z]/.test(char)) {
          formattedValue += char;
        }
      } else if (i < 11) {
        // Next 4 characters: Numbers only (positions 7-10)
        if (/[0-9]/.test(char)) {
          formattedValue += char;
        }
      } else if (i === 11) {
        // 12th character: Alphabet only
        if (/[A-Z]/.test(char)) {
          formattedValue += char;
        }
      } else if (i === 12) {
        // 13th character: Entity code (1-9, then A-Z)
        if (/[1-9A-Z]/.test(char)) {
          formattedValue += char;
        }
      } else if (i === 13) {
        // 14th character: Always Z
        formattedValue += 'Z';
      } else if (i === 14) {
        // 15th character: Checksum (can be number or alphabet)
        if (/[0-9A-Z]/.test(char)) {
          formattedValue += char;
        }
      }
    }
    
    return formattedValue;
  };

  const calculateVolumetricWeight = () => {
    const total = shipmentData.dimensions.reduce((sum, dim) => {
      const l = parseFloat(dim.length) || 0;
      const b = parseFloat(dim.breadth) || 0;
      const h = parseFloat(dim.height) || 0;
      const multiplier = dim.unit === 'cm' ? 1 : (dim.unit === 'mm' ? 0.1 : 100);
      return sum + (l * b * h * multiplier);
    }, 0);
    const volumetric = Math.round((total / 5000) * 100) / 100;
    
    // Update shipment data with calculated volumetric weight
    if (shipmentData.volumetricWeight !== volumetric) {
      setShipmentData(prev => ({ ...prev, volumetricWeight: volumetric }));
    }
    
    return volumetric;
  };

  const calculateChargeableWeight = () => {
    const volumetric = calculateVolumetricWeight();
    const actual = parseFloat(shipmentData.actualWeight) || 0;
    const chargeable = Math.max(volumetric, actual);
    
    // Update shipment data with calculated chargeable weight
    if (shipmentData.chargeableWeight !== chargeable) {
      setShipmentData(prev => ({ ...prev, chargeableWeight: chargeable }));
    }
    
    return chargeable;
  };

  // Helper to parse backend pincode response into flat values
  const parsePincodeResponse = (data: any) => {
    const state: string = data?.state || '';
    const citiesObj = data?.cities || {};
    const firstCityKey = citiesObj && Object.keys(citiesObj).length > 0 ? Object.keys(citiesObj)[0] : '';
    const city: string = firstCityKey;
    const districtsObj = firstCityKey ? citiesObj[firstCityKey]?.districts || {} : {};
    const firstDistrictKey = districtsObj && Object.keys(districtsObj).length > 0 ? Object.keys(districtsObj)[0] : '';
    const district: string = firstDistrictKey;
    const areasArr = firstDistrictKey ? districtsObj[firstDistrictKey]?.areas || [] : [];
    const areas: string[] = Array.isArray(areasArr) ? areasArr.map((a: any) => a?.name || '').filter(Boolean) : [];
    return { state, city, district, areas };
  };

  // Auto-fill address data from pincode via backend
  const autoFillFromPincode = async (pincode: string, type: 'origin' | 'destination') => {
    try {
      if (type === 'origin') {
        setOriginPinError(null);
      } else {
        setDestinationPinError(null);
      }
      const { data } = await axios.get(`${API_BASE}/api/pincode/${pincode}`);
      if (!data) throw new Error('Invalid pincode');
      const parsed = parsePincodeResponse(data);
      const updateData = {
        city: parsed.city,
        district: parsed.district,
        state: parsed.state
      };
      const areas: string[] = parsed.areas;
      if (type === 'origin') {
        setOriginData(prev => ({ ...prev, ...updateData }));
        setOriginAreas(areas);
      } else {
        setDestinationData(prev => ({ ...prev, ...updateData }));
        setDestinationAreas(areas);
      }
    } catch (err: any) {
      const message = err?.response?.data?.error || 'Invalid or unserviceable pincode';
      if (type === 'origin') {
        setOriginPinError(message);
        setOriginAreas([]);
      } else {
        setDestinationPinError(message);
        setDestinationAreas([]);
      }
    }
  };

  // Handle step save with confirmation modal
  const handleStepSave = (stepIndex: number) => {
    let stepData = {};
    let stepTitle = '';
    
    switch (stepIndex) {
      case 0:
        stepData = originData;
        stepTitle = 'Confirm Origin Details';
        break;
      case 1:
        stepData = destinationData;
        stepTitle = 'Confirm Destination Details';
        break;
      case 2:
        const formattedDimensions = shipmentData.dimensions
          .filter(dim => dim.length && dim.breadth && dim.height)
          .map(dim => `${dim.length} × ${dim.breadth} × ${dim.height} = ${(parseFloat(dim.length) * parseFloat(dim.breadth) * parseFloat(dim.height)).toFixed(2)} ${dim.unit}³`)
          .join(', ');
          
        stepData = {
          ...shipmentData,
          dimensions: formattedDimensions || 'No dimensions entered',
          volumetricWeight: calculateVolumetricWeight(),
          chargeableWeight: calculateChargeableWeight()
        };
        stepTitle = 'Confirm Shipment Details';
        break;
      case 3:
        stepData = {
          ...uploadData,
          packageImages: uploadData.packageImages.length > 0 
            ? uploadData.packageImages.map(file => file.file?.name || file.originalName || 'Unknown').join(', ')
            : 'No package images uploaded',
          invoiceImages: uploadData.invoiceImages.length > 0
            ? uploadData.invoiceImages.map(file => file.file?.name || file.originalName || 'Unknown').join(', ')
            : 'No invoice images uploaded'
        };
        stepTitle = 'Confirm Upload Details';
        break;
      case 4:
        stepData = paymentData;
        stepTitle = 'Confirm Payment Method';
        break;
      default:
        stepData = {};
    }

    // Special handling for Step 5 (Payment) - show final confirmation instead of regular modal
    if (stepIndex === 4) {
      // Compile all data for final confirmation
      const compiledData = {
        flowType,
        originData,
        destinationData,
        shipmentData: {
          ...shipmentData,
          dimensions: shipmentData.dimensions
            .filter(dim => dim.length && dim.breadth && dim.height)
            .map(dim => `${dim.length} × ${dim.breadth} × ${dim.height} = ${(parseFloat(dim.length) * parseFloat(dim.breadth) * parseFloat(dim.height)).toFixed(2)} ${dim.unit}³`)
            .join(', ') || 'No dimensions entered',
          volumetricWeight: calculateVolumetricWeight(),
          chargeableWeight: calculateChargeableWeight()
        },
        uploadData: {
          ...uploadData,
          packageImages: uploadData.packageImages.length > 0 
            ? uploadData.packageImages.map(file => file.file?.name || file.originalName || 'Unknown').join(', ')
            : 'No package images uploaded',
          invoiceImages: uploadData.invoiceImages.length > 0
            ? uploadData.invoiceImages.map(file => file.file?.name || file.originalName || 'Unknown').join(', ')
            : 'No invoice images uploaded'
        },
        paymentData
      };
      
      setAllFormData(compiledData);
      setShowFinalConfirmation(true);
      return;
    }
    
    setModalData(stepData);
    setModalTitle(stepTitle);
    setCurrentStepType(steps[stepIndex]);
    setShowConfirmModal(true);
  };

  // Confirm step and move to next
  const confirmStep = () => {
    const newCompletedSteps = [...completedSteps];
    newCompletedSteps[currentStep] = true;
    setCompletedSteps(newCompletedSteps);
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      
      // Generate customer ID on final step
      if (currentStep === steps.length - 2) {
        const customerId = `OCL${Date.now().toString().slice(-6)}`;
        setGeneratedCustomerId(customerId);
      }
    }
    
    setShowConfirmModal(false);
  };

  // Enhanced pincode serviceability check via backend
  const checkPincodeServiceability = async (pincode: string, type: 'origin' | 'destination') => {
    if (pincode.length === 6) {
      try {
        const { data } = await axios.get(`${API_BASE}/api/pincode/${pincode}`);
        const isServiceable = !!data;
        const parsed = isServiceable ? parsePincodeResponse(data) : { state: '', city: '', district: '', areas: [] as string[] };
        if (type === 'origin') {
          setOriginServiceable(isServiceable);
          if (!isServiceable) {
            setShowNonServiceableMessage(true);
            setShowStepper(false);
            setDestinationServiceable(null);
            setDestinationPincode('');
            setOriginAreas([]);
          } else {
            setOriginData(prev => ({
              ...prev,
              pincode: pincode,
              city: parsed.city,
              district: parsed.district,
              state: parsed.state
            }));
            setOriginAreas(parsed.areas);
          }
        } else {
          setDestinationServiceable(isServiceable);
          if (isServiceable) {
            setDestinationData(prev => ({
              ...prev,
              pincode: pincode,
              city: parsed.city,
              district: parsed.district,
              state: parsed.state
            }));
            setDestinationAreas(parsed.areas);
          } else {
            setDestinationAreas([]);
          }
        }
        if (type === 'destination' && isServiceable && originServiceable) {
          setShowStepper(true);
          setCurrentStep(0);
        } else if (type === 'origin' && isServiceable && destinationServiceable) {
          setShowStepper(true);
          setCurrentStep(0);
        }
      } catch (e) {
        if (type === 'origin') {
          setOriginServiceable(false);
          setOriginAreas([]);
        } else {
          setDestinationServiceable(false);
          setDestinationAreas([]);
        }
        setShowStepper(false);
      }
    } else {
      if (type === 'origin') {
        setOriginServiceable(null);
        setShowStepper(false);
        setOriginAreas([]);
      } else {
        setDestinationServiceable(null);
        setShowStepper(false);
        setDestinationAreas([]);
      }
    }
  };

  // Final booking submission - send consolidated full payload to backend
  const submitBooking = async () => {
    try {
      setSubmitLoading(true);
      setSubmitError(null);

      // Frontend validation mirroring backend required fields
      const requiredSender: Array<[string, string]> = [
        ['name', originData.name],
        ['email', originData.email],
        ['phone', originData.mobileNumber],
        ['pincode', originData.pincode],
        ['state', originData.state],
        ['city', originData.city],
        ['district', originData.district],
        ['area', originData.area],
        ['addressLine1', originData.flatBuilding]
      ];
      const missingSender = requiredSender.filter(([_, val]) => !val || String(val).trim() === '').map(([key]) => key);
      if (missingSender.length > 0) {
        setSubmitError(`Please complete sender fields: ${missingSender.join(', ')}`);
        return;
      }

      const requiredReceiver: Array<[string, string]> = [
        ['name', destinationData.name],
        ['email', destinationData.email],
        ['phone', destinationData.mobileNumber],
        ['pincode', destinationData.pincode],
        ['state', destinationData.state],
        ['city', destinationData.city],
        ['district', destinationData.district],
        ['area', destinationData.area],
        ['addressLine1', destinationData.flatBuilding]
      ];
      const missingReceiver = requiredReceiver.filter(([_, val]) => !val || String(val).trim() === '').map(([key]) => key);
      if (missingReceiver.length > 0) {
        setSubmitError(`Please complete receiver fields: ${missingReceiver.join(', ')}`);
        return;
      }

      // Prepare upload data with server paths
      const processedUploadData = {
        ...uploadData,
        packageImages: uploadData.packageImages
          .filter(file => file.uploaded && file.serverPath)
          .map(file => file.serverPath),
        invoiceImages: uploadData.invoiceImages
          .filter(file => file.uploaded && file.serverPath)
          .map(file => file.serverPath)
      };

      const fullPayload = {
        formType: "full",
        originData: { ...originData },
        destinationData: { ...destinationData },
        shipmentData: { ...shipmentData },
        uploadData: processedUploadData,
        paymentData: { ...paymentData }
      };

      const fullRes = await axios.post(`${API_BASE}/api/form`, fullPayload);

      const backendId = fullRes?.data?.data?._id || fullRes?.data?.bookingId || fullRes?.data?.customerId || fullRes?.data?.id;
      const fallbackId = `OCL${Date.now().toString().slice(-6)}`;
      setGeneratedCustomerId(backendId || fallbackId);
      setShowFinalConfirmation(false);
      setShowFinalDocument(true);
    } catch (err: any) {
      const backendError = err?.response?.data;
      const details = Array.isArray(backendError?.details) ? `: ${backendError.details.join('; ')}` : '';
      setSubmitError((backendError?.error || "Failed to submit booking") + details);
    } finally {
      setSubmitLoading(false);
    }
  };

  // Reset public flow
  const resetPublicFlow = () => {
    setOriginPincode('');
    setDestinationPincode('');
    setOriginServiceable(null);
    setDestinationServiceable(null);
    setShowNonServiceableMessage(false);
    setShowStepper(false);
    setCurrentStep(0);
    setCompletedSteps([false, false, false, false, false, false]);
    // Reset form data
    setOriginData({
      mobileNumber: '',
      name: '',
      companyName: '',
      email: '',
      locality: '',
      flatBuilding: '',
      landmark: '',
      pincode: '',
      area: '',
      city: '',
      district: '',
      state: '',
      gstNumber: '',
      alternateNumbers: [''],
      addressType: 'Home'
    });
    setDestinationData({
      mobileNumber: '',
      name: '',
      companyName: '',
      email: '',
      locality: '',
      flatBuilding: '',
      landmark: '',
      pincode: '',
      area: '',
      city: '',
      district: '',
      state: '',
      gstNumber: '',
      alternateNumbers: [''],
      addressType: 'Home'
    });
    setUploadData({
      totalPackages: '',
      packageImages: [],
      contentDescription: '',
      invoiceNumber: '',
      invoiceValue: '',
      invoiceImages: [],
      eWaybillNumber: '',
      acceptTerms: false
    });
    setPaymentData({ mode: '' });
  };

  // Enhanced corporate lookup with validation and auto-fill
  const handleCorporateLookup = () => {
    let foundData = null;
    let searchValue = '';
    
    if (foundData && foundData.isActive) {
      setCorporateData(foundData);
      
      // Pre-fill origin data with corporate information
      setOriginData(prev => ({
        ...prev,
        name: foundData.name,
        companyName: foundData.name, // Corporate name as company
        email: foundData.email,
        mobileNumber: foundData.contactNumber,
        pincode: foundData.pin,
        city: foundData.city,
        district: foundData.locality,
        state: foundData.state,
        locality: foundData.companyAddress,
        flatBuilding: foundData.flatNumber,
        landmark: foundData.landmark || '',
        gstNumber: foundData.gstNumber,
        addressType: 'Office'
      }));
      
      // Also set pincode validation for origin (defer to backend check)
      setOriginPincode(foundData.pin);
      
      setShowStepper(true);
      setCurrentStep(0); // Start from Origin step
    } else if (foundData && !foundData.isActive) {
      setCorporateData({ ...foundData, error: 'inactive' });
    } else {
      setCorporateData({ error: 'notFound', searchValue, searchType: corporateSearchType });
      // Still show stepper for manual entry
      setShowStepper(true);
      setCurrentStep(0);
    }
  };

  // Reset corporate flow
  const resetCorporateFlow = () => {
    setCorporateId('');
    setCorporateMobile('');
    setCorporateData(null);
    setShowStepper(false);
    setCurrentStep(0);
    setCompletedSteps([false, false, false, false, false, false]);
    // Reset form data
    setOriginData({
      mobileNumber: '',
      name: '',
      companyName: '',
      email: '',
      locality: '',
      flatBuilding: '',
      landmark: '',
      pincode: '',
      area: '',
      city: '',
      district: '',
      state: '',
      gstNumber: '',
      alternateNumbers: [''],
      addressType: 'Home'
    });
    setDestinationData({
      mobileNumber: '',
      name: '',
      companyName: '',
      email: '',
      locality: '',
      flatBuilding: '',
      landmark: '',
      pincode: '',
      area: '',
      city: '',
      district: '',
      state: '',
      gstNumber: '',
      alternateNumbers: [''],
      addressType: 'Home'
    });
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Top Toggle Circles */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-gray-100 rounded-full p-1">
            <button
              onClick={() => {
                setFlowType('public');
                resetPublicFlow();
              }}
              className={`
                px-8 py-3 rounded-full font-medium transition-all duration-300
                ${flowType === 'public' 
                  ? 'bg-blue-500 text-white shadow-lg' 
                  : 'text-gray-600 hover:text-blue-500'
                }
              `}
            >
              Public
            </button>
            <button
              onClick={() => {
                setFlowType('corporate');
                resetPublicFlow();
                resetCorporateFlow();
              }}
              className={`
                px-8 py-3 rounded-full font-medium transition-all duration-300
                ${flowType === 'corporate' 
                  ? 'bg-blue-500 text-white shadow-lg' 
                  : 'text-gray-600 hover:text-blue-500'
                }
              `}
            >
              Corporate
            </button>
          </div>
        </div>

        {/* Public Flow */}
        {flowType === 'public' && !showStepper && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
                Check Serviceability
              </h2>
              <p className="text-center text-gray-600 mb-8">
                Enter your origin and destination pincodes to proceed with booking
              </p>
              
              <div className="space-y-6">
                <div>
                  <FloatingInput
                    label="Origin Pincode"
                    value={originPincode}
                    onChange={(value) => {
                      const pincode = value.replace(/\D/g, '').slice(0, 6);
                      setOriginPincode(pincode);
                      checkPincodeServiceability(pincode, 'origin');
                    }}
                    type="tel"
                    maxLength={6}
                    required
                    icon={<MapPin className="w-4 h-4" />}
                  />
                  
                  {originServiceable !== null && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mt-3 p-3 rounded-lg flex items-center space-x-2 text-sm ${
                        originServiceable 
                          ? 'bg-green-50 border border-green-200 text-green-700' 
                          : 'bg-red-50 border border-red-200 text-red-700'
                      }`}
                    >
                      {originServiceable ? (
                        <>
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="font-medium">This pincode is serviceable</p>
                            {originData.city && originData.state && (
                              <p className="text-xs text-green-600 mt-1">{originData.city}, {originData.state}</p>
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-5 h-5 text-red-600" />
                          <div>
                            <p className="font-medium">This pincode is non-serviceable</p>
                            <p className="text-xs text-red-600 mt-1">Please try a different pincode or contact customer care</p>
                          </div>
                        </>
                      )}
                    </motion.div>
                  )}
                </div>

                <div className={`${!originServiceable && originServiceable !== null ? 'opacity-50 pointer-events-none' : ''}`}>
                  <FloatingInput
                    label="Destination Pincode"
                    value={destinationPincode}
                    onChange={(value) => {
                      const pincode = value.replace(/\D/g, '').slice(0, 6);
                      setDestinationPincode(pincode);
                      checkPincodeServiceability(pincode, 'destination');
                    }}
                    type="tel"
                    maxLength={6}
                    required
                    disabled={!originServiceable && originServiceable !== null}
                    icon={<MapPin className="w-4 h-4" />}
                  />
                  
                  {destinationServiceable !== null && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mt-3 p-3 rounded-lg flex items-center space-x-2 text-sm ${
                        destinationServiceable 
                          ? 'bg-green-50 border border-green-200 text-green-700' 
                          : 'bg-red-50 border border-red-200 text-red-700'
                      }`}
                    >
                      {destinationServiceable ? (
                        <>
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="font-medium">This pincode is serviceable</p>
                            {destinationData.city && destinationData.state && (
                              <p className="text-xs text-green-600 mt-1">{destinationData.city}, {destinationData.state}</p>
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-5 h-5 text-red-600" />
                          <div>
                            <p className="font-medium">This pincode is non-serviceable</p>
                            <p className="text-xs text-red-600 mt-1">Please try a different pincode</p>
                          </div>
                        </>
                      )}
                    </motion.div>
                  )}
                </div>

                {/* Success Message when both are serviceable */}
                {originServiceable && destinationServiceable && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center"
                  >
                    <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-blue-800 font-semibold">Great! Both locations are serviceable</p>
                    <p className="text-blue-600 text-sm mt-1">You can now proceed with the booking process</p>
                  </motion.div>
                )}

                {/* Reset Button */}
                {(originServiceable !== null || destinationServiceable !== null) && (
                  <div className="text-center">
                    <button
                      onClick={resetPublicFlow}
                      className="text-gray-500 hover:text-gray-700 text-sm underline"
                    >
                      Reset and try different pincodes
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Enhanced Corporate Flow */}
        {flowType === 'corporate' && !showStepper && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
                Corporate Login
              </h2>
              <p className="text-center text-gray-600 mb-8">
                Search by Corporate ID or Mobile Number to auto-fill your details
              </p>
              
              <div className="space-y-6">
                {/* Search Type Toggle */}
                <div className="flex justify-center space-x-1 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => {
                      setCorporateSearchType('id');
                      setCorporateData(null);
                      setCorporateMobile('');
                    }}
                    className={`flex-1 px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                      corporateSearchType === 'id' 
                        ? 'bg-white text-blue-600 shadow-sm border border-blue-200' 
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                  >
                    <Building className="w-4 h-4 inline mr-2" />
                    Corporate ID
                  </button>
                  <button
                    onClick={() => {
                      setCorporateSearchType('mobile');
                      setCorporateData(null);
                      setCorporateId('');
                    }}
                    className={`flex-1 px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                      corporateSearchType === 'mobile' 
                        ? 'bg-white text-blue-600 shadow-sm border border-blue-200' 
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                  >
                    <Phone className="w-4 h-4 inline mr-2" />
                    Mobile Number
                  </button>
                </div>

                {/* Search Input */}
                {corporateSearchType === 'id' ? (
                  <FloatingInput
                    label="Corporate ID (e.g., D00001)"
                    value={corporateId}
                    onChange={(value) => {
                      setCorporateId(value.toUpperCase());
                      setCorporateData(null);
                    }}
                    icon={<Building className="w-4 h-4" />}
                  />
                ) : (
                  <FloatingInput
                    label="Mobile Number"
                    value={corporateMobile}
                    onChange={(value) => {
                      const mobile = value.replace(/\D/g, '').slice(0, 10);
                      setCorporateMobile(mobile);
                      setCorporateData(null);
                    }}
                    type="tel"
                    maxLength={10}
                    icon={<Phone className="w-4 h-4" />}
                  />
                )}

                {/* Search Button */}
                <button
                  onClick={handleCorporateLookup}
                  disabled={
                    (corporateSearchType === 'id' && !corporateId.trim()) ||
                    (corporateSearchType === 'mobile' && corporateMobile.length !== 10)
                  }
                  className={`w-full py-3 rounded-lg font-medium transition-all duration-200 ${
                    (corporateSearchType === 'id' && corporateId.trim()) ||
                    (corporateSearchType === 'mobile' && corporateMobile.length === 10)
                      ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg hover:shadow-xl'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <User className="w-4 h-4 inline mr-2" />
                  Search & Proceed
                </button>

                {/* Results Display */}
                <AnimatePresence mode="wait">
                  {corporateData && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      {/* Success - Active Corporate Found */}
                      {!corporateData.error && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                          <div className="flex items-center mb-4">
                            <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                            <h3 className="text-lg font-semibold text-green-800">Corporate Account Found</h3>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-green-700"><strong>Company:</strong> {corporateData.name}</p>
                              <p className="text-green-700"><strong>Email:</strong> {corporateData.email}</p>
                              <p className="text-green-700"><strong>Contact:</strong> {corporateData.contactNumber}</p>
                            </div>
                            <div>
                              <p className="text-green-700"><strong>Address:</strong> {corporateData.companyAddress}</p>
                              <p className="text-green-700"><strong>City:</strong> {corporateData.city}, {corporateData.state}</p>
                              <p className="text-green-700"><strong>GST:</strong> {corporateData.gstNumber}</p>
                            </div>
                          </div>
                          
                          <div className="mt-4 p-3 bg-green-100 rounded-lg">
                            <p className="text-green-800 text-sm font-medium">
                              âœ“ Your details will be automatically filled in the booking form
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Error - Inactive Corporate */}
                      {corporateData.error === 'inactive' && (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                          <div className="flex items-center mb-4">
                            <AlertCircle className="w-6 h-6 text-orange-600 mr-3" />
                            <h3 className="text-lg font-semibold text-orange-800">Account Inactive</h3>
                          </div>
                          
                          <p className="text-orange-700 mb-4">
                            Your corporate account <strong>{corporateData.name}</strong> is currently inactive. 
                            Please contact your account manager to reactivate your account.
                          </p>
                          
                          <div className="flex space-x-3">
                            <button
                              onClick={() => setShowStepper(true)}
                              className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
                            >
                              Continue Manually
                            </button>
                            <button
                              onClick={resetCorporateFlow}
                              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                              Try Different Account
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Error - Not Found */}
                      {corporateData.error === 'notFound' && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                          <div className="flex items-center mb-4">
                            <AlertCircle className="w-6 h-6 text-blue-600 mr-3" />
                            <h3 className="text-lg font-semibold text-blue-800">Account Not Found</h3>
                          </div>
                          
                          <p className="text-blue-700 mb-4">
                            No corporate account found with {corporateData.searchType === 'id' ? 'ID' : 'mobile number'} 
                            <strong> {corporateData.searchValue}</strong>. You can proceed with manual entry or try a different search.
                          </p>
                          
                          <div className="flex space-x-3">
                            <button
                              onClick={() => setShowStepper(true)}
                              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                              Continue Manually
                            </button>
                            <button
                              onClick={resetCorporateFlow}
                              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                              Try Different Search
                            </button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Reset Option */}
                {(corporateId || corporateMobile) && (
                  <div className="text-center">
                    <button
                      onClick={resetCorporateFlow}
                      className="text-gray-500 hover:text-gray-700 text-sm underline"
                    >
                      Reset and try different credentials
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Enhanced Non-serviceable Message */}
        <AnimatePresence>
          {showNonServiceableMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Service Not Available</h3>
                  <p className="text-gray-600 mb-6">
                    Sorry, we don't currently service the origin pincode <strong>{originPincode}</strong>. 
                    Please try a different pincode or contact our customer care team for assistance.
                  </p>
                  
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        setShowNonServiceableMessage(false);
                        resetPublicFlow();
                      }}
                      className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                    >
                      Try Different Pincode
                    </button>
                    
                    <button
                      onClick={() => setShowNonServiceableMessage(false)}
                      className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Phone className="w-4 h-4 inline mr-2" />
                      Contact Customer Care
                    </button>
                  </div>
                  
                  <button
                    onClick={() => setShowNonServiceableMessage(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stepper Section */}
        {showStepper && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <Stepper 
              currentStep={currentStep} 
              steps={steps} 
              completedSteps={completedSteps} 
            />
            
            {/* Step Content - All Forms */}
            <div className="bg-white rounded-xl shadow-lg p-8 mt-6">
              {/* Back Button for all steps except step 0 */}
              {currentStep > 0 && (
                <div className="mb-6">
                  <button
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="flex items-center px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group"
                  >
                    <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to {steps[currentStep - 1]}
                  </button>
                </div>
              )}

              {/* Step 1: Origin Details */}
              {currentStep === 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="mb-6">
                    <h3 className="text-2xl font-semibold text-gray-800">Origin Details</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FloatingInput
                      label="Mobile Number"
                      value={originData.mobileNumber}
                      onChange={(value) => {
                        const mobile = value.replace(/\D/g, '').slice(0, 10);
                        setOriginData(prev => ({ ...prev, mobileNumber: mobile }));
                        
                        // Auto-fill from user database
                        
                      }}
                      type="tel"
                      required
                      icon={<Phone className="w-4 h-4" />}
                    />

                    <FloatingInput
                      label="Full Name"
                      value={originData.name}
                      onChange={(value) => setOriginData(prev => ({ ...prev, name: value }))}
                      required
                      icon={<User className="w-4 h-4" />}
                    />

                    <FloatingInput
                      label="Company Name"
                      value={originData.companyName}
                      onChange={(value) => setOriginData(prev => ({ ...prev, companyName: value }))}
                      icon={<Building className="w-4 h-4" />}
                    />

                    <FloatingInput
                      label="Email Address"
                      value={originData.email}
                      onChange={(value) => setOriginData(prev => ({ ...prev, email: value }))}
                      type="email"
                      icon={<Mail className="w-4 h-4" />}
                    />

                    <FloatingInput
                      label="Pin Code"
                      value={originData.pincode}
                      onChange={(value) => {
                        const pincode = value.replace(/\D/g, '').slice(0, 6);
                        setOriginData(prev => ({ ...prev, pincode }));
                        if (pincode.length === 6) {
                          autoFillFromPincode(pincode, 'origin');
                        }
                      }}
                      type="tel"
                      required
                      maxLength={6}
                      icon={<MapPin className="w-4 h-4" />}
                    />

                    {originData.pincode.length === 6 && originAreas.length > 0 && (
                      <FloatingSelect
                        label="Select Area"
                        value={originData.area}
                        onChange={(value) => setOriginData(prev => ({ ...prev, area: value }))}
                        options={originAreas}
                        required
                      />
                    )}
                    {originPinError && (
                      <div className="text-sm text-red-600">{originPinError}</div>
                    )}

                    <FloatingInput
                      label="Locality / Street"
                      value={originData.locality}
                      onChange={(value) => setOriginData(prev => ({ ...prev, locality: value }))}
                      required
                    />

                    <FloatingInput
                      label="Flat / Building"
                      value={originData.flatBuilding}
                      onChange={(value) => setOriginData(prev => ({ ...prev, flatBuilding: value }))}
                      required
                    />

                    <FloatingInput
                      label="Landmark (Optional)"
                      value={originData.landmark}
                      onChange={(value) => setOriginData(prev => ({ ...prev, landmark: value }))}
                    />

                    <div className="relative">
                      <FloatingInput
                        label="GST Number (Optional)"
                        value={originData.gstNumber}
                        onChange={(value) => {
                          const formattedGST = validateGSTFormat(value);
                          setOriginData(prev => ({ ...prev, gstNumber: formattedGST }));
                        }}
                        maxLength={15}
                      />
                      <div className="text-xs text-gray-500 mt-1 ml-1 space-y-1">
                        <div><strong>Format:</strong> 22AAAAA0000A1Z5</div>
                        <div className="text-[10px] leading-tight">
                          <span className="font-medium">22</span> = State Code | 
                          <span className="font-medium">AAAAA</span> = PAN Letters | 
                          <span className="font-medium">0000</span> = PAN Numbers | 
                          <span className="font-medium">A</span> = PAN Letter | 
                          <span className="font-medium">1</span> = Entity Code | 
                          <span className="font-medium">Z</span> = Fixed | 
                          <span className="font-medium">5</span> = Checksum
                        </div>
                      </div>
                    </div>

                    <FloatingInput
                      label="City"
                      value={originData.city}
                      onChange={(value) => setOriginData(prev => ({ ...prev, city: value }))}
                      disabled
                    />

                    <FloatingInput
                      label="District"
                      value={originData.district}
                      onChange={(value) => setOriginData(prev => ({ ...prev, district: value }))}
                      disabled
                    />

                    <FloatingInput
                      label="State"
                      value={originData.state}
                      onChange={(value) => setOriginData(prev => ({ ...prev, state: value }))}
                      disabled
                    />
                  </div>

                  {/* Alternate Numbers */}
                  <div className="border-t pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-800">Alternate Numbers</h4>
                      <button
                        onClick={() => setOriginData(prev => ({ 
                          ...prev, 
                          alternateNumbers: [...prev.alternateNumbers, ''] 
                        }))}
                        className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Number
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {originData.alternateNumbers.map((number, index) => (
                        <div key={index} className="flex space-x-3">
                          <FloatingInput
                            label={`Alternate Number ${index + 1}`}
                            value={number}
                            onChange={(value) => {
                              const newNumbers = [...originData.alternateNumbers];
                              newNumbers[index] = value.replace(/\D/g, '').slice(0, 10);
                              setOriginData(prev => ({ ...prev, alternateNumbers: newNumbers }));
                            }}
                            type="tel"
                            maxLength={10}
                            className="flex-1"
                          />
                          {originData.alternateNumbers.length > 1 && (
                            <button
                              onClick={() => {
                                const newNumbers = originData.alternateNumbers.filter((_, i) => i !== index);
                                setOriginData(prev => ({ ...prev, alternateNumbers: newNumbers }));
                              }}
                              className="mt-0 px-3 h-14 text-red-600 hover:text-red-700 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Address Type */}
                  <div className="border-t pt-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Address Type</h4>
                    <div className="flex space-x-6">
                      {['Home', 'Office', 'Other'].map((type) => (
                        <label key={type} className="flex items-center space-x-3 cursor-pointer group">
                          <input
                            type="radio"
                            name="originAddressType"
                            value={type}
                            checked={originData.addressType === type}
                            onChange={(e) => setOriginData(prev => ({ ...prev, addressType: e.target.value }))}
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <span className="text-gray-700 group-hover:text-blue-600 transition-colors">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Destination Details */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="mb-6">
                    <h3 className="text-2xl font-semibold text-gray-800">Destination Details</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FloatingInput
                      label="Mobile Number"
                      value={destinationData.mobileNumber}
                      onChange={(value) => {
                        const mobile = value.replace(/\D/g, '').slice(0, 10);
                        setDestinationData(prev => ({ ...prev, mobileNumber: mobile }));
                        
                        
                      }}
                      type="tel"
                      required
                      icon={<Phone className="w-4 h-4" />}
                    />

                    <FloatingInput
                      label="Full Name"
                      value={destinationData.name}
                      onChange={(value) => setDestinationData(prev => ({ ...prev, name: value }))}
                      required
                      icon={<User className="w-4 h-4" />}
                    />

                    <FloatingInput
                      label="Company Name"
                      value={destinationData.companyName}
                      onChange={(value) => setDestinationData(prev => ({ ...prev, companyName: value }))}
                      icon={<Building className="w-4 h-4" />}
                    />

                    <FloatingInput
                      label="Email Address"
                      value={destinationData.email}
                      onChange={(value) => setDestinationData(prev => ({ ...prev, email: value }))}
                      type="email"
                      icon={<Mail className="w-4 h-4" />}
                    />

                    <FloatingInput
                      label="Pin Code"
                      value={destinationData.pincode}
                      onChange={(value) => {
                        const pincode = value.replace(/\D/g, '').slice(0, 6);
                        setDestinationData(prev => ({ ...prev, pincode }));
                        if (pincode.length === 6) {
                          autoFillFromPincode(pincode, 'destination');
                        }
                      }}
                      type="tel"
                      required
                      maxLength={6}
                      icon={<MapPin className="w-4 h-4" />}
                    />

                    {destinationData.pincode.length === 6 && destinationAreas.length > 0 && (
                      <FloatingSelect
                        label="Select Area"
                        value={destinationData.area}
                        onChange={(value) => setDestinationData(prev => ({ ...prev, area: value }))}
                        options={destinationAreas}
                        required
                      />
                    )}
                    {destinationPinError && (
                      <div className="text-sm text-red-600">{destinationPinError}</div>
                    )}

                    <FloatingInput
                      label="Locality / Street"
                      value={destinationData.locality}
                      onChange={(value) => setDestinationData(prev => ({ ...prev, locality: value }))}
                      required
                    />

                    <FloatingInput
                      label="Flat / Building"
                      value={destinationData.flatBuilding}
                      onChange={(value) => setDestinationData(prev => ({ ...prev, flatBuilding: value }))}
                      required
                    />

                    <FloatingInput
                      label="Landmark (Optional)"
                      value={destinationData.landmark}
                      onChange={(value) => setDestinationData(prev => ({ ...prev, landmark: value }))}
                    />

                    <div className="relative">
                      <FloatingInput
                        label="GST Number (Optional)"
                        value={destinationData.gstNumber}
                        onChange={(value) => {
                          const formattedGST = validateGSTFormat(value);
                          setDestinationData(prev => ({ ...prev, gstNumber: formattedGST }));
                        }}
                        maxLength={15}
                      />
                      <div className="text-xs text-gray-500 mt-1 ml-1 space-y-1">
                        <div><strong>Format:</strong> 22AAAAA0000A1Z5</div>
                        <div className="text-[10px] leading-tight">
                          <span className="font-medium">22</span> = State Code | 
                          <span className="font-medium">AAAAA</span> = PAN Letters | 
                          <span className="font-medium">0000</span> = PAN Numbers | 
                          <span className="font-medium">A</span> = PAN Letter | 
                          <span className="font-medium">1</span> = Entity Code | 
                          <span className="font-medium">Z</span> = Fixed | 
                          <span className="font-medium">5</span> = Checksum
                        </div>
                      </div>
                    </div>

                    <FloatingInput
                      label="City"
                      value={destinationData.city}
                      onChange={(value) => setDestinationData(prev => ({ ...prev, city: value }))}
                      disabled
                    />

                    <FloatingInput
                      label="District"
                      value={destinationData.district}
                      onChange={(value) => setDestinationData(prev => ({ ...prev, district: value }))}
                      disabled
                    />

                    <FloatingInput
                      label="State"
                      value={destinationData.state}
                      onChange={(value) => setDestinationData(prev => ({ ...prev, state: value }))}
                      disabled
                    />
                  </div>

                  {/* Alternate Numbers */}
                  <div className="border-t pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-800">Alternate Numbers</h4>
                      <button
                        onClick={() => setDestinationData(prev => ({ 
                          ...prev, 
                          alternateNumbers: [...prev.alternateNumbers, ''] 
                        }))}
                        className="flex items-center text-green-600 hover:text-green-700 text-sm font-medium"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Number
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {destinationData.alternateNumbers.map((number, index) => (
                        <div key={index} className="flex space-x-3">
                          <FloatingInput
                            label={`Alternate Number ${index + 1}`}
                            value={number}
                            onChange={(value) => {
                              const newNumbers = [...destinationData.alternateNumbers];
                              newNumbers[index] = value.replace(/\D/g, '').slice(0, 10);
                              setDestinationData(prev => ({ ...prev, alternateNumbers: newNumbers }));
                            }}
                            type="tel"
                            maxLength={10}
                            className="flex-1"
                          />
                          {destinationData.alternateNumbers.length > 1 && (
                            <button
                              onClick={() => {
                                const newNumbers = destinationData.alternateNumbers.filter((_, i) => i !== index);
                                setDestinationData(prev => ({ ...prev, alternateNumbers: newNumbers }));
                              }}
                              className="mt-0 px-3 h-14 text-red-600 hover:text-red-700 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Address Type */}
                  <div className="border-t pt-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Address Type</h4>
                    <div className="flex space-x-6">
                      {['Home', 'Office', 'Other'].map((type) => (
                        <label key={type} className="flex items-center space-x-3 cursor-pointer group">
                          <input
                            type="radio"
                            name="destinationAddressType"
                            value={type}
                            checked={destinationData.addressType === type}
                            onChange={(e) => setDestinationData(prev => ({ ...prev, addressType: e.target.value }))}
                            className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300"
                          />
                          <span className="text-gray-700 group-hover:text-green-600 transition-colors">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Shipment Details */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-8"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-semibold text-gray-800">Shipment Details</h3>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Package className="w-4 h-4 mr-1" />
                      Package Configuration
                    </div>
                  </div>

                  {/* Services & Mode Section - Enhanced with separate boxes */}
                  <div className="space-y-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Truck className="w-5 h-5 mr-2 text-blue-600" />
                      Services & Mode
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Nature of Consignment */}
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 hover:shadow-lg transition-all duration-300">
                        <label className="block text-sm font-semibold text-blue-800 mb-4 text-center">Nature of Consignment</label>
                        <div className="space-y-3">
                          {['BOX', 'NON-BOX'].map((type) => (
                            <label key={type} className="flex items-center space-x-3 cursor-pointer group bg-white rounded-lg p-3 hover:bg-blue-50 transition-colors">
                              <input
                                type="radio"
                                name="natureOfConsignment"
                                value={type}
                                checked={shipmentData.natureOfConsignment === type}
                                onChange={(e) => setShipmentData(prev => ({ ...prev, natureOfConsignment: e.target.value }))}
                                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                              />
                              <span className="text-gray-700 group-hover:text-blue-600 transition-colors font-medium">
                                {type}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Services */}
                      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200 hover:shadow-lg transition-all duration-300">
                        <label className="block text-sm font-semibold text-green-800 mb-4 text-center">Services</label>
                        <div className="space-y-3">
                          {['Standard', 'Priority'].map((service) => (
                            <label key={service} className="flex items-center space-x-3 cursor-pointer group bg-white rounded-lg p-3 hover:bg-green-50 transition-colors">
                              <input
                                type="radio"
                                name="services"
                                value={service}
                                checked={shipmentData.services === service}
                                onChange={(e) => setShipmentData(prev => ({ ...prev, services: e.target.value }))}
                                className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300"
                              />
                              <span className="text-gray-700 group-hover:text-green-600 transition-colors font-medium">
                                {service}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Mode */}
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200 hover:shadow-lg transition-all duration-300">
                        <label className="block text-sm font-semibold text-purple-800 mb-4 text-center">Mode</label>
                        <div className="space-y-3">
                          {[
                            { value: 'Air', icon: Plane },
                            { value: 'Surface', icon: Truck }
                          ].map(({ value, icon: Icon }) => (
                            <label key={value} className="flex items-center space-x-3 cursor-pointer group bg-white rounded-lg p-3 hover:bg-purple-50 transition-colors">
                              <input
                                type="radio"
                                name="mode"
                                value={value}
                                checked={shipmentData.mode === value}
                                onChange={(e) => setShipmentData(prev => ({ ...prev, mode: e.target.value }))}
                                className="w-4 h-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                              />
                              <Icon className="w-4 h-4 text-gray-600 group-hover:text-purple-600 transition-colors" />
                              <span className="text-gray-700 group-hover:text-purple-600 transition-colors font-medium">
                                {value}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Insurance & Risk Section */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Shield className="w-5 h-5 mr-2 text-green-600" />
                      Insurance & Risk Coverage
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Insurance */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Insurance</label>
                        <div className="space-y-2">
                          <label className="flex items-start space-x-3 cursor-pointer group bg-white rounded-lg p-3 hover:bg-green-50 transition-colors">
                            <input
                              type="radio"
                              name="insurance"
                              value="Consignor not insured the shipment"
                              checked={shipmentData.insurance === "Consignor not insured the shipment"}
                              onChange={(e) => setShipmentData(prev => ({ ...prev, insurance: e.target.value }))}
                              className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 mt-0.5"
                            />
                            <span className="text-gray-700 group-hover:text-green-600 transition-colors text-sm">
                              Consignor not insured the shipment
                            </span>
                          </label>
                          <label className="flex items-start space-x-3 cursor-pointer group bg-white rounded-lg p-3 hover:bg-green-50 transition-colors">
                            <input
                              type="radio"
                              name="insurance"
                              value="Consignor has insured the shipment"
                              checked={shipmentData.insurance === "Consignor has insured the shipment"}
                              onChange={(e) => setShipmentData(prev => ({ ...prev, insurance: e.target.value }))}
                              className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 mt-0.5"
                            />
                            <span className="text-gray-700 group-hover:text-green-600 transition-colors text-sm">
                              Consignor has insured the shipment
                            </span>
                          </label>
                        </div>
                      </div>

                      {/* Risk Coverage */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Risk Coverage</label>
                        <div className="space-y-2">
                          <label className="flex items-center space-x-3 cursor-pointer group bg-white rounded-lg p-3 hover:bg-green-50 transition-colors">
                            <input
                              type="radio"
                              name="riskCoverage"
                              value="Carrier"
                              checked={shipmentData.riskCoverage === "Carrier"}
                              onChange={(e) => setShipmentData(prev => ({ ...prev, riskCoverage: e.target.value }))}
                              className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300"
                            />
                            <span className="text-gray-700 group-hover:text-green-600 transition-colors font-medium">
                              Carrier
                            </span>
                          </label>
                          <label className="flex items-center space-x-3 cursor-pointer group bg-white rounded-lg p-3 hover:bg-green-50 transition-colors">
                            <input
                              type="radio"
                              name="riskCoverage"
                              value="Owner"
                              checked={shipmentData.riskCoverage === "Owner"}
                              onChange={(e) => setShipmentData(prev => ({ ...prev, riskCoverage: e.target.value }))}
                              className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300"
                            />
                            <span className="text-gray-700 group-hover:text-green-600 transition-colors font-medium">
                              Owner
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Weight Calculations Section */}
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Package className="w-5 h-5 mr-2 text-orange-600" />
                      Weight Calculations
                    </h4>

                    {/* Dimensions */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">Package Dimensions</label>
                        <button
                          onClick={() => setShipmentData(prev => ({
                            ...prev,
                            dimensions: [...prev.dimensions, { length: '', breadth: '', height: '', unit: 'cm' }]
                          }))}
                          className="flex items-center text-orange-600 hover:text-orange-700 text-sm font-medium"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add Package
                        </button>
                      </div>

                      {shipmentData.dimensions.map((dim, index) => (
                        <div key={index} className="grid grid-cols-5 gap-3 items-end">
                          <FloatingInput
                            label="Length"
                            value={dim.length}
                            onChange={(value) => {
                              const newDimensions = [...shipmentData.dimensions];
                              newDimensions[index] = { ...newDimensions[index], length: value };
                              setShipmentData(prev => ({ ...prev, dimensions: newDimensions }));
                            }}
                            type="number"
                          />
                          <FloatingInput
                            label="Breadth"
                            value={dim.breadth}
                            onChange={(value) => {
                              const newDimensions = [...shipmentData.dimensions];
                              newDimensions[index] = { ...newDimensions[index], breadth: value };
                              setShipmentData(prev => ({ ...prev, dimensions: newDimensions }));
                            }}
                            type="number"
                          />
                          <FloatingInput
                            label="Height"
                            value={dim.height}
                            onChange={(value) => {
                              const newDimensions = [...shipmentData.dimensions];
                              newDimensions[index] = { ...newDimensions[index], height: value };
                              setShipmentData(prev => ({ ...prev, dimensions: newDimensions }));
                            }}
                            type="number"
                          />
                          <FloatingSelect
                            label="Unit"
                            value={dim.unit}
                            onChange={(value) => {
                              const newDimensions = [...shipmentData.dimensions];
                              newDimensions[index] = { ...newDimensions[index], unit: value };
                              setShipmentData(prev => ({ ...prev, dimensions: newDimensions }));
                            }}
                            options={['cm', 'mm', 'm']}
                          />
                          {shipmentData.dimensions.length > 1 && (
                            <button
                              onClick={() => {
                                const newDimensions = shipmentData.dimensions.filter((_, i) => i !== index);
                                setShipmentData(prev => ({ ...prev, dimensions: newDimensions }));
                              }}
                              className="h-14 px-3 text-red-600 hover:text-red-700 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Weight Inputs and Calculations */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <FloatingInput
                        label="Actual Weight (kg)"
                        value={shipmentData.actualWeight}
                        onChange={(value) => setShipmentData(prev => ({ ...prev, actualWeight: value }))}
                        type="number"
                      />
                      
                      <div className="space-y-3">
                        <div className="bg-white rounded-lg p-4 border border-orange-200">
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Volumetric Weight:</span>
                              <span className="font-semibold text-orange-600">{calculateVolumetricWeight()} kg</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Actual Weight:</span>
                              <span className="font-semibold text-blue-600">{shipmentData.actualWeight || 0} kg</span>
                            </div>
                            <div className="flex justify-between border-t border-gray-200 pt-2">
                              <span className="text-gray-800 font-medium">Chargeable Weight:</span>
                              <span className="font-bold text-green-600">{calculateChargeableWeight()} kg</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Upload Section - Enhanced */}
              {currentStep === 3 ? (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                      {steps[currentStep]}
                    </h3>
                    <p className="text-gray-600">
                      Upload package images and invoice details{parseFloat(uploadData.invoiceValue) >= 50000 ? ' (E-Waybill required for â‰¥â‚¹50,000)' : ''}
                    </p>
                  </div>

                  {/* Package Information */}
                  <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Package className="w-5 h-5 mr-2 text-purple-600" />
                      Package Information
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FloatingInput
                        label="Total Number of Packages"
                        value={uploadData.totalPackages}
                        onChange={(value) => setUploadData(prev => ({ ...prev, totalPackages: value.replace(/\D/g, '') }))}
                        type="number"
                        required
                        icon={<Package className="w-4 h-4" />}
                      />
                      
                      <div>
                        <ImageUploadWithPreview
                          label="Package Images"
                          files={uploadData.packageImages}
                          onFilesChange={(files) => setUploadData(prev => ({ ...prev, packageImages: files }))}
                          maxFiles={10}
                          accept="image/*"
                          uploadEndpoint={`${API_BASE}/api/upload/package-images`}
                          fieldName="packageImages"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <FloatingTextarea
                        label="Content Description"
                        value={uploadData.contentDescription}
                        onChange={(value) => setUploadData(prev => ({ ...prev, contentDescription: value }))}
                        required
                        rows={2}
                      />
                    </div>
                  </div>

                  {/* Invoice Information */}
                  <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-200">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-indigo-600" />
                      Invoice Information
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FloatingInput
                        label="Invoice Number"
                        value={uploadData.invoiceNumber}
                        onChange={(value) => setUploadData(prev => ({ ...prev, invoiceNumber: value }))}
                        required
                        icon={<FileText className="w-4 h-4" />}
                      />
                      
                      <FloatingInput
                        label="Invoice Value (â‚¹)"
                        value={uploadData.invoiceValue}
                        onChange={(value) => {
                          const numericValue = value.replace(/[^\d.]/g, '');
                          setUploadData(prev => ({ ...prev, invoiceValue: numericValue }));
                        }}
                        type="number"
                        required
                        icon={<DollarSign className="w-4 h-4" />}
                      />
                    </div>

                    {/* Conditional E-Waybill */}
                    {parseFloat(uploadData.invoiceValue) >= 50000 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                      >
                        <div className="flex items-center mb-2">
                          <AlertCircle className="w-4 h-4 text-yellow-600 mr-2" />
                          <span className="text-sm font-medium text-yellow-800">E-Waybill Required</span>
                        </div>
                        <FloatingInput
                          label="E-Waybill Number"
                          value={uploadData.eWaybillNumber}
                          onChange={(value) => setUploadData(prev => ({ ...prev, eWaybillNumber: value }))}
                          required
                          icon={<FileText className="w-4 h-4" />}
                        />
                      </motion.div>
                    )}

                    {/* Invoice Images Upload */}
                    <div className="mt-6">
                      <ImageUploadWithPreview
                        label="Upload Invoice Images"
                        files={uploadData.invoiceImages}
                        onFilesChange={(files) => setUploadData(prev => ({ ...prev, invoiceImages: files }))}
                        maxFiles={10}
                        accept="image/*"
                        uploadEndpoint={`${API_BASE}/api/upload/invoice-images`}
                        fieldName="invoiceImages"
                        className="bg-indigo-50 p-4 rounded-lg border border-indigo-200"
                      />
                    </div>
                  </div>

                  {/* Terms & Conditions */}
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id="acceptTerms"
                        checked={uploadData.acceptTerms}
                        onChange={(e) => setUploadData(prev => ({ ...prev, acceptTerms: e.target.checked }))}
                        className="w-4 h-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded mt-0.5"
                        required
                      />
                      <label htmlFor="acceptTerms" className="text-sm text-gray-700">
                        I accept the{' '}
                        <a href="#" className="text-purple-600 hover:text-purple-700 underline">
                          Terms & Conditions
                        </a>
                        {' '}and confirm that all information is accurate.
                      </label>
                    </div>
                    {!uploadData.acceptTerms && (
                      <p className="text-xs text-red-600 mt-2 ml-7">
                        * Required to proceed
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                currentStep === 4 ? (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="mb-6">
                      <h3 className="text-2xl font-semibold text-gray-800">Mode of Payment</h3>
                    </div>

                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-8 border border-indigo-200">
                      <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center justify-center">
                        <CreditCard className="w-6 h-6 mr-3 text-indigo-600" />
                        Select Payment Method
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                        {/* Cash Payment */}
                        <label className="flex flex-col items-center space-y-4 cursor-pointer group bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-300">
                          <input
                            type="radio"
                            name="paymentMode"
                            value="Cash"
                            checked={paymentData.mode === "Cash"}
                            onChange={(e) => setPaymentData(prev => ({ ...prev, mode: e.target.value }))}
                            className="w-5 h-5 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                          />
                          <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3 mx-auto group-hover:bg-green-200 transition-colors">
                              <DollarSign className="w-8 h-8 text-green-600" />
                            </div>
                            <span className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                              Cash
                            </span>
                            <p className="text-sm text-gray-500 mt-1">Pay in cash on delivery</p>
                          </div>
                        </label>

                        {/* Online/UPI/FP Payment */}
                        <label className="flex flex-col items-center space-y-4 cursor-pointer group bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-300">
                          <input
                            type="radio"
                            name="paymentMode"
                            value="Online/UPI/FP"
                            checked={paymentData.mode === "Online/UPI/FP"}
                            onChange={(e) => setPaymentData(prev => ({ ...prev, mode: e.target.value }))}
                            className="w-5 h-5 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                          />
                          <div className="text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3 mx-auto group-hover:bg-blue-200 transition-colors">
                              <CreditCard className="w-8 h-8 text-blue-600" />
                            </div>
                            <span className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                              Online/UPI/FP
                            </span>
                            <p className="text-sm text-gray-500 mt-1">Digital payment methods</p>
                          </div>
                        </label>
                      </div>

                      {/* Payment Selection Indicator */}
                      {paymentData.mode && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-6 text-center"
                        >
                          <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Selected: {paymentData.mode}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  currentStep === 5 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-12"
                    >
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-8 border border-green-200">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                          className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
                        >
                          <CheckCircle className="w-12 h-12 text-white" />
                        </motion.div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h3>
                        <p className="text-gray-600 mb-4">Your shipment has been successfully registered.</p>
                        <div className="bg-white rounded-lg p-4 border border-green-200 inline-block">
                          <p className="text-sm text-gray-600">Customer ID</p>
                          <p className="text-xl font-bold text-green-600">{generatedCustomerId}</p>
                        </div>
                      </div>
                    </motion.div>
                  ) : null
                )
              )}
                
              <div className="text-center mt-6">
                <button
                  onClick={() => handleStepSave(currentStep)}
                  disabled={
                    (currentStep === 3 && (!uploadData.acceptTerms || !uploadData.totalPackages || !uploadData.invoiceNumber || !uploadData.invoiceValue || !uploadData.contentDescription || (parseFloat(uploadData.invoiceValue) >= 50000 && !uploadData.eWaybillNumber))) ||
                    (currentStep === 4 && !paymentData.mode)
                  }
                  className={`px-8 py-3 rounded-lg transition-colors font-medium flex items-center mx-auto ${
                    ((currentStep === 3 && (!uploadData.acceptTerms || !uploadData.totalPackages || !uploadData.invoiceNumber || !uploadData.invoiceValue || !uploadData.contentDescription || (parseFloat(uploadData.invoiceValue) >= 50000 && !uploadData.eWaybillNumber))) ||
                     (currentStep === 4 && !paymentData.mode))
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : currentStep === 0 ? 'bg-blue-500 hover:bg-blue-600 text-white' :
                        currentStep === 1 ? 'bg-green-500 hover:bg-green-600 text-white' :
                        currentStep === 2 ? 'bg-orange-500 hover:bg-orange-600 text-white' :
                        currentStep === 3 ? 'bg-purple-500 hover:bg-purple-600 text-white' :
                        currentStep === 4 ? 'bg-indigo-500 hover:bg-indigo-600 text-white' :
                        'bg-emerald-500 hover:bg-emerald-600 text-white'
                  }`}
                >
                  {currentStep === 4 ? 'Review & Confirm' : currentStep === 5 ? 'Complete Booking' : 'Save & Continue'}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Enhanced Confirmation Modal */}
        <ConfirmationModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={confirmStep}
          onEdit={() => {
            setShowConfirmModal(false);
            // Stay on current step for editing - don't change currentStep
          }}
          title={modalTitle}
          data={modalData}
          stepType={currentStepType}
          currentStep={currentStep}
        />

        {/* Final Confirmation Modal (Step 6a) */}
        {showFinalConfirmation && (
          <FinalConfirmationModal
            isOpen={showFinalConfirmation}
            onClose={() => setShowFinalConfirmation(false)}
            onProceed={submitBooking}
            onBack={() => {
              setShowFinalConfirmation(false);
              setCurrentStep(0);
              setShowStepper(true);
            }}
            allData={allFormData}
            loading={submitLoading}
            errorMessage={submitError}
          />
        )}

        {/* Final Document Display (Step 6b) */}
        {showFinalDocument && (
          <FinalDocumentDisplay
            allData={allFormData}
            customerId={generatedCustomerId}
            onStartNew={() => {
              setShowFinalDocument(false);
              clearLocalStorage();
              window.location.reload();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default BookingPanel;