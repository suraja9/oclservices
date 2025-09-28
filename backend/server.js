import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import pincodeRoutes from "./routes/pincode.js";
import FormData from "./models/FormData.js";
import PinCodeArea from "./models/PinCodeArea.js";

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Add request logging for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api/pincode", pincodeRoutes);

// Save or update form data (handles both sender and receiver)
app.post("/api/form", async (req, res) => {
  try {
    console.log('Received form data:', req.body);
    
    const { formType, ...formData } = req.body;
    
    if (!formType || !['sender', 'receiver'].includes(formType)) {
      return res.status(400).json({ 
        error: 'formType must be either "sender" or "receiver"' 
      });
    }
    
    // Validate required fields based on form type
    let requiredFields;
    if (formType === 'sender') {
      requiredFields = ['name', 'email', 'phone', 'pincode', 'state', 'city', 'district', 'area', 'addressLine1'];
    } else {
      requiredFields = ['name', 'email', 'phone', 'pincode', 'state', 'city', 'district', 'area', 'addressLine1'];
    }
    
    const missingFields = requiredFields.filter(field => !formData[field] || formData[field].toString().trim() === '');
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      });
    }

    let existingForm = null;
    
    if (formType === 'sender') {
      // For sender, check if form already exists with this sender email
      existingForm = await FormData.findOne({
        senderEmail: formData.email.toLowerCase()
      });
    } else if (formType === 'receiver') {
      // For receiver, we need the sender email to find the existing form
      // This should be passed from the frontend as senderEmail
      if (!req.body.senderEmail) {
        return res.status(400).json({ 
          error: 'Sender email is required for receiver form submission' 
        });
      }
      
      existingForm = await FormData.findOne({
        senderEmail: req.body.senderEmail.toLowerCase()
      });
      
      if (!existingForm) {
        return res.status(400).json({ 
          error: 'No sender form found. Please submit sender form first.' 
        });
      }
    }
    
    // Prepare the update data with proper field prefixes
    const updateData = {};
    if (formType === 'sender') {
      updateData.senderName = formData.name;
      updateData.senderEmail = formData.email.toLowerCase();
      updateData.senderPhone = formData.phone;
      updateData.senderPincode = formData.pincode;
      updateData.senderState = formData.state;
      updateData.senderCity = formData.city;
      updateData.senderDistrict = formData.district;
      updateData.senderArea = formData.area;
      updateData.senderAddressLine1 = formData.addressLine1;
      updateData.senderAddressLine2 = formData.addressLine2 || '';
      updateData.senderLandmark = formData.landmark || '';
    } else {
      updateData.receiverName = formData.name;
      updateData.receiverEmail = formData.email.toLowerCase();
      updateData.receiverPhone = formData.phone;
      updateData.receiverPincode = formData.pincode;
      updateData.receiverState = formData.state;
      updateData.receiverCity = formData.city;
      updateData.receiverDistrict = formData.district;
      updateData.receiverArea = formData.area;
      updateData.receiverAddressLine1 = formData.addressLine1;
      updateData.receiverAddressLine2 = formData.addressLine2 || '';
      updateData.receiverLandmark = formData.landmark || '';
    }

    let savedForm;
    
    if (existingForm) {
      // Update existing form
      Object.assign(existingForm, updateData);
      savedForm = await existingForm.save();
      console.log('Form data updated successfully:', savedForm._id);
    } else {
      // Create new form
      savedForm = new FormData(updateData);
      await savedForm.save();
      console.log('Form data created successfully:', savedForm._id);
    }
    
    res.json({ 
      success: true, 
      data: savedForm,
      message: `${formType.charAt(0).toUpperCase() + formType.slice(1)} data submitted successfully!`,
      completionPercentage: savedForm.getCompletionPercentage(),
      formCompleted: savedForm.formCompleted
    });
    
  } catch (err) {
    console.error('Error saving form data:', err);
    
    if (err.name === 'ValidationError') {
      const validationErrors = Object.values(err.errors).map(e => e.message);
      res.status(400).json({ 
        error: 'Validation failed',
        details: validationErrors
      });
    } else if (err.code === 11000) {
      res.status(409).json({ 
        error: 'Duplicate entry detected',
        details: 'A form with this information already exists'
      });
    } else {
      res.status(500).json({ 
        error: err.message || 'Internal server error'
      });
    }
  }
});

// Get form data by sender email to check completion status
app.get("/api/form/check/:email", async (req, res) => {
  try {
    const form = await FormData.findOne({ 
      senderEmail: req.params.email.toLowerCase() 
    });
    
    if (!form) {
      return res.json({ 
        success: true, 
        exists: false,
        data: null
      });
    }
    
    res.json({ 
      success: true, 
      exists: true,
      data: form,
      completionPercentage: form.getCompletionPercentage(),
      senderCompleted: form.senderCompleted,
      receiverCompleted: form.receiverCompleted,
      formCompleted: form.formCompleted
    });
    
  } catch (err) {
    console.error('Error checking form status:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get all form data with filtering and pagination
app.get("/api/form", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const filters = {};
    
    // Add filters based on query parameters
    if (req.query.completed === 'true') {
      filters.formCompleted = true;
    } else if (req.query.completed === 'false') {
      filters.formCompleted = false;
    }
    
    if (req.query.senderState) {
      filters.senderState = new RegExp(req.query.senderState, 'i');
    }
    
    if (req.query.senderCity) {
      filters.senderCity = new RegExp(req.query.senderCity, 'i');
    }
    
    if (req.query.senderPincode) {
      filters.senderPincode = req.query.senderPincode;
    }
    
    if (req.query.senderEmail) {
      filters.senderEmail = new RegExp(req.query.senderEmail, 'i');
    }

    const forms = await FormData.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalCount = await FormData.countDocuments(filters);
    
    res.json({ 
      success: true, 
      data: forms, 
      count: forms.length,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      hasNext: page * limit < totalCount,
      hasPrev: page > 1
    });
    
  } catch (err) {
    console.error('Error fetching form data:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get specific form by ID
app.get("/api/form/:id", async (req, res) => {
  try {
    const form = await FormData.findById(req.params.id);
    
    if (!form) {
      return res.status(404).json({ 
        error: 'Form not found' 
      });
    }
    
    res.json({ 
      success: true, 
      data: form,
      completionPercentage: form.getCompletionPercentage()
    });
    
  } catch (err) {
    console.error('Error fetching form by ID:', err);
    if (err.name === 'CastError') {
      res.status(400).json({ error: 'Invalid form ID format' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

// Update form by ID
app.put("/api/form/:id", async (req, res) => {
  try {
    const updatedForm = await FormData.findByIdAndUpdate(
      req.params.id,
      req.body,
      { 
        new: true, 
        runValidators: true 
      }
    );
    
    if (!updatedForm) {
      return res.status(404).json({ 
        error: 'Form not found' 
      });
    }
    
    console.log('Form updated successfully:', updatedForm._id);
    res.json({ 
      success: true, 
      data: updatedForm,
      message: 'Form updated successfully!',
      completionPercentage: updatedForm.getCompletionPercentage()
    });
    
  } catch (err) {
    console.error('Error updating form:', err);
    if (err.name === 'ValidationError') {
      const validationErrors = Object.values(err.errors).map(e => e.message);
      res.status(400).json({ 
        error: 'Validation failed',
        details: validationErrors
      });
    } else if (err.name === 'CastError') {
      res.status(400).json({ error: 'Invalid form ID format' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

// Delete form by ID
app.delete("/api/form/:id", async (req, res) => {
  try {
    const deletedForm = await FormData.findByIdAndDelete(req.params.id);
    
    if (!deletedForm) {
      return res.status(404).json({ 
        error: 'Form not found' 
      });
    }
    
    console.log('Form deleted successfully:', deletedForm._id);
    res.json({ 
      success: true, 
      message: 'Form deleted successfully!',
      deletedData: deletedForm
    });
    
  } catch (err) {
    console.error('Error deleting form:', err);
    if (err.name === 'CastError') {
      res.status(400).json({ error: 'Invalid form ID format' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

// Get forms by email (either sender or receiver)
app.get("/api/form/email/:email", async (req, res) => {
  try {
    const forms = await FormData.findByEmail(req.params.email);
    
    res.json({ 
      success: true, 
      data: forms, 
      count: forms.length 
    });
    
  } catch (err) {
    console.error('Error fetching forms by email:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get forms by phone
app.get("/api/form/phone/:phone", async (req, res) => {
  try {
    const cleanPhone = req.params.phone.replace(/\D/g, '');
    const forms = await FormData.find({
      $or: [
        { senderPhone: cleanPhone },
        { receiverPhone: cleanPhone }
      ]
    }).sort({ createdAt: -1 });
    
    res.json({ 
      success: true, 
      data: forms, 
      count: forms.length 
    });
    
  } catch (err) {
    console.error('Error fetching forms by phone:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get form statistics
app.get("/api/stats/forms", async (req, res) => {
  try {
    const totalForms = await FormData.countDocuments();
    const completedForms = await FormData.countDocuments({ formCompleted: true });
    const incompleteForms = await FormData.countDocuments({ formCompleted: false });
    const senderOnlyForms = await FormData.countDocuments({ 
      senderCompleted: true, 
      receiverCompleted: false 
    });
    const receiverOnlyForms = await FormData.countDocuments({ 
      senderCompleted: false, 
      receiverCompleted: true 
    });
    
    // Get forms by sender state
    const formsByState = await FormData.aggregate([
      { $match: { senderState: { $exists: true, $ne: '' } } },
      { $group: { _id: '$senderState', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    // Get recent forms
    const recentForms = await FormData.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('senderName senderEmail receiverName receiverEmail createdAt senderState senderCity formCompleted')
      .lean();
    
    res.json({ 
      success: true, 
      stats: {
        totalForms,
        completedForms,
        incompleteForms,
        senderOnlyForms,
        receiverOnlyForms,
        formsByState,
        recentForms
      }
    });
    
  } catch (err) {
    console.error('Error fetching form statistics:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get pincode statistics
app.get("/api/stats/pincode", async (req, res) => {
  try {
    const totalPincodes = await PinCodeArea.countDocuments();
    const uniquePincodes = await PinCodeArea.distinct('pincode');
    const uniqueStates = await PinCodeArea.distinct('statename');
    const uniqueCities = await PinCodeArea.distinct('cityname');
    
    // Get top states by area count
    const stateStats = await PinCodeArea.aggregate([
      { $group: { _id: '$statename', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    // Get top cities by area count
    const cityStats = await PinCodeArea.aggregate([
      { $group: { _id: { state: '$statename', city: '$cityname' }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $project: { _id: 0, state: '$_id.state', city: '$_id.city', count: 1 } }
    ]);
    
    res.json({ 
      success: true, 
      stats: {
        totalAreas: totalPincodes,
        uniquePincodes: uniquePincodes.length,
        uniqueStates: uniqueStates.length,
        uniqueCities: uniqueCities.length,
        topStates: stateStats,
        topCities: cityStats
      }
    });
    
  } catch (err) {
    console.error('Error fetching pincode statistics:', err);
    res.status(500).json({ error: err.message });
  }
});

// Search endpoint for forms
app.get("/api/search", async (req, res) => {
  try {
    const { q, type = 'all' } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.status(400).json({ 
        error: 'Search query must be at least 2 characters long' 
      });
    }
    
    const searchRegex = new RegExp(q, 'i');
    let searchQuery = {};
    
    if (type === 'all') {
      searchQuery = {
        $or: [
          { senderName: searchRegex },
          { senderEmail: searchRegex },
          { senderPhone: searchRegex },
          { senderState: searchRegex },
          { senderCity: searchRegex },
          { senderDistrict: searchRegex },
          { senderArea: searchRegex },
          { senderPincode: searchRegex },
          { receiverName: searchRegex },
          { receiverEmail: searchRegex },
          { receiverPhone: searchRegex },
          { receiverState: searchRegex },
          { receiverCity: searchRegex },
          { receiverDistrict: searchRegex },
          { receiverArea: searchRegex },
          { receiverPincode: searchRegex }
        ]
      };
    } else if (type === 'sender') {
      searchQuery = {
        $or: [
          { senderName: searchRegex },
          { senderEmail: searchRegex },
          { senderPhone: searchRegex },
          { senderState: searchRegex },
          { senderCity: searchRegex },
          { senderDistrict: searchRegex },
          { senderArea: searchRegex },
          { senderPincode: searchRegex }
        ]
      };
    } else if (type === 'receiver') {
      searchQuery = {
        $or: [
          { receiverName: searchRegex },
          { receiverEmail: searchRegex },
          { receiverPhone: searchRegex },
          { receiverState: searchRegex },
          { receiverCity: searchRegex },
          { receiverDistrict: searchRegex },
          { receiverArea: searchRegex },
          { receiverPincode: searchRegex }
        ]
      };
    }
    
    const results = await FormData.find(searchQuery)
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();
    
    res.json({ 
      success: true, 
      data: results, 
      count: results.length,
      searchQuery: q,
      searchType: type
    });
    
  } catch (err) {
    console.error('Error in search:', err);
    res.status(500).json({ error: err.message });
  }
});

// Health check endpoint
app.get("/api/health", async (req, res) => {
  try {
    // Check MongoDB connection
    const dbState = mongoose.connection.readyState;
    const dbStatus = dbState === 1 ? 'Connected' : dbState === 2 ? 'Connecting' : 'Disconnected';
    
    // Get collection counts
    const formCount = await FormData.countDocuments();
    const completedFormCount = await FormData.countDocuments({ formCompleted: true });
    const pincodeCount = await PinCodeArea.countDocuments();
    
    res.json({ 
      status: "Server is running",
      database: dbStatus,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      collections: {
        forms: formCount,
        completedForms: completedFormCount,
        pincodeAreas: pincodeCount
      },
      version: "3.0.0"
    });
  } catch (err) {
    res.status(500).json({
      status: "Server running but database error",
      error: err.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Export data endpoint
app.get("/api/export", async (req, res) => {
  try {
    const { format = 'json', type = 'all' } = req.query;
    
    let query = {};
    if (type === 'completed') {
      query.formCompleted = true;
    } else if (type === 'incomplete') {
      query.formCompleted = false;
    }
    
    const forms = await FormData.find(query)
      .sort({ createdAt: -1 })
      .lean();
    
    if (format === 'csv') {
      if (forms.length === 0) {
        return res.status(404).json({ error: 'No data to export' });
      }
      
      const headers = Object.keys(forms[0]).filter(key => key !== '__v').join(',');
      const csvData = forms.map(form => 
        Object.keys(form)
          .filter(key => key !== '__v')
          .map(key => `"${form[key] || ''}"`)
          .join(',')
      ).join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=forms_export_${Date.now()}.csv`);
      res.send(`${headers}\n${csvData}`);
    } else {
      res.json({ 
        success: true, 
        data: forms, 
        count: forms.length,
        exportedAt: new Date().toISOString(),
        type: type
      });
    }
    
  } catch (err) {
    console.error('Error exporting data:', err);
    res.status(500).json({ error: err.message });
  }
});

// Start server function
const startServer = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
    
    // Verify pincode collection exists and has data
    const pincodeCount = await PinCodeArea.countDocuments();
    if (pincodeCount === 0) {
      console.log("⚠️  Warning: Pin_Code_Area collection appears to be empty");
    } else {
      console.log(`📊 Pin_Code_Area collection has ${pincodeCount} records`);
    }
    
    // Check form collection
    const formCount = await FormData.countDocuments();
    const completedFormCount = await FormData.countDocuments({ formCompleted: true });
    console.log(`📋 FormData collection has ${formCount} records (${completedFormCount} completed)`);
    
    // Start the server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🔍 Server ready for MongoDB operations`);
      console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
      console.log(`📈 Form stats: http://localhost:${PORT}/api/stats/forms`);
      console.log(`📊 Pincode stats: http://localhost:${PORT}/api/stats/pincode`);
      console.log(`🔎 Search API: http://localhost:${PORT}/api/search?q=<query>`);
    });
    
  } catch (err) {
    console.error("❌ Server startup error:", err);
    process.exit(1);
  }
};

// Graceful shutdown handlers
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

function gracefulShutdown(signal) {
  console.log(`\n${signal} received, shutting down gracefully...`);
  
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  gracefulShutdown('UNHANDLED_REJECTION');
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

// Start the server
startServer();