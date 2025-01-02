import { GiftCard } from '../models/index.js';
import logger from '../config/logger.js';

// Create new gift card
export const createGiftCard = async (req, res) => {
    try {
        const {
            amount,
            recipient,
            message,
            isDigital
        } = req.body;

        const giftCard = new GiftCard({
            code: await GiftCard.generateCode(),
            amount,
            balance: amount,
            purchaser: req.user.id,
            recipient: {
                name: recipient.name,
                email: recipient.email,
                message: message
            },
            isDigital
        });

        await giftCard.save();

        // TODO: Send email notification to recipient

        res.status(201).json({
            success: true,
            data: giftCard
        });
    } catch (error) {
        logger.error('Error creating gift card:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating gift card'
        });
    }
};

// Get gift card by code
export const getGiftCard = async (req, res) => {
    try {
        const giftCard = await GiftCard.findOne({ code: req.params.code })
            .populate('purchaser', 'name email');

        if (!giftCard) {
            return res.status(404).json({
                success: false,
                message: 'Gift card not found'
            });
        }

        res.status(200).json({
            success: true,
            data: giftCard
        });
    } catch (error) {
        logger.error('Error getting gift card:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching gift card'
        });
    }
};

// Redeem gift card
export const redeemGiftCard = async (req, res) => {
    try {
        const { amount, bookingId } = req.body;
        const giftCard = await GiftCard.findOne({ code: req.params.code });

        if (!giftCard) {
            return res.status(404).json({
                success: false,
                message: 'Gift card not found'
            });
        }

        if (!giftCard.isValid()) {
            return res.status(400).json({
                success: false,
                message: 'Gift card is not valid'
            });
        }

        await giftCard.redeem(amount, bookingId);

        res.status(200).json({
            success: true,
            data: giftCard
        });
    } catch (error) {
        logger.error('Error redeeming gift card:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error redeeming gift card'
        });
    }
};

// Admin: Get all gift cards
export const getAllGiftCards = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const query = {};

        if (status) query.status = status;

        const giftCards = await GiftCard.find(query)
            .populate('purchaser', 'name email')
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip((page - 1) * limit);

        const total = await GiftCard.countDocuments(query);

        res.status(200).json({
            success: true,
            data: giftCards,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                page: parseInt(page),
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        logger.error('Error getting gift cards:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching gift cards'
        });
    }
};

// Admin: Cancel gift card
export const cancelGiftCard = async (req, res) => {
    try {
        const giftCard = await GiftCard.findById(req.params.id);

        if (!giftCard) {
            return res.status(404).json({
                success: false,
                message: 'Gift card not found'
            });
        }

        await giftCard.cancel();

        res.status(200).json({
            success: true,
            data: giftCard
        });
    } catch (error) {
        logger.error('Error cancelling gift card:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error cancelling gift card'
        });
    }
};

// Get gift card stats
export const getGiftCardStats = async (req, res) => {
    try {
        const stats = await GiftCard.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalAmount: { $sum: '$amount' },
                    totalBalance: { $sum: '$balance' }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        logger.error('Error getting gift card stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching gift card statistics'
        });
    }
}; 