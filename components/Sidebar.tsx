'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Key,
  Settings,
  BarChart3,
  Users,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Code
} from 'lucide-react';

interface SidebarProps {
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

const navigationItems = [
  { name: 'Dashboard', href: '/dashboards', icon: Home },
  { name: 'API Keys', href: '/dashboards/api-keys', icon: Key },
  { name: 'Analytics', href: '/dashboards/analytics', icon: BarChart3 },
  { name: 'Users', href: '/dashboards/users', icon: Users },
  { name: 'Playground', href: '/playground', icon: Code },
  { name: 'Settings', href: '/dashboards/settings', icon: Settings },
  { name: 'Help', href: '/dashboards/help', icon: HelpCircle },
];

export default function Sidebar({ isMobile = false, isOpen = false, onClose }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const sidebarClasses = `
    ${isMobile ? 'fixed inset-y-0 left-0 z-50' : 'relative'}
    ${isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'}
    ${isCollapsed && !isMobile ? 'w-16' : 'w-64'}
    bg-white border-r border-gray-200 transition-all duration-300 ease-in-out
    flex flex-col h-full
  `;

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
      
      <div className={sidebarClasses}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SM</span>
              </div>
              <span className="font-semibold text-gray-900">Sami-O</span>
            </div>
          )}
          
          {isMobile ? (
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors
                  ${isActive 
                    ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' 
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                  }
                `}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span className="font-medium">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          {!isCollapsed && (
            <div className="text-xs text-gray-500 text-center">
              © 2024 Sami-O
            </div>
          )}
        </div>
      </div>
    </>
  );
} 