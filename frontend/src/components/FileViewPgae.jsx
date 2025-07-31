import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const FileViewPage = () => {
  const { id } = useParams();
  const [file, setFile] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:3000/file-info/${id}`).then((res) => setFile(res.data));
  }, [id]);

  if (!file) return <p>Loading...</p>;

  const fileUrl = `http://localhost:3000/${file.filePath}`;
  const ext = file.fileType.toLowerCase();

  const renderPreview = () => {
    if (ext === 'pdf') {
      return <iframe src={fileUrl} width="100%" height="600px" title="PDF Preview"></iframe>;
    } else if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) {
      return <img src={fileUrl} alt="preview" className="max-w-full" />;
    } else if (['mp4', 'webm'].includes(ext)) {
      return <video controls src={fileUrl} className="w-full" />;
    } else if (['mp3', 'wav'].includes(ext)) {
      return <audio controls src={fileUrl} className="w-full" />;
    } else {
      return <p>No preview available for this file type.</p>;
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">{file.name}</h2>
      {renderPreview()}
      <a href={fileUrl} download className="mt-4 inline-block px-4 py-2 bg-green-600 text-white rounded">
        Download
      </a>
    </div>
  );
};

export default FileViewPage;
