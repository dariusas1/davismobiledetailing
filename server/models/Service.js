const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dynamicPricingFactorsSchema = new Schema({
    demand: {
        type: Number,
        default: 1,
        min: 0.5,
        max: 2
    },
    seasonal: {
        type: Number,
        default: 1,
        min: 0.8,
        max: 1.5
    },
    vehicleSize: {
        type: Number,
        default: 1,
        min: 0.9,
        max: 1.5
    },
    timeOfDay: {
        type: Number,
        default: 1,
        min: 0.9,
        max: 1.2
    }
}, { _id: false });

const serviceSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    shortDescription: {
        type: String,
        required: true,
        maxlength: 200
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    duration: {
        type: Number, // in minutes
        required: true,
        min: 15
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    vehicleTypes: [{
        type: String,
        enum: ['Sedan', 'SUV', 'Truck', 'Van', 'Sports Car', 'Luxury Vehicle', 'Electric Vehicle'],
        required: true
    }],
    features: [{
        type: String,
        required: true
    }],
    image: {
        type: String,
        required: true
    },
    gallery: [{
        type: String
    }],
    popular: {
        type: Boolean,
        default: false
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviewCount: {
        type: Number,
        default: 0
    },
    dynamicPricingFactors: {
        type: dynamicPricingFactorsSchema,
        default: () => ({})
    },
    availability: {
        monday: {
            type: Boolean,
            default: true
        },
        tuesday: {
            type: Boolean,
            default: true
        },
        wednesday: {
            type: Boolean,
            default: true
        },
        thursday: {
            type: Boolean,
            default: true
        },
        friday: {
            type: Boolean,
            default: true
        },
        saturday: {
            type: Boolean,
            default: true
        },
        sunday: {
            type: Boolean,
            default: false
        }
    },
    timeSlots: [{
        startTime: String,
        endTime: String,
        maxBookings: {
            type: Number,
            default: 1
        }
    }],
    prerequisites: [{
        type: String
    }],
    recommendations: [{
        type: String
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    metadata: {
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        updatedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes
serviceSchema.index({ name: 1 });
serviceSchema.index({ category: 1 });
serviceSchema.index({ vehicleTypes: 1 });
serviceSchema.index({ price: 1 });
serviceSchema.index({ popular: -1 });
serviceSchema.index({ rating: -1 });
serviceSchema.index({ isActive: 1 });

// Virtual for average rating
serviceSchema.virtual('averageRating').get(function() {
    return this.reviewCount > 0 ? this.rating / this.reviewCount : 0;
});

// Method to update rating
serviceSchema.methods.updateRating = async function(newRating) {
    const oldTotal = this.rating * this.reviewCount;
    this.reviewCount += 1;
    this.rating = (oldTotal + newRating) / this.reviewCount;
    await this.save();
};

// Method to check availability for a specific date and time
serviceSchema.methods.checkAvailability = async function(date, time) {
    const dayOfWeek = date.toLocaleLowerCase();
    if (!this.availability[dayOfWeek]) {
        return false;
    }

    // Check if time slot exists and has capacity
    const timeSlot = this.timeSlots.find(slot => 
        slot.startTime <= time && slot.endTime >= time
    );

    if (!timeSlot) {
        return false;
    }

    // Check existing bookings for this slot
    const Booking = mongoose.model('Booking');
    const existingBookings = await Booking.countDocuments({
        service: this._id,
        date,
        time,
        status: { $in: ['confirmed', 'in-progress'] }
    });

    return existingBookings < timeSlot.maxBookings;
};

// Method to get dynamic price
serviceSchema.methods.getDynamicPrice = function(factors = {}) {
    const basePrice = this.price;
    const {
        demand = this.dynamicPricingFactors.demand,
        seasonal = this.dynamicPricingFactors.seasonal,
        vehicleSize = this.dynamicPricingFactors.vehicleSize,
        timeOfDay = this.dynamicPricingFactors.timeOfDay
    } = factors;

    const dynamicPrice = basePrice * demand * seasonal * vehicleSize * timeOfDay;
    return Math.round(dynamicPrice * 100) / 100; // Round to 2 decimal places
};

// Pre-save middleware
serviceSchema.pre('save', async function(next) {
    if (this.isModified('price')) {
        // Validate price is not below minimum threshold
        const minPrice = 20; // Minimum price threshold
        if (this.price < minPrice) {
            throw new Error(`Service price cannot be less than $${minPrice}`);
        }
    }

    if (this.isModified('timeSlots')) {
        // Validate time slots are properly formatted and non-overlapping
        const slots = this.timeSlots.sort((a, b) => a.startTime.localeCompare(b.startTime));
        for (let i = 1; i < slots.length; i++) {
            if (slots[i].startTime <= slots[i-1].endTime) {
                throw new Error('Time slots cannot overlap');
            }
        }
    }

    next();
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service; 