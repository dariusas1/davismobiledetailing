import mongoose from 'mongoose';

const maintenanceReminderSchema = new mongoose.Schema({
    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['wash', 'wax', 'interior', 'paint_correction', 'ceramic_coating', 'inspection']
    },
    status: {
        type: String,
        enum: ['scheduled', 'due', 'overdue', 'completed', 'cancelled'],
        default: 'scheduled'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    frequency: {
        value: {
            type: Number,
            required: true
        },
        unit: {
            type: String,
            enum: ['days', 'weeks', 'months', 'miles'],
            required: true
        }
    },
    lastService: {
        date: Date,
        mileage: Number,
        notes: String,
        serviceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Service'
        }
    },
    nextDueDate: {
        type: Date,
        required: true
    },
    notificationSettings: {
        enabled: {
            type: Boolean,
            default: true
        },
        channels: [{
            type: String,
            enum: ['email', 'sms', 'push'],
            default: ['email']
        }],
        advanceNotice: {
            type: Number,
            default: 7, // days
            min: 1,
            max: 30
        }
    },
    customInstructions: String,
    history: [{
        date: {
            type: Date,
            default: Date.now
        },
        action: {
            type: String,
            enum: ['created', 'updated', 'completed', 'cancelled', 'notification_sent']
        },
        notes: String,
        mileage: Number,
        performedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Calculate next due date based on frequency
maintenanceReminderSchema.methods.calculateNextDueDate = function() {
    const { value, unit } = this.frequency;
    const baseDate = this.lastService?.date || new Date();
    
    switch(unit) {
        case 'days':
            this.nextDueDate = new Date(baseDate.setDate(baseDate.getDate() + value));
            break;
        case 'weeks':
            this.nextDueDate = new Date(baseDate.setDate(baseDate.getDate() + (value * 7)));
            break;
        case 'months':
            this.nextDueDate = new Date(baseDate.setMonth(baseDate.getMonth() + value));
            break;
        default:
            // For mileage-based reminders, we'll need to estimate based on average daily mileage
            this.nextDueDate = new Date(baseDate.setDate(baseDate.getDate() + 30));
    }
    
    return this.save();
};

// Update reminder status based on current date
maintenanceReminderSchema.methods.updateStatus = function() {
    const now = new Date();
    const daysUntilDue = Math.ceil((this.nextDueDate - now) / (1000 * 60 * 60 * 24));
    
    if (daysUntilDue < 0) {
        this.status = 'overdue';
    } else if (daysUntilDue === 0) {
        this.status = 'due';
    } else {
        this.status = 'scheduled';
    }
    
    return this.save();
};

// Mark service as completed
maintenanceReminderSchema.methods.completeService = async function(serviceData) {
    const {
        date = new Date(),
        mileage,
        notes,
        serviceId,
        performedBy
    } = serviceData;

    this.lastService = {
        date,
        mileage,
        notes,
        serviceId
    };

    this.history.push({
        date,
        action: 'completed',
        notes,
        mileage,
        performedBy
    });

    this.status = 'completed';
    await this.calculateNextDueDate();
    
    return this.save();
};

// Check if notification should be sent
maintenanceReminderSchema.methods.shouldNotify = function() {
    if (!this.notificationSettings.enabled) return false;
    
    const now = new Date();
    const daysUntilDue = Math.ceil((this.nextDueDate - now) / (1000 * 60 * 60 * 24));
    
    return daysUntilDue <= this.notificationSettings.advanceNotice;
};

// Indexes for efficient queries
maintenanceReminderSchema.index({ vehicle: 1, isActive: 1 });
maintenanceReminderSchema.index({ user: 1, isActive: 1 });
maintenanceReminderSchema.index({ nextDueDate: 1, status: 1 });
maintenanceReminderSchema.index({ 'lastService.date': 1 });

const MaintenanceReminder = mongoose.model('MaintenanceReminder', maintenanceReminderSchema);

export default MaintenanceReminder; 