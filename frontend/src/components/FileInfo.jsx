import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function FileInfo() {
  const { id } = useParams();
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:5000/file-info/${id}`)
      .then(res => setFile(res.data))
      .catch(() => setError("File not found or expired"));
  }, [id]);

  const markOffline = async () => {
    await axios.post(`http://localhost:5000/mark-offline/${id}`);
    window.location.reload();
  };

  return (
    <div>
      <h2>File Info</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {file && (
        <div>
          <p><strong>Name:</strong> {file.name}</p>
          <p><strong>Size:</strong> {file.size} bytes</p>
          <p><strong>Uploader Status:</strong> {file.isUploaderOnline ? "Online ✅" : "Offline ❌"}</p>

          {file.isUploaderOnline ? (
            <a href={`http://localhost:5000/file/${id}`}>
              <button>Download File</button>
            </a>
          ) : (
            <p style={{ color: "red" }}>Uploader is offline. File cannot be downloaded.</p>
          )}

          <button style={{ marginTop: "20px" }} onClick={markOffline}>
            Simulate Uploader Logout (Mark Offline)
          </button>
        </div>
      )}
    </div>
  );
}

export default FileInfo;
