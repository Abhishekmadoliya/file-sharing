import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Upload from './components/Upload';
import FileViewPage from './components/FileViewPgae';
import About from './components/About';
// import Help from './components/Help';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Navbar />
        <div className="pt-16"> {/* Add padding to account for fixed navbar */}
          <Routes>
            <Route path="/" element={<Upload />} />
            <Route path="/file/:id" element={<FileViewPage />} />
            <Route path="/about" element={<About />} />
            {/* <Route path="/help" element={<Help />} /> */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
