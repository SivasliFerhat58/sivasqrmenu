import { compare, hash } from 'bcryptjs'
import { prisma } from './prisma'

// Password validation: minimum 8 characters
export const MIN_PASSWORD_LENGTH = 8

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12)
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return compare(password, hashedPassword)
}

export async function validatePassword(password: string): Promise<boolean> {
  return password.length >= MIN_PASSWORD_LENGTH
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    include: {
      restaurants: {
        select: {
          id: true,
        },
      },
    },
  })
}

export async function createUser(
  email: string,
  passwordHash: string,
  name?: string,
  role: 'ADMIN' | 'OWNER' = 'OWNER'
) {
  return prisma.user.create({
    data: {
      email,
      passwordHash,
      name,
      role,
    },
  })
}

