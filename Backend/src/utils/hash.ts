// src/utils/hash.ts
import { ethers } from 'ethers';
import crypto from 'crypto';

/**
 * Hash content using Keccak256 (same as Solidity)
 */
export function hashContent(content: string): string {
  return ethers.keccak256(ethers.toUtf8Bytes(content));
}

/**
 * Hash object as JSON
 */
export function hashObject(obj: any): string {
  const jsonString = JSON.stringify(obj, Object.keys(obj).sort());
  return ethers.keccak256(ethers.toUtf8Bytes(jsonString));
}

/**
 * Create content hash from news data
 */
export function createNewsContentHash(title: string, content: string, url: string): string {
  const combined = `${title}${content}${url}`;
  return hashContent(combined);
}

/**
 * Create analysis hash
 */
export function createAnalysisHash(
  score: number,
  verdict: string,
  timestamp: string
): string {
  return hashObject({ score, verdict, timestamp });
}

/**
 * Generate random hash (for testing)
 */
export function generateRandomHash(): string {
  return ethers.hexlify(crypto.randomBytes(32));
}

/**
 * Verify hash format
 */
export function isValidHash(hash: string): boolean {
  return ethers.isHexString(hash, 32);
}