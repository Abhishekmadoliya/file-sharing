import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load all components
const Upload = lazy(() => import('./components/Upload'));
const FileViewPage = lazy(() => import('./components/FileViewPage'));
const About = lazy(() => import('./components/About'));
const Demoinfo = lazy(() => import('./components/Demoinfo'));

// Loading fallback component
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
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Navbar />
        <div className="pt-16">
          <Suspense fallback={<LoadingFallback />}>
              <Routes>
                {/* Main routes */}
                <Route path="/" element={<Upload />} />
                <Route path="/file/:id" element={<FileViewPage />} />
                <Route path="/about" element={<About />} />
                <Route path="/demo/:id" element={<Demoinfo />} />
                
                {/* Catch-all route - must be last */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </div>
        </div>
      </ErrorBoundary>
  );
}

export default App;
