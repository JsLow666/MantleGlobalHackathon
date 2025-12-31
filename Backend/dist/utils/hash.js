"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashContent = hashContent;
exports.hashObject = hashObject;
exports.createNewsContentHash = createNewsContentHash;
exports.createAnalysisHash = createAnalysisHash;
exports.generateRandomHash = generateRandomHash;
exports.isValidHash = isValidHash;
// src/utils/hash.ts
const ethers_1 = require("ethers");
const crypto_1 = __importDefault(require("crypto"));
/**
 * Hash content using Keccak256 (same as Solidity)
 */
function hashContent(content) {
    return ethers_1.ethers.keccak256(ethers_1.ethers.toUtf8Bytes(content));
}
/**
 * Hash object as JSON
 */
function hashObject(obj) {
    const jsonString = JSON.stringify(obj, Object.keys(obj).sort());
    return ethers_1.ethers.keccak256(ethers_1.ethers.toUtf8Bytes(jsonString));
}
/**
 * Create content hash from news data
 */
function createNewsContentHash(title, content, url) {
    const combined = `${title}${content}${url}`;
    return hashContent(combined);
}
/**
 * Create analysis hash
 */
function createAnalysisHash(score, verdict, timestamp) {
    return hashObject({ score, verdict, timestamp });
}
/**
 * Generate random hash (for testing)
 */
function generateRandomHash() {
    return ethers_1.ethers.hexlify(crypto_1.default.randomBytes(32));
}
/**
 * Verify hash format
 */
function isValidHash(hash) {
    return ethers_1.ethers.isHexString(hash, 32);
}
