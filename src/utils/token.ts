import jwt from "jsonwebtoken";

export function createToken(userId: string): string {
  const secret = process.env.JWT_SECRET!;
  return jwt.sign({ userId }, secret, { expiresIn: "1d" });
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    const secret = process.env.JWT_SECRET!;
    const payload = jwt.verify(token, secret) as { userId: string };
    return payload;
  } catch {
    return null;
  }
}
