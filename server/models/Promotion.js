import mongoose from 'mongoose';

const promotionSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, 'Please provide a promotion code'],
        unique: true,
        uppercase: true,
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please provide a promotion description']
    },
    discountType: {
        type: String,
        required: [true, 'Please provide a discount type'],
        enum: ['percentage', 'fixed']
    },
    discountValue: {
        type: Number,
        required: [true, 'Please provide a discount value']
    },
    startDate: {
        type: Date,
        required: [true, 'Please provide a start date']
    },
    endDate: {
        type: Date,
        required: [true, 'Please provide an end date']
    },
    minimumPurchase: {
        type: Number,
        default: 0
    },
    maxUses: {
        type: Number,
        default: null
    },
    usedCount: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Check if promotion is valid
promotionSchema.methods.isValid = function() {
    const now = new Date();
    return (
        this.isActive &&
        now >= this.startDate &&
        now <= this.endDate &&
        (this.maxUses === null || this.usedCount < this.maxUses)
    );
};

const Promotion = mongoose.model('Promotion', promotionSchema);

export default Promotion; 