import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Returns the raw JWT token for the currently signed-in user.
// This endpoint is intentionally server-side only and will return 401
// when there is no authenticated session.
export async function GET(request: Request) {
  // Request the raw signed JWT string when possible so the client can
  // forward it to the backend via Authorization header.
  const token = await getToken({ req: request as unknown as any, secret: process.env.NEXTAUTH_SECRET, raw: true });

  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // Return the raw token string if available (some adapters return object payload)
  // next-auth's getToken may return a string or an object; if it's an object we
  // stringify it so the client can use the `sub` claim if needed. But our
  // backend expects a signed JWT string when using Authorization: Bearer <token>.
  // If you use a credentials provider, NextAuth stores the JWT in cookies; in
  // that case this token will be an object of claims — still useful.
  return NextResponse.json({ token });
}
