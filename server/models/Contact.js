import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    phone: {
        type: String,
        required: [true, 'Please provide your phone number'],
        trim: true,
        match: [/^\+?1?\d{10,14}$/, 'Please provide a valid phone number']
    },
    message: {
        type: String,
        required: [true, 'Please provide a message'],
        trim: true,
        maxlength: [1000, 'Message cannot exceed 1000 characters']
    },
    subject: {
        type: String,
        required: [true, 'Please provide a subject'],
        trim: true
    },
    status: {
        type: String,
        enum: ['new', 'in-progress', 'completed'],
        default: 'new'
    },
    responseMessage: {
        type: String,
        trim: true
    },
    respondedAt: {
        type: Date
    }
}, {
    timestamps: true
});

const Contact = mongoose.model('Contact', contactSchema);

export default Contact; 