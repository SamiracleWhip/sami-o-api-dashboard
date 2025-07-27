'use client';

import { useState } from 'react';
import { ArrowLeft, HelpCircle, Mail, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Sidebar from '@/components/Sidebar';

// Header Component
const DashboardHeader = ({ sidebarOpen, setSidebarOpen }: { sidebarOpen: boolean; setSidebarOpen: (open: boolean) => void }) => (
  <div className="lg:hidden bg-gray-800 border-b border-gray-700 px-4 py-3">
    <div className="flex items-center justify-between">
      <button
        onClick={() => setSidebarOpen(true)}
        className="p-2 rounded-md text-gray-400 hover:text-gray-300 hover:bg-gray-700 touch-manipulation"
      >
        <Menu size={20} />
      </button>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-xs">SM</span>
        </div>
        <span className="text-lg font-semibold text-white">Sami-O</span>
      </div>
      <div className="w-10" />
    </div>
  </div>
);

// Page Header Component
const PageHeader = () => (
  <div className="mb-6 md:mb-8">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 md:mb-6 gap-3">
      <div>
        <nav className="text-xs md:text-sm text-gray-400 mb-2">
          <Link href="/" className="hover:text-gray-300">Pages</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-300">Help</span>
        </nav>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">Help & Support</h1>
      </div>
      <div className="flex items-center gap-2">
        <Link
          href="/"
          className="flex items-center gap-2 text-gray-400 hover:text-gray-300 transition-colors text-sm md:text-base"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>

    {/* Gradient Card */}
    <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 text-white relative overflow-hidden shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-indigo-700/20 backdrop-blur-sm"></div>
      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 md:mb-6 gap-4">
          <div>
            <p className="text-xs md:text-sm font-medium opacity-90 mb-2" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
              NEED ASSISTANCE?
            </p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>
              We're Here to Help
            </h2>
          </div>
          <div className="flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
        </div>
        
        <div className="mb-4 md:mb-6">
          <p className="text-lg md:text-xl opacity-90 leading-relaxed" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
            Get the support you need for your API integration and development questions.
          </p>
        </div>
      </div>
    </div>
  </div>
);

// Help Content Component
const HelpContent = () => (
  <div className="bg-gray-800 rounded-xl md:rounded-2xl border border-gray-700 p-4 md:p-6 lg:p-8 shadow-lg">
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg">
        <Mail className="w-10 h-10 text-white" />
      </div>
      
      <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
        Contact Support
      </h3>
      
      <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
        For help please contact
      </p>
      
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg p-6 mb-8">
        <a 
          href="mailto:samiosaas@gmail.com"
          className="text-xl md:text-2xl font-semibold text-blue-400 hover:text-blue-300 transition-colors break-all"
        >
          samiosaas@gmail.com
        </a>
      </div>
      
      <div className="space-y-4 text-gray-400 text-sm md:text-base">
        <p>
          Our support team is ready to assist you with:
        </p>
        <ul className="text-left max-w-md mx-auto space-y-2">
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            API integration questions
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            Technical troubleshooting
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            Account and billing support
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            Feature requests and feedback
          </li>
        </ul>
      </div>
    </div>
  </div>
);

export default function HelpPage() {
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <DashboardHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-12">
            <PageHeader />
            <HelpContent />
          </div>
        </main>
      </div>
    </div>
  );
} 