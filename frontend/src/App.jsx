import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Upload from './components/Upload';
import FileViewPage from './components/FileViewPgae';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Upload />} />
        <Route path="/file/:id" element={<FileViewPage />} />
      </Routes>
    </Router>
  );
}

export default App;
