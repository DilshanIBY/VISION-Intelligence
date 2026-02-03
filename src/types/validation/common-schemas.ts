/**
 * Common validation schemas and utilities
 * @module types/validation/common-schemas
 * @see PRD §6.1
 */

import { z } from 'zod';

// ============================================================================
// Basic Type Schemas
// ============================================================================

/**
 * UUID validation schema
 */
export const uuidSchema = z.string().uuid('Invalid UUID format');

/**
 * Non-empty string schema
 */
export const nonEmptyStringSchema = z.string().min(1, 'This field is required');

/**
 * Email validation schema
 */
export const emailSchema = z.string().email('Invalid email format');

/**
 * Password validation schema (min 8 chars, at least 1 letter and 1 number)
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-zA-Z]/, 'Password must contain at least one letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

// ============================================================================
// Date Schemas
// ============================================================================

/**
 * Date string or Date object schema
 */
export const dateSchema = z.coerce.date();

/**
 * Future date validation (date must be >= today)
 */
export const futureDateSchema = z.coerce
  .date()
  .refine(date => date >= new Date(new Date().setHours(0, 0, 0, 0)), 'Date cannot be in the past');

/**
 * ISO date string schema
 */
export const isoDateStringSchema = z.string().datetime();

// ============================================================================
// Numeric Schemas
// ============================================================================

/**
 * Positive integer schema (> 0)
 */
export const positiveIntSchema = z.number().int().positive('Must be a positive integer');

/**
 * Non-negative integer schema (>= 0)
 */
export const nonNegativeIntSchema = z.number().int().nonnegative('Must be zero or positive');

/**
 * Positive number schema (> 0)
 */
export const positiveNumberSchema = z.number().positive('Must be a positive number');

/**
 * Percentage schema (0.0 - 1.0)
 */
export const percentageSchema = z
  .number()
  .min(0, 'Percentage must be at least 0')
  .max(1, 'Percentage must be at most 1');

/**
 * Efficiency factor schema (0.5 - 1.0)
 * @see PRD §6.1
 */
export const efficiencySchema = z
  .number()
  .min(0.5, 'Efficiency must be at least 50%')
  .max(1.0, 'Efficiency must be at most 100%');

/**
 * Working hours schema (0.5 - 24)
 * @see PRD §6.1
 */
export const workingHoursSchema = z
  .number()
  .min(0.5, 'Working hours must be at least 0.5')
  .max(24, 'Working hours must be at most 24');

// ============================================================================
// Pagination Schemas
// ============================================================================

/**
 * Pagination query parameters schema
 */
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
  cursor: z.string().optional(),
});

/**
 * Sort parameters schema
 */
export const sortSchema = z.object({
  sortBy: z.string().optional(),
  sortDirection: z.enum(['asc', 'desc']).optional().default('asc'),
});

/**
 * Combined list query parameters schema
 */
export const listQuerySchema = paginationSchema.merge(sortSchema).extend({
  search: z.string().optional(),
});

// ============================================================================
// Type Exports
// ============================================================================

export type UUID = z.infer<typeof uuidSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type SortInput = z.infer<typeof sortSchema>;
export type ListQueryInput = z.infer<typeof listQuerySchema>;
