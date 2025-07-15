import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { SupabaseAdapter } from '@auth/supabase-adapter'
import { supabaseAdmin } from './supabase'

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
    async session({ session, token }) {
      // Add user ID to session from token
      if (session?.user && token?.sub) {
        session.user.id = token.sub
      }
      return session
    },
    async jwt({ user, token }) {
      // Add user ID to JWT token
      if (user) {
        token.uid = user.id
      }
      return token
    },
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