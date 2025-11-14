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
          throw new Error('Email and password are required')
        }

        const user = await getUserByEmail(credentials.email)

        if (!user) {
          throw new Error('Invalid email or password')
        }

        const isValid = await verifyPassword(
          credentials.password,
          user.passwordHash
        )

        if (!isValid) {
          throw new Error('Invalid email or password')
        }

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
  },
  secret: process.env.NEXTAUTH_SECRET,
}

