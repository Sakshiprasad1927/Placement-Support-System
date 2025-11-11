/**
 * ProfileEditRequest model
 * - Stores student profile edit requests for admin approval
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfileEditRequestSchema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  requestedChanges: {
    name: String,
    rollNumber: String,
    branch: String,
    cgpa: Number,
    skills: [String],
    phone: String
  },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  adminComments: String,
  reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  reviewedAt: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ProfileEditRequest', ProfileEditRequestSchema);
