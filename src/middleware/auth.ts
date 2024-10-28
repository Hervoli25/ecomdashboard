import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { ROLE_PERMISSIONS } from '@/types/auth';

// Define the DecodedToken interface here
export interface DecodedToken {
  role: string;
  // Define other properties expected in your token, if any
  [key: string]: any;
}

// Define route permissions
const ROUTE_PERMISSIONS = {
  '/dashboard': ['view_dashboard'],
  '/dashboard/products': ['manage_products', 'manage_own_products'],
  '/dashboard/orders': ['manage_orders', 'view_own_orders'],
  '/dashboard/customers': ['manage_users'],
  '/dashboard/analytics': ['view_analytics', 'view_own_analytics'],
  '/dashboard/settings': ['manage_settings'],
};

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;

  if (!token) {
    return redirectToLogin(request);
  }

  try {
    // Verify and decode token, asserting its type as DecodedToken
    const decoded = (await verifyAuth(token)) as DecodedToken;

    // Check if decoded contains role property
    if (!decoded.role) {
      throw new Error('Invalid token format: role not found');
    }

    const userRole = decoded.role as keyof typeof ROLE_PERMISSIONS;
    const permissions = ROLE_PERMISSIONS[userRole];

    const path = request.nextUrl.pathname;
    const requiredPermissions = ROUTE_PERMISSIONS[path as keyof typeof ROUTE_PERMISSIONS];

    if (requiredPermissions && !hasPermission(permissions, requiredPermissions)) {
      return new NextResponse('Unauthorized', { status: 403 });
    }

    // Add user info to request headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('user', JSON.stringify(decoded));

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    return redirectToLogin(request);
  }
}

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL('/auth/login', request.url);
  loginUrl.searchParams.set('from', request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

function hasPermission(userPermissions: readonly string[], requiredPermissions: string[]) {
  return requiredPermissions.some((permission) => userPermissions.includes(permission));
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
