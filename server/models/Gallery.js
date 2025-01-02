import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide an image title'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    imageUrl: {
        type: String,
        required: [true, 'Please provide an image URL'],
        validate: {
            validator: function(v) {
                return /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/i.test(v);
            },
            message: props => `${props.value} is not a valid image URL!`
        }
    },
    thumbnailUrl: {
        type: String,
        required: [true, 'Please provide a thumbnail URL'],
        validate: {
            validator: function(v) {
                return /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/i.test(v);
            },
            message: props => `${props.value} is not a valid image URL!`
        }
    },
    category: {
        type: String,
        required: [true, 'Please provide a category'],
        enum: ['Interior', 'Exterior', 'Full Detail', 'Paint Correction', 'Ceramic Coating', 'Other'],
        default: 'Other'
    },
    tags: [{
        type: String,
        trim: true
    }],
    vehicle: {
        make: String,
        model: String,
        year: Number
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service'
    },
    beforeAfter: {
        before: {
            imageUrl: String,
            description: String
        },
        after: {
            imageUrl: String,
            description: String
        }
    },
    featured: {
        type: Boolean,
        default: false
    },
    order: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Indexes for efficient queries
gallerySchema.index({ category: 1, order: 1 });
gallerySchema.index({ featured: 1, order: 1 });
gallerySchema.index({ tags: 1 });

const Gallery = mongoose.model('Gallery', gallerySchema);

export default Gallery; 