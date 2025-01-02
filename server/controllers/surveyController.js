import SurveyResponse from '../models/SurveyResponse.js';
import Booking from '../models/Booking.js';
import { sendEmail } from '../utils/email.js';
import logger from '../config/logger.js';

// Create new survey for a booking
export const createSurvey = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const booking = await Booking.findById(bookingId)
            .populate('service')
            .populate('user');

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Check if survey already exists
        const existingSurvey = await SurveyResponse.findOne({ booking: bookingId });
        if (existingSurvey) {
            return res.status(400).json({
                success: false,
                message: 'Survey already exists for this booking'
            });
        }

        const survey = new SurveyResponse({
            booking: bookingId,
            user: booking.user._id,
            service: booking.service._id
        });

        await survey.save();

        // Send survey email to customer
        await sendEmail({
            to: booking.user.email,
            subject: 'Please Share Your Feedback',
            template: 'surveyRequest',
            data: {
                userName: booking.user.name,
                serviceName: booking.service.name,
                surveyLink: `${process.env.CLIENT_URL}/survey/${survey._id}`
            }
        });

        res.status(201).json({
            success: true,
            data: survey
        });
    } catch (error) {
        logger.error('Error creating survey:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating survey'
        });
    }
};

// Submit survey response
export const submitSurvey = async (req, res) => {
    try {
        const { surveyId } = req.params;
        const {
            ratings,
            feedback,
            satisfaction,
            serviceSpecific,
            photos,
            isPublic
        } = req.body;

        const survey = await SurveyResponse.findById(surveyId);

        if (!survey) {
            return res.status(404).json({
                success: false,
                message: 'Survey not found'
            });
        }

        if (survey.status === 'completed') {
            return res.status(400).json({
                success: false,
                message: 'Survey has already been completed'
            });
        }

        // Update survey with response
        survey.ratings = ratings;
        survey.feedback = feedback;
        survey.satisfaction = satisfaction;
        survey.serviceSpecific = serviceSpecific;
        survey.photos = photos;
        survey.isPublic = isPublic;
        survey.status = 'completed';
        survey.completedAt = new Date();

        await survey.analyzeSentiment();
        await survey.save();

        // Send thank you email
        await sendEmail({
            to: req.user.email,
            subject: 'Thank You for Your Feedback',
            template: 'surveyThankYou',
            data: {
                userName: req.user.name,
                loyaltyPoints: 50 // Add points for completing survey
            }
        });

        res.status(200).json({
            success: true,
            data: survey
        });
    } catch (error) {
        logger.error('Error submitting survey:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting survey'
        });
    }
};

// Get survey by ID
export const getSurvey = async (req, res) => {
    try {
        const survey = await SurveyResponse.findById(req.params.surveyId)
            .populate('booking')
            .populate('service')
            .populate('user', 'name email');

        if (!survey) {
            return res.status(404).json({
                success: false,
                message: 'Survey not found'
            });
        }

        res.status(200).json({
            success: true,
            data: survey
        });
    } catch (error) {
        logger.error('Error getting survey:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching survey'
        });
    }
};

// Get all surveys for a user
export const getUserSurveys = async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        const query = { user: req.user.id };

        if (status) query.status = status;

        const surveys = await SurveyResponse.find(query)
            .populate('booking')
            .populate('service')
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip((page - 1) * limit);

        const total = await SurveyResponse.countDocuments(query);

        res.status(200).json({
            success: true,
            data: surveys,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                page: parseInt(page),
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        logger.error('Error getting user surveys:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching surveys'
        });
    }
};

// Admin: Get all surveys
export const getAllSurveys = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            status,
            rating,
            startDate,
            endDate
        } = req.query;

        const query = {};
        if (status) query.status = status;
        if (rating) query['ratings.overall'] = parseInt(rating);
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        const surveys = await SurveyResponse.find(query)
            .populate('booking')
            .populate('service')
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip((page - 1) * limit);

        const total = await SurveyResponse.countDocuments(query);

        res.status(200).json({
            success: true,
            data: surveys,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                page: parseInt(page),
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        logger.error('Error getting all surveys:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching surveys'
        });
    }
};

// Admin: Add response to survey
export const addAdminResponse = async (req, res) => {
    try {
        const { content } = req.body;
        const survey = await SurveyResponse.findById(req.params.surveyId);

        if (!survey) {
            return res.status(404).json({
                success: false,
                message: 'Survey not found'
            });
        }

        survey.adminResponse = {
            content,
            respondedBy: req.user.id,
            respondedAt: new Date()
        };

        await survey.save();

        // Notify customer of response
        await sendEmail({
            to: survey.user.email,
            subject: 'Response to Your Feedback',
            template: 'surveyResponse',
            data: {
                userName: survey.user.name,
                response: content,
                surveyLink: `${process.env.CLIENT_URL}/survey/${survey._id}`
            }
        });

        res.status(200).json({
            success: true,
            data: survey
        });
    } catch (error) {
        logger.error('Error adding admin response:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding response'
        });
    }
};

// Get survey statistics
export const getSurveyStats = async (req, res) => {
    try {
        const [ratingStats, satisfactionStats, timelineStats] = await Promise.all([
            SurveyResponse.aggregate([
                {
                    $group: {
                        _id: null,
                        averageOverall: { $avg: '$ratings.overall' },
                        averageServiceQuality: { $avg: '$ratings.serviceQuality' },
                        averageTimeliness: { $avg: '$ratings.timeliness' },
                        averageCommunication: { $avg: '$ratings.communication' },
                        averageValueForMoney: { $avg: '$ratings.valueForMoney' },
                        averageStaffProfessionalism: { $avg: '$ratings.staffProfessionalism' }
                    }
                }
            ]),
            SurveyResponse.aggregate([
                {
                    $group: {
                        _id: null,
                        recommendationRate: {
                            $avg: { $cond: ['$satisfaction.wouldRecommend', 1, 0] }
                        },
                        averageReturnLikelihood: { $avg: '$satisfaction.likelyToReturn' }
                    }
                }
            ]),
            SurveyResponse.aggregate([
                {
                    $group: {
                        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                        count: { $sum: 1 },
                        averageRating: { $avg: '$ratings.overall' }
                    }
                },
                { $sort: { '_id': 1 } }
            ])
        ]);

        res.status(200).json({
            success: true,
            data: {
                ratings: ratingStats[0],
                satisfaction: satisfactionStats[0],
                timeline: timelineStats
            }
        });
    } catch (error) {
        logger.error('Error getting survey stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching survey statistics'
        });
    }
}; 