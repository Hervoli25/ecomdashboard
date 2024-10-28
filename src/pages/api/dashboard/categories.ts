// src/pages/api/dashboard/categories.ts
import { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { rows: categories } = await db.query(`
      SELECT category_id, category_name
      FROM categories
      WHERE is_active = true
    `);
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch categories' });
  }
}
