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

const app = express();
const port = process.env.PORT || 5000;
const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
);
app.use(
  cors({
    origin: [clientUrl, "http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true
  })
);
app.use(express.json({ limit: "12mb" }));
app.use(morgan("dev"));

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

await connectToDatabase();
await ensureDefaultContent();
await ensureDefaultAdmin();

app.listen(port, () => {
  console.log(`Portfolio API running on http://localhost:${port}`);
});
