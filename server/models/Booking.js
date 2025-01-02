import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
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
    date: {
        type: Date,
        required: [true, 'Please provide a booking date']
    },
    time: {
        type: String,
        required: [true, 'Please provide a booking time']
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending'
    },
    location: {
        address: {
            type: String,
            required: [true, 'Please provide an address']
        },
        city: {
            type: String,
            required: [true, 'Please provide a city']
        },
        state: {
            type: String,
            required: [true, 'Please provide a state']
        },
        zipCode: {
            type: String,
            required: [true, 'Please provide a ZIP code']
        }
    },
    vehicle: {
        make: {
            type: String,
            required: [true, 'Please provide vehicle make']
        },
        model: {
            type: String,
            required: [true, 'Please provide vehicle model']
        },
        year: {
            type: Number,
            required: [true, 'Please provide vehicle year']
        },
        color: {
            type: String,
            required: [true, 'Please provide vehicle color']
        }
    },
    totalPrice: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    notes: {
        type: String
    }
}, {
    timestamps: true
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
