import bcrypt from 'bcryptjs';
import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '@/lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    // Handle the GET request to fetch customers
    try {
      const { page = '1', limit = '10', search = '' } = req.query;
      const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

      const customers = await query(
        `
        SELECT
          u.user_id,
          u.email,
          u.first_name,
          u.last_name,
          u.created_at,
          u.is_verified,
          COUNT(DISTINCT o.order_id) as total_orders,
          COALESCE(SUM(o.total_amount), 0) as total_spent,
          MAX(o.created_at) as last_order_date,
          json_agg(DISTINCT jsonb_build_object(
            'address_type', a.address_type,
            'city', a.city,
            'country', a.country
          )) FILTER (WHERE a.address_id IS NOT NULL) as addresses
        FROM users u
        LEFT JOIN orders o ON u.user_id = o.user_id
        LEFT JOIN addresses a ON u.user_id = a.user_id
        WHERE u.role = 'user'
          AND (
            LOWER(u.email) LIKE LOWER($1) OR
            LOWER(u.first_name) LIKE LOWER($1) OR
            LOWER(u.last_name) LIKE LOWER($1)
          )
        GROUP BY u.user_id
        ORDER BY total_spent DESC NULLS LAST
        LIMIT $2 OFFSET $3
      `,
        [`%${search}%`, limit, offset]
      );

      const countResult = await query(
        `
        SELECT COUNT(*)
        FROM users
        WHERE role = 'user'
          AND (
            LOWER(email) LIKE LOWER($1) OR
            LOWER(first_name) LIKE LOWER($1) OR
            LOWER(last_name) LIKE LOWER($1)
          )
      `,
        [`%${search}%`]
      );

      const total = parseInt(countResult.rows[0].count);

      return res.status(200).json({
        success: true,
        data: {
          customers: customers.rows,
          total,
          page: parseInt(page as string),
          totalPages: Math.ceil(total / parseInt(limit as string)),
        },
      });
    } catch (error) {
      console.error('Customers API error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch customers',
      });
    }
  } else if (req.method === 'POST') {
    // Handle the POST request to add a new customer
    try {
      const { first_name, last_name, email, phone_number, password } = req.body;

      if (!first_name || !last_name || !email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields',
        });
      }

      // Hash the password
      const passwordHash = await bcrypt.hash(password, 10);

      const insertQuery = `
        INSERT INTO users (first_name, last_name, email, phone_number, password_hash, role)
        VALUES ($1, $2, $3, $4, $5, 'user')
        RETURNING user_id, email, first_name, last_name, created_at, is_verified;
      `;
      const values = [first_name, last_name, email, phone_number, passwordHash];

      const result = await query(insertQuery, values);
      const newCustomer = result.rows[0];

      return res.status(201).json({
        success: true,
        data: newCustomer,
      });
    } catch (error) {
      console.error('Error creating customer:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to create customer',
      });
    }
  } else {
    // Return 405 if the method is not supported
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }
}
