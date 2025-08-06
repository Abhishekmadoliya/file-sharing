import { useParams } from 'react-router-dom';
import { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';

// API base URL
const API_BASE_URL = 'https://file-sharing-nb09.onrender.com/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

const FileViewPage = () => {
  const { id } = useParams();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  // Memoize URLs and file extensions
  const fileUrl = useMemo(() => file ? `${API_BASE_URL}/file/${id}` : null, [file, id]);
  const previewUrl = useMemo(() => file ? (file.previewUrl || file.cloudinaryUrl) : null, [file]);
  const ext = useMemo(() => file ? file.fileType?.toLowerCase() : '', [file]);

  // Fetch file information
  const fetchFileInfo = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/file-info/${id}`);
      setFile(response.data.data);
    } catch (err) {
      console.error('Error fetching file info:', err);
      if (!navigator.onLine) {
        setError('You are offline. Please check your internet connection.');
      } else if (err.code === 'ECONNABORTED') {
        setError('Request timed out. Please try again.');
      } else if (err.response?.status === 404) {
        setError('File not found. It might have been deleted or moved.');
      } else if (err.response?.status === 403) {
        setError('Access denied. You might not have permission to view this file.');
      } else {
        setError(err.response?.data?.message || 'Failed to load file information');
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchFileInfo();
  }, [fetchFileInfo]);

  // Handle file download
  // const handleDownload = useCallback(() => {
  //   // Check if file exists and is accessible
  //   if (!file) {
  //     setError('File information is not available');
  //     return;
  //   }

  //   // Check uploader status
  //   if (!file.isUploaderOnline) {
  //     setError('Cannot download file when uploader is offline');
  //     return;
  //   }

  //   try {
  //     // Create a hidden anchor element
  //     const link = document.createElement('a');
      
  //     if (!fileUrl) {
  //       setError('Download URL is not available');
  //       return;
  //     }

  //     link.href = fileUrl;
      
  //     // Set the download attribute with the original filename
  //     link.setAttribute('download', file.name || 'download');
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);

  //   } catch (err) {
  //     console.error('Error initiating download:', err);
  //     setError('Failed to start download. Please try again.');
  //   }
  // }, [file, fileUrl, setError]);

  // Handle link copying with fallback
  const handleCopyLink = useCallback(async () => {
    const url = window.location.href;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Failed to copy link:', err);
      alert('Failed to copy link. Please try manually copying the URL.');
    }
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg font-medium">Loading file...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-red-200">
          <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">Error Loading File</h3>
          <p className="text-gray-600 text-center">{error}</p>
        </div>
      </div>
    </div>
  );

  if (!file) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-gray-600 text-lg font-medium">File not found.</p>
      </div>
    </div>
  );

  const getFileIcon = () => {
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(ext)) {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    } else if (['mp4', 'webm', 'ogg', 'mov', 'avi'].includes(ext)) {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      );
    } else if (['mp3', 'wav', 'ogg', 'aac', 'flac'].includes(ext)) {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      );
    } else if (ext === 'pdf') {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
    } else {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    }
  };

  const renderPreview = () => {
    if (ext === 'pdf') {
      return (
        <div className="bg-gray-50 rounded-xl overflow-hidden shadow-lg">
          <div className="w-full max-w-4xl mx-auto">
            <div className="relative w-full h-[calc(100vh-20rem)] min-h-[500px]">
              <iframe 
                src={previewUrl} 
                title="PDF Preview" 
                className="absolute top-0 left-0 w-full h-full border-0 rounded-lg"
              />
            </div>
          </div>
        </div>
      );
    } else if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(ext)) {
      return (
        <div className="bg-gray-50 rounded-xl overflow-hidden shadow-lg group">
          <div className="w-full max-w-4xl mx-auto">
            <div className="relative aspect-auto min-h-[300px] max-h-[70vh] flex items-center justify-center p-4">
              <img 
                src={previewUrl} 
                alt={file.name}
                className="max-w-full max-h-full rounded-lg object-contain transform transition-transform duration-300 group-hover:scale-105"
                style={{ objectFit: 'contain', width: 'auto', height: 'auto' }}
              />
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-lg"></div>
            </div>
          </div>
        </div>
      );
    } else if (['mp4', 'webm', 'ogg', 'mov', 'avi'].includes(ext)) {
      return (
        <div className="bg-gray-50 rounded-xl overflow-hidden shadow-lg">
          <div className="w-full max-w-4xl mx-auto">
            <div className="relative aspect-video">
              <video 
                controls 
                src={previewUrl}
                poster={previewUrl + '?t=1'} 
                className="w-full h-full rounded-lg"
                controlsList="nodownload"
                playsInline
              />
            </div>
          </div>
        </div>
      );
    } else if (['mp3', 'wav', 'ogg', 'aac', 'flac'].includes(ext)) {
      return (
        <div className="bg-gray-50 rounded-xl p-4 sm:p-8 shadow-lg">
          <audio controls src={previewUrl} className="w-full" />
        </div>
      );
    } else if (['txt', 'md', 'js', 'jsx', 'ts', 'tsx', 'html', 'css', 'json', 'xml', 'csv'].includes(ext)) {
      return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 shadow-lg border border-blue-200">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <p className="text-center text-gray-700 font-medium">Text file preview not available</p>
          <p className="text-center text-gray-500 text-sm mt-2">Please download to view the content</p>
        </div>
      );
    } else {
      return (
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-8 shadow-lg border border-gray-200">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <p className="text-center text-gray-700 font-medium">No preview available</p>
          <p className="text-center text-gray-500 text-sm mt-2">This file type cannot be previewed</p>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="max-w-5xl mx-auto">
          {/* Header Card */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-8 mb-4 sm:mb-8 border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-4 space-y-4 sm:space-y-0">
              <div className="flex-shrink-0 flex justify-center">
                <div className="w-20 h-20 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg transform hover:scale-105 transition-transform duration-200">
                  {getFileIcon()}
                </div>
              </div>
              <div className="flex-1 min-w-0 text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-2 truncate">{file.name}</h1>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {file.fileType.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${file.isUploaderOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className={file.isUploaderOnline ? 'text-green-600' : 'text-red-600'}>
                      {file.isUploaderOnline ? 'Uploader Online' : 'Uploader Offline'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl mb-4 sm:mb-8 border border-gray-100 overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center justify-center sm:justify-start">
                <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                File Preview
              </h2>
            </div>
            <div className="w-full overflow-hidden bg-gray-50">
              <div className="max-w-full overflow-x-hidden">
                {renderPreview()}
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4 sm:mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-8 border border-gray-100">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center justify-center sm:justify-start">
              <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <a 
                href={previewUrl}
                download={file.name}
                disabled={!file.isUploaderOnline}
                title={file.isUploaderOnline ? `Download ${file.name}` : 'Downloads are disabled when uploader is offline'}
                className={`w-full flex items-center justify-center px-4 sm:px-6 py-3 sm:py-4 rounded-xl font-medium sm:font-semibold text-base sm:text-lg transition-all duration-200 transform active:scale-95 ${
                  file.isUploaderOnline 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md hover:shadow-lg no-underline' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed pointer-events-none no-underline'
                }`}
              >
                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span className="whitespace-nowrap">
                  {file.isUploaderOnline ? 'Download File' : 'Download Disabled'}
                </span>
              </a>
              
              <button
                onClick={handleCopyLink}
                title="Copy shareable link to clipboard"
                className="w-full flex items-center justify-center px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-xl font-medium sm:font-semibold text-base sm:text-lg transition-all duration-200 transform active:scale-95 shadow-md hover:shadow-lg"
              >
                {copied ? (
                  <>
                    <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="whitespace-nowrap">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span className="whitespace-nowrap">Copy Link</span>
                  </>
                )}
              </button>
              
              <a 
                href={previewUrl}
                target="_blank" 
                rel="noopener noreferrer"
                title="Open file in a new tab"
                className="w-full flex items-center justify-center px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-medium sm:font-semibold text-base sm:text-lg transition-all duration-200 transform active:scale-95 shadow-md hover:shadow-lg"
              >
                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <span className="whitespace-nowrap">Open in New Tab</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileViewPage;
