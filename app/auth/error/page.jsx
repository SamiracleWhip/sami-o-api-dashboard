'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const errorMessages = {
    Configuration: 'There is a problem with the server configuration. Please check your environment variables.',
    AccessDenied: 'You do not have permission to sign in.',
    Verification: 'The sign in link is no longer valid.',
    OAuthSignin: 'Error in constructing an authorization URL.',
    OAuthCallback: 'Error in handling the response from an OAuth provider.',
    OAuthCreateAccount: 'Could not create OAuth account.',
    EmailCreateAccount: 'Could not create email account.',
    Callback: 'Error in the OAuth callback handler route.',
    OAuthAccountNotLinked: 'The account is not linked. Please sign in with the same account you used originally.',
    EmailSignin: 'Sending the e-mail with the verification token failed.',
    CredentialsSignin: 'The authorize callback returned null in the Credentials provider.',
    SessionRequired: 'You must be signed in to access this page.',
    Default: 'An error occurred during authentication.',
  }

  const errorMessage = errorMessages[error] || errorMessages.Default

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Authentication Error
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {errorMessage}
          </p>
          {error && (
            <p className="mt-2 text-center text-xs text-gray-500">
              Error code: {error}
            </p>
          )}
        </div>
        
        <div className="mt-8 space-y-6">
          <div className="text-center space-y-2">
            <Link
              href="/auth/signin"
              className="font-medium text-blue-600 hover:text-blue-500 block"
            >
              Try signing in again
            </Link>
            <Link
              href="/"
              className="font-medium text-gray-600 hover:text-gray-500 block"
            >
              Go back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AuthError() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  )
} 