import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Admin } from "../models/Admin.js";
import { isDatabaseReady } from "../config/db.js";
import { getFallbackAdminCredentials, getJwtSecret } from "./secrets.js";

export function signAdminToken(admin) {
  return jwt.sign(
    {
      sub: String(admin._id || admin.id || "env-admin"),
      email: admin.email,
      role: admin.role || "owner"
    },
    getJwtSecret(),
    { expiresIn: "8h" }
  );
}

export async function ensureDefaultAdmin() {
  if (!isDatabaseReady()) return;

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.warn("ADMIN_EMAIL or ADMIN_PASSWORD is missing. CMS login creation skipped.");
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  try {
    const result = await Admin.findOneAndUpdate(
      { email: email.toLowerCase() },
      {
        $setOnInsert: {
          name: "Portfolio Admin",
          email,
          passwordHash,
          role: "owner"
        }
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    if (result.createdAt?.getTime() === result.updatedAt?.getTime()) {
      console.log(`Default CMS admin created for ${email}`);
    }
  } catch (error) {
    if (error.code === 11000) return;
    throw error;
  }
}

export async function authenticateAdmin(email, password) {
  if (!email || !password) {
    const error = new Error("Email and password are required.");
    error.status = 400;
    throw error;
  }

  if (!isDatabaseReady()) {
    const { email: envEmail, password: envPassword } = getFallbackAdminCredentials();

    if (email.toLowerCase() === envEmail.toLowerCase() && password === envPassword) {
      return {
        admin: {
          id: "env-admin",
          email: envEmail,
          name: "Portfolio Admin",
          role: "owner"
        }
      };
    }
  }

  const admin = await Admin.findOne({ email: email.toLowerCase() });
  if (!admin) {
    const error = new Error("Invalid CMS credentials.");
    error.status = 401;
    throw error;
  }

  const validPassword = await bcrypt.compare(password, admin.passwordHash);
  if (!validPassword) {
    const error = new Error("Invalid CMS credentials.");
    error.status = 401;
    throw error;
  }

  admin.lastLoginAt = new Date();
  await admin.save();

  return { admin };
}

export async function changeAdminPassword(adminId, currentPassword, newPassword) {
  if (!currentPassword || !newPassword) {
    const error = new Error("Current password and new password are required.");
    error.status = 400;
    throw error;
  }

  if (newPassword.length < 8) {
    const error = new Error("New password must be at least 8 characters.");
    error.status = 400;
    throw error;
  }

  if (!isDatabaseReady() || adminId === "env-admin") {
    const error = new Error("Password changes require the MongoDB-backed CMS account.");
    error.status = 503;
    throw error;
  }

  const admin = await Admin.findById(adminId);
  if (!admin) {
    const error = new Error("Admin account was not found.");
    error.status = 404;
    throw error;
  }

  const validPassword = await bcrypt.compare(currentPassword, admin.passwordHash);
  if (!validPassword) {
    const error = new Error("Current password is incorrect.");
    error.status = 401;
    throw error;
  }

  const samePassword = await bcrypt.compare(newPassword, admin.passwordHash);
  if (samePassword) {
    const error = new Error("Choose a new password that is different from the current password.");
    error.status = 400;
    throw error;
  }

  admin.passwordHash = await bcrypt.hash(newPassword, 12);
  await admin.save();

  return { admin };
}
