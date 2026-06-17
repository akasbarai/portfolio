import jwt from "jsonwebtoken";
import { getJwtSecret } from "../utils/secrets.js";

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Authentication required." });
  }

  try {
    req.admin = jwt.verify(token, getJwtSecret());
    return next();
  } catch (error) {
    if (error.status) return next(error);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}
