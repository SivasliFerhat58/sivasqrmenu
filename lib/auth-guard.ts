import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'

export async function requireAuth() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    redirect('/auth/signin')
  }

  return session
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

