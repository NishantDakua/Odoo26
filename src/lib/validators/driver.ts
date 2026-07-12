import { z } from 'zod';

// ─── Shared ──────────────────────────────────────────────────────────────────

const DriverStatusEnum = z.enum(['AVAILABLE', 'ON_TRIP', 'OFF_DUTY', 'SUSPENDED']);
const LicenseCategoryEnum = z.enum(['LMV', 'HMV']);

// ─── Create ──────────────────────────────────────────────────────────────────

export const CreateDriverSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name too long')
    .trim(),
  licenseNumber: z
    .string({ required_error: 'License number is required' })
    .min(1, 'License number is required')
    .max(50, 'License number too long')
    .trim()
    .toUpperCase(),
  licenseCategory: LicenseCategoryEnum,
  licenseExpiryDate: z
    .string({ required_error: 'License expiry date is required' })
    .refine((v) => !isNaN(Date.parse(v)), 'Invalid date format'),
  contactNumber: z
    .string({ required_error: 'Contact number is required' })
    .min(7, 'Contact number too short')
    .max(20, 'Contact number too long')
    .trim(),
  safetyScore: z
    .number({ required_error: 'Safety score is required', invalid_type_error: 'Safety score must be a number' })
    .int('Safety score must be a whole number')
    .min(0, 'Safety score must be at least 0')
    .max(100, 'Safety score cannot exceed 100')
    .default(100),
  status: DriverStatusEnum.default('AVAILABLE'),
});

export type CreateDriverInput = z.infer<typeof CreateDriverSchema>;

// ─── Update ──────────────────────────────────────────────────────────────────

export const UpdateDriverSchema = CreateDriverSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field must be provided' }
);

export type UpdateDriverInput = z.infer<typeof UpdateDriverSchema>;

// ─── Patch Status ─────────────────────────────────────────────────────────────

export const PatchStatusSchema = z.object({
  status: DriverStatusEnum,
});

export type PatchStatusInput = z.infer<typeof PatchStatusSchema>;

// ─── List Query ───────────────────────────────────────────────────────────────

export const DriverListQuerySchema = z.object({
  status: DriverStatusEnum.optional(),
  licenseCategory: LicenseCategoryEnum.optional(),
  licenseValid: z
    .string()
    .optional()
    .transform((v: string | undefined) => v === 'true'),
  search: z.string().optional(),
  page: z
    .string()
    .optional()
    .transform((v: string | undefined) => (v ? parseInt(v, 10) : 1)),
  limit: z
    .string()
    .optional()
    .transform((v: string | undefined) => (v ? parseInt(v, 10) : 50)),
});

export type DriverListQuery = z.infer<typeof DriverListQuerySchema>;
