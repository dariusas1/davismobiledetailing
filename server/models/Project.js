import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Project title is required']
    },
    description: {
        type: String,
        required: [true, 'Project description is required']
    },
    category: {
        type: String,
        required: false
    },
    imageUrl: {
        type: String,
        required: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'published'
    }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Add indexes for better query performance
ProjectSchema.index({ title: 1 });
ProjectSchema.index({ category: 1 });
ProjectSchema.index({ createdBy: 1 });
ProjectSchema.index({ status: 1 });

const Project = mongoose.model('Project', ProjectSchema);
export default Project;
