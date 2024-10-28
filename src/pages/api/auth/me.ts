// src/pages/api/auth/me.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { query } from '@/lib/db'
import { verify } from 'jsonwebtoken'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  const token = req.cookies.auth_token

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Not authenticated'
    })
  }

  try {
    // Verify the token
    const decoded = verify(token, process.env.JWT_SECRET!) as { userId: number }

    // Get user data from database
    const result = await query(`
      SELECT
        user_id as id,
        email,
        first_name as "firstName",
        last_name as "lastName",
        role,
        is_verified as "isVerified"
      FROM users
      WHERE user_id = $1
    `, [decoded.userId])

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'User not found'
      })
    }

    return res.status(200).json({
      success: true,
      user: result.rows[0]
    })
  } catch (error) {
    console.error('Session validation error:', error)
    return res.status(401).json({
      success: false,
      error: 'Invalid authentication token'
    })
  }
}
