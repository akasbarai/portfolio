import "dotenv/config";
import mongoose from "mongoose";
import { connectToDatabase } from "./config/db.js";
import { ensureDefaultAdmin } from "./utils/admin.js";
import { resetContent } from "./utils/contentStore.js";

await connectToDatabase();
await resetContent();
await ensureDefaultAdmin();
await mongoose.disconnect();

console.log("Portfolio content seeded.");
