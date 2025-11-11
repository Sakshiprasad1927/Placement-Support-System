/**
 * Application-wide constants
 * Centralizes magic strings and configuration values
 */

const ROLES = {
  STUDENT: 'student',
  COMPANY: 'company',
  ADMIN: 'admin',
};

const APPLICATION_STATUS = {
  PENDING: 'pending',
  SHORTLISTED: 'shortlisted',
  REJECTED: 'rejected',
  HIRED: 'hired',
};

const JOB_STATUS = {
  OPEN: 'open',
  CLOSED: 'closed',
};

const REQUEST_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

const NOTIFICATION_TYPES = {
  APPLICATION_STATUS: 'application_status',
  JOB_POSTED: 'job_posted',
  PROFILE_APPROVED: 'profile_approved',
  PROFILE_REJECTED: 'profile_rejected',
  GENERAL: 'general',
};

const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: {
    RESUME: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  },
};

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
};

module.exports = {
  ROLES,
  APPLICATION_STATUS,
  JOB_STATUS,
  REQUEST_STATUS,
  NOTIFICATION_TYPES,
  FILE_UPLOAD,
  HTTP_STATUS,
};
