import mongoose from "mongoose";
import bcrypt from "bcrypt";

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be longer than 100 characters']
  },
  role: {
    type: String,
    enum: ['admin', 'super_admin'],
    default: 'admin'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  },
  loginCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  collection: 'admins'
});

// Create indexes
adminSchema.index({ email: 1 }, { unique: true });
adminSchema.index({ isActive: 1 });
adminSchema.index({ role: 1 });

// Pre-save middleware to hash password
adminSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with cost of 12
    const hashedPassword = await bcrypt.hash(this.password, 12);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password
adminSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Instance method to update login info
adminSchema.methods.updateLoginInfo = async function() {
  this.lastLogin = new Date();
  this.loginCount += 1;
  return this.save();
};

// Static method to find active admins
adminSchema.statics.findActive = function() {
  return this.find({ isActive: true }).select('-password');
};

// Static method to create default admin if none exists
adminSchema.statics.createDefaultAdmin = async function() {
  const adminCount = await this.countDocuments();
  
  if (adminCount === 0) {
    const defaultAdmin = new this({
      email: 'admin@ocl.com',
      password: 'admin123', // This will be hashed by pre-save middleware
      name: 'Default Admin',
      role: 'super_admin'
    });
    
    await defaultAdmin.save();
    console.log('✅ Default admin created: admin@ocl.com / admin123');
    return defaultAdmin;
  }
  
  return null;
};

// Remove password from JSON output
adminSchema.methods.toJSON = function() {
  const adminObject = this.toObject();
  delete adminObject.password;
  return adminObject;
};

export default mongoose.model("Admin", adminSchema);
