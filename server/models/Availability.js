import mongoose from 'mongoose';

const availabilitySchema = new mongoose.Schema({
    date: {
        type: Date,
        required: [true, 'Please provide a date']
    },
    timeSlots: [{
        startTime: {
            type: String,
            required: [true, 'Please provide a start time']
        },
        endTime: {
            type: String,
            required: [true, 'Please provide an end time']
        },
        isAvailable: {
            type: Boolean,
            default: true
        },
        booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Booking'
        },
        maxBookings: {
            type: Number,
            default: 1
        },
        currentBookings: {
            type: Number,
            default: 0
        }
    }],
    isHoliday: {
        type: Boolean,
        default: false
    },
    holidayReason: {
        type: String
    },
    specialHours: {
        isSpecial: {
            type: Boolean,
            default: false
        },
        reason: String
    },
    blockouts: [{
        startTime: String,
        endTime: String,
        reason: String
    }]
}, {
    timestamps: true
});

// Indexes for efficient queries
availabilitySchema.index({ date: 1 });
availabilitySchema.index({ 'timeSlots.isAvailable': 1, date: 1 });

// Check if a time slot is available
availabilitySchema.methods.isTimeSlotAvailable = function(startTime) {
    const slot = this.timeSlots.find(slot => slot.startTime === startTime);
    return slot && slot.isAvailable && slot.currentBookings < slot.maxBookings;
};

// Book a time slot
availabilitySchema.methods.bookTimeSlot = function(startTime, bookingId) {
    const slot = this.timeSlots.find(slot => slot.startTime === startTime);
    if (slot && this.isTimeSlotAvailable(startTime)) {
        slot.currentBookings += 1;
        slot.isAvailable = slot.currentBookings < slot.maxBookings;
        slot.booking = bookingId;
        return this.save();
    }
    throw new Error('Time slot not available');
};

// Cancel a booking in a time slot
availabilitySchema.methods.cancelBooking = function(startTime, bookingId) {
    const slot = this.timeSlots.find(slot => slot.startTime === startTime);
    if (slot && slot.booking?.equals(bookingId)) {
        slot.currentBookings = Math.max(0, slot.currentBookings - 1);
        slot.isAvailable = true;
        slot.booking = null;
        return this.save();
    }
    throw new Error('Booking not found in time slot');
};

const Availability = mongoose.model('Availability', availabilitySchema);

export default Availability; 