import mongoose from 'mongoose';

const loyaltyPointsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    points: {
        type: Number,
        default: 0,
        min: 0
    },
    tier: {
        type: String,
        enum: ['Bronze', 'Silver', 'Gold', 'Platinum'],
        default: 'Bronze'
    },
    history: [{
        type: {
            type: String,
            enum: ['earned', 'redeemed', 'expired', 'adjusted'],
            required: true
        },
        points: {
            type: Number,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Booking'
        },
        expiryDate: Date,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    totalEarned: {
        type: Number,
        default: 0
    },
    totalRedeemed: {
        type: Number,
        default: 0
    },
    totalExpired: {
        type: Number,
        default: 0
    },
    benefits: [{
        name: String,
        description: String,
        isActive: {
            type: Boolean,
            default: true
        }
    }],
    nextTierProgress: {
        pointsNeeded: Number,
        percentage: Number
    }
}, {
    timestamps: true
});

// Calculate tier based on points
loyaltyPointsSchema.methods.calculateTier = function() {
    const points = this.points;
    if (points >= 1000) return 'Platinum';
    if (points >= 500) return 'Gold';
    if (points >= 200) return 'Silver';
    return 'Bronze';
};

// Update tier and benefits
loyaltyPointsSchema.methods.updateTierAndBenefits = function() {
    const newTier = this.calculateTier();
    if (newTier !== this.tier) {
        this.tier = newTier;
        this.benefits = this.getTierBenefits(newTier);
    }
    this.calculateNextTierProgress();
    return this.save();
};

// Get benefits for a tier
loyaltyPointsSchema.methods.getTierBenefits = function(tier) {
    const benefits = {
        Bronze: [
            { name: 'Welcome Bonus', description: '50 points on first booking' }
        ],
        Silver: [
            { name: '5% Discount', description: '5% off all services' },
            { name: 'Priority Booking', description: 'Early access to promotions' }
        ],
        Gold: [
            { name: '10% Discount', description: '10% off all services' },
            { name: 'Free Add-on', description: 'One free add-on service per booking' },
            { name: 'Priority Support', description: '24/7 priority customer support' }
        ],
        Platinum: [
            { name: '15% Discount', description: '15% off all services' },
            { name: 'VIP Treatment', description: 'Exclusive VIP benefits' },
            { name: 'Free Annual Detail', description: 'One free full detail per year' },
            { name: 'Dedicated Manager', description: 'Personal account manager' }
        ]
    };
    return benefits[tier] || [];
};

// Calculate progress to next tier
loyaltyPointsSchema.methods.calculateNextTierProgress = function() {
    const tierThresholds = {
        Bronze: 200,  // Points needed for Silver
        Silver: 500,  // Points needed for Gold
        Gold: 1000,   // Points needed for Platinum
        Platinum: null
    };

    const nextThreshold = tierThresholds[this.tier];
    if (nextThreshold) {
        const remaining = nextThreshold - this.points;
        const progress = (this.points / nextThreshold) * 100;
        this.nextTierProgress = {
            pointsNeeded: remaining,
            percentage: Math.min(progress, 100)
        };
    } else {
        this.nextTierProgress = {
            pointsNeeded: 0,
            percentage: 100
        };
    }
};

// Add points
loyaltyPointsSchema.methods.addPoints = function(points, description, booking = null, expiryDate = null) {
    this.points += points;
    this.totalEarned += points;
    this.history.push({
        type: 'earned',
        points,
        description,
        booking,
        expiryDate
    });
    return this.updateTierAndBenefits();
};

// Redeem points
loyaltyPointsSchema.methods.redeemPoints = function(points, description, booking = null) {
    if (points > this.points) {
        throw new Error('Insufficient points');
    }
    this.points -= points;
    this.totalRedeemed += points;
    this.history.push({
        type: 'redeemed',
        points: -points,
        description,
        booking
    });
    return this.updateTierAndBenefits();
};

const LoyaltyPoints = mongoose.model('LoyaltyPoints', loyaltyPointsSchema);

export default LoyaltyPoints; 