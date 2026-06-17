import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { authenticateAdmin, changeAdminPassword, signAdminToken } from "../utils/admin.js";

const router = express.Router();

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { admin } = await authenticateAdmin(email, password);
    const token = signAdminToken(admin);

    res.json({
      token,
      admin: {
        id: admin._id || admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/password", requireAuth, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const { admin } = await changeAdminPassword(req.admin.sub, currentPassword, newPassword);
    const token = signAdminToken(admin);

    res.json({
      message: "Password updated.",
      token
    });
  } catch (error) {
    next(error);
  }
});

export default router;
