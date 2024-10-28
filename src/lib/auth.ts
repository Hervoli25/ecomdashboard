// src/lib/auth.ts
import { verify, sign } from 'jsonwebtoken'
import { query } from './db'
import type { User } from '@/types/auth'

export async function verifyAuth(token: string) {
  try {
    const decoded = verify(token, process.env.JWT_SECRET!)
    return decoded
  } catch (error) {
    throw new Error('Invalid token')
  }
}

export async function createAuthToken(user: User) {
  return sign(
    {
      userId: user.id,
      role: user.role,
      email: user.email
    },
    process.env.JWT_SECRET!,
    { expiresIn: '24h' }
  )
}

export async function getUserById(userId: number): Promise<User | null> {
  try {
    const result = await query(
      `SELECT
        user_id as id,
        email,
        first_name as "firstName",
        last_name as "lastName",
        role,
        is_verified as "isVerified"
      FROM users
      WHERE user_id = $1`,
      [userId]
    )

    return result.rows[0] || null
  } catch (error) {
    console.error('Error fetching user:', error)
    return null
  }
}
