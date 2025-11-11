/**
 * Authentication & Authorization middleware
 * - requireAuth: verifies JWT from Authorization header and loads user into req.user
 * - requireRole: checks that the authenticated user has one of the allowed roles
 */
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiResponse = require('../utils/response');
const { HTTP_STATUS, ROLES } = require('../config/constants');
const { asyncHandler } = require('./errorHandler');

/**
 * Extract token from Authorization header
 */
const extractToken = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  
  return parts[1];
};

/**
 * Middleware: requireAuth
 * - Expects header: Authorization: Bearer <token>
 * - Verifies token and attaches `req.user` (without password) for downstream handlers
 */
const requireAuth = asyncHandler(async (req, res, next) => {
  const token = extractToken(req);
  
  if (!token) {
    return ApiResponse.unauthorized(res, 'No authentication token provided');
  }

  try {
    // Verify token signature and expiry
    const jwtSecret = process.env.JWT_SECRET || 'change_this_secret';
    const payload = jwt.verify(token, jwtSecret);
    
    // Load the user from DB and strip sensitive fields
    const user = await User.findById(payload.id).select('-passwordHash');
    
    if (!user) {
      return ApiResponse.unauthorized(res, 'User not found');
    }
    
    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return ApiResponse.unauthorized(res, 'Token expired');
    }
    return ApiResponse.unauthorized(res, 'Invalid token');
  }
});

/**
 * Middleware factory: requireRole(roles)
 * - Returns middleware that allows only users whose `user.role` is included in `roles`
 * - Example: requireRole([ROLES.ADMIN])
 */
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return ApiResponse.unauthorized(res);
    }
    
    if (!roles.includes(req.user.role)) {
      return ApiResponse.forbidden(res, 'You do not have permission to access this resource');
    }
    
    next();
  };
};

module.exports = {
  requireAuth,
  requireRole,
  ROLES,
};
