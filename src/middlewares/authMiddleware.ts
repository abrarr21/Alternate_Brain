import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: DecodedToken;
}

interface DecodedToken extends JwtPayload {
  id: string;
  email: string;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const token: string | undefined =
    req.cookies?.token || req.headers?.authorization;
  // console.log(req.cookies);
  // console.log(req.headers.authorization);

  if (!token || !token.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const authToken: string = token.split(" ")[1];

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not found");
    }

    const decoded: DecodedToken = jwt.verify(
      authToken,
      secret,
    ) as unknown as DecodedToken;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: "Invalid Token" });
    return;
  }
};
