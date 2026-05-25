import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import net from "net";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import rateLimit from "express-rate-limit";
import { z } from "zod";

// Load local environment variables
dotenv.config();
dotenv.config({ path: ".env.local", override: true });

const app = express();
const PORT = Number(process.env.PORT || 3000);
const HMR_PORT = Number(process.env.HMR_PORT || 24678);

app.use(express.json({ limit: "10mb" }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many authentication attempts. Please wait a few minutes and try again." }
});

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 12,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "AI request limit reached. Please pause briefly and try again." }
});

const uploadLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Upload limit reached. Please pause briefly and try again." }
});

// Create local uploads directory if not present
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
app.use("/uploads", express.static(UPLOADS_DIR));

// Persistent DB File Path inside backend directory
const DB_PATH = path.join(process.cwd(), "my-portfolio", "backend", "portfolio-db.json");

type AstrologyConsultationRecord = {
  id: string;
  question: string;
  answer: string;
  createdAt: string;
};

type AstrologyUserRecord = {
  id: string;
  name: string;
  email: string;
  password?: string;
  passwordHash?: string;
  birthdate: string;
  birthdateAd?: string;
  birthdateBs?: string;
  birthplace: string;
  birthtime: string;
  rasi?: string;
  isVerified: boolean;
  createdAt: string;
  consultations: AstrologyConsultationRecord[];
};

// Default showcase portfolio data
const DEFAULT_PORTFOLIO_DATA = {
  profile: {
    name: "Akash Prasad Barai",
    title: "Full-Stack Developer, UI/UX Designer & Astrology Portal Builder",
    bio: "Building modern web experiences, owner-editable CMS workflows, and practical AI-assisted tools from Lumbini, Nepal.",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    aboutText: "Hello! I am Akash Prasad Barai, a developer focused on responsive portfolio systems, CMS dashboards, clean UI/UX, and server-side AI integrations. I enjoy building interfaces that feel polished while staying useful, editable, and secure for real workflows.",
    skills: [
      "TypeScript",
      "React",
      "Node.js",
      "Express",
      "Tailwind CSS",
      "Google GenAI SDK",
      "Python",
      "Figma",
      "Responsive Design",
      "Astrology Portal Systems"
    ],
    socialLinks: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
      email: "akasbarai560@gmail.com"
    }
  },
  projects: [
    {
      id: "proj-1",
      title: "Personal Portfolio CMS",
      category: "Full-Stack Web App",
      description: "A responsive portfolio with an owner-only CMS, image uploads, SEO controls, and server-side AI writing helpers.",
      longDescription: "This portfolio CMS combines a polished public site with a protected editing console for projects, blogs, profile content, and media assets. The backend keeps Gemini calls server-side, signs owner sessions, validates requests, and persists local content safely for development workflows.",
      techStack: ["React", "Express", "Gemini API", "Tailwind CSS"],
      imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
      liveUrl: "",
      githubUrl: "",
      featured: true,
      createdAt: "2026-01-20"
    },
    {
      id: "proj-2",
      title: "Astrology Consultation Portal",
      category: "AI-Assisted Portal",
      description: "A verified astrology seeker workflow with registration, owner approval, email notifications, and AI-assisted consultations.",
      longDescription: "The astrology portal lets users register birth details, sign in securely, wait for owner verification, and submit consultation questions once approved. It now avoids plaintext password storage, returns sanitized user profiles, and uses signed session tokens for protected consultation access.",
      techStack: ["React", "Express", "Gemini API", "Nodemailer"],
      imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
      liveUrl: "",
      githubUrl: "",
      featured: true,
      createdAt: "2026-03-15"
    },
    {
      id: "proj-3",
      title: "Neumorphic CMS Interface",
      category: "UI / UX Design",
      description: "A soft-shadow dashboard system with responsive editing panels, media management, and portfolio previews.",
      longDescription: "The interface explores a neumorphic visual style across public portfolio sections and dense CMS controls. It focuses on readable forms, owner workflows, reusable upload controls, and responsive layouts that work across desktop and mobile screens.",
      techStack: ["React", "Tailwind CSS", "Lucide Icons", "Responsive Design"],
      imageUrl: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80",
      liveUrl: "",
      featured: false,
      createdAt: "2025-11-05"
    }
  ],
  blogs: [
    {
      id: "blog-1",
      title: "Designing Smart CMS Workflows with Server-Side Gemini API",
      excerpt: "Explore how backend-secured language models can elevate the CMS editor experience with smart suggestions and automated tagging.",
      content: `## The Evolution of Content Management Systems

Traditional content management platforms require creators to input metadata, choose tags, translate copy manually, and rewrite abstracts. By bringing server-side AI directly into the publication pipeline via the **Gemini API** on port 3000, we can streamline this complex workflow:

1. **Auto-Tagging**: Let the model read your markdown payload and return five distinct semantic tags.
2. **Text Refinement & Translation**: Provide an interactive "expand/compress" system directly in the text editor.
3. **Draft Starters**: Generate initial outlines based on keywords.

### Implementing in React + Node
Using the new \`@google/genai\` SDK on the server, setting up server-side AI is secure and standard:

\`\`\`ts
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const response = await ai.models.generateContent({
  model: 'gemini-3.5-flash',
  contents: "Summarize this article: ..."
});
\`\`\`

With server proxy routes, you ensure your key never leaks to the client! This is fundamental for modern web design.`,
      imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80",
      tags: ["AI", "Web Dev", "Gemini"],
      publishedAt: "2026-05-10",
      readTime: "4 min read",
      published: true
    },
    {
      id: "blog-2",
      title: "Building Fluid Bento Layouts",
      excerpt: "A deep dive into grid systems, rhythm, typography pairing, and visual density in custom portfolio websites.",
      content: `## Grid Alignment & Fluid Layouts

Bento grids have taken modern portfolio designs by storm. They provide structured, asymmetrical compartments to display different kinds of media like text blocks, charts, images, and tools.

### Why Bento Rules?
- **High-Density Display**: Showing multiple metrics (stats, social links, tools) without overwhelming vertical lists.
- **Micro-interactions**: Hover effects fit beautifully into defined visual boxes.
- **Visual Rhythm**: Balancing margins, tracking, and paddings.

### Tailwind Layout Recipes
To implement a beautiful dynamic bento on mobile, use a single column that elevates to a multi-column layout on larger screens:

\`\`\`html
<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
  <div class="md:col-span-2 p-6 bg-stone-50 rounded-2xl">
    <!-- Main spotlight card -->
  </div>
  <div class="p-6 bg-stone-50 rounded-2xl">
    <!-- Utility box -->
  </div>
</div>
\`\`\`
`,
      imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80",
      tags: ["Design", "TailwindCSS", "UX"],
      publishedAt: "2026-04-18",
      readTime: "6 min read",
      published: true
    }
  ],
  experiences: [
    {
      id: "exp-1",
      role: "Full-Stack Developer & CMS Builder",
      company: "Akash Portfolio Studio",
      period: "2024 - Present",
      description: "Building owner-editable portfolio systems, CMS workflows, secure Express APIs, and responsive React interfaces."
    },
    {
      id: "exp-2",
      role: "Frontend UI/UX Designer",
      company: "Freelance & Academic Projects",
      period: "2022 - 2024",
      description: "Designed and implemented responsive layouts, visual identity systems, and interactive web components for portfolio and dashboard experiences."
    }
  ],
  education: [
    {
      id: "edu-1",
      degree: "Computer Science & Web Development",
      institution: "Self-directed Study and Coursework",
      period: "2022 - Present"
    }
  ]
};

type PortfolioStore = typeof DEFAULT_PORTFOLIO_DATA & {
  astrologyUsers: AstrologyUserRecord[];
  schemaVersion?: number;
};

type PublicPortfolioData = Omit<PortfolioStore, "astrologyUsers" | "schemaVersion">;

type SanitizedAstrologyUser = Omit<AstrologyUserRecord, "password" | "passwordHash">;

const schemaVersion = 2;

const ownerLoginSchema = z.object({
  password: z.string().min(1).max(256)
});

const uploadSchema = z.object({
  name: z.string().min(1).max(180),
  base64: z.string().min(1)
});

const portfolioSchema = z.object({
  profile: z.object({
    name: z.string().min(1).max(120),
    title: z.string().min(1).max(160),
    bio: z.string().min(1).max(800),
    avatarUrl: z.string().min(1).max(2000),
    aboutText: z.string().min(1).max(5000),
    skills: z.array(z.string().min(1).max(80)).max(80),
    socialLinks: z.object({
      github: z.string().max(2000).optional(),
      linkedin: z.string().max(2000).optional(),
      twitter: z.string().max(2000).optional(),
      email: z.string().max(254).optional()
    }),
    seo: z.object({
      metaTitle: z.string().max(160),
      metaDescription: z.string().max(320),
      metaKeywords: z.string().max(500)
    }).optional()
  }),
  projects: z.array(z.any()).max(100),
  blogs: z.array(z.any()).max(100),
  experiences: z.array(z.any()).max(100),
  education: z.array(z.any()).max(100)
});

const astrologyRegisterSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  password: z.string().min(8).max(256),
  birthdate: z.string().min(1).max(32),
  birthplace: z.string().trim().min(1).max(160),
  birthtime: z.string().min(1).max(20),
  rasi: z.string().max(80).optional(),
  birthdateAd: z.string().max(32).optional(),
  birthdateBs: z.string().max(40).optional()
});

const astrologyLoginSchema = z.object({
  email: z.string().trim().email().max(254),
  birthdate: z.string().min(1).max(40),
  password: z.string().min(1).max(256)
});

const astrologyConsultSchema = z.object({
  question: z.string().trim().min(1).max(2000)
});

const astrologyUserActionSchema = z.object({
  userId: z.string().min(1).max(120)
});

const astrologyVerifySchema = astrologyUserActionSchema.extend({
  verify: z.boolean()
});

const geminiBlogSchema = z.object({
  title: z.string().min(1).max(180),
  keywords: z.string().max(500).optional(),
  targetLength: z.string().max(8).optional(),
  tone: z.string().max(120).optional()
});

const geminiProjectSchema = z.object({
  title: z.string().min(1).max(180),
  description: z.string().min(1).max(2000),
  techStack: z.union([z.array(z.string().max(80)), z.string().max(500)]).optional()
});

const geminiBioSchema = z.object({
  name: z.string().max(120).optional(),
  title: z.string().max(160).optional(),
  skills: z.union([z.array(z.string().max(80)), z.string().max(500)]).optional(),
  focusArea: z.string().max(300).optional()
});

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET must be set to at least 32 characters.");
  }
  return secret;
}

function signToken(payload: Record<string, unknown>) {
  const encodedPayload = Buffer.from(JSON.stringify(payload), "utf-8").toString("base64url");
  const signature = crypto
    .createHmac("sha256", getSessionSecret())
    .update(encodedPayload)
    .digest("base64url");
  return `${encodedPayload}.${signature}`;
}

function verifyToken(token: unknown) {
  if (typeof token !== "string" || !token.includes(".")) {
    return null;
  }

  const [encodedPayload, signature] = token.split(".");
  const expected = crypto
    .createHmac("sha256", getSessionSecret())
    .update(encodedPayload)
    .digest("base64url");

  const signatureBytes = Buffer.from(signature);
  const expectedBytes = Buffer.from(expected);
  if (
    signatureBytes.length !== expectedBytes.length ||
    !crypto.timingSafeEqual(signatureBytes, expectedBytes)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf-8"));
    if (typeof payload.exp === "number" && payload.exp < Date.now()) {
      return null;
    }
    return payload as { sub: string; scope: string; exp: number };
  } catch {
    return null;
  }
}

function createOwnerToken() {
  return signToken({
    sub: "owner",
    scope: "owner",
    exp: Date.now() + 1000 * 60 * 60 * 8
  });
}

function createAstrologyToken(userId: string) {
  return signToken({
    sub: userId,
    scope: "astrology",
    exp: Date.now() + 1000 * 60 * 60 * 24 * 14
  });
}

function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("base64url");
  const hash = crypto.scryptSync(password, salt, 64).toString("base64url");
  return `scrypt:${salt}:${hash}`;
}

function verifyPassword(password: string, storedHash: string) {
  const [scheme, salt, hash] = storedHash.split(":");
  if (scheme !== "scrypt" || !salt || !hash) {
    return false;
  }

  const attempted = crypto.scryptSync(password, salt, 64).toString("base64url");
  const attemptedBytes = Buffer.from(attempted);
  const hashBytes = Buffer.from(hash);
  return attemptedBytes.length === hashBytes.length && crypto.timingSafeEqual(attemptedBytes, hashBytes);
}

function parseBody<T>(
  schema: z.ZodSchema<T>,
  req: express.Request,
  res: express.Response
): T | null {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: parsed.error.issues[0]?.message || "Invalid request body."
    });
    return null;
  }
  return parsed.data;
}

function sanitizeAstrologyUser(user: AstrologyUserRecord): SanitizedAstrologyUser {
  const { password, passwordHash, ...safeUser } = user;
  return safeUser;
}

function toPublicPortfolioData(data: PortfolioStore): PublicPortfolioData {
  const { astrologyUsers, schemaVersion, ...publicData } = data;
  return publicData;
}

function normalizePortfolioData(raw: any): PortfolioStore {
  return {
    ...DEFAULT_PORTFOLIO_DATA,
    ...raw,
    astrologyUsers: Array.isArray(raw?.astrologyUsers) ? raw.astrologyUsers : [],
    schemaVersion
  };
}

const allowedImageMimeTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const imageExtensionsByMime: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif"
};
const maxUploadBytes = 8 * 1024 * 1024;

function detectImageMime(buffer: Buffer): string | null {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return "image/png";
  }
  if (
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "image/webp";
  }
  if (buffer.length >= 6 && ["GIF87a", "GIF89a"].includes(buffer.toString("ascii", 0, 6))) {
    return "image/gif";
  }
  return null;
}

function isPortAvailable(port: number) {
  return new Promise<boolean>((resolve) => {
    const probe = net.createServer();
    probe.once("error", () => resolve(false));
    probe.once("listening", () => {
      probe.close(() => resolve(true));
    });
    probe.listen(port, "0.0.0.0");
  });
}

async function assertPortAvailable(port: number, label: string) {
  const available = await isPortAvailable(port);
  if (!available) {
    console.error(`${label} port ${port} is already in use. Stop the existing dev server or change ${label === "App" ? "PORT" : "HMR_PORT"} in .env.local.`);
    process.exit(1);
  }
}

// Help load/write DB
function loadPortfolioData(): PortfolioStore {
  try {
    // Ensure the parent directory for DB exists
    const dbDir = path.dirname(DB_PATH);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    
    if (fs.existsSync(DB_PATH)) {
      const fileData = fs.readFileSync(DB_PATH, "utf-8");
      const parsed = JSON.parse(fileData);
      return normalizePortfolioData(parsed);
    }
  } catch (err) {
    console.error("Error reading database file, using fallback:", err);
  }
  
  // Write default on initialization
  const defaultData = normalizePortfolioData({});
  savePortfolioData(defaultData);
  return defaultData;
}

function savePortfolioData(data: PortfolioStore) {
  try {
    const dbDir = path.dirname(DB_PATH);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    const normalized = normalizePortfolioData(data);
    const tempPath = `${DB_PATH}.${process.pid}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(normalized, null, 2));
    fs.renameSync(tempPath, DB_PATH);
  } catch (err) {
    console.error("Error writing portfolio db to disk:", err);
  }
}

// Lazy-initialized Gemini Client
let googleGenAI: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI {
  if (!googleGenAI) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is not set. Please set it in Settings > Secrets.");
    }
    googleGenAI = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        }
      }
    });
  }
  return googleGenAI;
}

// --- API Endpoints ---

// Auth validation middleware
function checkAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const token = req.headers["x-owner-token"];
  const payload = verifyToken(token);
  if (payload?.scope === "owner") {
    next();
  } else {
    res.status(401).json({ error: "Access denied. Please authenticate into Akash's Portal first." });
  }
}

// POST Verify Admin Portal Passcode
app.post("/api/auth/verify", authLimiter, (req, res) => {
  const body = parseBody(ownerLoginSchema, req, res);
  if (!body) return;

  const { password } = body;
  const correctPassword = process.env.OWNER_PORTAL_PASSWORD;
  if (!correctPassword) {
    return res.status(500).json({ error: "OWNER_PORTAL_PASSWORD is not configured on the server." });
  }

  if (password === correctPassword) {
    return res.json({ success: true, token: createOwnerToken() });
  } else {
    return res.status(401).json({ error: "Invalid owner passcode inside Akash's Portal challenge." });
  }
});

app.get("/api/auth/session", checkAuth, (req, res) => {
  res.json({ success: true });
});

// POST Upload generic photo file (saves inside public/uploads)
app.post("/api/portfolio/upload", uploadLimiter, checkAuth, (req, res) => {
  const body = parseBody(uploadSchema, req, res);
  if (!body) return;

  const { name, base64 } = body;

  try {
    const matches = base64.match(/^data:([A-Za-z0-9.+/-]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: "Invalid base64 string format pointer." });
    }

    const claimedMime = matches[1].toLowerCase();
    if (!allowedImageMimeTypes.has(claimedMime)) {
      return res.status(400).json({ error: "Only JPG, PNG, WebP, and GIF images are allowed." });
    }

    const fileBuffer = Buffer.from(matches[2], "base64");
    if (fileBuffer.length > maxUploadBytes) {
      return res.status(413).json({ error: "Image is larger than the 8MB upload limit." });
    }

    const detectedMime = detectImageMime(fileBuffer);
    if (!detectedMime || detectedMime !== claimedMime) {
      return res.status(400).json({ error: "Uploaded file content does not match its image type." });
    }

    const baseName = path.parse(name).name.replace(/[^a-zA-Z0-9.\-_]/g, "_").slice(0, 80) || "upload";
    const safeName = `${Date.now()}_${crypto.randomBytes(6).toString("hex")}_${baseName}${imageExtensionsByMime[detectedMime]}`;
    const filePath = path.join(process.cwd(), "public", "uploads", safeName);

    fs.writeFileSync(filePath, fileBuffer);
    res.json({ success: true, url: `/uploads/${safeName}` });
  } catch (err) {
    console.error("Base64 write error:", err);
    res.status(500).json({ error: "Failed to write photo asset to disk inside Akash's portal." });
  }
});

// GET Retrieve list of all uploaded photo URLs in local library
app.get("/api/portfolio/uploads", checkAuth, (req, res) => {
  try {
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      return res.json({ files: [] });
    }
    const files = fs.readdirSync(uploadsDir);
    // Filter only standard image formats
    const imageFiles = files
      .filter((file) => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .map((file) => `/uploads/${file}`);
    res.json({ files: imageFiles });
  } catch (err) {
    console.error("Failed to read uploads library:", err);
    res.status(500).json({ error: "Failed to retrieve the local photos assets library." });
  }
});

// POST Delete an uploaded photo from disk
app.post("/api/portfolio/uploads/delete", checkAuth, (req, res) => {
  const { url } = req.body;
  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "Missing photo file URL path." });
  }

  try {
    const filename = path.basename(url);
    const filePath = path.join(process.cwd(), "public", "uploads", filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return res.json({ success: true, message: "File deleted successfully on disk." });
    } else {
      return res.status(404).json({ error: "Photo file not found on server disk." });
    }
  } catch (err) {
    console.error("Failed to delete file:", err);
    res.status(500).json({ error: "Failed to erase photo from disk assets." });
  }
});



// Check if Gemini is configured (for client badge feedback)
app.get("/api/gemini/status", (req, res) => {
  res.json({ configured: !!process.env.GEMINI_API_KEY });
});

// GET Portfolio Data
app.get("/api/portfolio", (req, res) => {
  const data = loadPortfolioData();
  res.json(toPublicPortfolioData(data));
});

// POST Save Portfolio Data
app.post("/api/portfolio", checkAuth, (req, res) => {
  const body = parseBody(portfolioSchema, req, res);
  if (!body) return;

  const existing = loadPortfolioData();
  const data = normalizePortfolioData({
    ...body,
    astrologyUsers: existing.astrologyUsers
  });
  savePortfolioData(data);
  res.json({ success: true, message: "Portfolio saved successfully." });
});

// POST Reset Portfolio Data
app.post("/api/portfolio/reset", checkAuth, (req, res) => {
  const existing = loadPortfolioData();
  const resetData = normalizePortfolioData({
    ...DEFAULT_PORTFOLIO_DATA,
    astrologyUsers: existing.astrologyUsers
  });
  savePortfolioData(resetData);
  res.json({ success: true, message: "Portfolio successfully reset to default.", data: toPublicPortfolioData(resetData) });
});

// AI Blog generation proxy
app.post("/api/gemini/generate-blog", aiLimiter, checkAuth, async (req, res) => {
  const body = parseBody(geminiBlogSchema, req, res);
  if (!body) return;

  const { title, keywords, targetLength, tone } = body;

  try {
    const ai = getGemini();
    const prompt = `Write a high-quality blog post draft with the title: "${title}".
Keywords to weave in: ${keywords || "none"}.
Desired tone: ${tone || "Professional and tech-forward"}.
Output format: Output *only* raw Markdown with headings (##), lists, and formatted paragraphs. Do not wrap in backticks or markdown fences unless writing code blocks inside the text. Keep it around ${targetLength || "400"} words.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert tech blogger, copywriter, and software architect. Write clear, structured, engaging tech articles."
      }
    });

    const body = response.text || "Failed to generate blog text.";
    res.json({ content: body });
  } catch (error) {
    console.error("Gemini Blog Generation Error:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Internal AI call failed" });
  }
});

// AI Project Refiner proxy
app.post("/api/gemini/refine-project", aiLimiter, checkAuth, async (req, res) => {
  const body = parseBody(geminiProjectSchema, req, res);
  if (!body) return;

  const { title, description, techStack } = body;

  try {
    const ai = getGemini();
    const prompt = `Refine the following project details to sound highly professional, impressive, and clear for a software engineer portfolio.
Project Title: ${title}
Technologies: ${Array.isArray(techStack) ? techStack.join(", ") : techStack}
Raw Description: ${description}

Respond with a JSON object in this exact format, with no extra formatting or markdown wrapping:
{
  "refinedShort": "A 1-2 sentence snappy marketing hook description.",
  "refinedLong": "A detailed 4-5 sentence description detailing challenges solved, architectural decisions, and impact.",
  "suggestedTags": ["Tag1", "Tag2", "Tag3"]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        systemInstruction: "You are a professional resume writer and engineering talent scout. Refine technical project details to demonstrate high impact."
      }
    });

    try {
      const jsonText = response.text?.trim() || "{}";
      const cleaned = JSON.parse(jsonText);
      res.json(cleaned);
    } catch (parseErr) {
      // In case formatting fails, fallback to clean raw response parse (sometimes models wrap in ```json ... ```)
      let text = response.text?.trim() || "";
      if (text.startsWith("```json")) {
        text = text.substring(7, text.length - 3).trim();
      } else if (text.startsWith("```")) {
        text = text.substring(3, text.length - 3).trim();
      }
      res.json(JSON.parse(text));
    }
  } catch (error) {
    console.error("Gemini Project Refinement Error:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Internal AI call failed" });
  }
});

// AI Bio Generator proxy
app.post("/api/gemini/generate-bio", aiLimiter, checkAuth, async (req, res) => {
  const body = parseBody(geminiBioSchema, req, res);
  if (!body) return;

  const { name, title, skills, focusArea } = body;
  try {
    const ai = getGemini();
    const prompt = `Draft a compelling, 3-sentence professional bio tagline for a developer homepage.
Name: ${name || "A developer"}
Current Title: ${title || "Software Engineer"}
Primary Skills: ${Array.isArray(skills) ? skills.join(", ") : "Web design"}
Focus/Vibe: ${focusArea || "highly technical and clean UX"}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "Write sharp, punchy, high-impact introductory bio lines."
      }
    });

    res.json({ bio: response.text?.trim() || "" });
  } catch (error) {
    console.error("Gemini Bio Generation Error:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Internal AI call failed" });
  }
});


// ==========================================
// --- Astro Astrology Portal Helper Functions ---
// ==========================================

async function sendVerificationEmail(user: any) {
  const host = process.env.EMAIL_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.EMAIL_PORT || "587", 10);
  const user_email = process.env.EMAIL_USER || "";
  const pass = process.env.EMAIL_PASS || "";

  console.log(`[Email Service Triggered] Attempting to send verification email to: ${user.email}`);

  if (!user_email || !pass) {
    const consoleMsg = `
======================================================================
SIMULATED ACK MAIL TO USER'S GMAIL (To provide real emails, configure EMAIL_USER & EMAIL_PASS in Secrets):
To: ${user.email}
Subject: Cosmic Awakening: Your Astrology Profile has been Verified!

Dear ${user.name},

Pranam! We are delighted to inform you that your cosmic birth configurations have been carefully analyzed, verified, and activated by Astrology Guru, Akash Prasad Barai.

Your account in the Astrologer & Celestial Finder Portal is now fully active!

Account Information:
- Seeker Name: ${user.name}
- Registered Gmail: ${user.email}
- Birth Date (AD): ${user.birthdateAd || user.birthdate}
- Birth Date (BS): ${user.birthdateBs || "Synced Live"}
- Birth Place: ${user.birthplace}
- Birth Time: ${user.birthtime}
- Lunar Rasi: ${user.rasi || "Unknown"}

You can now sign in at the astrology portal using your registered Gmail, Date of Birth, and Password.

Wishing you celestial alignment, wisdom, and cosmic prosperity.

Peace & Light,
Akash Prasad Barai
Astrology Portal Team
======================================================================
`;
    console.log(consoleMsg);
    return;
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user: user_email,
      pass
    }
  });

  const mailOptions = {
    from: `"Akash Prasad Barai (Astrology Guru)" <${user_email}>`,
    to: user.email,
    subject: "Cosmic Awakening: Your Astrology Profile has been Verified!",
    text: `
Pranam ${user.name},

We are delighted to inform you that your cosmic birth configurations have been carefully analyzed, verified, and activated by Astrology Guru, Akash Prasad Barai.

Your account in the Astrologer & Celestial Finder Portal is now fully active!

Verified Seeker Profile Details:
- Name: ${user.name}
- Registered Gmail: ${user.email}
- Birth Date (AD): ${user.birthdateAd || user.birthdate}
- Birth Date (BS): ${user.birthdateBs || "Synced Auto"}
- Birth Time: ${user.birthtime}
- Birth Place: ${user.birthplace}
- Lunar Rasi: ${user.rasi || "Unknown"}

You can now sign in to the portal with your registered Gmail, Birth Date, and Password to unlock:
1. Personalized astrological consultations
2. Interactive planetary alignment readings
3. Direct mentoring answers with Jyotishi Akash Prasad Barai

Wishing you divine guidance and cosmic prosperity.

Warmest regards,
Akash Prasad Barai
Astrologer & Celestial Finder Portal Team
    `,
    html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #faf9f6; color: #334155;">
        <div style="text-align: center; border-bottom: 2px solid #818cf8; padding-bottom: 15px; margin-bottom: 20px;">
          <h2 style="color: #4f46e5; margin: 0; font-size: 22px; text-transform: uppercase; letter-spacing: 1px;">Astrologer & Celestial Finder Portal</h2>
          <p style="font-size: 11px; color: #64748b; margin: 5px 0 0 0;">Akash Prasad Barai - Spiritual Mentoring & Astrology</p>
        </div>
        
        <p style="font-size: 14px; line-height: 1.6;">Pranam <strong>${user.name}</strong>,</p>
        
        <p style="font-size: 14px; line-height: 1.6;">We are delighted to inform you that your cosmic birth configurations have been carefully analyzed, verified, and activated by Astrology Guru, <strong>Akash Prasad Barai</strong>.</p>
        
        <p style="font-size: 14px; line-height: 1.6; background-color: #f1f5f9; padding: 12px; border-left: 4px solid #4f46e5; border-radius: 4px; font-weight: bold; color: #1e1b4b; text-align: center;">
          Your account is now fully active!
        </p>

        <h3 style="color: #4f46e5; font-size: 15px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; margin-top: 25px;">Verified Account Details</h3>
        <table style="width: 100%; font-size: 13px; border-collapse: collapse; margin-top: 10px;">
          <tr>
            <td style="padding: 6px 0; color: #64748b; width: 35%;"><strong>Seeker Name:</strong></td>
            <td style="padding: 6px 0; color: #1e293b;">${user.name}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;"><strong>Registered Gmail:</strong></td>
            <td style="padding: 6px 0; color: #1e293b; font-family: monospace;">${user.email}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;"><strong>Birth Date (AD):</strong></td>
            <td style="padding: 6px 0; color: #1e293b;">${user.birthdateAd || user.birthdate}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;"><strong>Birth Date (BS):</strong></td>
            <td style="padding: 6px 0; color: #1e293b; color: #7c3aed;">${user.birthdateBs || "Synced Auto"}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;"><strong>Birth Time:</strong></td>
            <td style="padding: 6px 0; color: #1e293b;">${user.birthtime}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;"><strong>Birth Place:</strong></td>
            <td style="padding: 6px 0; color: #1e293b;">${user.birthplace}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;"><strong>Sidereal Lunar Rasi:</strong></td>
            <td style="padding: 6px 0; color: #7c3aed;"><strong>${user.rasi || "Unknown"}</strong></td>
          </tr>
        </table>

        <div style="margin: 25px 0; padding: 15px; background-color: #eef2ff; border-radius: 12px; border: 1px solid #c7d2fe; text-align: center;">
          <p style="margin: 0; font-size: 13px; font-weight: bold; color: #3730a3;">Ready to embark on your cosmic journey?</p>
          <p style="margin: 5px 0 12px 0; font-size: 12px; color: #4338ca;">You can now sign in using your registered Gmail (Email), Birth Date, and Password to consult the AI Guru.</p>
        </div>

        <p style="font-size: 13px; line-height: 1.5; margin-top: 30px;">
          Wishing you celestial alignment, divine grace, and cosmic prosperity.<br/><br/>
          Peace & Light,<br/>
          <strong>Akash Prasad Barai</strong><br/>
          <span style="color: #64748b; font-size: 11px;">Owner, Astrologer & Celestial Finder Portal Team</span>
        </p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
  console.log(`[Email Service Success] Verification email successfully sent to: ${user.email}`);
}

function getAstrologyUserFromRequest(req: express.Request, data: PortfolioStore) {
  const token = req.headers["x-astrology-token"];
  const payload = verifyToken(token);
  if (payload?.scope !== "astrology" || !payload.sub) {
    return { user: null, index: -1 };
  }

  const index = data.astrologyUsers.findIndex((user) => user.id === payload.sub);
  return {
    user: index >= 0 ? data.astrologyUsers[index] : null,
    index
  };
}

// ==========================================
// --- Astro Astrology Portal API Endpoints ---
// ==========================================

// Register a new astronomy astrology profile
app.post("/api/astrology/register", authLimiter, (req, res) => {
  const body = parseBody(astrologyRegisterSchema, req, res);
  if (!body) return;

  const { name, email, password, birthdate, birthplace, birthtime, rasi, birthdateAd, birthdateBs } = body;

  try {
    const data = loadPortfolioData();
    // Check if matching account already exists by email (case-insensitive)
    const existing = data.astrologyUsers.find(
      (u) => u.email && u.email.toLowerCase() === email.toLowerCase()
    );

    if (existing) {
      return res.status(400).json({ error: "An account with this Gmail / Email address already exists. Try signing in!" });
    }

    const newUser = {
      id: "user_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
      name,
      email: email.trim(),
      passwordHash: hashPassword(password),
      birthdate,
      birthdateAd: birthdateAd || birthdate,
      birthdateBs: birthdateBs || "",
      birthplace,
      birthtime,
      rasi: rasi || "Unknown",
      isVerified: false,
      createdAt: new Date().toISOString(),
      consultations: []
    };

    data.astrologyUsers.push(newUser);
    savePortfolioData(data);

    res.json({ success: true, user: sanitizeAstrologyUser(newUser) });
  } catch (err) {
    console.error("Astrology registration error:", err);
    res.status(500).json({ error: "Failed to create your astrology account." });
  }
});

// Login using email, birthdate, and password combination
app.post("/api/astrology/login", authLimiter, (req, res) => {
  const body = parseBody(astrologyLoginSchema, req, res);
  if (!body) return;

  const { email, birthdate, password } = body;

  try {
    const data = loadPortfolioData();
    const userIndex = data.astrologyUsers.findIndex(
      (u) => u.email && u.email.toLowerCase() === email.toLowerCase() && (
        u.birthdate === birthdate ||
        u.birthdateAd === birthdate ||
        u.birthdateBs === birthdate
      )
    );

    if (userIndex === -1) {
      return res.status(404).json({ error: "Invalid credentials. No astrology account found matching this Gmail, Birth Date, and Password." });
    }

    const user = data.astrologyUsers[userIndex];
    const isPasswordValid = user.passwordHash
      ? verifyPassword(password, user.passwordHash)
      : user.password === password;

    if (!isPasswordValid) {
      return res.status(404).json({ error: "Invalid credentials. No astrology account found matching this Gmail, Birth Date, and Password." });
    }

    if (!user.passwordHash) {
      user.passwordHash = hashPassword(password);
      delete user.password;
      data.astrologyUsers[userIndex] = user;
      savePortfolioData(data);
    }

    res.json({ success: true, user: sanitizeAstrologyUser(user), token: createAstrologyToken(user.id) });
  } catch (err) {
    console.error("Astrology login error:", err);
    res.status(500).json({ error: "Failed to sign into the astrology portal." });
  }
});

app.get("/api/astrology/me", (req, res) => {
  try {
    const data = loadPortfolioData();
    const { user } = getAstrologyUserFromRequest(req, data);
    if (!user) {
      return res.status(401).json({ error: "Astrology session expired. Please sign in again." });
    }
    res.json({ success: true, user: sanitizeAstrologyUser(user) });
  } catch (err) {
    console.error("Astrology session refresh error:", err);
    res.status(500).json({ error: "Failed to refresh astrology profile." });
  }
});

// Submit a consultation question (User must be verified!)
app.post("/api/astrology/consult", aiLimiter, async (req, res) => {
  const body = parseBody(astrologyConsultSchema, req, res);
  if (!body) return;

  const { question } = body;

  try {
    const data = loadPortfolioData();
    const { user, index: userIndex } = getAstrologyUserFromRequest(req, data);

    if (!user || userIndex === -1) {
      return res.status(404).json({ error: "Cosmic profile not found." });
    }

    if (!user.isVerified) {
      return res.status(403).json({ 
        error: "Your profile is still pending verification by Akash. Consultations are unlocked once Akash verifies your details inside the Owner Portal." 
      });
    }

    // Call Gemini to generate a personalized astrological analysis
    let answer = "Astrological channels are currently loading...";
    try {
      const ai = getGemini();
      const prompt = `You are a Vedic Astrology Guru Companion. Synthesize a high-fidelity astrological consultation.
Seeker Profile:
- Name: ${user.name}
- Birth Date: ${user.birthdate}
- Birth Time: ${user.birthtime}
- Birth Place: ${user.birthplace}
- Rasi (Zodiac / Lunar Sign): ${user.rasi || "Unknown"}

Seeker's Psychological/Cosmic Inquiry:
"${question}"

Provide an insightful, authentic, and highly personalized Vedic/Sidereal readings incorporating traditional themes like solar and lunar houses, planetary aspects, nakshatras, and a deep answer to their inquiry. Show warmth, clarity, predictive guidance, and wisdom. Speak to them as their spiritual mentor using direct, compassionate statements. Format using beautiful, structured Markdown paragraphs.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are an experienced, compassionate Vedic astrologer (Jyotishi) who provides deep spiritual, career, and personal guidance based on sacred cosmic patterns."
        }
      });

      answer = response.text || "The stars are quiet at this hour. Please try again soon.";
    } catch (aiErr: any) {
      console.error("Gemini Astrology Consultation Error:", aiErr);
      answer = `[Solar Transit Note] The Astrology Guru is currently offline, but here is a planetary analysis: Based on your rasi ${user.rasi || 'Unknown'} and birth details, you are entering a phase of reflection and cosmic search. (The server-side Gemini AI API suffered an operational limit, but your question "${question}" was securely processed).`;
    }

    const newConsultation = {
      id: "consult_" + Date.now(),
      question,
      answer,
      createdAt: new Date().toISOString()
    };

    if (!user.consultations) {
      user.consultations = [];
    }
    user.consultations.push(newConsultation);
    
    // Save updated user back to DB
    data.astrologyUsers[userIndex] = user;
    savePortfolioData(data);

    res.json({ success: true, consultation: newConsultation, user: sanitizeAstrologyUser(user) });
  } catch (err) {
    console.error("Astrology consultation error:", err);
    res.status(500).json({ error: "Could not fetch celestial alignments." });
  }
});

// Admin-Only: Retrieve all astrology users
app.get("/api/astrology/users", checkAuth, (req, res) => {
  try {
    const data = loadPortfolioData();
    res.json({ success: true, users: data.astrologyUsers.map(sanitizeAstrologyUser) });
  } catch (err) {
    console.error("Error reading astrology list:", err);
    res.status(500).json({ error: "Failed to load astrology profiles." });
  }
});

// Admin-Only: Verify or Unverify an astrology user
app.post("/api/astrology/verify", checkAuth, async (req, res) => {
  const body = parseBody(astrologyVerifySchema, req, res);
  if (!body) return;

  const { userId, verify } = body;

  try {
    const data = loadPortfolioData();
    const userIndex = data.astrologyUsers.findIndex((u) => u.id === userId);

    if (userIndex === undefined || userIndex === -1) {
      return res.status(404).json({ error: "Target astrology user account not found." });
    }

    const previousStatus = data.astrologyUsers[userIndex].isVerified;
    data.astrologyUsers[userIndex].isVerified = !!verify;
    
    const user = data.astrologyUsers[userIndex];
    savePortfolioData(data);

    let emailSentStatus = "none";
    if (!!verify && !previousStatus && user.email) {
      try {
        await sendVerificationEmail(user);
        emailSentStatus = "sent";
      } catch (mailErr: any) {
        console.error("Failed to send verification email:", mailErr);
        emailSentStatus = "failed: " + mailErr.message;
      }
    }

    res.json({ success: true, user: sanitizeAstrologyUser(user), emailSent: emailSentStatus });
  } catch (err) {
    console.error("Error verifying user:", err);
    res.status(500).json({ error: "Failed to perform verification on disk." });
  }
});

// Admin-Only: Delete an astrology user profile
app.post("/api/astrology/delete", checkAuth, (req, res) => {
  const body = parseBody(astrologyUserActionSchema, req, res);
  if (!body) return;

  const { userId } = body;

  try {
    const data = loadPortfolioData();
    const initialLength = data.astrologyUsers.length;
    data.astrologyUsers = data.astrologyUsers.filter((u) => u.id !== userId);

    if (data.astrologyUsers.length === initialLength) {
      return res.status(404).json({ error: "Account mapping not found, cannot delete." });
    }

    savePortfolioData(data);
    res.json({ success: true, message: "Astro profile erased from local system index." });
  } catch (err) {
    console.error("Error deleting astro user:", err);
    res.status(500).json({ error: "Failed to erase astrology user." });
  }
});

// Create and serve Vite app or Static dist folder
async function startServer() {
  await assertPortAvailable(PORT, "App");
  if (process.env.NODE_ENV !== "production" && process.env.DISABLE_HMR !== "true") {
    await assertPortAvailable(HMR_PORT, "HMR");
  }

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR === "true" ? false : { port: HMR_PORT }
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is booted! Standard port: ${PORT}`);
  });

  server.on("error", (error: NodeJS.ErrnoException) => {
    if (error.code === "EADDRINUSE") {
      console.error(`Port ${PORT} is already in use. Stop the existing dev server or run with a different PORT value.`);
      process.exit(1);
    }
    throw error;
  });
}

startServer();
