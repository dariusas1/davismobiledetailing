/* eslint-disable no-unused-vars */
const Booking = require('../models/Booking');
const LoyaltyProgram = require('../models/LoyaltyProgram');
const PricingService = require('./pricingService');
const BookingTimeService = require('./bookingTimeService');
const { sendEmail } = require('../services/emailService');
const { logger } = require('../utils/logger');

class BookingService {
    // Validate booking details
    static async validateBookingDetails(bookingData) {
        const errors = [];

        // Required fields validation
        const requiredFields = [
            'name', 
            'phone', 
            'email', 
            'package', 
            'vehicleType'
        ];

        requiredFields.forEach(field => {
            if (!bookingData[field]) {
                errors.push(`${field} is required`);
            }
        });

        // Extract service type from package
        const serviceType = bookingData.package?.name || 'Basic Wash';

        // Time slot availability check
        try {
            const timeSlotAvailability = await BookingTimeService.checkTimeSlotAvailability(
                new Date(), // Use current date if no specific date provided
                '08:00', // Default time slot 
                serviceType
            );

            if (!timeSlotAvailability.available) {
                errors.push(timeSlotAvailability.reason || 'Time slot not available');
            }
        } catch (timeSlotError) {
            errors.push(timeSlotError.message);
        }

        // Phone number validation
        const phoneRegex = /^\+?1?\d{10,14}$/;
        if (bookingData.phone && !phoneRegex.test(bookingData.phone)) {
            errors.push('Invalid phone number format');
        }

        // Email validation
        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (bookingData.email && !emailRegex.test(bookingData.email)) {
            errors.push('Invalid email format');
        }

        // Check if email is unique
        const existingBooking = await Booking.findOne({ email: bookingData.email });
        if (existingBooking) {
            errors.push('Email already in use for another booking');
        }

        // Check if phone number is unique
        const existingPhoneBooking = await Booking.findOne({ phone: bookingData.phone });
        if (existingPhoneBooking) {
            errors.push('Phone number already in use for another booking');
        }

        return errors;
    }

    // Create a new booking
    static async createBooking(bookingData) {
        // Extract and validate service type from package
        const serviceType = bookingData.package?.name;
        if (!serviceType) {
            throw new Error('Service type is required');
        }

        const validationErrors = await this.validateBookingDetails(bookingData);
        
        if (validationErrors.length > 0) {
            throw new Error(validationErrors.join(', '));
        }

        try {
            // Calculate total price based on service and vehicle type
            const totalPrice = await PricingService.calculateBookingPrice(
                serviceType, 
                bookingData.vehicleType?.name
            );

            // Check for loyalty program discounts
            const loyaltyDiscount = await LoyaltyProgram.calculateDiscount(bookingData.email);
            const finalPrice = totalPrice - loyaltyDiscount;

            // Prepare booking data
            const newBookingData = {
                ...bookingData,
                serviceType,
                totalPrice: finalPrice,
                status: 'Pending'
            };

            // Create booking
            const booking = await Booking.create(newBookingData);

            // Send confirmation email
            await sendEmail({
                to: booking.email,
                subject: 'Booking Confirmation - Precision Detailing',
                template: 'bookingConfirmation',
                data: { 
                    customerName: booking.name,
                    serviceType: booking.serviceType,
                    bookingDate: new Date().toLocaleDateString(),
                    totalPrice: booking.totalPrice,
                    discountApplied: loyaltyDiscount > 0 ? 'Yes' : 'No',
                    discountAmount: loyaltyDiscount
                }
            });

            // Log booking creation
            logger.info('New booking created', { 
                bookingId: booking._id, 
                customerName: booking.name,
                serviceType: booking.serviceType,
                totalPrice: booking.totalPrice,
                discountApplied: loyaltyDiscount > 0 ? 'Yes' : 'No',
                discountAmount: loyaltyDiscount
            });

            return booking;
        } catch (error) {
            logger.error('Error creating booking', { error: error.message });
            throw new Error('Failed to create booking');
        }
    }
}

module.exports = BookingService;
