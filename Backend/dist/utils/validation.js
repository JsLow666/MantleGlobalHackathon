"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAnalyzeRequest = validateAnalyzeRequest;
exports.isValidUrl = isValidUrl;
exports.sanitizeInput = sanitizeInput;
exports.isValidContentHash = isValidContentHash;
// src/utils/validation.ts
const zod_1 = require("zod");
/**
 * Schema for analyze request (backend only does AI analysis)
 */
const analyzeRequestSchema = zod_1.z.object({
    content: zod_1.z.string().min(50).max(50000),
    title: zod_1.z.string().min(1).max(200),
    sourceUrl: zod_1.z.string().url().max(500)
});
/**
 * Validate analyze request body
 */
function validateAnalyzeRequest(data) {
    try {
        const validated = analyzeRequestSchema.parse(data);
        return {
            success: true,
            data: validated
        };
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
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
function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    }
    catch {
        return false;
    }
}
/**
 * Sanitize user input
 */
function sanitizeInput(input) {
    // Remove potentially dangerous characters
    return input
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
        .trim();
}
/**
 * Validate content hash format
 */
function isValidContentHash(hash) {
    return /^0x[a-fA-F0-9]{64}$/.test(hash);
}
