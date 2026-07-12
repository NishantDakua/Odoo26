import { UserRole } from '@prisma/client';

// ─── JWT ────────────────────────────────────────────────────────────────────

export interface JWTPayload {
  sub: string;        // user id
  email: string;
  name: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

// ─── User ────────────────────────────────────────────────────────────────────

/** User shape returned by /api/auth/me and stored in client state */
export interface SafeUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  lastLoginAt: Date | null;
}

// ─── API ─────────────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ─── Driver ──────────────────────────────────────────────────────────────────

export type DriverStatusType = 'AVAILABLE' | 'ON_TRIP' | 'OFF_DUTY' | 'SUSPENDED';
export type LicenseCategoryType = 'LMV' | 'HMV';

export interface DriverListItem {
  id: string;
  name: string;
  licenseNumber: string;
  licenseCategory: LicenseCategoryType;
  licenseExpiryDate: string; // ISO string
  contactNumber: string;
  safetyScore: number;
  status: DriverStatusType;
  isLicenseExpired: boolean;
  isLicenseExpiringSoon: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Settings ────────────────────────────────────────────────────────────────

export interface AppSettings {
  depotName: string;
  currency: 'INR' | 'USD' | 'EUR';
  distanceUnit: 'km' | 'miles';
}
