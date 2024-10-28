// src/pages/api/dashboard/settings/index.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { query } from '@/lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      try {
        const { category } = req.query;

        let queryStr = `
          SELECT category, settings_key, settings_value, updated_at
          FROM system_settings
        `;

        if (category) {
          queryStr += ` WHERE category = $1`;
        }

        const result = await query(queryStr, category ? [category] : []);

        // Transform the results into a more usable format
        const settings = result.rows.reduce((acc, row) => {
          if (!acc[row.category]) {
            acc[row.category] = {};
          }
          acc[row.category][row.settings_key] = row.settings_value;
          return acc;
        }, {});

        return res.status(200).json({
          success: true,
          data: settings
        });
      } catch (error) {
        console.error('Failed to fetch settings:', error);
        return res.status(500).json({
          success: false,
          error: 'Failed to fetch settings'
        });
      }
      break;

    case 'PUT':
      try {
        const { category, settings } = req.body;

        if (!category || !settings) {
          return res.status(400).json({
            success: false,
            error: 'Category and settings are required'
          });
        }

        // Start transaction
        await query('BEGIN');

        for (const [key, value] of Object.entries(settings)) {
          await query(`
            INSERT INTO system_settings (category, settings_key, settings_value)
            VALUES ($1, $2, $3)
            ON CONFLICT (category, settings_key)
            DO UPDATE SET
              settings_value = $3,
              updated_at = CURRENT_TIMESTAMP
          `, [category, key, JSON.stringify(value)]);
        }

        await query('COMMIT');

        return res.status(200).json({
          success: true,
          message: 'Settings updated successfully'
        });
      } catch (error) {
        await query('ROLLBACK');
        console.error('Failed to update settings:', error);
        return res.status(500).json({
          success: false,
          error: 'Failed to update settings'
        });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      return res.status(405).json({
        success: false,
        error: `Method ${req.method} Not Allowed`
      });
  }
}
