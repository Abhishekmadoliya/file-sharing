const express = require('express');
const multer = require('multer');
const File = require('../models/file');
const router = express.Router();

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

router.post('/upload', upload.single('file'), async (req, res) => {
  const file = new File({
    filename: req.file.filename,
    originalName: req.file.originalname,
    path: req.file.path,
    size: req.file.size,
    isUploaderOnline: true
  });

  await file.save();

  res.json({
    _id: file._id,
    filePath: file.path,
    fileUrl: `${req.protocol}://${req.get('host')}/file/${file._id}`,
    fileInfoUrl: `${req.protocol}://${req.get('host')}/file-info/${file._id}`
  });
});


router.get('/file-info/:id', async (req, res) => {
  const file = await File.findById(req.params.id);
  if (!file) return res.status(404).send("File not found");

  const fileType = file.originalName.split('.').pop();

  res.json({
    name: file.originalName,
    size: file.size,
    filePath: file.path,
    fileType,
    isUploaderOnline: file.isUploaderOnline
  });
});



router.get('/file/:id', async (req, res) => {
  const file = await File.findById(req.params.id);
  if (!file) return res.status(404).send('File not found');

  if (!file.isUploaderOnline) {
    return res.status(403).send('Uploader is offline. File download disabled.');
  }

  res.download(file.path, file.originalName);
});


router.post('/mark-offline/:id', async (req, res) => {
  const file = await File.findByIdAndUpdate(req.params.id, {
    isUploaderOnline: false
  });

  if (!file) return res.status(404).send('File not found');
  res.json({ message: "Uploader marked offline" });
});





module.exports = router;
