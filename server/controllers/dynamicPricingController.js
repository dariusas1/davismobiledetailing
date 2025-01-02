import DynamicPricing from '../models/DynamicPricing.js';
import logger from '../config/logger.js';

// Initialize dynamic pricing for a service
export const initializePricing = async (req, res) => {
    try {
        const {
            service,
            basePrice,
            vehicleTypeMultipliers,
            rules
        } = req.body;

        const pricing = new DynamicPricing({
            service,
            basePrice,
            currentPrice: basePrice
        });

        if (vehicleTypeMultipliers) {
            pricing.factors.vehicleTypeMultiplier = {
                ...pricing.factors.vehicleTypeMultiplier,
                ...vehicleTypeMultipliers
            };
        }

        if (rules) {
            pricing.rules = {
                ...pricing.rules,
                ...rules
            };
        }

        await pricing.calculatePrice();

        res.status(201).json({
            success: true,
            data: pricing
        });
    } catch (error) {
        logger.error('Error initializing dynamic pricing:', error);
        res.status(500).json({
            success: false,
            message: 'Error initializing dynamic pricing'
        });
    }
};

// Get current price for a service
export const getCurrentPrice = async (req, res) => {
    try {
        const { serviceId } = req.params;
        const { vehicleType, bookingTime } = req.query;

        const pricing = await DynamicPricing.findOne({
            service: serviceId,
            isActive: true
        });

        if (!pricing) {
            return res.status(404).json({
                success: false,
                message: 'Pricing not found for this service'
            });
        }

        await pricing.calculatePrice(vehicleType, bookingTime ? new Date(bookingTime) : undefined);

        res.status(200).json({
            success: true,
            data: {
                currentPrice: pricing.currentPrice,
                basePrice: pricing.basePrice,
                factors: pricing.factors
            }
        });
    } catch (error) {
        logger.error('Error getting current price:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching current price'
        });
    }
};

// Update pricing factors
export const updatePricingFactors = async (req, res) => {
    try {
        const { serviceId } = req.params;
        const {
            demandMultiplier,
            seasonalMultiplier,
            timeOfDayMultiplier,
            vehicleTypeMultiplier
        } = req.body;

        const pricing = await DynamicPricing.findOne({
            service: serviceId,
            isActive: true
        });

        if (!pricing) {
            return res.status(404).json({
                success: false,
                message: 'Pricing not found for this service'
            });
        }

        if (demandMultiplier) pricing.factors.demandMultiplier = demandMultiplier;
        if (seasonalMultiplier) pricing.factors.seasonalMultiplier = seasonalMultiplier;
        if (timeOfDayMultiplier) pricing.factors.timeOfDayMultiplier = timeOfDayMultiplier;
        if (vehicleTypeMultiplier) {
            pricing.factors.vehicleTypeMultiplier = {
                ...pricing.factors.vehicleTypeMultiplier,
                ...vehicleTypeMultiplier
            };
        }

        await pricing.calculatePrice();

        res.status(200).json({
            success: true,
            data: pricing
        });
    } catch (error) {
        logger.error('Error updating pricing factors:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating pricing factors'
        });
    }
};

// Get price history for a service
export const getPriceHistory = async (req, res) => {
    try {
        const { serviceId } = req.params;
        const { startDate, endDate } = req.query;

        const query = {
            service: serviceId,
            isActive: true
        };

        if (startDate || endDate) {
            query['priceHistory.timestamp'] = {};
            if (startDate) query['priceHistory.timestamp'].$gte = new Date(startDate);
            if (endDate) query['priceHistory.timestamp'].$lte = new Date(endDate);
        }

        const pricing = await DynamicPricing.findOne(query);

        if (!pricing) {
            return res.status(404).json({
                success: false,
                message: 'Pricing history not found for this service'
            });
        }

        const history = pricing.priceHistory.filter(record => {
            if (!startDate && !endDate) return true;
            const recordDate = new Date(record.timestamp);
            if (startDate && recordDate < new Date(startDate)) return false;
            if (endDate && recordDate > new Date(endDate)) return false;
            return true;
        });

        res.status(200).json({
            success: true,
            data: history
        });
    } catch (error) {
        logger.error('Error getting price history:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching price history'
        });
    }
};

// Update pricing rules
export const updatePricingRules = async (req, res) => {
    try {
        const { serviceId } = req.params;
        const { rules } = req.body;

        const pricing = await DynamicPricing.findOne({
            service: serviceId,
            isActive: true
        });

        if (!pricing) {
            return res.status(404).json({
                success: false,
                message: 'Pricing not found for this service'
            });
        }

        pricing.rules = {
            ...pricing.rules,
            ...rules
        };

        await pricing.calculatePrice();

        res.status(200).json({
            success: true,
            data: pricing
        });
    } catch (error) {
        logger.error('Error updating pricing rules:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating pricing rules'
        });
    }
}; 