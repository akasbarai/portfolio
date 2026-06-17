import express from "express";
import { isDatabaseReady } from "../config/db.js";
import { requireAuth } from "../middleware/auth.js";
import { Message } from "../models/Message.js";
import { messageStorageFile, readJsonFile, writeJsonFile } from "../utils/fileStore.js";

const router = express.Router();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isServerless = Boolean(process.env.VERCEL);

function cleanText(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

function validateMessagePayload(payload = {}) {
  const entry = {
    name: cleanText(payload.name, 120),
    email: cleanText(payload.email, 200).toLowerCase(),
    phone: cleanText(payload.phone, 80),
    message: cleanText(payload.message, 5000)
  };

  if (!entry.name || !entry.email || !entry.message) {
    const error = new Error("Name, email, and message are required.");
    error.status = 400;
    throw error;
  }

  if (!emailPattern.test(entry.email)) {
    const error = new Error("Please provide a valid email address.");
    error.status = 400;
    throw error;
  }

  return entry;
}

async function readStoredMessages() {
  const messages = await readJsonFile(messageStorageFile, []);
  return Array.isArray(messages) ? messages : [];
}

async function writeStoredMessages(messages) {
  await writeJsonFile(messageStorageFile, messages);
}

function requirePersistentMessageStore() {
  if (isServerless && !isDatabaseReady()) {
    const error = new Error("MongoDB is required to store messages on Vercel.");
    error.status = 503;
    throw error;
  }
}

router.post("/", async (req, res, next) => {
  try {
    const payload = validateMessagePayload(req.body);

    if (!isDatabaseReady()) {
      requirePersistentMessageStore();
      const messages = await readStoredMessages();
      const entry = {
        _id: crypto.randomUUID(),
        ...payload,
        status: "new",
        source: "portfolio",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      messages.unshift(entry);
      await writeStoredMessages(messages.slice(0, 500));
      return res.status(201).json({ message: "Message received.", entry });
    }

    const entry = await Message.create(payload);
    res.status(201).json({ message: "Message received.", entry });
  } catch (error) {
    next(error);
  }
});

router.get("/", requireAuth, async (_req, res, next) => {
  try {
    if (!isDatabaseReady()) return res.json(await readStoredMessages());

    const messages = await Message.find().sort({ createdAt: -1 }).lean();
    res.json(messages);
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", requireAuth, async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!["new", "read", "archived"].includes(status)) {
      return res.status(400).json({ message: "Invalid message status." });
    }

    if (!isDatabaseReady()) {
      requirePersistentMessageStore();
      const messages = await readStoredMessages();
      const index = messages.findIndex((entry) => entry._id === req.params.id);

      if (index === -1) {
        return res.status(404).json({ message: "Message not found." });
      }

      messages[index] = {
        ...messages[index],
        status,
        updatedAt: new Date().toISOString()
      };
      await writeStoredMessages(messages);
      return res.json(messages[index]);
    }

    const entry = await Message.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).lean();

    if (!entry) return res.status(404).json({ message: "Message not found." });

    res.json(entry);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    if (!isDatabaseReady()) {
      requirePersistentMessageStore();
      const messages = await readStoredMessages();
      const nextMessages = messages.filter((entry) => entry._id !== req.params.id);

      if (nextMessages.length === messages.length) {
        return res.status(404).json({ message: "Message not found." });
      }

      await writeStoredMessages(nextMessages);
      return res.status(204).send();
    }

    const entry = await Message.findByIdAndDelete(req.params.id);
    if (!entry) return res.status(404).json({ message: "Message not found." });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
