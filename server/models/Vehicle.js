import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    make: {
        type: String,
        required: [true, 'Please provide vehicle make'],
        trim: true
    },
    model: {
        type: String,
        required: [true, 'Please provide vehicle model'],
        trim: true
    },
    year: {
        type: Number,
        required: [true, 'Please provide vehicle year'],
        min: [1900, 'Year must be after 1900'],
        max: [new Date().getFullYear() + 1, 'Year cannot be in the future']
    },
    color: {
        type: String,
        required: [true, 'Please provide vehicle color'],
        trim: true
    },
    type: {
        type: String,
        required: [true, 'Please provide vehicle type'],
        enum: ['Sedan', 'SUV', 'Truck', 'Van', 'Coupe', 'Wagon', 'Other'],
        default: 'Sedan'
    },
    licensePlate: {
        type: String,
        trim: true,
        uppercase: true
    },
    vin: {
        type: String,
        trim: true,
        uppercase: true,
        minlength: [17, 'VIN must be 17 characters'],
        maxlength: [17, 'VIN must be 17 characters']
    },
    specialInstructions: {
        type: String,
        trim: true,
        maxlength: [500, 'Special instructions cannot exceed 500 characters']
    },
    serviceHistory: [{
        service: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Service'
        },
        date: {
            type: Date,
            default: Date.now
        },
        notes: String,
        mileage: Number
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index for efficient queries
vehicleSchema.index({ user: 1, licensePlate: 1 });
vehicleSchema.index({ user: 1, make: 1, model: 1 });

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

export default Vehicle; 