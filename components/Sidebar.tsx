'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  Home,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Code,
  LayoutDashboard,
  LogOut,
  User
} from 'lucide-react';

interface SidebarProps {
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

const navigationItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Dashboard', href: '/dashboards', icon: LayoutDashboard },
  { name: 'Playground', href: '/playground', icon: Code },
  { name: 'Settings', href: '/dashboards/settings', icon: Settings },
  { name: 'Help', href: '/dashboards/help', icon: HelpCircle },
];

export default function Sidebar({ isMobile = false, isOpen = false, onClose }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  // Determine if we're in mobile view or desktop view
  const isMobileView = isMobile || isOpen;

  const sidebarClasses = `
    ${isMobileView ? 'fixed inset-y-0 left-0 z-50' : 'hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 lg:z-30'}
    ${isMobileView && !isOpen ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}
    ${isCollapsed && !isMobileView ? 'w-16' : 'w-64'}
    bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out
    flex flex-col h-full shadow-lg lg:shadow-none
  `;

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobileView && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <div className={sidebarClasses}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700 min-h-[64px]">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-sm lg:text-base">SM</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white text-lg lg:text-xl">Sami-O</span>
            </div>
          )}
          
          {/* Mobile close button or desktop collapse button */}
          {isMobileView ? (
            <button
              onClick={onClose}
              className="p-2 lg:p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors touch-manipulation"
            >
              <X className="w-5 h-5 lg:w-6 lg:h-6 text-gray-500 dark:text-gray-400" />
            </button>
          ) : (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {isCollapsed ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 lg:p-6 space-y-1 lg:space-y-2 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => isMobileView && onClose && onClose()}
                className={`
                  flex items-center space-x-3 lg:space-x-4 px-3 lg:px-4 py-3 lg:py-4 rounded-lg transition-all duration-200 touch-manipulation
                  ${isActive 
                    ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 border-r-2 border-blue-600 dark:border-blue-400 shadow-sm' 
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300'
                  }
                  ${isCollapsed && !isMobileView ? 'justify-center' : ''}
                `}
              >
                <Icon className="w-5 h-5 lg:w-6 lg:h-6 flex-shrink-0" />
                {(!isCollapsed || isMobileView) && (
                  <span className="font-medium text-sm lg:text-base">{item.name}</span>
                )}
                {isActive && (!isCollapsed || isMobileView) && (
                  <div className="ml-auto w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Section */}
        {session?.user && (
          <div className="p-4 lg:p-6 border-t border-gray-200 dark:border-gray-700">
            {(!isCollapsed || isMobileView) ? (
              <div className="space-y-3">
                {/* User Info */}
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || 'User'}
                        className="w-10 h-10 rounded-full border-2 border-gray-200 dark:border-gray-600"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {session.user.name || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {session.user.email}
                    </p>
                  </div>
                </div>
                
                {/* Sign Out Button */}
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-800 dark:hover:text-gray-100 transition-all duration-200"
                >
                  <LogOut className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm font-medium">Sign Out</span>
                </button>
              </div>
            ) : (
              /* Collapsed state - just show profile picture */
              <div className="flex justify-center">
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    className="w-8 h-8 rounded-full border-2 border-gray-200 dark:border-gray-600 cursor-pointer hover:opacity-80 transition-opacity"
                    title={`${session.user.name}\n${session.user.email}`}
                  />
                ) : (
                  <div 
                    className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                    title={`${session.user.name}\n${session.user.email}`}
                  >
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="p-4 lg:p-6 border-t border-gray-200 dark:border-gray-700">
          {(!isCollapsed || isMobileView) && (
            <div className="text-xs lg:text-sm text-gray-500 dark:text-gray-400 text-center">
              <p className="mb-1">© 2025 Sami-O</p>
              <p className="text-xs">v1.0.0</p>
            </div>
          )}
          {isCollapsed && !isMobileView && !session?.user && (
            <div className="flex justify-center">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            </div>
          )}
        </div>
      </div>
    </>
  );
} 