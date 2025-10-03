import express from 'express';
import { uploadPackageImages, uploadInvoiceImages, uploadScreenshots, handleUploadError } from '../middleware/upload.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Upload package images
router.post('/package-images', uploadPackageImages, handleUploadError, (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        error: 'No files uploaded',
        message: 'Please select at least one package image'
      });
    }

    const uploadedFiles = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      path: file.path,
      size: file.size,
      mimetype: file.mimetype,
      url: `/api/upload/serve/${file.filename}`
    }));

    res.json({
      success: true,
      message: `${req.files.length} package image(s) uploaded successfully`,
      files: uploadedFiles
    });
  } catch (error) {
    console.error('Error uploading package images:', error);
    res.status(500).json({
      error: 'Upload failed',
      message: 'Failed to upload package images'
    });
  }
});

// Upload invoice images
router.post('/invoice-images', uploadInvoiceImages, handleUploadError, (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        error: 'No files uploaded',
        message: 'Please select at least one invoice image'
      });
    }

    const uploadedFiles = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      path: file.path,
      size: file.size,
      mimetype: file.mimetype,
      url: `/api/upload/serve/${file.filename}`
    }));

    res.json({
      success: true,
      message: `${req.files.length} invoice image(s) uploaded successfully`,
      files: uploadedFiles
    });
  } catch (error) {
    console.error('Error uploading invoice images:', error);
    res.status(500).json({
      error: 'Upload failed',
      message: 'Failed to upload invoice images'
    });
  }
});

// Upload both package and invoice images
router.post('/screenshots', uploadScreenshots, handleUploadError, (req, res) => {
  try {
    const result = {
      packageImages: [],
      invoiceImages: []
    };

    if (req.files.packageImages) {
      result.packageImages = req.files.packageImages.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        path: file.path,
        size: file.size,
        mimetype: file.mimetype,
        url: `/api/upload/serve/${file.filename}`
      }));
    }

    if (req.files.invoiceImages) {
      result.invoiceImages = req.files.invoiceImages.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        path: file.path,
        size: file.size,
        mimetype: file.mimetype,
        url: `/api/upload/serve/${file.filename}`
      }));
    }

    const totalFiles = result.packageImages.length + result.invoiceImages.length;

    if (totalFiles === 0) {
      return res.status(400).json({
        error: 'No files uploaded',
        message: 'Please select at least one image'
      });
    }

    res.json({
      success: true,
      message: `${totalFiles} image(s) uploaded successfully`,
      data: result
    });
  } catch (error) {
    console.error('Error uploading screenshots:', error);
    res.status(500).json({
      error: 'Upload failed',
      message: 'Failed to upload screenshots'
    });
  }
});

// Serve uploaded images
router.get('/serve/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    
    // Determine which folder to look in based on filename
    let filePath;
    if (filename.startsWith('packageImages-')) {
      filePath = path.join(__dirname, '../uploads/screenshots/package-images', filename);
    } else if (filename.startsWith('invoiceImages-')) {
      filePath = path.join(__dirname, '../uploads/screenshots/invoice-images', filename);
    } else {
      // Try both folders
      const packagePath = path.join(__dirname, '../uploads/screenshots/package-images', filename);
      const invoicePath = path.join(__dirname, '../uploads/screenshots/invoice-images', filename);
      
      if (fs.existsSync(packagePath)) {
        filePath = packagePath;
      } else if (fs.existsSync(invoicePath)) {
        filePath = invoicePath;
      } else {
        return res.status(404).json({
          error: 'File not found',
          message: 'The requested image file was not found'
        });
      }
    }

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        error: 'File not found',
        message: 'The requested image file was not found'
      });
    }

    // Set appropriate headers
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    
    // Send the file
    res.sendFile(filePath);
  } catch (error) {
    console.error('Error serving image:', error);
    res.status(500).json({
      error: 'Server error',
      message: 'Failed to serve image'
    });
  }
});

// Delete uploaded image
router.delete('/delete/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    
    // Try to find and delete the file from both folders
    const packagePath = path.join(__dirname, '../uploads/screenshots/package-images', filename);
    const invoicePath = path.join(__dirname, '../uploads/screenshots/invoice-images', filename);
    
    let deleted = false;
    
    if (fs.existsSync(packagePath)) {
      fs.unlinkSync(packagePath);
      deleted = true;
    } else if (fs.existsSync(invoicePath)) {
      fs.unlinkSync(invoicePath);
      deleted = true;
    }
    
    if (deleted) {
      res.json({
        success: true,
        message: 'Image deleted successfully'
      });
    } else {
      res.status(404).json({
        error: 'File not found',
        message: 'The requested image file was not found'
      });
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({
      error: 'Delete failed',
      message: 'Failed to delete image'
    });
  }
});

// Get upload statistics
router.get('/stats', (req, res) => {
  try {
    const packageImagesPath = path.join(__dirname, '../uploads/screenshots/package-images');
    const invoiceImagesPath = path.join(__dirname, '../uploads/screenshots/invoice-images');
    
    let packageImageCount = 0;
    let invoiceImageCount = 0;
    let totalSize = 0;
    
    // Count package images
    if (fs.existsSync(packageImagesPath)) {
      const packageFiles = fs.readdirSync(packageImagesPath);
      packageImageCount = packageFiles.length;
      
      packageFiles.forEach(file => {
        const filePath = path.join(packageImagesPath, file);
        const stats = fs.statSync(filePath);
        totalSize += stats.size;
      });
    }
    
    // Count invoice images
    if (fs.existsSync(invoiceImagesPath)) {
      const invoiceFiles = fs.readdirSync(invoiceImagesPath);
      invoiceImageCount = invoiceFiles.length;
      
      invoiceFiles.forEach(file => {
        const filePath = path.join(invoiceImagesPath, file);
        const stats = fs.statSync(filePath);
        totalSize += stats.size;
      });
    }
    
    res.json({
      success: true,
      stats: {
        packageImages: packageImageCount,
        invoiceImages: invoiceImageCount,
        totalImages: packageImageCount + invoiceImageCount,
        totalSize: totalSize,
        totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2)
      }
    });
  } catch (error) {
    console.error('Error getting upload stats:', error);
    res.status(500).json({
      error: 'Server error',
      message: 'Failed to get upload statistics'
    });
  }
});

export default router;
