import express from 'express';
import {User} from '@prisma/client';
import {cihuibiao} from '@prisma/client';

export interface UserPayload extends User {}
export interface ChPayload extends cihuibiao {}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
      query?: ChPayload;
    }
  }
}
