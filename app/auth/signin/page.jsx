'use client'

import { signIn, getSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Github, ArrowLeft, Loader2 } from 'lucide-react'

export default function SignIn() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is already signed in
    getSession().then((session) => {
      if (session) {
        router.push('/dashboards')
      }
    })
  }, [router])

  const handleGoogleSignIn = async () => {
    setLoading(true)
    try {
      await signIn('google', { 
        callbackUrl: '/dashboards',
        redirect: true 
      })
    } catch (error) {
      console.error('Sign in error:', error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 md:w-64 md:h-64 bg-purple-500 rounded-full filter blur-xl opacity-40 animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-32 h-32 md:w-64 md:h-64 bg-blue-500 rounded-full filter blur-xl opacity-40 animate-pulse delay-1000"></div>
        </div>
      </div>

      <div className="max-w-md w-full space-y-6 md:space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center justify-center mb-6 md:mb-8 hover:opacity-75 transition-opacity">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl md:rounded-2xl flex items-center justify-center mr-3 shadow-lg">
              <Github className="h-6 w-6 md:h-8 md:w-8 text-white" />
            </div>
            <span className="font-bold text-2xl md:text-3xl text-white">Sami-O</span>
          </Link>
          
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Welcome Back
          </h2>
          <p className="text-sm md:text-base text-white/70 px-4">
            Sign in to your account to access your GitHub repository insights
          </p>
        </div>

        {/* Sign-in card */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl shadow-2xl border border-white/20 p-6 md:p-8">
          <div className="space-y-4 md:space-y-6">
            {/* Google Sign In Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="group relative w-full flex justify-center items-center py-3 md:py-4 px-4 border border-transparent text-sm md:text-base font-medium rounded-lg text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg touch-manipulation"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin mr-3" />
              ) : (
                <svg className="w-5 h-5 md:w-6 md:h-6 mr-3" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              {loading ? 'Signing in...' : 'Continue with Google'}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20" />
              </div>
              <div className="relative flex justify-center text-sm md:text-base">
                <span className="px-2 bg-transparent text-white/60">Quick & Secure Access</span>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-3">
              <div className="flex items-center text-white/80 text-sm md:text-base">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-3 flex-shrink-0"></div>
                <span>Analyze any public GitHub repository</span>
              </div>
              <div className="flex items-center text-white/80 text-sm md:text-base">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 flex-shrink-0"></div>
                <span>AI-powered insights and summaries</span>
              </div>
              <div className="flex items-center text-white/80 text-sm md:text-base">
                <div className="w-2 h-2 bg-purple-400 rounded-full mr-3 flex-shrink-0"></div>
                <span>Track stars, PRs, and updates</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <Link 
            href="/"
            className="inline-flex items-center text-white/60 hover:text-white/80 transition-colors text-sm md:text-base touch-manipulation"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          
          <p className="mt-4 text-xs md:text-sm text-white/50 px-4">
            By signing in, you agree to our{' '}
            <Link href="/terms" className="underline hover:text-white/70 transition-colors">
              Terms of Service
            </Link>
            {' '}and{' '}
            <Link href="/privacy" className="underline hover:text-white/70 transition-colors">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
} 