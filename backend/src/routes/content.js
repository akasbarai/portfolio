import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { getContent, resetContent, updateContent } from "../utils/contentStore.js";

const router = express.Router();

router.get("/", async (_req, res, next) => {
  try {
    res.json(await getContent());
  } catch (error) {
    next(error);
  }
});

router.put("/", requireAuth, async (req, res, next) => {
  try {
    const saved = await updateContent(req.body, req.admin?.sub);
    res.json(saved);
  } catch (error) {
    next(error);
  }
});

router.post("/reset", requireAuth, async (req, res, next) => {
  try {
    const saved = await resetContent(req.admin?.sub);
    res.json(saved);
  } catch (error) {
    next(error);
  }
});

export default router;
