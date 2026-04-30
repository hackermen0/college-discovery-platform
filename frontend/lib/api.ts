// frontend/lib/api.ts
const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export type ApiOptions = {
  headers?: Record<string, string>;
} & Omit<RequestInit, 'headers'>;

/**
 * Simple API fetch wrapper that works both on server and client.
 * Credentials (cookies) are included so auth via httpOnly cookies works.
 */
export async function apiFetch<T = unknown>(path: string, options: ApiOptions = {}): Promise<T> {
  const { headers = {}, ...fetchOptions } = options;

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers
  };

  // If running in the browser and no Authorization header is provided,
  // attempt to obtain a token from the local NextAuth API and attach it.
  if (typeof window !== 'undefined' && !requestHeaders['Authorization']) {
    try {
      const tokenRes = await fetch('/api/auth/token');
      if (tokenRes.ok) {
        const body = await tokenRes.json();
        // token may be an object of claims or a string; if object, there's
        // no signed JWT string to forward — rely on cookies instead.
        if (typeof body.token === 'string') {
          requestHeaders['Authorization'] = `Bearer ${body.token}`;
        }
      }
    } catch (err) {
      // ignore token fetch errors; we'll still send cookies via credentials
    }
  }

  const response = await fetch(`${apiBaseUrl}/api${path}`, {
    ...fetchOptions,
    headers: requestHeaders,
    credentials: 'include'
  });

  if (!response.ok) {
    let message = 'Something went wrong. Please try again.';

    try {
      const errorBody = await response.json();
      if (typeof errorBody?.error === 'string' && errorBody.error.trim()) {
        message = errorBody.error;
      }
    } catch {
      if (response.statusText) {
        message = response.statusText;
      }
    }

    throw new Error(message);
  }

  // If the response has no content (204) or an empty body, return null.
  // Otherwise try to parse JSON; if parsing fails, return the raw text.
  if (response.status === 204) return null as unknown as T;

  const text = await response.text();
  if (!text || !text.trim()) return null as unknown as T;

  try {
    return JSON.parse(text) as T;
  } catch {
    return text as unknown as T;
  }
}

export async function apiGet<T = unknown>(path: string, options?: ApiOptions): Promise<T> {
  return apiFetch<T>(path, { ...options, method: 'GET' });
}

export async function apiPost<T = unknown>(path: string, body?: unknown, options?: ApiOptions): Promise<T> {
  return apiFetch<T>(path, {
    ...options,
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined
  });
}

export async function apiPatch<T = unknown>(path: string, body?: unknown, options?: ApiOptions): Promise<T> {
  return apiFetch<T>(path, {
    ...options,
    method: 'PATCH',
    body: body ? JSON.stringify(body) : undefined
  });
}

export async function apiDelete<T = unknown>(path: string, options?: ApiOptions): Promise<T> {
  return apiFetch<T>(path, { ...options, method: 'DELETE' });
}
