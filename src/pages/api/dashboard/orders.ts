// src/pages/api/dashboard/orders.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { query } from '@/lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const {
        page = '1',
        limit = '10',
        status = ''
      } = req.query;

      const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

      let queryStr = `
        SELECT
          o.order_id,
          o.total_amount,
          o.status,
          o.created_at,
          o.payment_status,
          u.email as customer_email,
          u.first_name,
          u.last_name,
          COUNT(oi.product_id) as items_count,
          COALESCE(json_agg(json_build_object(
            'product_id', p.product_id,
            'product_name', p.product_name,
            'quantity', oi.quantity,
            'price', oi.price_per_unit
          )) FILTER (WHERE p.product_id IS NOT NULL), '[]') as items
        FROM orders o
        JOIN users u ON o.user_id = u.user_id
        LEFT JOIN order_items oi ON o.order_id = oi.order_id
        LEFT JOIN products p ON oi.product_id = p.product_id
      `;

      const queryParams: any[] = [];
      if (status) {
        queryStr += ` WHERE o.status = $${queryParams.length + 1}`;
        queryParams.push(status);
      }

      queryStr += `
        GROUP BY o.order_id, u.email, u.first_name, u.last_name
        ORDER BY o.created_at DESC
        LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
      `;
      queryParams.push(limit, offset);

      const orders = await query(queryStr, queryParams);

      // Get total count
      let countQuery = 'SELECT COUNT(DISTINCT o.order_id) FROM orders o';
      if (status) {
        countQuery += ' WHERE o.status = $1';
      }
      const countResult = await query(countQuery, status ? [status] : []);

      const total = parseInt(countResult.rows[0].count);

      return res.status(200).json({
        success: true,
        data: {
          orders: orders.rows,
          total,
          page: parseInt(page as string),
          totalPages: Math.ceil(total / parseInt(limit as string))
        }
      });
    } catch (error) {
      console.error('Orders API error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch orders'
      });
    }
  }
}
