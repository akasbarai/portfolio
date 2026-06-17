import express from "express";
import { authenticateAdmin, signAdminToken } from "../utils/admin.js";

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

export default router;
