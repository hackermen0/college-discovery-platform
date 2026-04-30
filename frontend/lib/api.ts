// frontend/lib/api.ts
import { getSession } from 'next-auth/react';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export type ApiOptions = {
  includeAuth?: boolean;
  headers?: Record<string, string>;
} & Omit<RequestInit, 'headers'>;

/**
 * Authenticated API fetch wrapper
 * Automatically includes JWT token from NextAuth session
 */
export async function apiFetch(
  path: string,
  options: ApiOptions = {}
): Promise<Response> {
  const { includeAuth = true, headers = {}, ...fetchOptions } = options;

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers
  };

  // Add authorization header if token is available
  if (includeAuth) {
    const session = await getSession();
    if (session?.user?.id) {
      // Session contains JWT token via httpOnly cookie
      // We don't need to manually add it - the cookie will be sent automatically
      // But we can verify session exists
    }
  }

  const response = await fetch(`${apiBaseUrl}/api${path}`, {
    ...fetchOptions,
    headers: requestHeaders,
    credentials: 'include' // Include cookies for httpOnly cookie auth
  });

  return response;
}

/**
 * Make an authenticated GET request
 */
export async function apiGet(path: string, options?: ApiOptions) {
  return apiFetch(path, { ...options, method: 'GET' });
}

/**
 * Make an authenticated POST request
 */
export async function apiPost(path: string, body?: unknown, options?: ApiOptions) {
  return apiFetch(path, {
    ...options,
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined
  });
}

/**
 * Make an authenticated PATCH request
 */
export async function apiPatch(path: string, body?: unknown, options?: ApiOptions) {
  return apiFetch(path, {
    ...options,
    method: 'PATCH',
    body: body ? JSON.stringify(body) : undefined
  });
}

/**
 * Make an authenticated DELETE request
 */
export async function apiDelete(path: string, options?: ApiOptions) {
  return apiFetch(path, { ...options, method: 'DELETE' });
}
