'use client';

import { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { Key, CheckCircle, XCircle, ArrowLeft, Send, Github, Loader2 } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';

export default function Playground() {
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    message: string;
    keyInfo?: any;
  } | null>(null);
  const [summaryResult, setSummaryResult] = useState<{
    success: boolean;
    summary?: string;
    repository?: any;
    error?: string;
  } | null>(null);

  const handleValidateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;

    setIsValidating(true);
    setValidationResult(null);

    try {
      const response = await fetch('/api/validate-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: apiKey.trim() }),
      });

      const data = await response.json();
      setValidationResult({
        isValid: response.ok,
        message: response.ok ? 'Valid API key!' : data.error || 'Invalid API key',
        keyInfo: data.keyInfo,
      });
    } catch (error) {
      setValidationResult({
        isValid: false,
        message: 'Validation failed',
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleSummarizeRepo = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is authenticated before proceeding
    if (!session) {
      // Redirect to sign in if not authenticated
      signIn('google');
      return;
    }

    if (!apiKey.trim() || !githubUrl.trim()) return;

    setIsSummarizing(true);
    setSummaryResult(null);

    try {
      const response = await fetch('/api/github-summarizer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey.trim(),
        },
        body: JSON.stringify({ githubUrl: githubUrl.trim() }),
      });

      const data = await response.json();
      setSummaryResult({
        success: response.ok,
        summary: data.summary,
        repository: data.repository,
        error: response.ok ? undefined : data.error || 'Summarization failed',
      });
    } catch (error) {
      setSummaryResult({
        success: false,
        error: 'Request failed',
      });
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleClear = () => {
    setApiKey('');
    setGithubUrl('');
    setValidationResult(null);
    setSummaryResult(null);
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
          <div className="max-w-3xl mx-auto px-4 py-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Key className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Playground</h1>
                  <p className="text-gray-600">Test your API</p>
                </div>
              </div>
              <Link 
                href="/dashboards"
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Link>
            </div>

            {/* API Key Input */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <form onSubmit={handleValidateKey} className="space-y-4">
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
                      placeholder="smo-..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                      disabled={isValidating}
                    />
                    <Key className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isValidating || !apiKey.trim()}
                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    {isValidating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Validating...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Validate
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </form>

              {/* Validation Result */}
              {validationResult && (
                <div className={`mt-4 p-4 rounded-lg border-l-4 ${
                  validationResult.isValid
                    ? 'bg-green-50 border-green-400'
                    : 'bg-red-50 border-red-400'
                }`}>
                  <div className="flex items-center">
                    {validationResult.isValid ? (
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 mr-2" />
                    )}
                    <span className={`text-sm font-medium ${
                      validationResult.isValid ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {validationResult.message}
                    </span>
                  </div>
                  
                  {validationResult.isValid && validationResult.keyInfo && (
                    <div className="mt-3 bg-white rounded p-3 border border-green-200">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>Name: <span className="font-medium">{validationResult.keyInfo.name}</span></div>
                        <div>Type: <span className="font-medium">{validationResult.keyInfo.key_type}</span></div>
                        <div>Usage: <span className="font-medium">{validationResult.keyInfo.usage_count}/{validationResult.keyInfo.usage_limit}</span></div>
                        <div>Status: <span className={`font-medium ${validationResult.keyInfo.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>{validationResult.keyInfo.status}</span></div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* GitHub Summarizer */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <form onSubmit={handleSummarizeRepo} className="space-y-4">
                <div>
                  <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-700 mb-2">
                    GitHub Repository URL
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      id="githubUrl"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      placeholder="https://github.com/owner/repo"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      disabled={isSummarizing}
                    />
                    <Github className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSummarizing || !apiKey.trim() || !githubUrl.trim()}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  {isSummarizing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Summarizing...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Summarize Repository
                    </>
                  )}
                </button>
              </form>

              {/* Summary Result */}
              {summaryResult && (
                <div className={`mt-4 p-4 rounded-lg border-l-4 ${
                  summaryResult.success
                    ? 'bg-green-50 border-green-400'
                    : 'bg-red-50 border-red-400'
                }`}>
                  <div className="flex items-center mb-3">
                    {summaryResult.success ? (
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 mr-2" />
                    )}
                    <span className={`text-sm font-medium ${
                      summaryResult.success ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {summaryResult.success ? 'Summary Generated' : summaryResult.error}
                    </span>
                  </div>
                  
                  {summaryResult.success && (
                    <div className="space-y-3">
                      {/* Summary */}
                      <div className="bg-white rounded p-3 border border-green-200">
                        <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                          {summaryResult.summary}
                        </div>
                      </div>

                      {/* Repository Info */}
                      {summaryResult.repository && (
                        <div className="bg-white rounded p-3 border border-green-200">
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>Name: <span className="font-medium">{summaryResult.repository.name}</span></div>
                            <div>Stars: <span className="font-medium">{summaryResult.repository.stars?.toLocaleString() || 'N/A'}</span></div>
                            <div>Language: <span className="font-medium">{summaryResult.repository.language || 'N/A'}</span></div>
                            {summaryResult.repository.latest_release && (
                              <div>Release: <span className="font-medium">{summaryResult.repository.latest_release.tag_name}</span></div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 