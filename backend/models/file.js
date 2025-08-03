const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  filename: String,
  originalName: String,
  path: String,
  size: Number,
  cloudinaryUrl: String, // Cloudinary URL for the uploaded file
  cloudinaryPublicId: String, // Cloudinary public ID for file management
  isUploaderOnline: { type: Boolean, default: true }, // no auth needed
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("File", fileSchema);
