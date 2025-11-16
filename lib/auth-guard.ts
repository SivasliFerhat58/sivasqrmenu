import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth-config'
import { redirect } from 'next/navigation'
import { logger } from './logger'

export async function requireAuth() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      logger.debug('[requireAuth] No session found, redirecting to signin')
      redirect('/auth/signin')
    }

    return session
  } catch (error) {
    logger.error('[requireAuth] Error getting session:', error)
    redirect('/auth/signin')
  }
}

export async function requireOwner() {
  const session = await requireAuth()

  if (session.user.role !== 'OWNER') {
    redirect('/')
  }

  return session
}

export async function requireAdmin() {
  const session = await requireAuth()

  if (session.user.role !== 'ADMIN') {
    redirect('/')
  }

  return session
}

