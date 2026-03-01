import * as jose from 'jose';

declare global {
  namespace Express {
    interface Request {
      vercel?: jose.JWTPayload; 
    }
  }
}