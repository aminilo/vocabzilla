import { User as PrismaUser } from '@prisma/client';

declare global {
  namespace Express {
    // interface User extends Pick<PrismaUser, 'id'> {}
    // interface User extends PrismaUser {}
    interface Request {
      user?: PrismaUser & { id: string }; // or just: { id: string; email: string; ... }
    }
  }
}

export {}; /* So that TypeScript treats it as a module */
