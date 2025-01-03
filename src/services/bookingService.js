import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { validateBookingData } from '../utils/bookingValidationUtils.js';
import socket from '../services/socketService.js';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

// Socket connection management
let socketConnectionAttempts = 0;
const MAX_SOCKET_RETRIES = 3;
const SOCKET_RETRY_DELAY = 5000;

const initializeSocket = () => {
    socket.on('connect', () => {
        console.log('Socket connected');
        socketConnectionAttempts = 0;
    });

    socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        if (socketConnectionAttempts < MAX_SOCKET_RETRIES) {
            socketConnectionAttempts++;
            console.log(`Retrying socket connection (attempt ${socketConnectionAttempts})...`);
            setTimeout(() => socket.connect(), SOCKET_RETRY_DELAY);
        } else {
            console.error('Max socket connection attempts reached');
        }
    });

    socket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
        if (reason === 'io server disconnect') {
            socket.connect();
        }
    });
};

// Initialize socket connection
initializeSocket();

// Check slot availability in real-time
export const checkAvailability = async ({ date, serviceType, duration }) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/booking/check-availability`, {
            date,
            serviceType,
            duration
        });
        return response.data;
    } catch (error) {
        console.error('Error checking availability:', error);
        throw error;
    }
};

// Calculate loyalty points based on purchase amount
export const calculateLoyaltyPoints = (totalAmount) => {
    const pointsPerDollar = 10; // 10 points per dollar spent
    return Math.floor(totalAmount * pointsPerDollar);
};

// Process payment through payment gateway
export const processPayment = async ({ amount, currency, customerEmail, description }) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/payment/process`, {
            amount,
            currency,
            customerEmail,
            description
        });
        return response.data;
    } catch (error) {
        console.error('Payment processing error:', error);
        throw error;
    }
};

// Get available time slots
export const getAvailableSlots = async (date) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/booking/availability`, {
            date
        });
        return response.data.availableSlots;
    } catch (error) {
        console.error('Error fetching available slots:', error);
        throw error;
    }
};

// Broadcast slot availability to connected clients
export const broadcastAvailability = async () => {
    try {
        const date = new Date().toISOString().split('T')[0];
        const slots = await getAvailableSlots(date);
        socket.emit('slotAvailability', slots);
    } catch (error) {
        console.error('Error broadcasting availability:', error);
    }
};

// Start periodic availability updates
setInterval(broadcastAvailability, 30000);

// Create a new booking
export const createBooking = async (bookingData) => {
    try {
        // Validate booking data before sending request
        const validation = validateBookingData(bookingData);
        if (!validation.isValid) {
            return {
                error: 'Validation failed',
                details: validation.errors
            };
        }

        // Log booking request
        console.log('Creating booking:', {
            timestamp: new Date().toISOString(),
            bookingData: {
                ...bookingData,
                paymentInfo: '***REDACTED***' // Sensitive data redaction
            }
        });

        const response = await axios.post(`${API_BASE_URL}/booking`, bookingData, {
            timeout: 10000, // 10 second timeout
            headers: {
                'Content-Type': 'application/json',
                'X-Request-ID': uuidv4() // Add unique request ID
            }
        });

        // Log successful booking creation
        console.log('Booking created successfully:', {
            bookingId: response.data._id,
            timestamp: new Date().toISOString()
        });

        return {
            ...response.data,
            success: true
        };
    } catch (error) {
        // Log error details
        console.error('Booking creation error:', {
            timestamp: new Date().toISOString(),
            error: error.message,
            stack: error.stack
        });

        if (error.response) {
            // Handle specific error responses from the server
            const { status, data } = error.response;
            
            return {
                error: data.error || 'Booking creation failed',
                statusCode: status,
                details: data.details || null,
                success: false
            };
        }
        
        if (error.code === 'ECONNABORTED') {
            return {
                error: 'Request timeout',
                details: 'The booking request took too long to process',
                success: false
            };
        }
        
        // Return network or other errors
        return {
            error: error.message || 'Network error occurred',
            success: false
        };
    }
};

// Update an existing booking
export const updateBooking = async (bookingId, updatedData) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/booking/${bookingId}`, updatedData);
        return response.data;
    } catch (error) {
        console.error('Error updating booking:', error);
        throw error;
    }
};

// Cancel a booking
export const cancelBooking = async (bookingId) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/booking/${bookingId}`);
        return response.data;
    } catch (error) {
        console.error('Error canceling booking:', error);
        throw error;
    }
};

// Get booking details
export const getBookingDetails = async (bookingId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/booking/${bookingId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching booking details:', error);
        throw error;
    }
};
