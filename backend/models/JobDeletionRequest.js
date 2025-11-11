/**
 * JobDeletionRequest model
 * - Created when a company deletes a job and provides a reason
 * - Admins can review these requests and add comments or mark them finished
 * - Consider adding `jobTitle` snapshot so admins can view the title after the job is deleted
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JobDeletionRequestSchema = new Schema({
  jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
  jobTitle: { type: String },
  companyId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  reason: { type: String },
  otherReason: { type: String },
  numApplications: { type: Number, default: 0 },
  status: { type: String, enum: ['ongoing','finished'], default: 'ongoing' },
  comments: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update `updatedAt` on save
JobDeletionRequestSchema.pre('save', function(next){ this.updatedAt = Date.now(); next(); });

module.exports = mongoose.model('JobDeletionRequest', JobDeletionRequestSchema);
