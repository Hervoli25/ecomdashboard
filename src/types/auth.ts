// src/types/auth.ts
export type UserRole = 'admin' | 'seller' | 'customer'

export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  role: UserRole
  isVerified: boolean
}

export interface Session {
  user: User
  expires: string
}

export const ROLE_PERMISSIONS = {
  admin: [
    'view_dashboard',
    'manage_users',
    'manage_products',
    'manage_orders',
    'manage_settings',
    'view_analytics'
  ],
  seller: [
    'view_dashboard',
    'manage_own_products',
    'view_own_orders',
    'view_own_analytics'
  ],
  customer: [
    'view_own_orders',
    'view_own_profile',
    'manage_own_profile'
  ]
} as const
