import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Navbar from './components/Navbar';

// Lazy load components
const Upload = lazy(() => import('./components/Upload'));
const FileViewPage = lazy(() => import('./components/FileViewPgae'));
const About = lazy(() => import('./components/About'));

// Loading fallback
const LoadingFallback = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600 text-lg font-medium">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Navbar />
        <div className="pt-16">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Upload />} />
              <Route path="/file/:id" element={<FileViewPage />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </div>
      </div>
    </Router>
  );
}

export default App;
