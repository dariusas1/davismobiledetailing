import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: [
            'booking_created',
            'booking_confirmed',
            'booking_updated',
            'booking_cancelled',
            'booking_reminder',
            'payment_received',
            'payment_failed',
            'review_request',
            'promotion_new',
            'system_notification'
        ]
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    data: {
        booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Booking'
        },
        service: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Service'
        },
        promotion: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Promotion'
        }
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    isRead: {
        type: Boolean,
        default: false
    },
    readAt: {
        type: Date
    },
    deliveryStatus: {
        email: {
            sent: Boolean,
            sentAt: Date,
            error: String
        },
        sms: {
            sent: Boolean,
            sentAt: Date,
            error: String
        },
        push: {
            sent: Boolean,
            sentAt: Date,
            error: String
        }
    },
    expiresAt: {
        type: Date
    }
}, {
    timestamps: true
});

// Indexes for efficient queries
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ user: 1, isRead: 1 });
notificationSchema.index({ type: 1, createdAt: -1 });

// Mark notification as read
notificationSchema.methods.markAsRead = function() {
    this.isRead = true;
    this.readAt = new Date();
    return this.save();
};

// Update delivery status
notificationSchema.methods.updateDeliveryStatus = function(channel, status, error = null) {
    this.deliveryStatus[channel] = {
        sent: status,
        sentAt: status ? new Date() : null,
        error: error
    };
    return this.save();
};

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification; 