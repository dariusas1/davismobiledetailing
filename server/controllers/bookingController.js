/* eslint-disable no-unused-vars */
const Booking = require('../models/Booking');
const Package = require('../models/Package');
const { DateTime } = require('luxon');
const { validationResult } = require('express-validator');
const slotAvailabilityService = require('../../src/services/slotAvailabilityService');
const { validateBookingData } = require('../../src/utils/bookingValidationUtils');

const bookingController = {
    async createBooking(req, res) {
        try {
            // Log incoming request
            console.log('Booking request received:', {
                method: req.method,
                url: req.originalUrl,
                body: req.body
            });

            // Validate request body
            const validation = validateBookingData(req.body);
            if (!validation.isValid) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: validation.errors
                });
            }

            const { 
                customerName: name, 
                customerEmail: email, 
                customerPhone: phone, 
                serviceType: selectedPackage, 
                totalPrice, 
                vehicleType, 
                additionalServices, 
                preferredTime: selectedSlot, 
                weatherConditions,
                location: selectedAddress
            } = req.body;

            // Create new booking with address data
            const newBooking = new Booking({
                customer: {
                    name,
                    email,
                    phone,
                    address: {
                        displayName: selectedAddress.displayName,
                        coordinates: {
                            lat: selectedAddress.lat,
                            lon: selectedAddress.lon
                        },
                        city: selectedAddress.address.city,
                        state: selectedAddress.address.state,
                        country: selectedAddress.address.country,
                        postcode: selectedAddress.address.postcode
                    }
                },
                selectedPackage,
                totalPrice,
                vehicleType,
                additionalServices,
                selectedSlot,
                weatherConditions,
                status: 'Pending',
                paymentStatus: 'Unpaid'
            });

            const savedBooking = await newBooking.save();
            
            // Broadcast updated availability
            slotAvailabilityService.broadcastAvailability();

            res.status(201).json({
                message: 'Booking created successfully',
                booking: savedBooking,
                referenceNumber: savedBooking._id
            });
        } catch (error) {
            console.error('Error creating booking:', error);
            res.status(500).json({ message: 'Error creating booking' });
        }
    },

    async getAvailableSlots(req, res) {
        try {
            const { date } = req.query;
            const startDate = DateTime.fromISO(date).startOf('day');
            const endDate = startDate.endOf('day');

            // Get all bookings for the day
            const bookings = await Booking.find({
                startDateTime: {
                    $gte: startDate.toJSDate(),
                    $lte: endDate.toJSDate()
                }
            }).select('startDateTime duration');

            // Generate available slots
            const slots = generateTimeSlots(startDate, bookings);
            
            res.json(slots);
        } catch (error) {
            console.error('Error getting available slots:', error);
            res.status(500).json({ message: 'Error getting available slots' });
        }
    },

    async getRealTimeAvailability(req, res) {
        try {
            const availability = await slotAvailabilityService.getRealTimeAvailability();
            res.json(availability);
        } catch (error) {
            console.error('Error getting real-time availability:', error);
            res.status(500).json({ message: 'Error getting real-time availability' });
        }
    },

    async validateDateTime(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { startDateTime, startTime } = req.body;
            const bookingDateTime = DateTime.fromISO(startDateTime);

            // Check if the time slot is in the past
            if (bookingDateTime < DateTime.now()) {
                return res.json({ 
                    valid: false,
                    message: 'Selected time is in the past'
                });
            }

            // Check if the slot is already booked
            const existingBooking = await Booking.findOne({
                startDateTime: bookingDateTime.toJSDate()
            });

            if (existingBooking) {
                return res.json({ 
                    valid: false,
                    message: 'This time slot is already booked'
                });
            }

            res.json({ valid: true });
        } catch (error) {
            console.error('Error validating date/time:', error);
            res.status(500).json({ message: 'Error validating date/time' });
        }
    },

    async reserveSlot(req, res) {
        try {
            const { slotId } = req.body;
            // Additional validation and reservation logic here
            res.json({ success: true, slotId });
        } catch (error) {
            console.error('Error reserving slot:', error);
            res.status(500).json({ message: 'Error reserving slot' });
        }
    },

    async getWeatherConditions(req, res) {
        try {
            const { date } = req.query;
            // Fetch weather conditions from external API or database
            res.json({ conditions: 'Sunny', temperature: 72 });
        } catch (error) {
            console.error('Error getting weather conditions:', error);
            res.status(500).json({ message: 'Error getting weather conditions' });
        }
    },

    async getRecommendedSlots(req, res) {
        try {
            const { vehicleType, packageType } = req.query;
            // Generate recommended slots based on vehicle and package
            const recommendations = await generateRecommendations(vehicleType, packageType);
            res.json(recommendations);
        } catch (error) {
            console.error('Error getting recommended slots:', error);
            res.status(500).json({ message: 'Error getting recommended slots' });
        }
    }
};

// Helper functions
function generateTimeSlots(startDate, bookings) {
    const slots = [];
    const startHour = 8; // 8 AM
    const endHour = 18; // 6 PM
    const slotDuration = 60; // 60 minutes

    for (let hour = startHour; hour < endHour; hour++) {
        const slotStart = startDate.set({ hour, minute: 0 });
        const slotEnd = slotStart.plus({ minutes: slotDuration });

        // Check if slot is available
        const isBooked = bookings.some(booking => {
            const bookingStart = DateTime.fromJSDate(booking.startDateTime);
            const bookingEnd = bookingStart.plus({ minutes: booking.duration });
            return slotStart < bookingEnd && slotEnd > bookingStart;
        });

        if (!isBooked) {
            slots.push({
                start: slotStart.toISO(),
                end: slotEnd.toISO(),
                available: true
            });
        }
    }

    return slots;
}

async function generateRecommendations(vehicleType, packageType) {
    // Generate recommendations based on vehicle type and package
    const packageDetails = await Package.findOne({ name: packageType });
    const recommendations = [];

    // Add logic to generate recommendations
    return recommendations;
}

module.exports = bookingController;
