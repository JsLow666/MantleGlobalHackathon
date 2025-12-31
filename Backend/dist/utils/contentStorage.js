"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStorageStats = exports.getAllStoredHashes = exports.getContent = exports.storeContent = void 0;
// src/utils/contentStorage.ts
const logger_1 = require("./logger");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
// File-based persistent storage
const STORAGE_DIR = path.join(__dirname, '../../data');
const CONTENT_FILE = path.join(STORAGE_DIR, 'content.json');
// Ensure storage directory exists
if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true });
}
// Load content from file on startup
let contentStore = new Map();
loadContentFromFile();
function loadContentFromFile() {
    try {
        if (fs.existsSync(CONTENT_FILE)) {
            const data = fs.readFileSync(CONTENT_FILE, 'utf8');
            const contentArray = JSON.parse(data);
            contentStore = new Map(contentArray.map(item => [item.hash, item]));
            logger_1.logger.info(`📂 Loaded ${contentStore.size} stored content items from disk`);
        }
        else {
            logger_1.logger.info('📂 No existing content file found, starting fresh');
        }
    }
    catch (error) {
        logger_1.logger.error('❌ Failed to load content from file:', error);
        contentStore = new Map();
    }
}
function saveContentToFile() {
    try {
        const contentArray = Array.from(contentStore.values());
        fs.writeFileSync(CONTENT_FILE, JSON.stringify(contentArray, null, 2));
    }
    catch (error) {
        logger_1.logger.error('❌ Failed to save content to file:', error);
    }
}
const storeContent = (hash, content, title, sourceUrl) => {
    const storedContent = {
        content,
        title,
        sourceUrl,
        timestamp: new Date().toISOString(),
        hash
    };
    contentStore.set(hash, storedContent);
    saveContentToFile(); // Persist to disk
    logger_1.logger.info('💾 Content stored and persisted', { hash, title });
};
exports.storeContent = storeContent;
const getContent = (hash) => {
    const content = contentStore.get(hash);
    if (content) {
        logger_1.logger.info('📖 Content retrieved', { hash });
    }
    else {
        logger_1.logger.warn('❌ Content not found', { hash });
    }
    return content || null;
};
exports.getContent = getContent;
const getAllStoredHashes = () => {
    return Array.from(contentStore.keys());
};
exports.getAllStoredHashes = getAllStoredHashes;
const getStorageStats = () => {
    return {
        totalItems: contentStore.size,
        storagePath: CONTENT_FILE,
        lastModified: fs.existsSync(CONTENT_FILE) ? fs.statSync(CONTENT_FILE).mtime.toISOString() : null
    };
};
exports.getStorageStats = getStorageStats;
