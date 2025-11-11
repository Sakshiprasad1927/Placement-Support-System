/**
 * Frontend application constants
 * Centralizes configuration values and magic strings
 */

export const ROLES = {
  STUDENT: 'student',
  COMPANY: 'company',
  ADMIN: 'admin',
};

export const APPLICATION_STATUS = {
  PENDING: 'pending',
  SHORTLISTED: 'shortlisted',
  REJECTED: 'rejected',
  HIRED: 'hired',
};

export const JOB_STATUS = {
  OPEN: 'open',
  CLOSED: 'closed',
};

export const REQUEST_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

export const NOTIFICATION_TYPES = {
  APPLICATION_STATUS: 'application_status',
  JOB_POSTED: 'job_posted',
  PROFILE_APPROVED: 'profile_approved',
  PROFILE_REJECTED: 'profile_rejected',
  GENERAL: 'general',
};

export const ROUTES = {
  HOME: '/',
  AUTH: '/auth',
  STUDENT_DASHBOARD: '/student',
  STUDENT_APPLICATIONS: '/student/applications',
  COMPANY_DASHBOARD: '/company',
  COMPANY_JOB_APPLICATIONS: '/company/jobs',
  ADMIN_DASHBOARD: '/admin',
};

export const STORAGE_KEYS = {
  TOKEN: 'token',
  ROLE: 'role',
  USER_ID: 'userId',
};

export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  ALLOWED_EXTENSIONS: ['.pdf', '.doc', '.docx'],
};

export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  PASSWORD_MIN_LENGTH: 'Password must be at least 6 characters',
  FILE_TOO_LARGE: 'File size must be less than 5MB',
  INVALID_FILE_TYPE: 'Only PDF, DOC, and DOCX files are allowed',
};

export const API_BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

export const STATUS_COLORS = {
  [APPLICATION_STATUS.PENDING]: 'yellow',
  [APPLICATION_STATUS.SHORTLISTED]: 'blue',
  [APPLICATION_STATUS.REJECTED]: 'red',
  [APPLICATION_STATUS.HIRED]: 'green',
};

export const STATUS_LABELS = {
  [APPLICATION_STATUS.PENDING]: 'Pending',
  [APPLICATION_STATUS.SHORTLISTED]: 'Shortlisted',
  [APPLICATION_STATUS.REJECTED]: 'Rejected',
  [APPLICATION_STATUS.HIRED]: 'Hired',
};
