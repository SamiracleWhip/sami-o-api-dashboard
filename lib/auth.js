import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { SupabaseAdapter } from '@auth/supabase-adapter'
import { createOrUpdateUser } from './user-manager'

export const authOptions = {
  // Temporarily comment out adapter to use JWT sessions for debugging
  // adapter: SupabaseAdapter({
  //   url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  //   secret: process.env.SUPABASE_SERVICE_ROLE_KEY,
  // }),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (process.env.NODE_ENV === 'development') {
        console.log('SignIn callback triggered:', {
          user: user?.email,
          provider: account?.provider,
          providerAccountId: account?.providerAccountId
        })
      }
      
      // Save user to Supabase when they sign in
      if (account?.provider === 'google' && user?.email) {
        try {
          if (process.env.NODE_ENV === 'development') {
            console.log('Attempting to save user to Supabase:', user.email)
          }
          const result = await createOrUpdateUser({
            name: user.name,
            email: user.email,
            image: user.image,
            provider: account.provider,
            providerAccountId: account.providerAccountId,
          })
          if (process.env.NODE_ENV === 'development') {
            console.log('User save result:', result)
          }
        } catch (error) {
          console.error('Error saving user to Supabase:', error)
          console.error('Error details:', error.message, error.code)
          // Don't block sign-in if database save fails
        }
      }
      return true
    },
    async session({ session, token }) {
      // Add user ID to session from token
      if (token?.sub) {
        session.user.id = token.sub
      }
      if (token?.email) {
        session.user.email = token.email
      }
      if (token?.name) {
        session.user.name = token.name
      }
      if (token?.picture) {
        session.user.image = token.picture
      }
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Session callback:', {
          sessionUser: session?.user?.email,
          tokenSub: token?.sub,
          tokenEmail: token?.email
        })
      }
      
      return session
    },
    async jwt({ user, token }) {
      // Add user data to JWT token
      if (user) {
        token.uid = user.id
        token.email = user.email
        token.name = user.name
        token.picture = user.image
        // Ensure sub (subject) is set to user ID for session
        token.sub = user.id
      }
      
      if (process.env.NODE_ENV === 'development') {
        console.log('JWT callback:', {
          userEmail: user?.email,
          tokenSub: token?.sub,
          tokenEmail: token?.email
        })
      }
      
      return token
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt', // Use JWT instead of database for now
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development', // Only debug in development
} 