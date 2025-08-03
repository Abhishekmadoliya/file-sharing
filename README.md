View live here: https://file-sharing-cyan.vercel.app/
note: document will not persist as of now but we will surely update application shortly, thanks
 # FileShare - Secure File Sharing Platform

A modern, responsive file sharing application built with React frontend and Node.js backend, featuring real-time uploader status tracking and secure file management.

## 🏗️ Architecture Overview

```
FileShare/
├── frontend/                 # React + Vite Frontend
│   ├── src/
│   │   ├── components/      # React Components
│   │   ├── App.jsx         # Main App Component
│   │   ├── main.jsx        # Entry Point
│   │   └── index.css       # Global Styles
│   ├── public/             # Static Assets
│   └── package.json        # Frontend Dependencies
├── backend/                 # Node.js + Express Backend
│   ├── routes/             # API Routes
│   ├── models/             # MongoDB Models
│   ├── uploads/            # File Storage
│   ├── index.js           # Server Entry Point
│   └── package.json       # Backend Dependencies
└── README.md              # This File
```

## 🚀 Technology Stack

### Frontend
- **React 19** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Multer** - File upload middleware
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

### Frontend Structure
```
frontend/src/
├── components/
│   ├── Navbar.jsx          # Responsive navigation bar
│   ├── Upload.jsx          # File upload interface
│   ├── FileViewPage.jsx    # File preview and download
│   ├── FileInfo.jsx        # File information display
│   ├── About.jsx           # About page
│   └── index.jsx           # Placeholder component
├── App.jsx                 # Main application component
├── main.jsx               # React entry point
└── index.css              # Global styles and animations
```

### Backend Structure
```
backend/
├── routes/
│   └── fileRoutes.js       # File-related API endpoints
├── models/
│   └── file.js            # File data model
├── uploads/               # File storage directory
├── index.js              # Express server setup
└── package.json          # Backend dependencies
```

## 🔄 Control Flow

### 1. File Upload Flow
```
User → Frontend (Upload.jsx) → Backend API → MongoDB → File System
```

**Detailed Steps:**
1. User drags/drops or selects file in `Upload.jsx`
2. Frontend validates file and shows preview
3. User clicks "Upload File" button
4. Frontend sends file via FormData to `/upload` endpoint
5. Backend (`fileRoutes.js`) processes upload with Multer
6. File saved to `uploads/` directory
7. File metadata saved to MongoDB via Mongoose
8. Backend returns file info (ID, URLs) to frontend
9. Frontend displays success message with shareable links

### 2. File View/Download Flow
```
User → File Link → Frontend (FileViewPage.jsx) → Backend API → File System
```

**Detailed Steps:**
1. User clicks file link (e.g., `/file/:id`)
2. React Router loads `FileViewPage.jsx`
3. Component fetches file info from `/file-info/:id`
4. Backend queries MongoDB for file metadata
5. Frontend displays file preview based on type:
   - Images: Direct display
   - Videos: HTML5 video player
   - Audio: HTML5 audio player
   - PDFs: iframe embed
   - Others: Download prompt
6. User clicks download → Backend serves file from `/file/:id`
7. Backend checks uploader status before allowing download

### 3. Uploader Status Management
```
Uploader → Backend API → MongoDB → Frontend Display
```

**Detailed Steps:**
1. Uploader can mark themselves offline via `/mark-offline/:id`
2. Backend updates `isUploaderOnline` field in MongoDB
3. File viewers see real-time status updates
4. Downloads disabled when uploader is offline

## 🛠️ API Endpoints

### File Management
- `POST /upload` - Upload a new file
- `GET /file-info/:id` - Get file information
- `GET /file/:id` - Download file (with status check)
- `POST /mark-offline/:id` - Mark uploader as offline

### File Serving
- `GET /uploads/*` - Serve static files for preview

## 📊 Data Models

### File Schema (MongoDB)
```javascript
{
  filename: String,        // Generated unique filename
  originalName: String,    // Original file name
  path: String,           // File system path
  size: Number,           // File size in bytes
  isUploaderOnline: Boolean, // Uploader status
  createdAt: Date         // Upload timestamp
}
```

## 🎨 Frontend Features

### Components Overview
1. **Navbar.jsx** - Responsive navigation with mobile menu
2. **Upload.jsx** - Drag & drop file upload with preview
3. **FileViewPage.jsx** - File preview and download interface
4. **FileInfo.jsx** - File information and status management
5. **About.jsx** - Application information and features

### Key Features
- **Responsive Design** - Works on all device sizes
- **Drag & Drop** - Intuitive file upload interface
- **File Preview** - Preview images, videos, PDFs, audio
- **Real-time Status** - Uploader online/offline tracking
- **Modern UI** - Beautiful gradients and animations
- **Error Handling** - User-friendly error messages
- **Loading States** - Smooth loading animations

## 🔧 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
# Create .env file with MongoDB URI
echo "MONGO_URI=your_mongodb_connection_string" > .env
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables
Create `.env` file in backend directory:
```env
MONGO_URI=mongodb://localhost:27017/fileshare
PORT=3000
```

## 🚀 Running the Application

1. **Start Backend:**
   ```bash
   cd backend
   npm start
   ```
   Server runs on `http://localhost:3000`

2. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

3. **Access Application:**
   - Open `http://localhost:5173` in browser
   - Upload files via drag & drop
   - Share generated links with others

## 🔒 Security Features

- **File Validation** - Server-side file type checking
- **Status Tracking** - Uploader can disable downloads
- **Secure File Serving** - Files served through controlled endpoints
- **CORS Protection** - Cross-origin request handling
- **Input Sanitization** - File name and path validation

## 📱 Responsive Design

The application is fully responsive with:
- **Mobile-first** approach
- **Breakpoint-specific** layouts
- **Touch-friendly** interfaces
- **Optimized** for all screen sizes

## 🎯 Key Features

### File Management
- ✅ Drag & drop file upload
- ✅ Multiple file type support
- ✅ File preview capabilities
- ✅ Secure file downloads
- ✅ Uploader status tracking

### User Experience
- ✅ Modern, intuitive interface
- ✅ Real-time status updates
- ✅ Responsive design
- ✅ Error handling
- ✅ Loading states

### Technical
- ✅ RESTful API design
- ✅ MongoDB integration
- ✅ File system storage
- ✅ CORS handling
- ✅ Error logging

## 🔄 Development Workflow

1. **Feature Development:**
   - Create feature branch
   - Implement frontend/backend changes
   - Test functionality
   - Update documentation

2. **Testing:**
   - Test file uploads
   - Verify file previews
   - Check responsive design
   - Validate API endpoints

3. **Deployment:**
   - Build frontend (`npm run build`)
   - Deploy backend to server
   - Configure environment variables
   - Set up MongoDB connection

## 📈 Future Enhancements

- [ ] User authentication system
- [ ] File expiration dates
- [ ] Password-protected files
- [ ] File sharing analytics
- [ ] Cloud storage integration
- [ ] Mobile app development
- [ ] Advanced file preview features
- [ ] Bulk file upload support

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 License

This project is licensed under the MIT License.

---

**FileShare** - Secure, fast, and reliable file sharing for everyone.


