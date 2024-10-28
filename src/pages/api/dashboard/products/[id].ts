// src/pages/api/dashboard/products/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { query } from '@/lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query

  switch (req.method) {
    case 'PUT':
      try {
        const data = req.body

        await query(`
          UPDATE products
          SET
            product_name = $1,
            description = $2,
            price = $3,
            stock_quantity = $4,
            category_id = $5,
            is_featured = $6,
            updated_at = CURRENT_TIMESTAMP
          WHERE product_id = $7
        `, [
          data.product_name,
          data.description,
          data.price,
          data.stock_quantity,
          data.category_id,
          data.is_featured,
          id
        ])

        // Handle images update if needed
        if (data.images?.length) {
          // First delete existing images
          await query('DELETE FROM product_images WHERE product_id = $1', [id])

          // Insert new images
          for (let i = 0; i < data.images.length; i++) {
            await query(`
              INSERT INTO product_images (product_id, image_url, is_primary, display_order)
              VALUES ($1, $2, $3, $4)
            `, [id, data.images[i], i === 0, i])
          }
        }

        return res.status(200).json({ success: true })
      } catch (error) {
        console.error('Update product error:', error)
        return res.status(500).json({ success: false, error: 'Failed to update product' })
      }
      break

    case 'DELETE':
      try {
        await query('DELETE FROM products WHERE product_id = $1', [id])
        return res.status(200).json({ success: true })
      } catch (error) {
        console.error('Delete product error:', error)
        return res.status(500).json({ success: false, error: 'Failed to delete product' })
      }
      break

    default:
      res.setHeader('Allow', ['PUT', 'DELETE'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
