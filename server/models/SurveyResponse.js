import mongoose from 'mongoose';

const surveyResponseSchema = new mongoose.Schema({
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    ratings: {
        overall: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        serviceQuality: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        timeliness: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        communication: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        valueForMoney: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        staffProfessionalism: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        }
    },
    feedback: {
        positives: {
            type: String,
            maxLength: 1000
        },
        improvements: {
            type: String,
            maxLength: 1000
        },
        additionalComments: {
            type: String,
            maxLength: 1000
        }
    },
    satisfaction: {
        wouldRecommend: {
            type: Boolean,
            required: true
        },
        likelyToReturn: {
            type: Number,
            required: true,
            min: 1,
            max: 10
        }
    },
    serviceSpecific: {
        cleanlinessRating: {
            type: Number,
            min: 1,
            max: 5
        },
        attentionToDetail: {
            type: Number,
            min: 1,
            max: 5
        },
        productQuality: {
            type: Number,
            min: 1,
            max: 5
        }
    },
    photos: [{
        before: String,
        after: String,
        caption: String
    }],
    status: {
        type: String,
        enum: ['pending', 'completed', 'reminded', 'expired'],
        default: 'pending'
    },
    reminders: [{
        sentAt: {
            type: Date,
            default: Date.now
        },
        method: {
            type: String,
            enum: ['email', 'sms', 'push']
        }
    }],
    completedAt: Date,
    isPublic: {
        type: Boolean,
        default: false
    },
    adminResponse: {
        content: String,
        respondedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        respondedAt: Date
    },
    tags: [{
        type: String,
        trim: true
    }],
    sentiment: {
        score: Number,
        analysis: {
            positive: Number,
            negative: Number,
            neutral: Number
        }
    }
}, {
    timestamps: true
});

// Calculate average ratings
surveyResponseSchema.methods.calculateAverages = function() {
    const ratings = this.ratings;
    const values = Object.values(ratings);
    return values.reduce((a, b) => a + b, 0) / values.length;
};

// Check if reminder should be sent
surveyResponseSchema.methods.shouldSendReminder = function() {
    if (this.status !== 'pending') return false;
    
    const lastReminder = this.reminders[this.reminders.length - 1];
    if (!lastReminder) return true;

    const daysSinceLastReminder = (Date.now() - lastReminder.sentAt) / (1000 * 60 * 60 * 24);
    return daysSinceLastReminder >= 3; // Send reminder every 3 days
};

// Add sentiment analysis
surveyResponseSchema.methods.analyzeSentiment = function() {
    // Combine all text feedback
    const text = [
        this.feedback.positives,
        this.feedback.improvements,
        this.feedback.additionalComments
    ].filter(Boolean).join(' ');

    // Simple sentiment analysis (replace with more sophisticated solution)
    const words = text.toLowerCase().split(/\s+/);
    let positive = 0, negative = 0, neutral = 0;

    words.forEach(word => {
        if (positiveWords.includes(word)) positive++;
        else if (negativeWords.includes(word)) negative++;
        else neutral++;
    });

    const total = positive + negative + neutral;
    this.sentiment = {
        score: (positive - negative) / total,
        analysis: {
            positive: positive / total,
            negative: negative / total,
            neutral: neutral / total
        }
    };

    return this.save();
};

// Indexes for efficient queries
surveyResponseSchema.index({ booking: 1, user: 1 });
surveyResponseSchema.index({ service: 1 });
surveyResponseSchema.index({ status: 1 });
surveyResponseSchema.index({ 'ratings.overall': 1 });
surveyResponseSchema.index({ createdAt: 1 });
surveyResponseSchema.index({ completedAt: 1 });

const SurveyResponse = mongoose.model('SurveyResponse', surveyResponseSchema);

export default SurveyResponse; 