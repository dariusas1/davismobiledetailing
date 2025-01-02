import mongoose from 'mongoose';
import crypto from 'crypto';

const referralSchema = new mongoose.Schema({
    referrer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    code: {
        type: String,
        unique: true,
        required: true
    },
    referrals: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        status: {
            type: String,
            enum: ['pending', 'completed', 'expired'],
            default: 'pending'
        },
        bookings: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Booking'
        }],
        pointsEarned: {
            type: Number,
            default: 0
        },
        signupDate: {
            type: Date,
            default: Date.now
        },
        completedDate: Date
    }],
    rewards: {
        signupBonus: {
            type: Number,
            default: 50 // Points for referee signup
        },
        bookingBonus: {
            type: Number,
            default: 100 // Points for first booking
        },
        referrerBonus: {
            type: Number,
            default: 150 // Points for referrer
        }
    },
    stats: {
        totalReferrals: {
            type: Number,
            default: 0
        },
        successfulReferrals: {
            type: Number,
            default: 0
        },
        totalPointsEarned: {
            type: Number,
            default: 0
        },
        totalBookings: {
            type: Number,
            default: 0
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    expiryDate: {
        type: Date,
        default: () => new Date(+new Date() + 365*24*60*60*1000) // 1 year from now
    }
}, {
    timestamps: true
});

// Generate unique referral code
referralSchema.statics.generateCode = function() {
    return crypto.randomBytes(4).toString('hex').toUpperCase();
};

// Add new referral
referralSchema.methods.addReferral = async function(userId) {
    if (!this.isActive || new Date() > this.expiryDate) {
        throw new Error('Referral program is not active or has expired');
    }

    const existingReferral = this.referrals.find(ref => 
        ref.user.toString() === userId.toString()
    );

    if (existingReferral) {
        throw new Error('User has already been referred');
    }

    this.referrals.push({
        user: userId,
        status: 'pending'
    });

    this.stats.totalReferrals += 1;
    return this.save();
};

// Complete referral after first booking
referralSchema.methods.completeReferral = async function(userId, bookingId) {
    const referral = this.referrals.find(ref => 
        ref.user.toString() === userId.toString() && 
        ref.status === 'pending'
    );

    if (!referral) {
        throw new Error('Referral not found or already completed');
    }

    referral.status = 'completed';
    referral.completedDate = new Date();
    referral.bookings.push(bookingId);
    referral.pointsEarned = this.rewards.signupBonus + this.rewards.bookingBonus;

    this.stats.successfulReferrals += 1;
    this.stats.totalPointsEarned += referral.pointsEarned;
    this.stats.totalBookings += 1;

    return this.save();
};

// Check if referral is valid
referralSchema.methods.isValid = function() {
    return this.isActive && new Date() < this.expiryDate;
};

// Indexes for efficient queries
referralSchema.index({ referrer: 1 });
referralSchema.index({ code: 1 });
referralSchema.index({ 'referrals.user': 1 });
referralSchema.index({ isActive: 1, expiryDate: 1 });

const Referral = mongoose.model('Referral', referralSchema);

export default Referral; 