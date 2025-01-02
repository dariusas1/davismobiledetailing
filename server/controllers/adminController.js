import {
    User,
    Service,
    Booking,
    Review,
    Gallery,
    Blog,
    FAQ,
    ServicePackage,
    LoyaltyPoints,
    Promotion
} from '../models/index.js';
import logger from '../config/logger.js';

// Dashboard Overview
export const getDashboardStats = async (req, res) => {
    try {
        const stats = await Promise.all([
            Booking.countDocuments({ status: 'pending' }),
            User.countDocuments(),
            Review.countDocuments({ isPublished: false }),
            ServicePackage.countDocuments({ isActive: true }),
            Booking.aggregate([
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: '$totalPrice' },
                        averageBookingValue: { $avg: '$totalPrice' }
                    }
                }
            ])
        ]);

        const [
            pendingBookings,
            totalCustomers,
            pendingReviews,
            activePackages,
            financialStats
        ] = stats;

        res.status(200).json({
            success: true,
            data: {
                pendingBookings,
                totalCustomers,
                pendingReviews,
                activePackages,
                revenue: financialStats[0]?.totalRevenue || 0,
                averageBookingValue: financialStats[0]?.averageBookingValue || 0
            }
        });
    } catch (error) {
        logger.error('Error getting dashboard stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard statistics'
        });
    }
};

// Service Management
export const getAllServices = async (req, res) => {
    try {
        const services = await Service.find().sort({ category: 1, name: 1 });
        res.status(200).json({ success: true, data: services });
    } catch (error) {
        logger.error('Error getting services:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching services'
        });
    }
};

export const updateService = async (req, res) => {
    try {
        const service = await Service.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        res.status(200).json({ success: true, data: service });
    } catch (error) {
        logger.error('Error updating service:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating service'
        });
    }
};

// Booking Management
export const getBookings = async (req, res) => {
    try {
        const { status, date, page = 1, limit = 10 } = req.query;
        const query = {};

        if (status) query.status = status;
        if (date) query.date = new Date(date);

        const bookings = await Booking.find(query)
            .populate('user', 'name email')
            .populate('service', 'name price')
            .sort({ date: -1 })
            .limit(limit)
            .skip((page - 1) * limit);

        const total = await Booking.countDocuments(query);

        res.status(200).json({
            success: true,
            data: bookings,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                page: parseInt(page),
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        logger.error('Error getting bookings:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching bookings'
        });
    }
};

// Customer Management
export const getCustomers = async (req, res) => {
    try {
        const { search, sort = 'createdAt', page = 1, limit = 10 } = req.query;
        const query = {};

        if (search) {
            query.$or = [
                { name: new RegExp(search, 'i') },
                { email: new RegExp(search, 'i') }
            ];
        }

        const customers = await User.find(query)
            .select('-password')
            .sort(sort)
            .limit(limit)
            .skip((page - 1) * limit);

        const total = await User.countDocuments(query);

        res.status(200).json({
            success: true,
            data: customers,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                page: parseInt(page),
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        logger.error('Error getting customers:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching customers'
        });
    }
};

// Content Management
export const getContentStats = async (req, res) => {
    try {
        const [blogs, galleries, faqs, reviews] = await Promise.all([
            Blog.countDocuments(),
            Gallery.countDocuments(),
            FAQ.countDocuments(),
            Review.countDocuments()
        ]);

        res.status(200).json({
            success: true,
            data: {
                blogs,
                galleries,
                faqs,
                reviews
            }
        });
    } catch (error) {
        logger.error('Error getting content stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching content statistics'
        });
    }
};

// Loyalty Program Management
export const getLoyaltyStats = async (req, res) => {
    try {
        const stats = await LoyaltyPoints.aggregate([
            {
                $group: {
                    _id: '$tier',
                    count: { $sum: 1 },
                    totalPoints: { $sum: '$points' }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        logger.error('Error getting loyalty stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching loyalty statistics'
        });
    }
};

// Promotion Management
export const getPromotions = async (req, res) => {
    try {
        const promotions = await Promotion.find()
            .sort({ startDate: -1 });

        res.status(200).json({
            success: true,
            data: promotions
        });
    } catch (error) {
        logger.error('Error getting promotions:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching promotions'
        });
    }
};

export const updatePromotion = async (req, res) => {
    try {
        const promotion = await Promotion.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!promotion) {
            return res.status(404).json({
                success: false,
                message: 'Promotion not found'
            });
        }

        res.status(200).json({
            success: true,
            data: promotion
        });
    } catch (error) {
        logger.error('Error updating promotion:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating promotion'
        });
    }
}; 