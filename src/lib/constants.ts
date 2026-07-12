// Auth
export const LOCK_THRESHOLD = 5; // failed attempts before account lock
export const LOCK_DURATION_MINUTES = 30;

// JWT
export const JWT_COOKIE_NAME = 'transitops_token';
export const JWT_EXPIRY_DEFAULT = '24h'; // session
export const JWT_EXPIRY_REMEMBER = '30d'; // remember me

// Safety score bounds
export const SAFETY_SCORE_MIN = 0;
export const SAFETY_SCORE_MAX = 100;

// License expiry warning threshold (days)
export const LICENSE_EXPIRY_WARNING_DAYS = 30;
