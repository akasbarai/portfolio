import { Content } from "../models/Content.js";
import { defaultContent } from "../data/defaultContent.js";
import { isDatabaseReady } from "../config/db.js";
import { contentStorageFile, readJsonFile, writeJsonFile } from "./fileStore.js";

let cachedFileContent;

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function mergeMissingDefaults(defaultValue, savedValue) {
  if (savedValue === undefined || savedValue === null) return clone(defaultValue);

  if (Array.isArray(defaultValue)) {
    return Array.isArray(savedValue) ? savedValue : clone(defaultValue);
  }

  if (!isPlainObject(defaultValue)) return savedValue;
  if (!isPlainObject(savedValue)) return clone(defaultValue);

  const merged = { ...savedValue };
  Object.entries(defaultValue).forEach(([key, value]) => {
    merged[key] = mergeMissingDefaults(value, savedValue[key]);
  });

  return merged;
}

function normalizeContent(value) {
  return mergeMissingDefaults(defaultContent, value);
}

export async function ensureDefaultContent() {
  if (!isDatabaseReady()) {
    const storedContent = await readJsonFile(contentStorageFile, defaultContent);
    cachedFileContent = normalizeContent(storedContent);

    if (JSON.stringify(storedContent) !== JSON.stringify(cachedFileContent)) {
      await writeJsonFile(contentStorageFile, cachedFileContent);
    }

    return;
  }

  const storedContent = await readJsonFile(contentStorageFile, defaultContent);
  await Content.findOneAndUpdate(
    { slug: "portfolio" },
    {
      $setOnInsert: {
        slug: "portfolio",
        data: normalizeContent(storedContent),
        version: 1
      }
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
}

export async function getContent() {
  if (!isDatabaseReady()) {
    const storedContent = await readJsonFile(
      contentStorageFile,
      cachedFileContent || defaultContent
    );
    cachedFileContent = normalizeContent(storedContent);

    if (JSON.stringify(storedContent) !== JSON.stringify(cachedFileContent)) {
      await writeJsonFile(contentStorageFile, cachedFileContent);
    }

    return clone(cachedFileContent);
  }

  let content = await Content.findOne({ slug: "portfolio" }).lean();
  if (!content) {
    await ensureDefaultContent();
    content = await Content.findOne({ slug: "portfolio" }).lean();
  }

  return normalizeContent(content?.data || defaultContent);
}

export async function updateContent(nextContent, adminId) {
  if (!nextContent || typeof nextContent !== "object" || Array.isArray(nextContent)) {
    const error = new Error("Content payload must be an object.");
    error.status = 400;
    throw error;
  }

  if (!isDatabaseReady()) {
    cachedFileContent = normalizeContent(nextContent);
    await writeJsonFile(contentStorageFile, cachedFileContent);
    return clone(cachedFileContent);
  }

  const saved = await Content.findOneAndUpdate(
    { slug: "portfolio" },
    {
      $set: {
        data: normalizeContent(nextContent),
        updatedBy: adminId
      },
      $inc: { version: 1 }
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  ).lean();

  return saved.data;
}

export async function resetContent(adminId) {
  return updateContent(defaultContent, adminId);
}
