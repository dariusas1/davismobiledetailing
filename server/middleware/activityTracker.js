import UserActivity from '../models/UserActivity.js';

export const trackActivity = (action) => async (req, res, next) => {
  try {
    if (!req.user) {
      return next();
    }

    const activity = new UserActivity({
      userId: req.user._id,
      action,
      details: {
        method: req.method,
        path: req.path,
        query: req.query,
        body: action.includes('PASSWORD') ? undefined : req.body // Don't log sensitive data
      },
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    // Don't wait for the activity to be saved
    activity.save().catch(err => console.error('Activity tracking error:', err));
    next();
  } catch (error) {
    console.error('Activity tracking error:', error);
    next(); // Continue even if tracking fails
  }
};

export const getActivityLogs = async (userId, startDate, endDate, action) => {
  try {
    const query = {};
    if (userId) query.userId = userId;
    if (action) query.action = action;
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const activities = await UserActivity.find(query)
      .sort({ timestamp: -1 })
      .populate('userId', 'name email')
      .lean();

    return activities;
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    throw error;
  }
}; 