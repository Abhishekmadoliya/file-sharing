const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const dotenv = require('dotenv');
dotenv.config();
const fileRoutes = require('./routes/fileRoutes')
const cors = require('cors');

// CORS Configuration
const corsOptions = {
  origin: [
    'http://localhost:5173',  // Vite default development port
    'http://localhost:3000',  // In case you're using a different port
    'https://file-sharing-nb09.onrender.com', // Your production domain
    'http://localhost:4173'  // Vite preview port
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400 // 24 hours
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Static file serving
app.use('/uploads', express.static('uploads'));

// Body parser middleware
const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err))    


  app.use('/api', fileRoutes)
// app.get('/app', (req, res) => res.send('Hello World!'))
// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    error: true,
    message: err.message || 'Internal Server Error',
  });
});

// Handle options requests
app.options('*', cors(corsOptions));

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`CORS is enabled for origins:`, corsOptions.origin);
});