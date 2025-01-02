const Booking = require('../models/Booking');
const { logger } = require('../utils/logger');

class BookingAnalyticsService {
    // Get overall booking statistics
    static async getBookingStats(options = {}) {
        const { 
            startDate, 
            endDate, 
            serviceType 
        } = options;

        try {
            const query = {};

            if (startDate && endDate) {
                query.date = {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                };
            }

            if (serviceType) {
                query.serviceType = serviceType;
            }

            const stats = await Booking.aggregate([
                { $match: query },
                {
                    $group: {
                        _id: null,
                        totalBookings: { $sum: 1 },
                        totalRevenue: { $sum: '$price' },
                        averageBookingPrice: { $avg: '$price' },
                        bookingsByStatus: {
                            $push: {
                                status: '$status',
                                count: 1
                            }
                        }
                    }
                }
            ]);

            return stats[0] || {
                totalBookings: 0,
                totalRevenue: 0,
                averageBookingPrice: 0,
                bookingsByStatus: []
            };
        } catch (error) {
            logger.error('Failed to retrieve booking statistics', {
                error: error.message,
                options
            });
            throw error;
        }
    }

    // Get booking trends
    static async getBookingTrends(options = {}) {
        const { 
            period = 'monthly', 
            startDate, 
            endDate 
        } = options;

        try {
            let groupBy;
            switch (period) {
                case 'daily':
                    groupBy = { 
                        $dateToString: { 
                            format: '%Y-%m-%d', 
                            date: '$date' 
                        } 
                    };
                    break;
                case 'weekly':
                    groupBy = { 
                        $dateToString: { 
                            format: '%Y-W%W', 
                            date: '$date' 
                        } 
                    };
                    break;
                default:
                    groupBy = { 
                        $dateToString: { 
                            format: '%Y-%m', 
                            date: '$date' 
                        } 
                    };
            }

            const query = {};
            if (startDate && endDate) {
                query.date = {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                };
            }

            const trends = await Booking.aggregate([
                { $match: query },
                {
                    $group: {
                        _id: groupBy,
                        bookingCount: { $sum: 1 },
                        totalRevenue: { $sum: '$price' },
                        serviceTypes: {
                            $push: '$serviceType'
                        }
                    }
                },
                { 
                    $sort: { _id: 1 } 
                }
            ]);

            return trends.map(trend => ({
                period: trend._id,
                bookingCount: trend.bookingCount,
                totalRevenue: trend.totalRevenue,
                popularServices: this.getMostFrequentServices(trend.serviceTypes)
            }));
        } catch (error) {
            logger.error('Failed to retrieve booking trends', {
                error: error.message,
                options
            });
            throw error;
        }
    }

    // Get most popular services
    static async getPopularServices(options = {}) {
        const { 
            startDate, 
            endDate 
        } = options;

        try {
            const query = {};
            if (startDate && endDate) {
                query.date = {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                };
            }

            const popularServices = await Booking.aggregate([
                { $match: query },
                {
                    $group: {
                        _id: '$serviceType',
                        bookingCount: { $sum: 1 },
                        totalRevenue: { $sum: '$price' }
                    }
                },
                { 
                    $sort: { bookingCount: -1 } 
                }
            ]);

            return popularServices;
        } catch (error) {
            logger.error('Failed to retrieve popular services', {
                error: error.message,
                options
            });
            throw error;
        }
    }

    // Helper method to find most frequent services
    static getMostFrequentServices(services, topN = 3) {
        const serviceCounts = services.reduce((acc, service) => {
            acc[service] = (acc[service] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(serviceCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, topN)
            .map(([service, count]) => ({ service, count }));
    }

    // Predictive booking capacity
    static async getPredictiveBookingCapacity(options = {}) {
        const { 
            startDate, 
            endDate, 
            serviceType 
        } = options;

        try {
            const query = {};
            if (startDate && endDate) {
                query.date = {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                };
            }

            if (serviceType) {
                query.serviceType = serviceType;
            }

            const bookingCapacity = await Booking.aggregate([
                { $match: query },
                {
                    $group: {
                        _id: {
                            $dateToString: { 
                                format: '%Y-%m-%d', 
                                date: '$date' 
                            }
                        },
                        bookingCount: { $sum: 1 },
                        maxCapacity: { $max: 10 } // Assuming max 10 bookings per day
                    }
                },
                {
                    $project: {
                        date: '$_id',
                        bookingCount: 1,
                        maxCapacity: 1,
                        capacityPercentage: {
                            $multiply: [
                                { $divide: ['$bookingCount', '$maxCapacity'] }, 
                                100
                            ]
                        }
                    }
                },
                { 
                    $sort: { date: 1 } 
                }
            ]);

            return bookingCapacity;
        } catch (error) {
            logger.error('Failed to retrieve predictive booking capacity', {
                error: error.message,
                options
            });
            throw error;
        }
    }
}

module.exports = BookingAnalyticsService;
