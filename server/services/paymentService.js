const { Client, Environment } = require('square');
const crypto = require('crypto');
const { logger } = require('../utils/logger');

class PaymentService {
    constructor() {
        this.client = new Client({
            environment: process.env.NODE_ENV === 'production' 
                ? Environment.Production 
                : Environment.Sandbox,
            accessToken: process.env.SQUARE_ACCESS_TOKEN
        });
    }

    async processSquarePayment(paymentDetails) {
        try {
            const response = await this.client.paymentsApi.createPayment({
                sourceId: paymentDetails.sourceId, // From Square payment form
                idempotencyKey: this.generateIdempotencyKey(),
                amountMoney: {
                    amount: Math.round(paymentDetails.amount * 100), // Convert to cents
                    currency: 'USD'
                }
            });

            logger.info('Payment processed successfully', {
                transactionId: response.result.payment.id,
                amount: paymentDetails.amount
            });

            return {
                success: true,
                transactionId: response.result.payment.id,
                amount: paymentDetails.amount
            };
        } catch (error) {
            logger.error('Square payment error:', {
                error: error.message
            });
            return {
                success: false,
                error: error.message
            };
        }
    }

    generateIdempotencyKey() {
        return crypto.randomBytes(16).toString('hex');
    }

    async processCashPayment(bookingId) {
        // Mark booking as pending payment
        const Booking = require('../models/Booking');
        await Booking.findByIdAndUpdate(bookingId, {
            paymentStatus: 'pending',
            paymentMethod: 'cash'
        });

        return {
            success: true,
            paymentMethod: 'cash'
        };
    }

    async calculateLoyaltyDiscount(userId) {
        const User = require('../models/User');
        const user = await User.findById(userId);

        // Loyalty discount tiers
        const discountTiers = [
            { points: 100, discount: 0.05 },
            { points: 250, discount: 0.10 },
            { points: 500, discount: 0.15 }
        ];

        const applicableDiscount = discountTiers
            .reverse()
            .find(tier => user.loyaltyPoints >= tier.points);

        return applicableDiscount 
            ? { 
                discountPercentage: applicableDiscount.discount,
                requiredPoints: applicableDiscount.points
            }
            : null;
    }
}

module.exports = new PaymentService();
