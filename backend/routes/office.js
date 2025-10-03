import express from 'express';
import OfficeUser from '../models/OfficeUser.js';
import FormData from '../models/FormData.js';
import PinCodeArea from '../models/PinCodeArea.js';
import { generateToken, authenticateOfficeUser, validateLoginInput } from '../middleware/auth.js';

const router = express.Router();

// Office user login route
router.post('/login', validateLoginInput, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log(`Office user login attempt: ${email}`);
    
    // Find user by email
    const user = await OfficeUser.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid email or password.' 
      });
    }
    
    if (!user.isActive) {
      return res.status(401).json({ 
        error: 'Account is deactivated. Please contact administrator.' 
      });
    }
    
    // Check password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ 
        error: 'Invalid email or password.' 
      });
    }
    
    // Update login info
    await user.updateLoginInfo();
    
    // Generate JWT token
    const token = generateToken(user._id, 'office');
    
    console.log(`✅ Office user login successful: ${user.name} (${user.email})`);
    
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
        department: user.department,
        lastLogin: user.lastLogin
      }
    });
    
  } catch (error) {
    console.error('Office user login error:', error);
    res.status(500).json({ 
      error: 'Login failed. Please try again.' 
    });
  }
});

// Office user signup route
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name, department, phone } = req.body;
    
    // Validate required fields
    if (!email || !password || !name) {
      return res.status(400).json({
        error: 'Email, password, and name are required.'
      });
    }
    
    // Check if user already exists
    const existingUser = await OfficeUser.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        error: 'User with this email already exists.'
      });
    }
    
    // Create new user
    const newUser = new OfficeUser({
      email: email.toLowerCase(),
      password,
      name,
      department,
      phone,
      role: 'office_user',
      isActive: true,
      permissions: {
        dashboard: true,
        booking: true,
        reports: true,
        settings: true,
        pincodeManagement: false,
        addressForms: false
      }
    });
    
    await newUser.save();
    
    console.log(`✅ New office user created: ${newUser.name} (${newUser.email})`);
    
    res.status(201).json({
      success: true,
      message: 'User created successfully. Please login.',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department
      }
    });
    
  } catch (error) {
    console.error('Office user signup error:', error);
    res.status(500).json({ 
      error: 'Signup failed. Please try again.' 
    });
  }
});

// Get current user profile
router.get('/profile', authenticateOfficeUser, async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      error: 'Failed to get profile.' 
    });
  }
});

// Get all office users (for admin)
router.get('/users', authenticateOfficeUser, async (req, res) => {
  try {
    // Only allow office managers to view all users
    if (req.user.role !== 'office_manager') {
      return res.status(403).json({
        error: 'Access denied. Manager role required.'
      });
    }
    
    const users = await OfficeUser.find({})
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ 
      error: 'Failed to get users.' 
    });
  }
});

// Update user permissions (for admin)
router.put('/users/:id/permissions', authenticateOfficeUser, async (req, res) => {
  try {
    // Only allow office managers to update permissions
    if (req.user.role !== 'office_manager') {
      return res.status(403).json({
        error: 'Access denied. Manager role required.'
      });
    }
    
    const { permissions } = req.body;
    const userId = req.params.id;
    
    const user = await OfficeUser.findByIdAndUpdate(
      userId,
      { permissions },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found.'
      });
    }
    
    res.json({
      success: true,
      message: 'User permissions updated successfully.',
      user
    });
  } catch (error) {
    console.error('Update permissions error:', error);
    res.status(500).json({ 
      error: 'Failed to update permissions.' 
    });
  }
});

// Get address forms (with permission check)
router.get('/addressforms', authenticateOfficeUser, async (req, res) => {
  try {
    // Check if user has permission to access address forms
    if (!req.user.permissions.addressForms) {
      return res.status(403).json({
        error: 'Access denied. You do not have permission to view address forms.'
      });
    }
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    
    // Build search query
    let query = {};
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query = {
        $or: [
          { senderName: searchRegex },
          { senderEmail: searchRegex },
          { senderPhone: searchRegex },
          { senderPincode: searchRegex },
          { receiverName: searchRegex },
          { receiverEmail: searchRegex },
          { receiverPhone: searchRegex },
          { receiverPincode: searchRegex }
        ]
      };
    }
    
    // Add filters
    if (req.query.completed === 'true') {
      query.formCompleted = true;
    } else if (req.query.completed === 'false') {
      query.formCompleted = false;
    }
    
    if (req.query.state) {
      query.senderState = new RegExp(req.query.state, 'i');
    }
    
    const forms = await FormData.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    const totalCount = await FormData.countDocuments(query);
    
    res.json({
      success: true,
      data: forms,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNext: page * limit < totalCount,
        hasPrev: page > 1,
        limit
      },
      search: search
    });
    
  } catch (error) {
    console.error('Get address forms error:', error);
    res.status(500).json({ 
      error: 'Failed to get address forms.' 
    });
  }
});

// Get pincodes (with permission check)
router.get('/pincodes', authenticateOfficeUser, async (req, res) => {
  try {
    // Check if user has permission to access pincode management
    if (!req.user.permissions.pincodeManagement) {
      return res.status(403).json({
        error: 'Access denied. You do not have permission to view pincode management.'
      });
    }
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const state = req.query.state || '';
    const city = req.query.city || '';
    
    // Build search query
    let query = {};
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      const searchConditions = [
        { areaname: searchRegex },
        { cityname: searchRegex },
        { statename: searchRegex },
        { distrcitname: searchRegex } // Note: using the typo that exists in the model
      ];
      
      // If search term is numeric, also search by pincode
      if (!isNaN(search)) {
        searchConditions.push({ pincode: parseInt(search) });
      }
      
      query = { $or: searchConditions };
    }
    
    if (state) {
      query.statename = new RegExp(state, 'i');
    }
    
    if (city) {
      query.cityname = new RegExp(city, 'i');
    }
    
    const pincodes = await PinCodeArea.find(query)
      .sort({ pincode: 1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    const totalCount = await PinCodeArea.countDocuments(query);
    
    res.json({
      success: true,
      data: pincodes,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNext: page * limit < totalCount,
        hasPrev: page > 1,
        limit
      }
    });
    
  } catch (error) {
    console.error('Get pincodes error:', error);
    res.status(500).json({ 
      error: 'Failed to get pincodes.' 
    });
  }
});

// Add new pincode (with permission check)
router.post('/pincodes', authenticateOfficeUser, async (req, res) => {
  try {
    // Check if user has permission to access pincode management
    if (!req.user.permissions.pincodeManagement) {
      return res.status(403).json({
        error: 'Access denied. You do not have permission to manage pincodes.'
      });
    }
    
    const { pincode, areaname, cityname, districtname, distrcitname, statename } = req.body;
    
    // Validate required fields
    if (!pincode || !areaname || !cityname || !statename) {
      return res.status(400).json({
        error: 'Pincode, area name, city name, and state name are required.'
      });
    }
    
    // Check if pincode already exists
    const existingPincode = await PinCodeArea.findOne({ pincode });
    if (existingPincode) {
      return res.status(400).json({
        error: 'Pincode already exists.'
      });
    }
    
    const newPincode = new PinCodeArea({
      pincode: parseInt(pincode),
      areaname: areaname.trim(),
      cityname: cityname.trim(),
      distrcitname: (districtname || distrcitname || cityname)?.trim(), // Handle both field names
      statename: statename.trim()
    });
    
    await newPincode.save();
    
    res.status(201).json({
      success: true,
      message: 'Pincode added successfully.',
      data: newPincode
    });
    
  } catch (error) {
    console.error('Add pincode error:', error);
    res.status(500).json({ 
      error: 'Failed to add pincode.' 
    });
  }
});

// Update pincode (with permission check)
router.put('/pincodes/:id', authenticateOfficeUser, async (req, res) => {
  try {
    // Check if user has permission to access pincode management
    if (!req.user.permissions.pincodeManagement) {
      return res.status(403).json({
        error: 'Access denied. You do not have permission to manage pincodes.'
      });
    }
    
    const { pincode, areaname, cityname, districtname, distrcitname, statename } = req.body;
    const pincodeId = req.params.id;
    
    const updateData = {
      pincode: parseInt(pincode),
      areaname: areaname.trim(),
      cityname: cityname.trim(),
      distrcitname: (districtname || distrcitname || cityname)?.trim(), // Handle both field names
      statename: statename.trim()
    };
    
    const updatedPincode = await PinCodeArea.findByIdAndUpdate(
      pincodeId,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedPincode) {
      return res.status(404).json({
        error: 'Pincode not found.'
      });
    }
    
    res.json({
      success: true,
      message: 'Pincode updated successfully.',
      data: updatedPincode
    });
    
  } catch (error) {
    console.error('Update pincode error:', error);
    res.status(500).json({ 
      error: 'Failed to update pincode.' 
    });
  }
});

// Delete pincode (with permission check)
router.delete('/pincodes/:id', authenticateOfficeUser, async (req, res) => {
  try {
    // Check if user has permission to access pincode management
    if (!req.user.permissions.pincodeManagement) {
      return res.status(403).json({
        error: 'Access denied. You do not have permission to manage pincodes.'
      });
    }
    
    const pincodeId = req.params.id;
    
    const deletedPincode = await PinCodeArea.findByIdAndDelete(pincodeId);
    
    if (!deletedPincode) {
      return res.status(404).json({
        error: 'Pincode not found.'
      });
    }
    
    res.json({
      success: true,
      message: 'Pincode deleted successfully.'
    });
    
  } catch (error) {
    console.error('Delete pincode error:', error);
    res.status(500).json({ 
      error: 'Failed to delete pincode.' 
    });
  }
});

export default router;
