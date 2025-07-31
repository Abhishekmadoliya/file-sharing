import React, { useState } from 'react';
import axios from 'axios';

function Upload() {
  const [file, setFile] = useState(null);
  const [links, setLinks] = useState(null);
  const [error, setError] = useState('');

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:3000/upload", formData);
      setLinks({
        fileUrl: `http://localhost:3000/${res.data.filePath}`,
        fileInfoUrl: `/file/${res.data._id}`
      });
      setError('');
    } catch (err) {
      console.error(err);
      setError('Upload failed. Please try again.');
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Upload a File</h2>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-4"
      />

      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Upload
      </button>

      {error && <p className="text-red-500 mt-3">{error}</p>}

      {links && (
        <div className="mt-6 bg-gray-100 p-4 rounded">
          <p>
            <strong>Preview Page:</strong>{' '}
            <a href={links.fileInfoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
              {links.fileInfoUrl}
            </a>
          </p>
          <p className="mt-2">
            <strong>Direct Download:</strong>{' '}
            <a href={links.fileUrl} target="_blank" rel="noopener noreferrer" className="text-green-600 underline">
              {links.fileUrl}
            </a>
          </p>
        </div>
      )}
    </div>
  );
}

export default Upload;
