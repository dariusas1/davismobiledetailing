const mongoose = require('mongoose');

const LoyaltyProgramSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    points: {
        type: Number,
        default: 0
    },
    level: {
        type: String,
        enum: ['standard', 'bronze', 'silver', 'gold', 'platinum'],
        default: 'standard'
    },
    totalSpend: {
        type: Number,
        default: 0
    },
    bookingHistory: [{
        bookingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Booking'
        },
        points: Number,
        date: Date
    }],
    redeemableRewards: [{
        type: {
            type: String,
            enum: ['discount', 'freeService', 'upgrade']
        },
        value: Number,
        expiresAt: Date
    }]
}, { 
    timestamps: true 
});

// Loyalty level calculation method
LoyaltyProgramSchema.methods.calculateLoyaltyLevel = function() {
    const totalSpend = this.totalSpend;

    if (totalSpend >= 5000) return 'platinum';
    if (totalSpend >= 2500) return 'gold';
    if (totalSpend >= 1000) return 'silver';
    if (totalSpend >= 500) return 'bronze';
    
    return 'standard';
};

// Add points for a booking
LoyaltyProgramSchema.methods.addBookingPoints = function(bookingAmount) {
    // 1 point per $10 spent
    const pointsEarned = Math.floor(bookingAmount / 10);
    
    this.points += pointsEarned;
    this.totalSpend += bookingAmount;
    
    // Update loyalty level
    this.level = this.calculateLoyaltyLevel();

    // Add to booking history
    this.bookingHistory.push({
        points: pointsEarned,
        date: new Date()
    });

    return pointsEarned;
};

// Redeem points
LoyaltyProgramSchema.methods.redeemPoints = function(rewardType, pointsCost) {
    if (this.points < pointsCost) {
        throw new Error('Insufficient points');
    }

    this.points -= pointsCost;

    const reward = {
        type: rewardType,
        value: this.calculateRewardValue(rewardType),
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days
    };

    this.redeemableRewards.push(reward);

    return reward;
};

// Calculate reward value
LoyaltyProgramSchema.methods.calculateRewardValue = function(rewardType) {
    const rewardValues = {
        'discount': 50,      // $50 off next service
        'freeService': 100,  // Free basic service
        'upgrade': 75        // Free upgrade to next service tier
    };

    return rewardValues[rewardType] || 0;
};

// Static method to create or update loyalty program
LoyaltyProgramSchema.statics.createOrUpdateForUser = async function(userId, bookingAmount) {
    let loyaltyProgram = await this.findOne({ user: userId });

    if (!loyaltyProgram) {
        loyaltyProgram = new this({ 
            user: userId 
        });
    }

    loyaltyProgram.addBookingPoints(bookingAmount);
    await loyaltyProgram.save();

    return loyaltyProgram;
};

module.exports = mongoose.model('LoyaltyProgram', LoyaltyProgramSchema);
