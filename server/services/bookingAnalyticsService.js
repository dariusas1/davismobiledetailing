import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import logger from '../config/logger.js';

export async function getBookingStats() {
    try {
        const totalBookings = await Booking.countDocuments();
        const completedBookings = await Booking.countDocuments({ status: 'completed' });
        const pendingBookings = await Booking.countDocuments({ status: 'pending' });
        const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });

        const totalRevenue = await Booking.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);

        return {
            totalBookings,
            completedBookings,
            pendingBookings,
            cancelledBookings,
            totalRevenue: totalRevenue[0]?.total || 0
        };
    } catch (error) {
        logger.error('Error getting booking stats:', error);
        throw error;
    }
}

export async function getBookingTrends() {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const dailyBookings = await Booking.aggregate([
            {
                $match: {
                    createdAt: { $gte: thirtyDaysAgo }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    count: { $sum: 1 },
                    revenue: { $sum: '$totalAmount' }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        return dailyBookings;
    } catch (error) {
        logger.error('Error getting booking trends:', error);
        throw error;
    }
}

export async function getPopularServices() {
    try {
        const popularServices = await Booking.aggregate([
            {
                $match: { status: 'completed' }
            },
            {
                $group: {
                    _id: '$service',
                    count: { $sum: 1 },
                    revenue: { $sum: '$totalAmount' }
                }
            },
            {
                $sort: { count: -1 }
            },
            {
                $limit: 5
            },
            {
                $lookup: {
                    from: 'services',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'serviceDetails'
                }
            },
            {
                $unwind: '$serviceDetails'
            }
        ]);

        return popularServices;
    } catch (error) {
        logger.error('Error getting popular services:', error);
        throw error;
    }
}

export async function getPredictiveBookingCapacity() {
    try {
        const nextThirtyDays = new Date();
        nextThirtyDays.setDate(nextThirtyDays.getDate() + 30);

        // Get all services
        const services = await Service.find();
        
        // Calculate capacity for each service
        const capacity = await Promise.all(services.map(async (service) => {
            const bookedSlots = await Booking.countDocuments({
                service: service._id,
                date: { $gte: new Date(), $lte: nextThirtyDays },
                status: { $in: ['confirmed', 'in-progress'] }
            });

            // Calculate total available slots
            const totalSlots = service.timeSlots.reduce((acc, slot) => {
                return acc + (slot.maxBookings * 30); // 30 days
            }, 0);

            return {
                service: {
                    _id: service._id,
                    name: service.name
                },
                totalCapacity: totalSlots,
                bookedSlots,
                availableSlots: totalSlots - bookedSlots,
                utilizationRate: (bookedSlots / totalSlots) * 100
            };
        }));

        return capacity;
    } catch (error) {
        logger.error('Error getting booking capacity:', error);
        throw error;
    }
}
