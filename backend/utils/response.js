/**
 * Response helper utilities
 * Standardizes API response formats
 */
const { HTTP_STATUS } = require('../config/constants');

class ApiResponse {
  /**
   * Send success response
   */
  static success(res, data = {}, message = 'Success', statusCode = HTTP_STATUS.OK) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  /**
   * Send error response
   */
  static error(res, message = 'Error occurred', statusCode = HTTP_STATUS.BAD_REQUEST, errors = null) {
    const response = {
      success: false,
      message,
    };
    
    if (errors) {
      response.errors = errors;
    }
    
    return res.status(statusCode).json(response);
  }

  /**
   * Send validation error response
   */
  static validationError(res, errors) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  /**
   * Send unauthorized response
   */
  static unauthorized(res, message = 'Unauthorized access') {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message,
    });
  }

  /**
   * Send forbidden response
   */
  static forbidden(res, message = 'Access forbidden') {
    return res.status(HTTP_STATUS.FORBIDDEN).json({
      success: false,
      message,
    });
  }

  /**
   * Send not found response
   */
  static notFound(res, message = 'Resource not found') {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message,
    });
  }
}

module.exports = ApiResponse;
