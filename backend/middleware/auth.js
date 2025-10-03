import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import OfficeUser from '../models/OfficeUser.js';

// Generate JWT token
export const generateToken = (userId, type = 'admin') => {
  return jwt.sign(
    { userId, type },
    process.env.JWT_SECRET || 'ocl-admin-secret-key-2024',
    { expiresIn: '24h' }
  );
};

// Middleware to verify JWT token for admin routes
export const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        error: 'Access denied. No token provided.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ocl-admin-secret-key-2024');
    
    // Check if token is for admin
    if (decoded.type !== 'admin') {
      return res.status(401).json({ 
        error: 'Invalid token type for admin access.' 
      });
    }
    
    const admin = await Admin.findById(decoded.userId).select('-password');
    
    if (!admin) {
      return res.status(401).json({ 
        error: 'Invalid token. Admin not found.' 
      });
    }

    if (!admin.isActive) {
      return res.status(401).json({ 
        error: 'Admin account is deactivated.' 
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expired. Please login again.' 
      });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Invalid token.' 
      });
    } else {
      console.error('Auth middleware error:', error);
      return res.status(500).json({ 
        error: 'Authentication error.' 
      });
    }
  }
};

// Middleware to verify JWT token for office user routes
export const authenticateOfficeUser = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        error: 'Access denied. No token provided.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ocl-admin-secret-key-2024');
    
    // Check if token is for office user
    if (decoded.type !== 'office') {
      return res.status(401).json({ 
        error: 'Invalid token type for office access.' 
      });
    }
    
    const user = await OfficeUser.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid token. User not found.' 
      });
    }

    if (!user.isActive) {
      return res.status(401).json({ 
        error: 'User account is deactivated.' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expired. Please login again.' 
      });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Invalid token.' 
      });
    } else {
      console.error('Auth middleware error:', error);
      return res.status(500).json({ 
        error: 'Authentication error.' 
      });
    }
  }
};

// Middleware to check if admin has super_admin role
export const requireSuperAdmin = (req, res, next) => {
  if (req.admin.role !== 'super_admin') {
    return res.status(403).json({ 
      error: 'Access denied. Super admin role required.' 
    });
  }
  next();
};

// Middleware to validate admin login input
export const validateLoginInput = (req, res, next) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ 
      error: 'Email and password are required.' 
    });
  }
  
  if (!email.includes('@') || email.length < 5) {
    return res.status(400).json({ 
      error: 'Please enter a valid email address.' 
    });
  }
  
  if (password.length < 6) {
    return res.status(400).json({ 
      error: 'Password must be at least 6 characters long.' 
    });
  }
  
  next();
};
