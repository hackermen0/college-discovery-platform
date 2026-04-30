// frontend/lib/auth.ts
import type { NextAuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const response = await fetch(`${backendUrl}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password
            })
          });

          if (!response.ok) {
            return null;
          }

          const result = await response.json();
          return result.data as User;
        } catch (error) {
          console.error('Credentials provider error:', error);
          return null;
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
    })
  ],
  pages: {
    signIn: '/auth/login'
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Handle Google sign-in
      if (account?.provider === 'google' && user) {
        try {
          const response = await fetch(`${backendUrl}/api/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              imageUrl: user.image,
              providerAccountId: account.providerAccountId
            })
          });

          if (response.ok) {
            const result = await response.json();
            const dbUser = result.data;
            token.id = dbUser.id;
            token.email = dbUser.email;
            token.name = dbUser.name;
            token.picture = dbUser.imageUrl;
          }
        } catch (error) {
          console.error('Google sign-in backend call failed:', error);
        }
      }

      // Handle credentials login
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) || '';
        session.user.image = (token.picture as string) || null;
      }
      return session;
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET
  },
  secret: process.env.NEXTAUTH_SECRET
};
