// src/pages/api/test-connection.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { query } from '@/lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Simple test query to get some products
    const result = await query(`
      SELECT
        product_id,
        product_name,
        price,
        stock_quantity
      FROM products
      LIMIT 5
    `);

    return res.status(200).json({
      success: true,
      message: 'Database connection successful',
      data: result.rows
    });
  } catch (error) {
    console.error('Database test failed:', error);
    return res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
