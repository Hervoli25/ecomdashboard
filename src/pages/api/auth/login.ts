// src/pages/api/auth/login.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { query } from '@/lib/db'
import { sign } from 'jsonwebtoken'
import { serialize } from 'cookie'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email, password } = req.body

    const result = await query(
      'SELECT user_id, email, role, first_name, last_name FROM users WHERE email = $1 AND password_hash = $2',
      [email, password] // In production, use proper password hashing
    )

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      })
    }

    const user = result.rows[0]
    const token = sign(
      { userId: user.user_id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    )

    // Set HTTP-only cookie
    res.setHeader('Set-Cookie', serialize('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400,
      path: '/'
    }))

    return res.json({
      success: true,
      user: {
        id: user.user_id,
        email: user.email,
        role: user.role,
        name: `${user.first_name} ${user.last_name}`
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
}
