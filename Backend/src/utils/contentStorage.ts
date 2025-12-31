// src/utils/contentStorage.ts
import { logger } from './logger';
import * as fs from 'fs';
import * as path from 'path';

interface StoredContent {
  content: string;
  title: string;
  sourceUrl: string;
  timestamp: string;
  hash: string;
}

// File-based persistent storage
const STORAGE_DIR = path.join(__dirname, '../../data');
const CONTENT_FILE = path.join(STORAGE_DIR, 'content.json');

// Ensure storage directory exists
if (!fs.existsSync(STORAGE_DIR)) {
  fs.mkdirSync(STORAGE_DIR, { recursive: true });
}

// Load content from file on startup
let contentStore = new Map<string, StoredContent>();
loadContentFromFile();

function loadContentFromFile(): void {
  try {
    if (fs.existsSync(CONTENT_FILE)) {
      const data = fs.readFileSync(CONTENT_FILE, 'utf8');
      const contentArray: StoredContent[] = JSON.parse(data);
      contentStore = new Map(contentArray.map(item => [item.hash, item]));
      logger.info(`📂 Loaded ${contentStore.size} stored content items from disk`);
    } else {
      logger.info('📂 No existing content file found, starting fresh');
    }
  } catch (error) {
    logger.error('❌ Failed to load content from file:', error);
    contentStore = new Map();
  }
}

function saveContentToFile(): void {
  try {
    const contentArray = Array.from(contentStore.values());
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(contentArray, null, 2));
  } catch (error) {
    logger.error('❌ Failed to save content to file:', error);
  }
}

export const storeContent = (hash: string, content: string, title: string, sourceUrl: string): void => {
  const storedContent: StoredContent = {
    content,
    title,
    sourceUrl,
    timestamp: new Date().toISOString(),
    hash
  };

  contentStore.set(hash, storedContent);
  saveContentToFile(); // Persist to disk
  logger.info('💾 Content stored and persisted', { hash, title });
};

export const getContent = (hash: string): StoredContent | null => {
  const content = contentStore.get(hash);
  if (content) {
    logger.info('📖 Content retrieved', { hash });
  } else {
    logger.warn('❌ Content not found', { hash });
  }
  return content || null;
};

export const getAllStoredHashes = (): string[] => {
  return Array.from(contentStore.keys());
};

export const getStorageStats = () => {
  return {
    totalItems: contentStore.size,
    storagePath: CONTENT_FILE,
    lastModified: fs.existsSync(CONTENT_FILE) ? fs.statSync(CONTENT_FILE).mtime.toISOString() : null
  };
};