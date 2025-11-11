/**
 * Job model
 * - Represents a job/opportunity posted by a company user
 * - `companyId` references the posting company (User with role 'company')
 * - Eligibility filters (cgpaCutoff, eligibleBranches, requiredSkills) are kept simple arrays/numbers
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JobSchema = new Schema({
  companyId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: String,
  description: String,
  ctc: String,
  location: String,
  role: String,
  // Eligibility criteria
  cgpaCutoff: { type: Number, default: 0 },
  eligibleBranches: [String],
  requiredSkills: [String],
  rounds: [String],
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  // Recruitment status
  recruitmentStatus: { 
    type: String, 
    enum: ['active', 'completed', 'closed'], 
    default: 'active' 
  },
  closureReason: String,
  closedAt: Date,
  hiredCount: Number
});

module.exports = mongoose.model('Job', JobSchema);
