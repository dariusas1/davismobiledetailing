const express = require('express');
const router = express.Router();
const paymentService = require('../services/paymentService');
const { accessControl } = require('../middleware/accessControl');
const { logger } = require('../utils/logger');

// Process payment for booking
router.post('/process', 
    accessControl(['write:own']), 
    async (req, res) => {
        try {
            const { 
                bookingDetails, 
                cardDetails 
            } = req.body;

            // Validate card details
            const cardValidation = await paymentService.validateCardDetails(cardDetails);
            
            if (!cardValidation.isValid) {
                return res.status(400).json({
                    message: 'Invalid card details',
                    errors: cardValidation.errors
                });
            }

            // Process payment
            const paymentResult = await paymentService.createPaymentIntent(bookingDetails);

            res.status(200).json({
                message: 'Payment processed successfully',
                paymentDetails: paymentResult
            });
        } catch (error) {
            logger.error('Payment processing error', {
                error: error.message,
                body: req.body
            });

            res.status(500).json({
                message: 'Payment processing failed',
                error: error.message
            });
        }
    }
);

// Refund payment
router.post('/refund', 
    accessControl(['write:own']), 
    async (req, res) => {
        try {
            const { 
                paymentId, 
                amount 
            } = req.body;

            const refundResult = await paymentService.refundPayment(paymentId, amount);

            res.status(200).json({
                message: 'Refund processed successfully',
                refundDetails: refundResult
            });
        } catch (error) {
            logger.error('Refund processing error', {
                error: error.message,
                body: req.body
            });

            res.status(500).json({
                message: 'Refund processing failed',
                error: error.message
            });
        }
    }
);

// Get payment methods
router.get('/methods', 
    accessControl(['read:own']), 
    (req, res) => {
        // Provide available payment methods
        res.json({
            methods: [
                { 
                    id: 'credit_card', 
                    name: 'Credit Card', 
                    icon: 'credit-card' 
                },
                { 
                    id: 'apple_pay', 
                    name: 'Apple Pay', 
                    icon: 'apple' 
                },
                { 
                    id: 'google_pay', 
                    name: 'Google Pay', 
                    icon: 'google' 
                }
            ]
        });
    }
);

module.exports = router;
