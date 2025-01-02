const { logger } = require('../utils/logger');

class PricingService {
    // Base pricing configuration
    static PRICING_CONFIG = {
        baseServices: {
            'Basic Wash': {
                basePrice: 50,
                complexityFactors: {
                    'Small Car': 1.0,
                    'Sedan': 1.2,
                    'SUV': 1.5,
                    'Truck': 1.7
                }
            },
            'Premium Wash': {
                basePrice: 100,
                complexityFactors: {
                    'Small Car': 1.0,
                    'Sedan': 1.3,
                    'SUV': 1.6,
                    'Truck': 1.9
                }
            },
            'Elite Ceramic Package': {
                basePrice: 250,
                complexityFactors: {
                    'Small Car': 1.0,
                    'Sedan': 1.4,
                    'SUV': 1.8,
                    'Truck': 2.2
                }
            }
        },
        seasonalModifiers: {
            winter: 0.9,  // 10% discount
            summer: 1.1,  // 10% premium
            peak: 1.2     // High-demand periods
        },
        timeSlotModifiers: {
            weekday: {
                morning: 0.9,   // 10% discount
                afternoon: 1.0,
                evening: 1.1    // 10% premium
            },
            weekend: {
                morning: 1.0,
                afternoon: 1.2, // 20% premium
                evening: 1.3    // 30% premium
            }
        }
    };

    // Calculate dynamic pricing
    static calculatePrice(options) {
        const { 
            serviceType, 
            vehicleType, 
            date, 
            time,
            loyaltyLevel = 'standard'
        } = options;

        try {
            // Get base service pricing
            const serviceConfig = this.PRICING_CONFIG.baseServices[serviceType];
            if (!serviceConfig) {
                throw new Error(`Unsupported service type: ${serviceType}`);
            }

            // Base price
            let price = serviceConfig.basePrice;

            // Vehicle complexity factor
            const complexityFactor = serviceConfig.complexityFactors[vehicleType] || 1.0;
            price *= complexityFactor;

            // Seasonal modifier
            const season = this.determineSeason(date);
            const seasonalModifier = this.PRICING_CONFIG.seasonalModifiers[season] || 1.0;
            price *= seasonalModifier;

            // Time slot modifier
            const timeSlotModifier = this.determineTimeSlotModifier(date, time);
            price *= timeSlotModifier;

            // Loyalty discount
            const loyaltyDiscount = this.calculateLoyaltyDiscount(loyaltyLevel);
            price *= (1 - loyaltyDiscount);

            // Round to nearest dollar
            return Math.round(price);
        } catch (error) {
            logger.error('Pricing calculation failed', {
                error: error.message,
                options
            });
            throw error;
        }
    }

    // Determine season based on date
    static determineSeason(date) {
        const month = new Date(date).getMonth() + 1;
        if (month >= 12 || month <= 2) return 'winter';
        if (month >= 6 && month <= 8) return 'summer';
        return 'standard';
    }

    // Determine time slot modifier
    static determineTimeSlotModifier(date, time) {
        const dayOfWeek = new Date(date).getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const timeSlotKey = isWeekend ? 'weekend' : 'weekday';

        // Categorize time
        const hour = parseInt(time.split(':')[0]);
        let timeCategory;
        if (hour < 12) timeCategory = 'morning';
        else if (hour < 17) timeCategory = 'afternoon';
        else timeCategory = 'evening';

        return this.PRICING_CONFIG.timeSlotModifiers[timeSlotKey][timeCategory] || 1.0;
    }

    // Calculate loyalty discount
    static calculateLoyaltyDiscount(loyaltyLevel) {
        const loyaltyDiscounts = {
            'standard': 0,
            'bronze': 0.05,   // 5% discount
            'silver': 0.10,   // 10% discount
            'gold': 0.15,     // 15% discount
            'platinum': 0.20  // 20% discount
        };

        return loyaltyDiscounts[loyaltyLevel] || 0;
    }

    // Generate pricing preview
    static generatePricingPreview(serviceType) {
        const serviceConfig = this.PRICING_CONFIG.baseServices[serviceType];
        if (!serviceConfig) {
            throw new Error(`Unsupported service type: ${serviceType}`);
        }

        return {
            basePrice: serviceConfig.basePrice,
            vehiclePricing: Object.entries(serviceConfig.complexityFactors).map(([vehicleType, factor]) => ({
                vehicleType,
                price: Math.round(serviceConfig.basePrice * factor)
            })),
            seasonalPricing: Object.entries(this.PRICING_CONFIG.seasonalModifiers).map(([season, modifier]) => ({
                season,
                modifier: modifier
            })),
            loyaltyDiscounts: [
                { level: 'standard', discount: 0 },
                { level: 'bronze', discount: 0.05 },
                { level: 'silver', discount: 0.10 },
                { level: 'gold', discount: 0.15 },
                { level: 'platinum', discount: 0.20 }
            ]
        };
    }
}

module.exports = PricingService;
