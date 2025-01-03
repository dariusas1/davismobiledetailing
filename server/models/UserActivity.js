import mongoose from 'mongoose';

const userActivitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: ['LOGIN', 'LOGOUT', 'CREATE_BOOKING', 'UPDATE_BOOKING', 'DELETE_BOOKING', 'VIEW_DASHBOARD', 'EXPORT_REPORT', 'UPDATE_PROFILE']
  },
  details: {
    type: mongoose.Schema.Types.Mixed
  },
  ipAddress: String,
  userAgent: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient querying
userActivitySchema.index({ userId: 1, timestamp: -1 });
userActivitySchema.index({ action: 1, timestamp: -1 });

const UserActivity = mongoose.model('UserActivity', userActivitySchema);

export default UserActivity; 