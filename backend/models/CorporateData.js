import mongoose from "mongoose";
import bcrypt from "bcrypt";

const corporateSchema = new mongoose.Schema({
  corporateId: {
    type: String,
    unique: true,
    required: true
  },
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [200, 'Company name cannot be longer than 200 characters']
  },
  companyAddress: {
    type: String,
    required: [true, 'Company address is required'],
    trim: true,
    maxlength: [500, 'Company address cannot be longer than 500 characters']
  },
  pin: {
    type: String,
    required: [true, 'Pin code is required'],
    match: [/^\d{6}$/, 'Pin code must be exactly 6 digits']
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true
  },
  locality: {
    type: String,
    required: [true, 'Locality/Area/District is required'],
    trim: true
  },
  flatNumber: {
    type: String,
    trim: true,
    maxlength: [100, 'Flat number/Building name cannot be longer than 100 characters']
  },
  landmark: {
    type: String,
    trim: true,
    maxlength: [100, 'Landmark cannot be longer than 100 characters']
  },
  gstNumber: {
    type: String,
    trim: true,
    maxlength: [15, 'GST number cannot be longer than 15 characters'],
    match: [/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$|^$/, 'Please enter a valid GST number']
  },
  birthday: {
    type: Date
  },
  anniversary: {
    type: Date
  },
  contactNumber: {
    type: String,
    required: [true, 'Contact number is required'],
    trim: true,
    match: [/^[\d\s\-\+\(\)]{10,15}$/, 'Please enter a valid contact number']
  },
  addressType: {
    type: String,
    enum: ['corporate', 'branch', 'firm', 'other'],
    default: 'corporate',
    required: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  registrationDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'corporateregistrations'
});

// Create indexes for better query performance
corporateSchema.index({ corporateId: 1 });
corporateSchema.index({ companyName: 1 });
corporateSchema.index({ gstNumber: 1 });
corporateSchema.index({ contactNumber: 1 });
corporateSchema.index({ pin: 1 });
corporateSchema.index({ city: 1 });
corporateSchema.index({ state: 1 });
corporateSchema.index({ registrationDate: -1 });

// Virtual for full address
corporateSchema.virtual('fullAddress').get(function() {
  const addressParts = [
    this.companyAddress,
    this.flatNumber,
    this.locality,
    this.city,
    this.state,
    this.pin
  ].filter(Boolean);
  
  return addressParts.join(', ');
});

// Ensure virtual fields are serialized
corporateSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret._id;
    delete ret.__v;
    delete ret.password; // Never return password in JSON
    return ret;
  }
});

// Pre-save middleware to hash password and format data
corporateSchema.pre('save', async function(next) {
  try {
    // Hash password if it's modified
    if (this.isModified('password')) {
      const saltRounds = 12;
      this.password = await bcrypt.hash(this.password, saltRounds);
    }
    
    // Clean and validate contact number
    if (this.contactNumber) {
      const cleanPhone = this.contactNumber.replace(/\D/g, '');
      if (cleanPhone.length === 10) {
        this.contactNumber = cleanPhone;
      } else if (cleanPhone.length === 12 && cleanPhone.startsWith('91')) {
        this.contactNumber = cleanPhone.slice(2);
      } else if (cleanPhone.length !== 10) {
        next(new Error('Contact number must be exactly 10 digits'));
        return;
      }
    }
    
    // Capitalize text fields
    const textFields = ['companyName', 'city', 'state', 'locality', 'flatNumber', 'landmark'];
    textFields.forEach(field => {
      if (this[field] && typeof this[field] === 'string') {
        if (field === 'companyName') {
          // Capitalize each word in company name
          this[field] = this[field].split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
        } else {
          // Capitalize first letter
          this[field] = this[field].charAt(0).toUpperCase() + this[field].slice(1).toLowerCase();
        }
      }
    });
    
    // Uppercase GST number
    if (this.gstNumber) {
      this.gstNumber = this.gstNumber.toUpperCase();
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

// Static method to generate unique corporate ID
corporateSchema.statics.generateCorporateId = async function(companyName) {
  try {
    // Get the first letter of company name
    const firstLetter = companyName.charAt(0).toUpperCase();
    
    // Find the highest existing number for this letter
    const existingIds = await this.find({
      corporateId: new RegExp(`^${firstLetter}\\d{5}$`)
    }).select('corporateId').lean();
    
    let maxNumber = 0;
    existingIds.forEach(doc => {
      const number = parseInt(doc.corporateId.slice(1));
      if (number > maxNumber) {
        maxNumber = number;
      }
    });
    
    // Generate next number
    const nextNumber = maxNumber + 1;
    const corporateId = `${firstLetter}${nextNumber.toString().padStart(5, '0')}`;
    
    return corporateId;
  } catch (error) {
    throw new Error('Error generating corporate ID: ' + error.message);
  }
};

// Static method to find by corporate ID
corporateSchema.statics.findByCorporateId = function(corporateId) {
  return this.findOne({ corporateId: corporateId });
};

// Static method to search companies
corporateSchema.statics.searchCompanies = function(searchQuery) {
  const searchRegex = new RegExp(searchQuery, 'i');
  return this.find({
    $or: [
      { companyName: searchRegex },
      { corporateId: searchRegex },
      { gstNumber: searchRegex },
      { contactNumber: searchRegex },
      { city: searchRegex },
      { state: searchRegex }
    ]
  }).sort({ registrationDate: -1 });
};

// Instance method to verify password
corporateSchema.methods.verifyPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// Instance method to get masked contact number
corporateSchema.methods.getMaskedContact = function() {
  if (this.contactNumber && this.contactNumber.length === 10) {
    return `${this.contactNumber.slice(0, 2)}****${this.contactNumber.slice(-4)}`;
  }
  return this.contactNumber;
};

export default mongoose.model("CorporateData", corporateSchema);