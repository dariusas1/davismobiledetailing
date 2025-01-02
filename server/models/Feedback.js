import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['service', 'website', 'app', 'staff', 'general', 'suggestion'],
        default: 'general'
    },
    category: {
        type: String,
        required: true,
        enum: ['bug', 'feature', 'complaint', 'praise', 'suggestion', 'other'],
        default: 'other'
    },
    title: {
        type: String,
        required: [true, 'Please provide a feedback title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please provide feedback description'],
        trim: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
    },
    status: {
        type: String,
        enum: ['new', 'in-review', 'in-progress', 'resolved', 'closed'],
        default: 'new'
    },
    resolution: {
        status: {
            type: String,
            enum: ['pending', 'resolved', 'rejected'],
            default: 'pending'
        },
        note: String,
        resolvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        resolvedAt: Date
    },
    attachments: [{
        url: {
            type: String,
            required: true,
            validate: {
                validator: function(v) {
                    return /^https?:\/\/.+\.(jpg|jpeg|png|gif|pdf)$/i.test(v);
                },
                message: props => `${props.value} is not a valid file URL!`
            }
        },
        type: {
            type: String,
            enum: ['image', 'document'],
            required: true
        },
        name: String
    }],
    tags: [{
        type: String,
        trim: true
    }],
    source: {
        type: String,
        enum: ['web', 'mobile', 'email', 'phone', 'in-person'],
        default: 'web'
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    responses: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        message: {
            type: String,
            required: true,
            trim: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        isStaff: {
            type: Boolean,
            default: false
        }
    }],
    meta: {
        browser: String,
        os: String,
        device: String,
        location: String
    }
}, {
    timestamps: true
});

// Indexes for efficient queries
feedbackSchema.index({ user: 1, createdAt: -1 });
feedbackSchema.index({ type: 1, status: 1 });
feedbackSchema.index({ priority: 1, status: 1 });
feedbackSchema.index({ tags: 1 });

// Add response to feedback
feedbackSchema.methods.addResponse = async function(userId, message, isStaff = false) {
    this.responses.push({
        user: userId,
        message,
        isStaff
    });
    return this.save();
};

// Update feedback status
feedbackSchema.methods.updateStatus = async function(status, userId, note = '') {
    this.status = status;
    if (status === 'resolved' || status === 'closed') {
        this.resolution = {
            status: 'resolved',
            note,
            resolvedBy: userId,
            resolvedAt: new Date()
        };
    }
    return this.save();
};

const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback; 