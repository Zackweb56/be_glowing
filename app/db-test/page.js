'use client';

import { useState, useEffect } from 'react';
import { MdCheckCircle as CheckCircle, MdCancel as XCircle, MdLoop as Loader2, MdStorage as Database, MdDns as Server, MdAccessTime as Clock } from 'react-icons/md';

export default function DatabaseTestPage() {
  const [status, setStatus] = useState('loading');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const testConnection = async () => {
    setStatus('loading');
    try {
      const response = await fetch('/api/test-db');
      const result = await response.json();
      
      if (result.success) {
        setStatus('success');
        setData(result.details);
      } else {
        setStatus('error');
        setError(result.message);
      }
    } catch (err) {
      setStatus('error');
      setError(err.message || 'Failed to connect to database');
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-8">
        <div className="flex items-center gap-3 mb-6">
          <Database className="w-8 h-8 text-rose-600" />
          <h1 className="text-2xl font-semibold text-gray-800">Database Connection Test</h1>
        </div>

        <div className="space-y-6">
          {/* Status Card */}
          <div className={`p-4 rounded-lg border ${
            status === 'loading' ? 'border-blue-200 bg-blue-50' :
            status === 'success' ? 'border-green-200 bg-green-50' :
            'border-red-200 bg-red-50'
          }`}>
            <div className="flex items-center gap-3">
              {status === 'loading' && <Loader2 className="w-5 h-5 animate-spin text-blue-600" />}
              {status === 'success' && <CheckCircle className="w-5 h-5 text-green-600" />}
              {status === 'error' && <XCircle className="w-5 h-5 text-red-600" />}
              <span className={`font-medium ${
                status === 'loading' ? 'text-blue-800' :
                status === 'success' ? 'text-green-800' :
                'text-red-800'
              }`}>
                {status === 'loading' ? 'Testing connection...' :
                 status === 'success' ? '✅ Connected successfully!' :
                 '❌ Connection failed'}
              </span>
            </div>
          </div>

          {/* Details */}
          {status === 'success' && data && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Server className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-600">Database</span>
                </div>
                <p className="text-lg font-semibold text-gray-800">{data.database}</p>
                <p className="text-sm text-gray-500">Host: {data.host}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-600">Statistics</span>
                </div>
                <p className="text-sm text-gray-600">Collections: <span className="font-semibold">{data.collections}</span></p>
                <p className="text-sm text-gray-600">Indexes: <span className="font-semibold">{data.indexes}</span></p>
                <p className="text-sm text-gray-600">Data Size: <span className="font-semibold">{data.dataSize}</span></p>
              </div>

              <div className="md:col-span-2 bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Status: <span className="font-semibold capitalize">{data.state}</span></p>
                <p className="text-sm text-gray-600">Last Check: <span className="font-semibold">{new Date(data.timestamp).toLocaleString()}</span></p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {status === 'error' && error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-medium">Error Details:</p>
              <p className="text-red-600 text-sm mt-1 font-mono">{error}</p>
              <p className="text-red-500 text-sm mt-2">
                💡 Make sure your MongoDB connection string is correct and 
                your IP address is whitelisted in MongoDB Atlas.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={testConnection}
              disabled={status === 'loading'}
              className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? 'Testing...' : 'Test Again'}
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}