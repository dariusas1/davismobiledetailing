import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a blog title'],
        trim: true,
        unique: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    content: {
        type: String,
        required: [true, 'Please provide blog content']
    },
    excerpt: {
        type: String,
        required: [true, 'Please provide a blog excerpt'],
        maxlength: [300, 'Excerpt cannot exceed 300 characters']
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    featuredImage: {
        type: String,
        required: [true, 'Please provide a featured image URL'],
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
        enum: ['Tips & Tricks', 'News', 'Product Reviews', 'Case Studies', 'How-To Guides', 'Industry Updates'],
        default: 'Tips & Tricks'
    },
    tags: [{
        type: String,
        trim: true
    }],
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft'
    },
    publishDate: {
        type: Date
    },
    views: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
    },
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        content: {
            type: String,
            required: true,
            trim: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        isApproved: {
            type: Boolean,
            default: false
        }
    }],
    seo: {
        metaTitle: String,
        metaDescription: String,
        keywords: [String]
    }
}, {
    timestamps: true
});

// Create slug from title before saving
blogSchema.pre('save', function(next) {
    if (this.isModified('title')) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
    }
    next();
});

// Indexes for efficient queries
blogSchema.index({ slug: 1 });
blogSchema.index({ category: 1, publishDate: -1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ status: 1, publishDate: -1 });

const Blog = mongoose.model('Blog', blogSchema);

export default Blog; 