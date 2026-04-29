import 'dotenv/config';
import { z } from 'zod';

const booleanSchema = z
  .string()
  .optional()
  .transform((value) => value === 'true');

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().min(1),
  CORS_ORIGIN: z.string().default('*'),
  NEXTAUTH_SECRET: z.string().optional(),
  AUTH_SECRET: z.string().optional(),
  DEV_AUTH_BYPASS: booleanSchema,
  DEV_AUTH_USER_ID: z.string().default('dev-user'),
  DEV_AUTH_EMAIL: z.string().email().default('dev@example.com'),
  DEV_AUTH_NAME: z.string().default('Local Developer')
});

export const env = envSchema.parse(process.env);

export const authConfig = {
  secret: env.NEXTAUTH_SECRET ?? env.AUTH_SECRET ?? '',
  devBypass: env.DEV_AUTH_BYPASS,
  devUser: {
    id: env.DEV_AUTH_USER_ID,
    email: env.DEV_AUTH_EMAIL,
    name: env.DEV_AUTH_NAME,
    imageUrl: null as string | null
  }
};
