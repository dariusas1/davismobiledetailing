import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, 'Please provide a question'],
        trim: true,
        unique: true
    },
    answer: {
        type: String,
        required: [true, 'Please provide an answer'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Please provide a category'],
        enum: ['General', 'Services', 'Pricing', 'Booking', 'Products', 'Other'],
        default: 'General'
    },
    order: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    views: {
        type: Number,
        default: 0
    },
    helpfulVotes: {
        type: Number,
        default: 0
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for efficient queries
faqSchema.index({ category: 1, order: 1 });
faqSchema.index({ isPublished: 1, category: 1 });

const FAQ = mongoose.model('FAQ', faqSchema);

export default FAQ; 