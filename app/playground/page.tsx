'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Key, Send, CheckCircle, XCircle } from 'lucide-react';
import Sidebar from '@/components/Sidebar';

interface Notification {
  message: string;
  type: 'success' | 'error';
}

export default function Playground() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<Notification | null>(null);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      showNotification('Please enter an API key', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/validate-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey: apiKey.trim() }),
      });

      const data = await response.json();

      if (data.valid) {
        showNotification('Valid API key, /protected can be accessed', 'success');
        // Redirect to protected page after a short delay
        setTimeout(() => {
          router.push('/protected');
        }, 2000);
      } else {
        showNotification('Invalid API key.', 'error');
      }
    } catch (error) {
      showNotification('Error validating API key. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 lg:ml-64 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">SM</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">Sami-O</span>
            </div>
            <div className="w-10" />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Key className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">API Playground</h1>
                  <p className="text-gray-600">Test and validate your API keys</p>
                </div>
              </div>
            </div>

            {/* API Key Validation Form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-xl font-semibold text-gray-900">API Key Validator</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Enter your API key to validate access to protected resources
                </p>
              </div>

              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
                      API Key
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="apiKey"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Enter your API key (e.g., smo-1234567890abcdef...)"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono text-sm"
                        disabled={isSubmitting}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <Key className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Your API key will be validated against the database to check if it&apos;s active and valid.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting || !apiKey.trim()}
                      className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Validating...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Validate API Key
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setApiKey('')}
                      disabled={isSubmitting}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                      Clear
                    </button>
                  </div>
                </form>

                {/* Info Section */}
                <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="text-sm font-medium text-blue-900 mb-2">How it works:</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Enter your API key in the field above</li>
                    <li>• Click &quot;Validate API Key&quot; to check if it&apos;s valid</li>
                    <li>• Valid keys will grant access to the protected page</li>
                    <li>• Invalid or inactive keys will be rejected</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className={`px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
            notification.type === 'success'
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle size={20} />
            ) : (
              <XCircle size={20} />
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}
    </div>
  );
} 