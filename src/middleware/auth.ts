import type { Request, Response, NextFunction } from "express";
import * as jose from "jose";

const TEAM_SLUG = "the-not-project";
const PROJECT_NAME = "not-project-website";

const JWKS = jose.createRemoteJWKSet(
  new URL(`https://oidc.vercel.com/${TEAM_SLUG}/.well-known/jwks`)
);

export async function verifyOidcMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Missing token" });

  try {
    const { payload } = await jose.jwtVerify(token, JWKS, {
      issuer: `https://oidc.vercel.com/${TEAM_SLUG}`,
      audience: `https://vercel.com/${TEAM_SLUG}`,
    });

    if (payload.sub?.indexOf(`project:${PROJECT_NAME}`) === -1) {
      return res.status(403).json({ error: "Wrong project" });
    }

    req.vercel = payload;
    next();
  } catch (err) {
    console.log(err);

    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
