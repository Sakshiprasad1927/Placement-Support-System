/**
 * Application model
 * - Each document represents a student's application to a job posting
 * - `resumeSnapshotPath` can be used to store a copy/path of the resume at application time
 * - `status` reflects the current stage of the application
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ApplicationSchema = new Schema({
  jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  resumeSnapshotPath: String,
  status: { type: String, enum: ['Applied','Shortlisted','Rejected','Selected'], default: 'Applied' },
  appliedAt: { type: Date, default: Date.now },
  notes: String
});

module.exports = mongoose.model('Application', ApplicationSchema);
