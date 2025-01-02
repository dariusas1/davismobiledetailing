import mongoose from 'mongoose';

const dynamicPricingSchema = new mongoose.Schema({
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    basePrice: {
        type: Number,
        required: [true, 'Base price is required']
    },
    currentPrice: {
        type: Number,
        required: true
    },
    factors: {
        demandMultiplier: {
            type: Number,
            default: 1.0,
            min: 0.5,
            max: 2.0
        },
        seasonalMultiplier: {
            type: Number,
            default: 1.0,
            min: 0.8,
            max: 1.5
        },
        timeOfDayMultiplier: {
            type: Number,
            default: 1.0,
            min: 0.9,
            max: 1.3
        },
        vehicleTypeMultiplier: {
            sedan: { type: Number, default: 1.0 },
            suv: { type: Number, default: 1.2 },
            truck: { type: Number, default: 1.3 },
            van: { type: Number, default: 1.25 },
            luxury: { type: Number, default: 1.4 }
        }
    },
    rules: {
        maxPriceIncrease: {
            type: Number,
            default: 50, // percentage
            max: 100
        },
        minPriceDecrease: {
            type: Number,
            default: 20, // percentage
            max: 50
        },
        demandThresholds: {
            low: { type: Number, default: 0.3 },
            medium: { type: Number, default: 0.6 },
            high: { type: Number, default: 0.8 }
        }
    },
    priceHistory: [{
        price: Number,
        factors: {
            demand: Number,
            seasonal: Number,
            timeOfDay: Number
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    nextUpdateScheduled: Date,
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Calculate current price based on all factors
dynamicPricingSchema.methods.calculatePrice = function(vehicleType = 'sedan', bookingTime = new Date()) {
    const {
        demandMultiplier,
        seasonalMultiplier,
        timeOfDayMultiplier,
        vehicleTypeMultiplier
    } = this.factors;

    const vehicleMultiplier = vehicleTypeMultiplier[vehicleType.toLowerCase()] || 1.0;
    
    const calculatedPrice = this.basePrice * 
        demandMultiplier * 
        seasonalMultiplier * 
        timeOfDayMultiplier * 
        vehicleMultiplier;

    // Apply price limits
    const maxPrice = this.basePrice * (1 + this.rules.maxPriceIncrease / 100);
    const minPrice = this.basePrice * (1 - this.rules.minPriceDecrease / 100);

    this.currentPrice = Math.min(Math.max(calculatedPrice, minPrice), maxPrice);
    this.lastUpdated = new Date();

    // Record price history
    this.priceHistory.push({
        price: this.currentPrice,
        factors: {
            demand: demandMultiplier,
            seasonal: seasonalMultiplier,
            timeOfDay: timeOfDayMultiplier
        }
    });

    return this.save();
};

// Update demand multiplier based on bookings
dynamicPricingSchema.methods.updateDemandMultiplier = async function(bookingsCount, capacity) {
    const demandRatio = bookingsCount / capacity;
    let multiplier = 1.0;

    if (demandRatio >= this.rules.demandThresholds.high) {
        multiplier = 1.5;
    } else if (demandRatio >= this.rules.demandThresholds.medium) {
        multiplier = 1.25;
    } else if (demandRatio <= this.rules.demandThresholds.low) {
        multiplier = 0.8;
    }

    this.factors.demandMultiplier = multiplier;
    return this.calculatePrice();
};

// Update seasonal multiplier based on time of year
dynamicPricingSchema.methods.updateSeasonalMultiplier = function() {
    const month = new Date().getMonth();
    let multiplier = 1.0;

    // Peak season (summer months)
    if (month >= 5 && month <= 7) {
        multiplier = 1.3;
    }
    // Shoulder season (spring and fall)
    else if ((month >= 2 && month <= 4) || (month >= 8 && month <= 10)) {
        multiplier = 1.1;
    }
    // Off season (winter months)
    else {
        multiplier = 0.9;
    }

    this.factors.seasonalMultiplier = multiplier;
    return this.calculatePrice();
};

// Update time of day multiplier
dynamicPricingSchema.methods.updateTimeOfDayMultiplier = function(hour = new Date().getHours()) {
    let multiplier = 1.0;

    // Peak hours (9 AM - 5 PM)
    if (hour >= 9 && hour <= 17) {
        multiplier = 1.2;
    }
    // Early morning/evening (7-9 AM, 5-7 PM)
    else if ((hour >= 7 && hour < 9) || (hour > 17 && hour <= 19)) {
        multiplier = 1.1;
    }
    // Off-peak hours
    else {
        multiplier = 0.9;
    }

    this.factors.timeOfDayMultiplier = multiplier;
    return this.calculatePrice();
};

// Indexes for efficient queries
dynamicPricingSchema.index({ service: 1, isActive: 1 });
dynamicPricingSchema.index({ lastUpdated: 1 });
dynamicPricingSchema.index({ nextUpdateScheduled: 1 });

const DynamicPricing = mongoose.model('DynamicPricing', dynamicPricingSchema);

export default DynamicPricing; 