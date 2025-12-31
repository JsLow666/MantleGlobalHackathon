// src/utils/validation.ts
import { z } from 'zod';

/**
 * Schema for analyze request (backend only does AI analysis)
 */
const analyzeRequestSchema = z.object({
  content: z.string().min(50).max(50000),
  title: z.string().min(1).max(200),
  sourceUrl: z.string().url().max(500)
});

/**
 * Validate analyze request body
 */
export function validateAnalyzeRequest(data: any): {
  success: boolean;
  errors?: string[];
  data?: any;
} {
  try {
    const validated = analyzeRequestSchema.parse(data);
    return {
      success: true,
      data: validated
    };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.issues.map(err => `${err.path.join('.')}: ${err.message}`)
      };
    }
    return {
      success: false,
      errors: ['Invalid request format']
    };
  }
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Sanitize user input
 */
export function sanitizeInput(input: string): string {
  // Remove potentially dangerous characters
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .trim();
}

/**
 * Validate content hash format
 */
export function isValidContentHash(hash: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(hash);
}