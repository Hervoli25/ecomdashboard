// src/pages/api/dashboard/analytics.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { query } from '@/lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const { timeframe = '30' } = req.query
    const days = parseInt(timeframe as string)

    // Get overall metrics
    const metricsQuery = await query(`
      WITH date_range AS (
        SELECT NOW() - INTERVAL '${days} days' as start_date
      ),
      orders_data AS (
        SELECT
          COUNT(*) as total_orders,
          COUNT(DISTINCT user_id) as unique_customers,
          COALESCE(SUM(total_amount), 0) as total_revenue
        FROM orders
        WHERE created_at >= (SELECT start_date FROM date_range)
      )
      SELECT
        total_orders::integer as total_orders,
        unique_customers::integer as unique_customers,
        ROUND(total_revenue::numeric, 2) as total_revenue,
        CASE
          WHEN total_orders > 0 THEN ROUND((total_revenue / total_orders)::numeric, 2)
          ELSE 0
        END as average_order_value
      FROM orders_data
    `)

    // Convert the numeric values to numbers explicitly
    const metrics = {
      total_orders: parseInt(metricsQuery.rows[0].total_orders),
      unique_customers: parseInt(metricsQuery.rows[0].unique_customers),
      total_revenue: parseFloat(metricsQuery.rows[0].total_revenue),
      average_order_value: parseFloat(metricsQuery.rows[0].average_order_value)
    }

    // Get daily revenue data
    const dailyRevenueQuery = await query(`
      SELECT
        TO_CHAR(DATE(created_at), 'YYYY-MM-DD') as date,
        ROUND(COALESCE(SUM(total_amount), 0)::numeric, 2) as revenue,
        COUNT(*)::integer as orders
      FROM orders
      WHERE created_at >= NOW() - INTERVAL '${days} days'
      GROUP BY DATE(created_at)
      ORDER BY date
    `)

    // Get top products
    const topProductsQuery = await query(`
      SELECT
        p.product_name,
        SUM(oi.quantity)::integer as units_sold,
        ROUND(SUM(oi.quantity * oi.price_per_unit)::numeric, 2) as revenue
      FROM order_items oi
      JOIN products p ON oi.product_id = p.product_id
      JOIN orders o ON oi.order_id = o.order_id
      WHERE o.created_at >= NOW() - INTERVAL '${days} days'
      GROUP BY p.product_id, p.product_name
      ORDER BY units_sold DESC
      LIMIT 5
    `)

    // Get category stats
    const categoryStatsQuery = await query(`
      SELECT
        c.category_name,
        COUNT(DISTINCT o.order_id)::integer as orders_count,
        ROUND(SUM(oi.quantity * oi.price_per_unit)::numeric, 2) as revenue
      FROM categories c
      JOIN products p ON c.category_id = p.category_id
      JOIN order_items oi ON p.product_id = oi.product_id
      JOIN orders o ON oi.order_id = o.order_id
      WHERE o.created_at >= NOW() - INTERVAL '${days} days'
      GROUP BY c.category_id, c.category_name
      ORDER BY revenue DESC
    `)

    // Get order status distribution
    const orderStatusQuery = await query(`
      SELECT
        status,
        COUNT(*)::integer as count
      FROM orders
      WHERE created_at >= NOW() - INTERVAL '${days} days'
      GROUP BY status
      ORDER BY count DESC
    `)

    return res.status(200).json({
      success: true,
      data: {
        metrics,
        dailyRevenue: dailyRevenueQuery.rows.map(row => ({
          ...row,
          revenue: parseFloat(row.revenue),
          orders: parseInt(row.orders)
        })),
        topProducts: topProductsQuery.rows.map(row => ({
          ...row,
          units_sold: parseInt(row.units_sold),
          revenue: parseFloat(row.revenue)
        })),
        categoryStats: categoryStatsQuery.rows.map(row => ({
          ...row,
          orders_count: parseInt(row.orders_count),
          revenue: parseFloat(row.revenue)
        })),
        orderStatusStats: orderStatusQuery.rows.map(row => ({
          ...row,
          count: parseInt(row.count)
        }))
      }
    })
  } catch (error) {
    console.error('Analytics API error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics data'
    })
  }
}
