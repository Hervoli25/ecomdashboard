
// src/pages/api/dashboard/products.ts - For product management
import type { NextApiRequest, NextApiResponse } from 'next'
import { query } from '@/lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const { page = '1', limit = '10', search = '' } = req.query;
      const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

      const products = await query(`
        SELECT
          p.product_id,
          p.product_name,
          p.price,
          p.stock_quantity,
          p.is_featured,
          c.category_name,
          p.created_at
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.category_id
        WHERE p.product_name ILIKE $1
        ORDER BY p.created_at DESC
        LIMIT $2 OFFSET $3
      `, [`%${search}%`, limit, offset]);

      const countResult = await query(
        'SELECT COUNT(*) FROM products WHERE product_name ILIKE $1',
        [`%${search}%`]
      );

      const total = parseInt(countResult.rows[0].count);

      return res.status(200).json({
        success: true,
        data: {
          products: products.rows,
          total,
          page: parseInt(page as string),
          totalPages: Math.ceil(total / parseInt(limit as string))
        }
      });
    } catch (error) {
      console.error('Products API error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch products'
      });
    }
  }
}
