import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { verifyPassword, getUserByEmail } from '@/lib/auth'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.error('[NextAuth] Missing credentials')
          return null
        }

        try {
          const email = credentials.email.toLowerCase().trim()
          console.log('[NextAuth] Attempting login for:', email)
          
          // Get user from database
          const user = await getUserByEmail(email)

          if (!user) {
            console.error('[NextAuth] User not found:', email)
            return null
          }

          console.log('[NextAuth] User found:', user.email, 'Role:', user.role)

          // Verify password
          const isValid = await verifyPassword(
            credentials.password,
            user.passwordHash
          )

          if (!isValid) {
            console.error('[NextAuth] Password verification failed for:', email)
            return null
          }

          console.log('[NextAuth] Password verified successfully for:', email)

          // Get the first restaurant ID if user is an owner
          const restaurantId =
            user.role === 'OWNER' && user.restaurants.length > 0
              ? user.restaurants[0].id
              : null

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            restaurantId,
          }
        } catch (error) {
          console.error('[NextAuth] Authorize error:', error)
          console.error('[NextAuth] Error stack:', error instanceof Error ? error.stack : 'No stack')
          // Return null to indicate authentication failure
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.restaurantId = user.restaurantId
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.restaurantId = token.restaurantId
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
}

