import { Feedback, User } from '../models/index.js';
import logger from '../config/logger.js';

// Submit feedback
export const submitFeedback = async (req, res) => {
    try {
        const {
            type,
            category,
            title,
            description,
            priority,
            attachments,
            rating,
            meta
        } = req.body;

        const feedback = new Feedback({
            user: req.user.id,
            type,
            category,
            title,
            description,
            priority,
            attachments,
            rating,
            meta
        });

        await feedback.save();

        // TODO: Send notification to admin about new feedback

        res.status(201).json({
            success: true,
            data: feedback
        });
    } catch (error) {
        logger.error('Error submitting feedback:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting feedback'
        });
    }
};

// Get user's feedback
export const getUserFeedback = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const feedback = await Feedback.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip((page - 1) * limit);

        const total = await Feedback.countDocuments({ user: req.user.id });

        res.status(200).json({
            success: true,
            data: feedback,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                page: parseInt(page),
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        logger.error('Error getting user feedback:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching feedback'
        });
    }
};

// Add response to feedback
export const addResponse = async (req, res) => {
    try {
        const { message } = req.body;
        const feedback = await Feedback.findById(req.params.id);

        if (!feedback) {
            return res.status(404).json({
                success: false,
                message: 'Feedback not found'
            });
        }

        await feedback.addResponse(req.user.id, message, req.user.role === 'admin');

        res.status(200).json({
            success: true,
            data: feedback
        });
    } catch (error) {
        logger.error('Error adding response:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding response'
        });
    }
};

// Admin: Get all feedback
export const getAllFeedback = async (req, res) => {
    try {
        const {
            type,
            category,
            status,
            priority,
            page = 1,
            limit = 10
        } = req.query;

        const query = {};
        if (type) query.type = type;
        if (category) query.category = category;
        if (status) query.status = status;
        if (priority) query.priority = priority;

        const feedback = await Feedback.find(query)
            .populate('user', 'name email')
            .populate('responses.user', 'name email role')
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip((page - 1) * limit);

        const total = await Feedback.countDocuments(query);

        res.status(200).json({
            success: true,
            data: feedback,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                page: parseInt(page),
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        logger.error('Error getting all feedback:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching feedback'
        });
    }
};

// Admin: Update feedback status
export const updateFeedbackStatus = async (req, res) => {
    try {
        const { status, note } = req.body;
        const feedback = await Feedback.findById(req.params.id);

        if (!feedback) {
            return res.status(404).json({
                success: false,
                message: 'Feedback not found'
            });
        }

        await feedback.updateStatus(status, req.user.id, note);

        res.status(200).json({
            success: true,
            data: feedback
        });
    } catch (error) {
        logger.error('Error updating feedback status:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating feedback status'
        });
    }
};

// Get feedback statistics
export const getFeedbackStats = async (req, res) => {
    try {
        const [typeStats, categoryStats, priorityStats, statusStats] = await Promise.all([
            Feedback.aggregate([
                {
                    $group: {
                        _id: '$type',
                        count: { $sum: 1 },
                        avgRating: { $avg: '$rating' }
                    }
                }
            ]),
            Feedback.aggregate([
                {
                    $group: {
                        _id: '$category',
                        count: { $sum: 1 }
                    }
                }
            ]),
            Feedback.aggregate([
                {
                    $group: {
                        _id: '$priority',
                        count: { $sum: 1 }
                    }
                }
            ]),
            Feedback.aggregate([
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 }
                    }
                }
            ])
        ]);

        res.status(200).json({
            success: true,
            data: {
                byType: typeStats,
                byCategory: categoryStats,
                byPriority: priorityStats,
                byStatus: statusStats
            }
        });
    } catch (error) {
        logger.error('Error getting feedback stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching feedback statistics'
        });
    }
}; 