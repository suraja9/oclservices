import mongoose from "mongoose";

const formSchema = new mongoose.Schema({
  // Sender (Left form) data
  senderName: { 
    type: String, 
    required: [true, 'Sender name is required'],
    trim: true,
    maxlength: [100, 'Sender name cannot be longer than 100 characters']
  },
  senderEmail: { 
    type: String, 
    required: [true, 'Sender email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid sender email']
  },
  senderPhone: {
    type: String,
    required: [true, 'Sender phone number is required'],
    trim: true,
    match: [/^[\d\s\-\+\(\)]{10,15}$/, 'Please enter a valid sender phone number']
  },
  senderPincode: { 
    type: String, 
    required: [true, 'Sender pincode is required'],
    match: [/^\d{6}$/, 'Sender pincode must be exactly 6 digits']
  },
  senderState: {
    type: String,
    required: [true, 'Sender state is required'],
    trim: true
  },
  senderCity: {
    type: String,
    required: [true, 'Sender city is required'],
    trim: true
  },
  senderDistrict: {
    type: String,
    required: [true, 'Sender district is required'],
    trim: true
  },
  senderArea: {
    type: String,
    required: [true, 'Sender area is required'],
    trim: true
  },
  senderAddressLine1: {
    type: String,
    required: [true, 'Sender address Line 1 is required'],
    trim: true,
    maxlength: [200, 'Sender address Line 1 cannot be longer than 200 characters']
  },
  senderAddressLine2: {
    type: String,
    trim: true,
    maxlength: [200, 'Sender address Line 2 cannot be longer than 200 characters']
  },
  senderLandmark: {
    type: String,
    trim: true,
    maxlength: [100, 'Sender landmark cannot be longer than 100 characters']
  },
  
  // Receiver (Right form) data
  receiverName: { 
    type: String, 
    trim: true,
    maxlength: [100, 'Receiver name cannot be longer than 100 characters']
  },
  receiverEmail: { 
    type: String, 
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid receiver email']
  },
  receiverPhone: {
    type: String,
    trim: true,
    match: [/^[\d\s\-\+\(\)]{10,15}$/, 'Please enter a valid receiver phone number']
  },
  receiverPincode: { 
    type: String, 
    match: [/^\d{6}$/, 'Receiver pincode must be exactly 6 digits']
  },
  receiverState: {
    type: String,
    trim: true
  },
  receiverCity: {
    type: String,
    trim: true
  },
  receiverDistrict: {
    type: String,
    trim: true
  },
  receiverArea: {
    type: String,
    trim: true
  },
  receiverAddressLine1: {
    type: String,
    trim: true,
    maxlength: [200, 'Receiver address Line 1 cannot be longer than 200 characters']
  },
  receiverAddressLine2: {
    type: String,
    trim: true,
    maxlength: [200, 'Receiver address Line 2 cannot be longer than 200 characters']
  },
  receiverLandmark: {
    type: String,
    trim: true,
    maxlength: [100, 'Receiver landmark cannot be longer than 100 characters']
  },
  
  // Status fields to track form completion
  senderCompleted: {
    type: Boolean,
    default: false
  },
  receiverCompleted: {
    type: Boolean,
    default: false
  },
  formCompleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  collection: 'addressforms'
});

// Create indexes for better query performance
formSchema.index({ senderEmail: 1 });
formSchema.index({ receiverEmail: 1 });
formSchema.index({ senderPhone: 1 });
formSchema.index({ receiverPhone: 1 });
formSchema.index({ senderPincode: 1 });
formSchema.index({ receiverPincode: 1 });
formSchema.index({ createdAt: -1 });
formSchema.index({ formCompleted: 1 });

// Virtual for sender full address
formSchema.virtual('senderFullAddress').get(function() {
  const addressParts = [
    this.senderAddressLine1,
    this.senderAddressLine2,
    this.senderArea,
    this.senderCity,
    this.senderDistrict,
    this.senderState,
    this.senderPincode
  ].filter(Boolean);
  
  return addressParts.join(', ');
});

// Virtual for receiver full address
formSchema.virtual('receiverFullAddress').get(function() {
  if (!this.receiverAddressLine1) return '';
  
  const addressParts = [
    this.receiverAddressLine1,
    this.receiverAddressLine2,
    this.receiverArea,
    this.receiverCity,
    this.receiverDistrict,
    this.receiverState,
    this.receiverPincode
  ].filter(Boolean);
  
  return addressParts.join(', ');
});

// Ensure virtual fields are serialized
formSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

// Pre-save middleware to validate and format data
formSchema.pre('save', function(next) {
  // Clean and validate sender phone number
  if (this.senderPhone) {
    const cleanPhone = this.senderPhone.replace(/\D/g, '');
    if (cleanPhone.length === 10) {
      this.senderPhone = cleanPhone;
    } else if (cleanPhone.length === 12 && cleanPhone.startsWith('91')) {
      this.senderPhone = cleanPhone.slice(2);
    } else if (cleanPhone.length !== 10) {
      next(new Error('Sender phone number must be exactly 10 digits'));
      return;
    }
  }
  
  // Clean and validate receiver phone number
  if (this.receiverPhone) {
    const cleanPhone = this.receiverPhone.replace(/\D/g, '');
    if (cleanPhone.length === 10) {
      this.receiverPhone = cleanPhone;
    } else if (cleanPhone.length === 12 && cleanPhone.startsWith('91')) {
      this.receiverPhone = cleanPhone.slice(2);
    } else if (cleanPhone.length !== 10) {
      next(new Error('Receiver phone number must be exactly 10 digits'));
      return;
    }
  }
  
  // Capitalize sender text fields
  const senderTextFields = ['senderName', 'senderCity', 'senderDistrict', 'senderState', 'senderArea', 'senderAddressLine1', 'senderAddressLine2', 'senderLandmark'];
  senderTextFields.forEach(field => {
    if (this[field] && typeof this[field] === 'string') {
      if (field === 'senderName') {
        this[field] = this[field].split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
      } else {
        this[field] = this[field].charAt(0).toUpperCase() + this[field].slice(1).toLowerCase();
      }
    }
  });
  
  // Capitalize receiver text fields
  const receiverTextFields = ['receiverName', 'receiverCity', 'receiverDistrict', 'receiverState', 'receiverArea', 'receiverAddressLine1', 'receiverAddressLine2', 'receiverLandmark'];
  receiverTextFields.forEach(field => {
    if (this[field] && typeof this[field] === 'string') {
      if (field === 'receiverName') {
        this[field] = this[field].split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
      } else {
        this[field] = this[field].charAt(0).toUpperCase() + this[field].slice(1).toLowerCase();
      }
    }
  });
  
  // Update completion status
  this.senderCompleted = !!(this.senderName && this.senderEmail && this.senderPhone && 
    this.senderPincode && this.senderState && this.senderCity && 
    this.senderDistrict && this.senderArea && this.senderAddressLine1);
  
  this.receiverCompleted = !!(this.receiverName && this.receiverEmail && this.receiverPhone && 
    this.receiverPincode && this.receiverState && this.receiverCity && 
    this.receiverDistrict && this.receiverArea && this.receiverAddressLine1);
  
  this.formCompleted = this.senderCompleted && this.receiverCompleted;
  
  next();
});

// Static method to find incomplete forms
formSchema.statics.findIncomplete = function() {
  return this.find({ formCompleted: false }).sort({ createdAt: -1 });
};

// Static method to find by email (either sender or receiver)
formSchema.statics.findByEmail = function(email) {
  return this.find({
    $or: [
      { senderEmail: email.toLowerCase() },
      { receiverEmail: email.toLowerCase() }
    ]
  }).sort({ createdAt: -1 });
};

// Instance method to check completion percentage
formSchema.methods.getCompletionPercentage = function() {
  const senderFields = ['senderName', 'senderEmail', 'senderPhone', 'senderPincode', 'senderState', 'senderCity', 'senderDistrict', 'senderArea', 'senderAddressLine1'];
  const receiverFields = ['receiverName', 'receiverEmail', 'receiverPhone', 'receiverPincode', 'receiverState', 'receiverCity', 'receiverDistrict', 'receiverArea', 'receiverAddressLine1'];
  
  const senderComplete = senderFields.filter(field => this[field] && this[field].toString().trim().length > 0).length;
  const receiverComplete = receiverFields.filter(field => this[field] && this[field].toString().trim().length > 0).length;
  
  const totalFields = senderFields.length + receiverFields.length;
  const completedFields = senderComplete + receiverComplete;
  
  return Math.round((completedFields / totalFields) * 100);
};

export default mongoose.model("FormData", formSchema);