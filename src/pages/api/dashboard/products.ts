// src/pages/api/dashboard/products/index.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { query } from '@/lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      try {
        const { page = '1', limit = '10', search = '' } = req.query;
        const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

        // Get products with category names and images
        const products = await query(`
          SELECT
            p.product_id,
            p.product_name,
            p.description,
            p.price,
            p.stock_quantity,
            p.is_featured,
            c.category_name,
            c.category_id,
            p.created_at,
            COALESCE(
              json_agg(
                json_build_object(
                  'image_url', pi.image_url,
                  'is_primary', pi.is_primary
                )
              ) FILTER (WHERE pi.image_id IS NOT NULL),
              '[]'
            ) as images
          FROM products p
          LEFT JOIN categories c ON p.category_id = c.category_id
          LEFT JOIN product_images pi ON p.product_id = pi.product_id
          WHERE LOWER(p.product_name) LIKE LOWER($1)
          GROUP BY p.product_id, c.category_name, c.category_id
          ORDER BY p.created_at DESC
          LIMIT $2 OFFSET $3
        `, [`%${search}%`, limit, offset]);

        // Get total count for pagination
        const countResult = await query(
          'SELECT COUNT(*) FROM products WHERE LOWER(product_name) LIKE LOWER($1)',
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
      break;

    case 'POST':
      try {
        const data = req.body;

        // Start a transaction
        await query('BEGIN');

        // Insert product
        const result = await query(`
          INSERT INTO products (
            product_name,
            description,
            price,
            stock_quantity,
            category_id,
            is_featured
          ) VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING product_id
        `, [
          data.product_name,
          data.description,
          data.price,
          data.stock_quantity,
          data.category_id,
          data.is_featured
        ]);

        const productId = result.rows[0].product_id;

        // Insert images if provided
        if (data.images?.length) {
          for (let i = 0; i < data.images.length; i++) {
            await query(`
              INSERT INTO product_images (
                product_id,
                image_url,
                is_primary,
                display_order
              ) VALUES ($1, $2, $3, $4)
            `, [productId, data.images[i], i === 0, i]);
          }
        }

        await query('COMMIT');

        return res.status(201).json({
          success: true,
          data: { product_id: productId }
        });
      } catch (error) {
        await query('ROLLBACK');
        console.error('Create product error:', error);
        return res.status(500).json({
          success: false,
          error: 'Failed to create product'
        });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({
        success: false,
        error: `Method ${req.method} Not Allowed`
      });
  }
}
