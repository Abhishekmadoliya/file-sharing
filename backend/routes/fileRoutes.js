const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const File = require('../models/file');
const router = express.Router();

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Sanitize filename and create unique name
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2)}-${sanitizedName}`;
    cb(null, uniqueName);
  }
});

// File filter for security
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
    'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime',
    'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/aac',
    'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain', 'text/csv', 'application/json', 'application/xml',
    'application/zip', 'application/x-rar-compressed'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('File type not allowed'), false);
  }
};

// Multer configuration with limits
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
    files: 1 // Only one file per request
  }
});

// Upload file endpoint
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

    // Create file record
    const file = new File({
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      size: req.file.size,
      isUploaderOnline: true
    });

    await file.save();

    // Generate URLs
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        _id: file._id,
        filename: file.filename,
        originalName: file.originalName,
        size: file.size,
        filePath: file.path,
        fileUrl: `${baseUrl}/api/file/${file._id}`,
        fileInfoUrl: `${baseUrl}/api/file-info/${file._id}`,
        previewUrl: `${baseUrl}/uploads/${file.filename}`,
        uploadedAt: file.createdAt
      }
    });

  } catch (error) {
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

    // Check if file exists on disk
    if (!fs.existsSync(file.path)) {
      return res.status(404).json({
        error: 'File not found',
        message: 'File has been deleted from server'
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
        filePath: file.path,
        fileType: fileType,
        isUploaderOnline: file.isUploaderOnline,
        uploadedAt: file.createdAt,
        downloadUrl: `${baseUrl}/api/file/${file._id}`,
        previewUrl: `${baseUrl}/uploads/${file.filename}`
      }
    });

  } catch (error) {
    next(error);
  }
});

// Download file endpoint
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

    // Check if file exists on disk
    if (!fs.existsSync(file.path)) {
      return res.status(404).json({
        error: 'File not found',
        message: 'File has been deleted from server'
      });
    }

    // Check uploader status
    if (!file.isUploaderOnline) {
      return res.status(403).json({
        error: 'Download disabled',
        message: 'Uploader is offline. File download is currently disabled.'
      });
    }

    // Set headers for download
    res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Length', file.size);

    // Stream the file
    const fileStream = fs.createReadStream(file.path);
    fileStream.pipe(res);

    // Handle stream errors
    fileStream.on('error', (error) => {
      console.error('File stream error:', error);
      if (!res.headersSent) {
        res.status(500).json({
          error: 'File read error',
          message: 'Unable to read file from server'
        });
      }
    });

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

// Delete file endpoint (for cleanup)
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

    // Delete file from disk
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    // Delete from database
    await File.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'File deleted successfully'
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
