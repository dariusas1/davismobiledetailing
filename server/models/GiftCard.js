import mongoose from 'mongoose';
import crypto from 'crypto';

const giftCardSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },
    amount: {
        type: Number,
        required: [true, 'Please provide gift card amount'],
        min: [10, 'Gift card amount must be at least $10']
    },
    balance: {
        type: Number,
        required: true
    },
    purchaser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipient: {
        name: {
            type: String,
            required: [true, 'Please provide recipient name']
        },
        email: {
            type: String,
            required: [true, 'Please provide recipient email'],
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
        },
        message: String
    },
    status: {
        type: String,
        enum: ['active', 'redeemed', 'expired', 'cancelled'],
        default: 'active'
    },
    expiryDate: {
        type: Date,
        required: true,
        default: () => new Date(+new Date() + 365*24*60*60*1000) // 1 year from now
    },
    usageHistory: [{
        amount: Number,
        booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Booking'
        },
        date: {
            type: Date,
            default: Date.now
        }
    }],
    isDigital: {
        type: Boolean,
        default: true
    },
    deliveryStatus: {
        sent: {
            type: Boolean,
            default: false
        },
        sentAt: Date,
        error: String
    }
}, {
    timestamps: true
});

// Generate unique gift card code
giftCardSchema.statics.generateCode = function() {
    return crypto.randomBytes(6).toString('hex').toUpperCase();
};

// Check if gift card is valid
giftCardSchema.methods.isValid = function() {
    return (
        this.status === 'active' &&
        this.balance > 0 &&
        new Date() < this.expiryDate
    );
};

// Redeem amount from gift card
giftCardSchema.methods.redeem = async function(amount, bookingId) {
    if (!this.isValid()) {
        throw new Error('Gift card is not valid');
    }
    if (amount > this.balance) {
        throw new Error('Insufficient balance');
    }

    this.balance -= amount;
    this.usageHistory.push({
        amount,
        booking: bookingId,
        date: new Date()
    });

    if (this.balance === 0) {
        this.status = 'redeemed';
    }

    return this.save();
};

// Cancel gift card
giftCardSchema.methods.cancel = async function() {
    if (this.status !== 'active') {
        throw new Error('Gift card cannot be cancelled');
    }
    this.status = 'cancelled';
    return this.save();
};

// Indexes for efficient queries
giftCardSchema.index({ code: 1 });
giftCardSchema.index({ purchaser: 1 });
giftCardSchema.index({ status: 1 });
giftCardSchema.index({ expiryDate: 1 });

const GiftCard = mongoose.model('GiftCard', giftCardSchema);

export default GiftCard; 