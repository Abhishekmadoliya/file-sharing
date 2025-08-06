import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy, Component } from 'react';
import Navbar from './components/Navbar';

// Lazy load all components
const Upload = lazy(() => import('./components/Upload'));
const FileViewPage = lazy(() => import('./components/FileViewPage'));
const About = lazy(() => import('./components/About'));
const Demoinfo = lazy(() => import('./components/Demoinfo'));

// Error Boundary Component
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught in boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-red-200 max-w-md w-full">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
              <p className="text-gray-600 mb-4">The application encountered an error. Please try refreshing the page.</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

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
