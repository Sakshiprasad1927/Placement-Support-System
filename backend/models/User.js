/**
 * User model
 * - Represents both students and companies (and admin users)
 * - For students, the `profile` subdocument holds academic/personal info and resume path
 * - Passwords are stored as hashed values in `passwordHash`
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Embedded profile schema used for student users
const ProfileSchema = new Schema({
  name: String,
  rollNumber: String,
  branch: String,
  cgpa: Number,
  skills: [String],
  phone: String,
  resumePath: String, // file path to uploaded resume (relative to /uploads)
  certificates: [String]
});

const UserSchema = new Schema({
  // Authentication
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },

  // Role-based access
  role: { type: String, enum: ['student','company','admin'], required: true },
  isVerified: { type: Boolean, default: false },
  companyVerified: { type: Boolean, default: false }, // for companies

  // Profile data for students
  profile: ProfileSchema,
  profileLocked: { type: Boolean, default: false },

  // Metadata and auditing
  createdAt: { type: Date, default: Date.now },
  metadata: Schema.Types.Mixed,
  emailVerificationToken: String
});

module.exports = mongoose.model('User', UserSchema);
