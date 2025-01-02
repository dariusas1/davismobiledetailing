/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');
const User = require('../models/User');
const Booking = require('../models/Booking');
const moment = require('moment');

class AnalyticsService {
    // Comprehensive User Behavior Analytics
    async getUserBehaviorAnalytics(userId) {
        try {
            const bookings = await Booking.aggregate([
                { $match: { user: mongoose.Types.ObjectId(userId) } },
                {
                    $group: {
                        _id: {
                            year: { $year: '$bookingDate' },
                            month: { $month: '$bookingDate' },
                            service: '$service'
                        },
                        totalBookings: { $sum: 1 },
                        totalRevenue: { $sum: '$totalPrice' }
                    }
                },
                { $sort: { '_id.year': 1, '_id.month': 1 } }
            ]);

            const servicePreferences = await this.calculateServicePreferences(userId);
            const seasonalTrends = await this.analyzeSseasonalBookingTrends(userId);
            const predictiveRecommendations = await this.generatePredictiveRecommendations(userId);

            return {
                monthlyBookings: bookings,
                servicePreferences,
                seasonalTrends,
                predictiveRecommendations
            };
        } catch (error) {
            throw new Error(`Analytics generation failed: ${error.message}`);
        }
    }

    // Detailed Service Preferences
    async calculateServicePreferences(userId) {
        return await Booking.aggregate([
            { $match: { user: mongoose.Types.ObjectId(userId) } },
            {
                $group: {
                    _id: '$service.name',
                    frequency: { $sum: 1 },
                    totalSpent: { $sum: '$totalPrice' },
                    averageSpend: { $avg: '$totalPrice' }
                }
            },
            { $sort: { frequency: -1 } },
            { $limit: 5 }
        ]);
    }

    // Seasonal Booking Trends
    async analyzeSseasonalBookingTrends(userId) {
        return await Booking.aggregate([
            { $match: { user: mongoose.Types.ObjectId(userId) } },
            {
                $group: {
                    _id: { 
                        season: {
                            $switch: {
                                branches: [
                                    { case: { $in: [{ $month: '$bookingDate' }, [12, 1, 2]] }, then: 'Winter' },
                                    { case: { $in: [{ $month: '$bookingDate' }, [3, 4, 5]] }, then: 'Spring' },
                                    { case: { $in: [{ $month: '$bookingDate' }, [6, 7, 8]] }, then: 'Summer' },
                                    { case: { $in: [{ $month: '$bookingDate' }, [9, 10, 11]] }, then: 'Autumn' }
                                ],
                                default: 'Unknown'
                            }
                        }
                    },
                    bookingCount: { $sum: 1 },
                    totalRevenue: { $sum: '$totalPrice' }
                }
            },
            { $sort: { 'bookingCount': -1 } }
        ]);
    }

    // Predictive Service Recommendations
    async generatePredictiveRecommendations(userId) {
        const pastBookings = await Booking.find({ user: userId })
            .sort({ bookingDate: -1 })
            .limit(10);

        const serviceFrequency = {};
        const vehicleTypes = {};
        let totalSpend = 0;

        pastBookings.forEach(booking => {
            serviceFrequency[booking.service.name] = 
                (serviceFrequency[booking.service.name] || 0) + 1;
            
            vehicleTypes[booking.vehicle.type] = 
                (vehicleTypes[booking.vehicle.type] || 0) + 1;
            
            totalSpend += booking.totalPrice;
        });

        const mostFrequentService = Object.keys(serviceFrequency)
            .reduce((a, b) => serviceFrequency[a] > serviceFrequency[b] ? a : b);

        const mostCommonVehicleType = Object.keys(vehicleTypes)
            .reduce((a, b) => vehicleTypes[a] > vehicleTypes[b] ? a : b);

        const averageSpend = totalSpend / pastBookings.length;

        return {
            recommendedService: mostFrequentService,
            recommendedVehicleType: mostCommonVehicleType,
            predictedSpend: averageSpend * 1.1  // 10% increase prediction
        };
    }

    // User Engagement Scoring
    async calculateUserEngagementScore(userId) {
        const user = await User.findById(userId);
        const bookings = await Booking.find({ user: userId });

        const recencyScore = this.calculateRecencyScore(bookings);
        const frequencyScore = this.calculateFrequencyScore(bookings);
        const monetaryScore = this.calculateMonetaryScore(bookings);

        const engagementScore = (recencyScore + frequencyScore + monetaryScore) / 3;

        return {
            recencyScore,
            frequencyScore,
            monetaryScore,
            engagementScore
        };
    }

    // RFM Score Calculation Helpers
    calculateRecencyScore(bookings) {
        if (bookings.length === 0) return 0;

        const lastBookingDate = bookings[bookings.length - 1].bookingDate;
        const daysSinceLastBooking = moment().diff(moment(lastBookingDate), 'days');

        // Score decreases as days since last booking increase
        return Math.max(0, 100 - (daysSinceLastBooking * 2));
    }

    calculateFrequencyScore(bookings) {
        // More bookings = higher score, with diminishing returns
        return Math.min(100, Math.log(bookings.length + 1) * 20);
    }

    calculateMonetaryScore(bookings) {
        const totalSpend = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
        // Score increases with total spend, with a logarithmic curve
        return Math.min(100, Math.log(totalSpend + 1) * 10);
    }
}

module.exports = new AnalyticsService();
