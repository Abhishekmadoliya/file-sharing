const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const File = require('../models/file');
const { cloudinary, upload } = require('../config/cloudinary');
const router = express.Router();

// Upload file endpoint using Cloudinary
router.post('/upload', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded',
        message: 'Please select a file to upload'
      });
    }

    // Validate file size
    if (req.file.size > 100 * 1024 * 1024) {
      return res.status(413).json({
        error: 'File too large',
        message: 'File size must be less than 100MB'
      });
    }

    // Create file record with Cloudinary data
    const file = new File({
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path, // Keep for backward compatibility
      size: req.file.size,
      cloudinaryUrl: req.file.path, // Cloudinary URL (req.file.path contains the Cloudinary URL)
      cloudinaryPublicId: req.file.filename, // Cloudinary public ID (req.file.filename contains the public ID)
      isUploaderOnline: true
    });

    await file.save();

    // Generate URLs
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    res.status(201).json({
      success: true,
      message: 'File uploaded successfully to Cloudinary',
      data: {
        _id: file._id,
        filename: file.filename,
        originalName: file.originalName,
        size: file.size,
        cloudinaryUrl: file.cloudinaryUrl,
        fileUrl: `${baseUrl}/api/file/${file._id}`,
        fileInfoUrl: `${baseUrl}/api/file-info/${file._id}`,
        previewUrl: file.cloudinaryUrl, // Use Cloudinary URL for preview
        uploadedAt: file.createdAt
      }
    });

  } catch (error) {
    console.error('❌ Upload error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    next(error);
  }
});

// Get file information endpoint
router.get('/file-info/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        error: 'Invalid file ID',
        message: 'Please provide a valid file ID'
      });
    }

    const file = await File.findById(id);
    
    if (!file) {
      return res.status(404).json({
        error: 'File not found',
        message: 'The requested file does not exist'
      });
    }

    const fileType = path.extname(file.originalName).toLowerCase().substring(1);
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    res.json({
      success: true,
      data: {
        _id: file._id,
        name: file.originalName,
        size: file.size,
        cloudinaryUrl: file.cloudinaryUrl,
        fileType: fileType,
        isUploaderOnline: file.isUploaderOnline,
        uploadedAt: file.createdAt,
        downloadUrl: `${baseUrl}/api/file/${file._id}`,
        previewUrl: file.cloudinaryUrl // Use Cloudinary URL for preview
      }
    });

  } catch (error) {
    next(error);
  }
});

// Download file endpoint (redirects to Cloudinary URL)
router.get('/file/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        error: 'Invalid file ID',
        message: 'Please provide a valid file ID'
      });
    }

    const file = await File.findById(id);
    
    if (!file) {
      return res.status(404).json({
        error: 'File not found',
        message: 'The requested file does not exist'
      });
    }

    // Check uploader status
    if (!file.isUploaderOnline) {
      return res.status(403).json({
        error: 'Download disabled',
        message: 'Uploader is offline. File download is currently disabled.'
      });
    }

    // Send Cloudinary URL in response
    if (file.cloudinaryUrl) {
      res.json({
        success: true,
        data: {
          cloudinaryUrl: file.cloudinaryUrl,
          fileName: file.originalName,
          fileType: path.extname(file.originalName).toLowerCase().substring(1),
          size: file.size
        }
      });
    } else {
      return res.status(404).json({
        error: 'File URL not found',
        message: 'File URL is not available'
      });
    }

  } catch (error) {
    next(error);
  }
});

// Mark uploader offline endpoint
router.post('/mark-offline/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        error: 'Invalid file ID',
        message: 'Please provide a valid file ID'
      });
    }

    const file = await File.findByIdAndUpdate(
      id,
      { isUploaderOnline: false },
      { new: true }
    );

    if (!file) {
      return res.status(404).json({
        error: 'File not found',
        message: 'The requested file does not exist'
      });
    }

    res.json({
      success: true,
      message: 'Uploader marked offline successfully',
      fileurl: file.cloudinaryUrl,
      data: {
        _id: file._id,
        isUploaderOnline: file.isUploaderOnline,
        updatedAt: file.updatedAt
      }
    });

  } catch (error) {
    next(error);
  }
});

// Mark uploader online endpoint
router.post('/mark-online/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        error: 'Invalid file ID',
        message: 'Please provide a valid file ID'
      });
    }

    const file = await File.findByIdAndUpdate(
      id,
      { isUploaderOnline: true },
      { new: true }
    );

    if (!file) {
      return res.status(404).json({
        error: 'File not found',
        message: 'The requested file does not exist'
      });
    }

    res.json({
      success: true,
      message: 'Uploader marked online successfully',
      data: {
        _id: file._id,
        isUploaderOnline: file.isUploaderOnline,
        updatedAt: file.updatedAt
      }
    });

  } catch (error) {
    next(error);
  }
});

// Delete file endpoint (deletes from both Cloudinary and MongoDB)
router.delete('/file/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        error: 'Invalid file ID',
        message: 'Please provide a valid file ID'
      });
    }

    const file = await File.findById(id);
    
    if (!file) {
      return res.status(404).json({
        error: 'File not found',
        message: 'The requested file does not exist'
      });
    }

    // Delete from Cloudinary if public ID exists
    if (file.cloudinaryPublicId) {
      try {
        await cloudinary.uploader.destroy(file.cloudinaryPublicId);
        console.log(`File deleted from Cloudinary: ${file.cloudinaryPublicId}`);
      } catch (cloudinaryError) {
        console.error('Error deleting from Cloudinary:', cloudinaryError);
        // Continue with local deletion even if Cloudinary deletion fails
      }
    }

    // Delete local file if it exists
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    // Delete from database
    await File.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'File deleted successfully from Cloudinary and database'
    });

  } catch (error) {
    next(error);
  }
});

// Error handler for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        error: 'File too large',
        message: 'File size must be less than 100MB'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        error: 'Too many files',
        message: 'Only one file can be uploaded at a time'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        error: 'Invalid upload',
        message: 'Unexpected file field in upload'
      });
    }
  }

  if (error.message === 'File type not allowed') {
    return res.status(400).json({
      error: 'File type not allowed',
      message: 'Please upload a supported file type'
    });
  }

  next(error);
});

module.exports = router;
