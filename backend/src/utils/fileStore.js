import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const storageDirectory = fileURLToPath(new URL("../../storage/", import.meta.url));
const isServerless = Boolean(process.env.VERCEL);

export const contentStorageFile = fileURLToPath(
  new URL("../../storage/content.json", import.meta.url)
);

export const messageStorageFile = fileURLToPath(
  new URL("../../storage/messages.json", import.meta.url)
);

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

async function ensureStorage(filePath) {
  await mkdir(dirname(filePath), { recursive: true });
}

export async function readJsonFile(filePath, fallbackValue) {
  try {
    const raw = await readFile(filePath, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.warn(`Could not read ${filePath}. Recreating it from defaults.`);
      console.warn(error.message);
    }

    const fallback = clone(fallbackValue);
    if (isServerless) return fallback;

    await writeJsonFile(filePath, fallback);
    return fallback;
  }
}

export async function writeJsonFile(filePath, value) {
  await ensureStorage(filePath);
  const tempPath = `${filePath}.tmp`;
  await writeFile(tempPath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  await rename(tempPath, filePath);
}

export function getStorageDirectory() {
  return storageDirectory;
}
