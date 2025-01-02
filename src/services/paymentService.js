import axios from 'axios';
import AuthService from './authService';
import ErrorHandler from '../utils/ErrorHandler';
import Logger from '../utils/Logger';

class PaymentService {
    // Process payment for booking
    static async processPayment(bookingDetails, paymentDetails) {
        try {
            const response = await axios.post('/api/payments/process', 
                { 
                    bookingDetails, 
                    paymentDetails 
                },
                {
                    headers: { 
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${AuthService.getToken()}` 
                    }
                }
            );

            // Log successful payment
            Logger.info('Payment processed', {
                bookingId: bookingDetails.id,
                amount: bookingDetails.totalAmount
            });

            return response.data;
        } catch (error) {
            // Handle and log payment errors
            ErrorHandler.handleError(error, 'Payment processing failed');
            throw error;
        }
    }

    // Refund payment
    static async refundPayment(paymentId, amount) {
        try {
            const response = await axios.post('/api/payments/refund', 
                { paymentId, amount },
                {
                    headers: { 
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${AuthService.getToken()}` 
                    }
                }
            );

            // Log successful refund
            Logger.info('Payment refunded', {
                paymentId,
                amount
            });

            return response.data;
        } catch (error) {
            // Handle and log refund errors
            ErrorHandler.handleError(error, 'Payment refund failed');
            throw error;
        }
    }

    // Get available payment methods
    static async getPaymentMethods() {
        try {
            const response = await axios.get('/api/payments/methods', {
                headers: { 
                    Authorization: `Bearer ${AuthService.getToken()}` 
                }
            });

            return response.data.methods;
        } catch (error) {
            // Handle payment methods retrieval error
            ErrorHandler.handleError(error, 'Failed to retrieve payment methods');
            return [];
        }
    }

    // Validate card details client-side
    static validateCardDetails(cardDetails) {
        const { 
            cardNumber, 
            expirationMonth, 
            expirationYear, 
            cvv 
        } = cardDetails;

        const errors = [];

        // Card number validation (Luhn algorithm)
        if (!this.validateCardNumber(cardNumber)) {
            errors.push('Invalid card number');
        }

        // Expiration date validation
        if (!this.validateExpirationDate(expirationMonth, expirationYear)) {
            errors.push('Invalid expiration date');
        }

        // CVV validation
        if (!this.validateCVV(cvv)) {
            errors.push('Invalid CVV');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    // Luhn algorithm for card number validation
    static validateCardNumber(cardNumber) {
        if (!/^\d{13,19}$/.test(cardNumber)) return false;

        let sum = 0;
        let isEven = false;

        for (let i = cardNumber.length - 1; i >= 0; i--) {
            let digit = parseInt(cardNumber.charAt(i), 10);

            if (isEven) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }

            sum += digit;
            isEven = !isEven;
        }

        return (sum % 10) === 0;
    }

    // Expiration date validation
    static validateExpirationDate(month, year) {
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;

        const parsedMonth = parseInt(month, 10);
        const parsedYear = parseInt(year, 10);

        return (
            parsedYear > currentYear || 
            (parsedYear === currentYear && parsedMonth >= currentMonth)
        );
    }

    // CVV validation
    static validateCVV(cvv) {
        return /^\d{3,4}$/.test(cvv);
    }

    // Calculate total amount with tax and fees
    static calculateTotalAmount(baseAmount, serviceType) {
        const taxRates = {
            'basic': 0.08,  // 8% tax for basic services
            'premium': 0.10, // 10% tax for premium services
            'full-detail': 0.12 // 12% tax for full detailing
        };

        const serviceFees = {
            'basic': 10,     // $10 service fee for basic
            'premium': 25,   // $25 service fee for premium
            'full-detail': 50 // $50 service fee for full detailing
        };

        const taxRate = taxRates[serviceType] || 0.08;
        const serviceFee = serviceFees[serviceType] || 10;

        const tax = baseAmount * taxRate;
        const totalAmount = baseAmount + tax + serviceFee;

        return {
            baseAmount,
            tax,
            serviceFee,
            totalAmount
        };
    }
}

export default PaymentService;
