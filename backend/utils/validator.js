/**
 * Input validation helpers
 * Centralizes common validation logic
 */

class Validator {
  /**
   * Validate email format
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate password strength
   * Minimum 6 characters for now, can be enhanced
   */
  static isValidPassword(password) {
    return typeof password === 'string' && password.length >= 6;
  }

  /**
   * Validate required fields
   */
  static validateRequired(fields, data) {
    const errors = {};
    
    fields.forEach(field => {
      if (!data[field] || (typeof data[field] === 'string' && !data[field].trim())) {
        errors[field] = `${field} is required`;
      }
    });
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * Validate enum value
   */
  static isValidEnum(value, validValues) {
    return validValues.includes(value);
  }

  /**
   * Sanitize string input
   */
  static sanitizeString(str) {
    if (typeof str !== 'string') return str;
    return str.trim();
  }

  /**
   * Validate phone number (basic validation)
   */
  static isValidPhone(phone) {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  }

  /**
   * Validate URL format
   */
  static isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}

module.exports = Validator;
