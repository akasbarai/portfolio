import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { connectToDatabase, isDatabaseReady } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import contentRoutes from "./routes/content.js";
import messageRoutes from "./routes/messages.js";
import { ensureDefaultAdmin } from "./utils/admin.js";
import { ensureDefaultContent } from "./utils/contentStore.js";
import { getStorageDirectory } from "./utils/fileStore.js";

let initPromise;

function createApp() {
  const app = express();
  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

  app.use(
    helmet({
      crossOriginResourcePolicy: false
    })
  );
  app.use(
    cors({
      origin: [
        clientUrl,
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        /\.vercel\.app$/
      ],
      credentials: true
    })
  );
  app.use(express.json({ limit: "12mb" }));

  if (process.env.NODE_ENV !== "production") {
    app.use(morgan("dev"));
  }

  app.get("/api/health", (_req, res) => {
    res.json({
      ok: true,
      database: isDatabaseReady() ? "connected" : "fallback-file",
      storage: isDatabaseReady() ? "mongodb" : getStorageDirectory()
    });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/content", contentRoutes);
  app.use("/api/messages", messageRoutes);

  app.use((req, res) => {
    res.status(404).json({ message: `Route not found: ${req.method} ${req.path}` });
  });

  app.use((error, _req, res, _next) => {
    const status = error.status || 500;
    res.status(status).json({
      message: error.message || "Unexpected server error."
    });
  });

  return app;
}

export const app = createApp();

export function initializeApp() {
  if (!initPromise) {
    initPromise = connectToDatabase()
      .then(() => ensureDefaultContent())
      .then(() => ensureDefaultAdmin());
  }

  return initPromise;
}
