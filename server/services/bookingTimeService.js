/* eslint-disable no-unused-vars */
const moment = require('moment');
const mongoose = require('mongoose');
const { logger } = require('../utils/logger');
const Booking = require('../models/Booking');

class BookingTimeService {
    constructor() {
        this.bookingModel = mongoose.model('Booking');
        this.weatherService = require('../../src/services/weatherService');
        // Default configuration with sensible restrictions
        this.TIME_CONFIG = {
            workingHours: {
                start: 8,   // 8 AM
                end: 18     // 6 PM
            },
            slotDuration: 60,  // 1 hour slots
            maxDailyBookings: 10,
            serviceTypeDuration: {
                'Basic Wash': 60,       // 1 hour
                'Premium Wash': 90,      // 1.5 hours
                'Elite Ceramic Package': 180  // 3 hours
            },
            restrictions: {
                minNotice: {
                    normal: 4, // hours
                    rain: 6, // hours
                    extremeHeat: 8 // hours
                },
                maxAdvanceBooking: 90, // days
                blackoutDays: [
                    '2024-12-25', // Christmas
                    '2024-01-01', // New Year's Day
                    '2024-07-04', // Independence Day
                    '2024-09-02'  // Labor Day
                ],
                businessHours: {
                    start: '08:00',
                    end: '18:00'
                }
            }
        };
    }

    async checkAvailability(date, serviceType = 'Basic Wash') {
        try {
            const bookingDate = moment(date);
            const now = moment();

            // Validate date and time
            await this.validateDateTime(date);

            // Get all possible time slots
            const allTimeSlots = this.generateTimeSlots();

            // Check existing bookings and filter slots
            const existingBookings = await this.getExistingBookings(bookingDate, serviceType);
            
            const availableSlots = allTimeSlots.filter(slot => 
                !existingBookings.some(booking => booking.time === slot)
            );

            return availableSlots;
        } catch (error) {
            logger.error('Availability check failed', {
                date,
                serviceType,
                error: error.message
            });
            throw error;
        }
    }

    generateTimeSlots() {
        const slots = [];
        const businessStart = moment(this.TIME_CONFIG.restrictions.businessHours.start, 'HH:mm');
        const businessEnd = moment(this.TIME_CONFIG.restrictions.businessHours.end, 'HH:mm');

        // Generate hourly slots within business hours
        let currentSlot = moment(businessStart);
        while (currentSlot.isBefore(businessEnd)) {
            slots.push(currentSlot.format('HH:mm'));
            currentSlot.add(1, 'hour');
        }

        return slots;
    }

    async getExistingBookings(date, serviceType) {
        // In a real-world scenario, this would query your booking database
        // For now, return an empty array as a placeholder
        return [];
    }

    async validateDateTime(date, time) {
        const bookingDate = moment(date);
        const now = moment();
        const weather = await this.weatherService.getWeather();

        // Check blackout days
        if (this.TIME_CONFIG.restrictions.blackoutDays.includes(
            bookingDate.format('YYYY-MM-DD')
        )) {
            throw new Error('Booking not allowed on this date');
        }

        // Check maximum advance booking
        const maxBookingDate = moment().add(
            this.TIME_CONFIG.restrictions.maxAdvanceBooking, 
            'days'
        );

        // Validate booking date
        if (bookingDate.isBefore(now, 'day') || bookingDate.isAfter(maxBookingDate, 'day')) {
            throw new Error('Invalid booking date');
        }

        // Dynamic minimum notice based on weather and service type
        let minimumNoticeHours = this.TIME_CONFIG.restrictions.minNotice.normal;
        
        if (weather.description.toLowerCase().includes('rain')) {
            minimumNoticeHours = this.TIME_CONFIG.restrictions.minNotice.rain;
        } else if (weather.temperature > 85) {
            minimumNoticeHours = this.TIME_CONFIG.restrictions.minNotice.extremeHeat;
        }

        // Additional buffer for same-day bookings
        if (bookingDate.isSame(now, 'day')) {
            minimumNoticeHours = Math.max(minimumNoticeHours, 2);
        }

        const minimumAllowedBookingTime = moment().add(minimumNoticeHours, 'hours');
        
        // Check if booking time is after minimum notice
        if (bookingDate.isSameOrBefore(minimumAllowedBookingTime)) {
            throw new Error(`Booking requires minimum ${minimumNoticeHours} hour${minimumNoticeHours > 1 ? 's' : ''} notice`);
        }

        // Weather-based service recommendations
        const weatherRecommendations = this.weatherService.getWeatherRecommendations(weather);
        if (weatherRecommendations.length > 0) {
            console.log('Weather-based recommendations:', weatherRecommendations);
        }

        // Optional: Additional time slot validation
        if (time) {
            const bookingTime = moment(time, 'HH:mm');
            const businessStart = moment(this.TIME_CONFIG.restrictions.businessHours.start, 'HH:mm');
            const businessEnd = moment(this.TIME_CONFIG.restrictions.businessHours.end, 'HH:mm');

            if (bookingTime.isBefore(businessStart) || bookingTime.isAfter(businessEnd)) {
                throw new Error('Booking time outside of business hours');
            }
        }

        return true;
    }

    async checkTimeSlotAvailability(date, time, serviceType) {
        try {
            // Validate service type
            if (!serviceType) {
                throw new Error('Service type is required');
            }

            // Validate date and time
            await this.validateDateTime(date, time);

            // Check service-specific duration
            const serviceDuration = this.TIME_CONFIG.serviceTypeDuration[serviceType];
            if (!serviceDuration) {
                throw new Error(`Unsupported service type: ${serviceType}`);
            }

            // Validate service type against available services
            const validServiceTypes = Object.keys(this.TIME_CONFIG.serviceTypeDuration);
            if (!validServiceTypes.includes(serviceType)) {
                throw new Error(`Invalid service type: ${serviceType}`);
            }

            // Check daily booking limit
            const dailyBookings = await this.countDailyBookings(date);
            if (dailyBookings >= this.TIME_CONFIG.maxDailyBookings) {
                return {
                    available: false,
                    reason: 'Daily booking limit reached'
                };
            }

            // Check for overlapping bookings
            const overlappingBookings = await this.findOverlappingBookings(
                date, 
                time, 
                serviceDuration
            );

            return {
                available: overlappingBookings.length === 0,
                reason: overlappingBookings.length > 0 
                    ? 'Time slot already booked' 
                    : null
            };
        } catch (error) {
            logger.error('Time slot availability check failed', {
                error: error.message,
                date,
                time,
                serviceType
            });
            throw error;
        }
    }

    async generateAvailableTimeSlots(date, serviceType) {
        const availableSlots = [];
        const serviceDuration = this.TIME_CONFIG.serviceTypeDuration[serviceType];

        for (
            let hour = this.TIME_CONFIG.workingHours.start; 
            hour < this.TIME_CONFIG.workingHours.end; 
            hour++
        ) {
            const timeString = `${hour.toString().padStart(2, '0')}:00`;
            
            // Check if this time slot is available
            const slotAvailability = await this.checkTimeSlotAvailability(
                date, 
                timeString, 
                serviceType
            );

            if (slotAvailability.available) {
                availableSlots.push({
                    time: timeString,
                    duration: serviceDuration
                });
            }
        }

        return availableSlots;
    }

    calculateDynamicPricing(serviceType, vehicleType, additionalServices) {
        const baseRates = {
            'Basic Wash': 50,
            'Premium Detailing': 120,
            'Full Service': 200
        };

        const vehicleMultipliers = {
            'Sedan': 1.0,
            'SUV': 1.2,
            'Truck': 1.5,
            'Sports Car': 1.3
        };

        const additionalServiceRates = {
            'Engine Bay Cleaning': 50,
            'Headlight Restoration': 75,
            'Pet Hair Removal': 40
        };

        // Base price calculation
        let totalPrice = baseRates[serviceType] * vehicleMultipliers[vehicleType];

        // Add additional services
        additionalServices.forEach(service => {
            totalPrice += additionalServiceRates[service.name] || 0;
        });

        // Time-based and demand-based pricing adjustments
        const currentHour = moment().hour();
        const isWeekend = moment().day() >= 5;

        // Peak hours and weekend surcharge
        if ((currentHour >= 10 && currentHour <= 14) || isWeekend) {
            totalPrice *= 1.15; // 15% surcharge
        }

        return Math.round(totalPrice);
    }

    async createLoyaltyBooking(userId, bookingDetails) {
        const userModel = mongoose.model('User');
        const user = await userModel.findById(userId);

        // Calculate loyalty points
        const pointsEarned = Math.floor(bookingDetails.totalPrice / 10);
        
        user.loyaltyPoints += pointsEarned;
        await user.save();

        return {
            loyaltyPointsEarned: pointsEarned,
            totalLoyaltyPoints: user.loyaltyPoints
        };
    }

    generateReferralCode(userId) {
        return `PRE-${userId.slice(-6).toUpperCase()}`;
    }

    async processReferral(referrerCode, newUserId) {
        const userModel = mongoose.model('User');
        const referrer = await userModel.findOne({ referralCode: referrerCode });

        if (referrer) {
            referrer.referralBonus += 50; // $50 credit
            referrer.referredUsers.push(newUserId);
            await referrer.save();

            return {
                referralBonusEarned: 50,
                referredUserId: newUserId
            };
        }

        return null;
    }

    async countDailyBookings(date) {
        return await Booking.countDocuments({
            date: date,
            status: { $ne: 'cancelled' }
        });
    }

    async findOverlappingBookings(date, time, duration) {
        const startTime = this.parseTime(time);
        const endTime = new Date(startTime.getTime() + duration * 60000);

        return await Booking.find({
            date: date,
            status: { $ne: 'cancelled' },
            $or: [
                // New booking starts during existing booking
                {
                    time: { 
                        $gte: startTime.toTimeString().slice(0, 5),
                        $lt: endTime.toTimeString().slice(0, 5)
                    }
                },
                // Existing booking starts during new booking
                {
                    time: { 
                        $lte: startTime.toTimeString().slice(0, 5)
                    },
                    // Calculate end time of existing booking
                    $expr: {
                        $gte: [
                            { 
                                $dateFromString: { 
                                    dateString: { 
                                        $concat: [
                                            date, 
                                            'T', 
                                            '$time', 
                                            ':00'
                                        ] 
                                    }
                                }
                            },
                            startTime
                        ]
                    }
                }
            ]
        });
    }

    parseTime(time) {
        // Implement time parsing logic if needed
        return time;
    }
}

module.exports = new BookingTimeService();
