import mongoose from 'mongoose';

const servicePackageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a package name'],
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please provide a package description']
    },
    services: [{
        service: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Service',
            required: true
        },
        quantity: {
            type: Number,
            default: 1,
            min: 1
        }
    }],
    price: {
        type: Number,
        required: [true, 'Please provide a package price']
    },
    originalPrice: {
        type: Number,
        required: [true, 'Please provide the original price']
    },
    savings: {
        type: Number,
        required: [true, 'Please provide the savings amount']
    },
    duration: {
        type: Number,
        required: [true, 'Please provide package duration in minutes']
    },
    image: {
        type: String,
        required: [true, 'Please provide an image URL']
    },
    features: [{
        type: String,
        required: true
    }],
    category: {
        type: String,
        required: [true, 'Please provide a package category'],
        enum: ['Basic', 'Premium', 'Ultimate', 'Custom', 'Seasonal', 'Special']
    },
    vehicleTypes: [{
        type: String,
        enum: ['Sedan', 'SUV', 'Truck', 'Van', 'Coupe', 'Wagon', 'Other']
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    popularity: {
        type: Number,
        default: 0
    },
    validityPeriod: {
        startDate: {
            type: Date,
            default: Date.now
        },
        endDate: Date
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for calculating savings percentage
servicePackageSchema.virtual('savingsPercentage').get(function() {
    return Math.round((this.savings / this.originalPrice) * 100);
});

// Indexes for efficient queries
servicePackageSchema.index({ category: 1, isActive: 1 });
servicePackageSchema.index({ vehicleTypes: 1 });
servicePackageSchema.index({ popularity: -1 });

const ServicePackage = mongoose.model('ServicePackage', servicePackageSchema);

export default ServicePackage; 