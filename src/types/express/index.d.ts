import { User as PrismaUser } from '@prisma/client';

declare global {
  namespace Express {
    // interface User extends Pick<PrismaUser, 'id'> {}
    interface User extends PrismaUser {}
    // interface Request {
    //   user?: User;
    // }
  }
}

export {}; /* So that TypeScript treats it as a module */
