/**
 * Notification model
 * - Stores small user-targeted notifications. `data` can reference related entities
 *   (for example { jobId: '...' }) to enable linking from the UI
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String },
  title: { type: String },
  message: { type: String },
  data: Schema.Types.Mixed,
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', NotificationSchema);
