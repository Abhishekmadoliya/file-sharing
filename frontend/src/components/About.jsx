import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">About FileShare</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Secure, fast, and reliable file sharing for everyone. Share your files with confidence.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Secure Sharing</h3>
            <p className="text-gray-600">
              Your files are protected with industry-standard encryption and secure transfer protocols.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Lightning Fast</h3>
            <p className="text-gray-600">
              Upload and share files instantly with our optimized infrastructure and CDN.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Easy to Use</h3>
            <p className="text-gray-600">
              Simple drag-and-drop interface with no registration required. Share files in seconds.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                1
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload</h3>
              <p className="text-gray-600">Drag and drop your file or click to browse and select</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Share</h3>
              <p className="text-gray-600">Get a unique link to share with anyone, anywhere</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Download</h3>
              <p className="text-gray-600">Recipients can download files directly from the link</p>
            </div>
          </div>
        </div>

        {/* Features List */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <svg className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h4 className="font-semibold text-gray-900">No Registration Required</h4>
                <p className="text-gray-600">Start sharing files immediately without creating an account</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <svg className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h4 className="font-semibold text-gray-900">File Preview</h4>
                <p className="text-gray-600">Preview images, videos, PDFs, and more before downloading</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <svg className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h4 className="font-semibold text-gray-900">Uploader Status</h4>
                <p className="text-gray-600">Real-time status tracking of uploader availability</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <svg className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h4 className="font-semibold text-gray-900">Secure Downloads</h4>
                <p className="text-gray-600">Files are served securely with proper access controls</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <svg className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h4 className="font-semibold text-gray-900">Multiple File Types</h4>
                <p className="text-gray-600">Support for images, documents, videos, audio, and more</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <svg className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h4 className="font-semibold text-gray-900">Responsive Design</h4>
                <p className="text-gray-600">Works perfectly on desktop, tablet, and mobile devices</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Sharing?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of users who trust FileShare for their file sharing needs.
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Start Sharing Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 