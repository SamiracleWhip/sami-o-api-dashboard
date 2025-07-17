'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Key, CheckCircle, XCircle, AlertCircle, ArrowLeft, Send } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';

export default function Playground() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    message: string;
    keyInfo?: any;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;

    setIsSubmitting(true);
    setValidationResult(null);

    try {
      const response = await fetch('/api/validate-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey: apiKey.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setValidationResult({
          isValid: true,
          message: 'API key is valid and active!',
          keyInfo: data.keyInfo,
        });
      } else {
        setValidationResult({
          isValid: false,
          message: data.error || 'API key validation failed',
        });
      }
    } catch (error) {
      setValidationResult({
        isValid: false,
        message: 'Failed to validate API key. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClear = () => {
    setApiKey('');
    setValidationResult(null);
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
              className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 touch-manipulation"
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
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
            {/* Header */}
            <div className="mb-6 md:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Key className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">API Playground</h1>
                  <p className="text-gray-600 text-sm md:text-base">Test and validate your API keys</p>
                </div>
                <Link 
                  href="/dashboards"
                  className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors text-sm md:text-base touch-manipulation sm:ml-auto"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Back to Dashboard</span>
                  <span className="sm:hidden">Dashboard</span>
                </Link>
              </div>
            </div>

            {/* API Key Validation Form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900">API Key Validator</h2>
                <p className="text-sm md:text-base text-gray-600 mt-1">
                  Enter your API key to validate access to protected resources
                </p>
              </div>

              <div className="p-4 sm:p-6">
                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
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
                        className="w-full px-4 py-3 md:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono text-sm md:text-base"
                        disabled={isSubmitting}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <Key className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                    <p className="text-xs md:text-sm text-gray-500 mt-2">
                      Your API key will be validated against the database to check if it&apos;s active and valid.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting || !apiKey.trim()}
                      className="flex-1 bg-blue-600 text-white py-3 md:py-4 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2 touch-manipulation"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Validating...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>Validate Key</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleClear}
                      disabled={isSubmitting}
                      className="sm:w-auto bg-gray-200 text-gray-700 py-3 md:py-4 px-4 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors font-medium touch-manipulation"
                    >
                      Clear
                    </button>
                  </div>
                </form>

                {/* Validation Result */}
                {validationResult && (
                  <div className={`mt-6 p-4 md:p-6 rounded-lg border-l-4 ${
                    validationResult.isValid
                      ? 'bg-green-50 border-green-400'
                      : 'bg-red-50 border-red-400'
                  }`}>
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        {validationResult.isValid ? (
                          <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
                        )}
                      </div>
                      <div className="ml-3 flex-1">
                        <h3 className={`text-sm md:text-base font-medium ${
                          validationResult.isValid ? 'text-green-800' : 'text-red-800'
                        }`}>
                          {validationResult.isValid ? 'Success!' : 'Validation Failed'}
                        </h3>
                        <p className={`mt-1 text-xs md:text-sm ${
                          validationResult.isValid ? 'text-green-700' : 'text-red-700'
                        }`}>
                          {validationResult.message}
                        </p>
                        
                        {validationResult.isValid && validationResult.keyInfo && (
                          <div className="mt-3 md:mt-4 bg-white rounded-lg p-3 md:p-4 border border-green-200">
                            <h4 className="text-sm font-medium text-gray-900 mb-2 md:mb-3">Key Information</h4>
                            <div className="space-y-1 md:space-y-2 text-xs md:text-sm">
                              <div className="flex flex-col sm:flex-row sm:justify-between">
                                <span className="text-gray-600">Name:</span>
                                <span className="font-medium text-gray-900">{validationResult.keyInfo.name}</span>
                              </div>
                              <div className="flex flex-col sm:flex-row sm:justify-between">
                                <span className="text-gray-600">Type:</span>
                                <span className="font-medium text-gray-900">{validationResult.keyInfo.key_type}</span>
                              </div>
                              <div className="flex flex-col sm:flex-row sm:justify-between">
                                <span className="text-gray-600">Permissions:</span>
                                <span className="font-medium text-gray-900">{validationResult.keyInfo.permissions}</span>
                              </div>
                              <div className="flex flex-col sm:flex-row sm:justify-between">
                                <span className="text-gray-600">Usage:</span>
                                <span className="font-medium text-gray-900">
                                  {validationResult.keyInfo.usage_count} / {validationResult.keyInfo.usage_limit}
                                </span>
                              </div>
                              <div className="flex flex-col sm:flex-row sm:justify-between">
                                <span className="text-gray-600">Status:</span>
                                <span className={`font-medium ${
                                  validationResult.keyInfo.status === 'active' 
                                    ? 'text-green-600' 
                                    : 'text-red-600'
                                }`}>
                                  {validationResult.keyInfo.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Usage Guide */}
            <div className="mt-6 md:mt-8 bg-blue-50 rounded-xl p-4 md:p-6 border border-blue-200">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="ml-3">
                  <h3 className="text-sm md:text-base font-medium text-blue-900">How to use the API Playground</h3>
                  <div className="mt-2 text-xs md:text-sm text-blue-800 space-y-1 md:space-y-2">
                    <p>• Copy an API key from your <Link href="/dashboards" className="underline hover:text-blue-900">Dashboard</Link></p>
                    <p>• Paste it in the input field above</p>
                    <p>• Click "Validate Key" to check if it&apos;s active and accessible</p>
                    <p>• View detailed information about your API key usage and permissions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 