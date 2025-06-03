import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaClient } from '@prisma/client';
import { multiSession } from 'better-auth/plugins';

const prisma = new PrismaClient();

/**
 * Multi-session
 * https://www.better-auth.com/docs/plugins/multi-session
 */
export const auth = betterAuth({
  plugins: [multiSession()],
  emailAndPassword: {
    enabled: true,
  },
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
});
