'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // Still loading
    if (!session) router.push('/') // Redirect to homepage if not authenticated
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!session) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Welcome to Your Dashboard
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                You&apos;re signed in as <span className="font-semibold">{session.user.email}</span>
              </p>
              
              {session.user.image && (
                <div className="mt-4 flex justify-center">
                  <img 
                    src={session.user.image} 
                    alt="Profile" 
                    className="h-16 w-16 rounded-full border-4 border-blue-500"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link href="/api-keys">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg">
                  Manage API Keys
                </button>
              </Link>
              
              <Link href="/">
                <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg">
                  Back to Home
                </button>
              </Link>
              
              <button 
                onClick={() => signOut({ callbackUrl: '/' })}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
              >
                Sign Out
              </button>
            </div>

            <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Quick Actions
              </h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <p>• Access your GitHub repository analysis APIs</p>
                <p>• Manage your authentication keys</p>
                <p>• View usage statistics and analytics</p>
                <p>• Configure notifications and alerts</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 