/**
 * Validation utility functions
 * Provides reusable validation logic for forms and inputs
 */
import { FILE_UPLOAD, VALIDATION_MESSAGES } from '../config/constants';

/**
 * Validate email format
 */
export function isEmail(value) {
  if (!value) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

/**
 * Check if string meets minimum length
 */
export function minLength(value, minLen) {
  if (typeof value !== 'string') return false;
  return value.length >= minLen;
}

/**
 * Validate password strength
 */
export function isValidPassword(password) {
  return minLength(password, 6);
}

/**
 * Validate file for upload
 */
export function fileIsValid(file) {
  if (!file) {
    return {
      ok: false,
      error: 'No file selected',
    };
  }

  // Check file type
  if (!FILE_UPLOAD.ALLOWED_TYPES.includes(file.type)) {
    return {
      ok: false,
      error: VALIDATION_MESSAGES.INVALID_FILE_TYPE,
    };
  }

  // Check file size
  if (file.size > FILE_UPLOAD.MAX_SIZE) {
    return {
      ok: false,
      error: VALIDATION_MESSAGES.FILE_TOO_LARGE,
    };
  }

  return { ok: true };
}

/**
 * Validate required field
 */
export function isRequired(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
}

/**
 * Validate phone number (Indian format)
 */
export function isValidPhone(phone) {
  if (!phone) return false;
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
}

/**
 * Validate URL format
 */
export function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Sanitize input string
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  return input.trim();
}

/**
 * Validate form data against rules
 */
export function validateForm(data, rules) {
  const errors = {};

  Object.keys(rules).forEach(field => {
    const value = data[field];
    const fieldRules = rules[field];

    // Required check
    if (fieldRules.required && !isRequired(value)) {
      errors[field] = fieldRules.message || VALIDATION_MESSAGES.REQUIRED;
      return;
    }

    // Skip other validations if field is empty and not required
    if (!value && !fieldRules.required) return;

    // Email validation
    if (fieldRules.email && !isEmail(value)) {
      errors[field] = VALIDATION_MESSAGES.INVALID_EMAIL;
    }

    // Min length validation
    if (fieldRules.minLength && !minLength(value, fieldRules.minLength)) {
      errors[field] = `Minimum ${fieldRules.minLength} characters required`;
    }

    // Custom validation
    if (fieldRules.custom && !fieldRules.custom(value)) {
      errors[field] = fieldRules.message || 'Invalid value';
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

