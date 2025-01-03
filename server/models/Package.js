import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  duration: {
    type: Number,
    required: true,
    min: 30 // Minimum 30 minutes
  },
  services: [{
    type: String,
    required: true
  }],
  vehicleTypes: [{
    type: String,
    required: true,
    enum: ['Sedan', 'SUV', 'Truck', 'Van', 'Luxury Vehicle', 'Sports Car']
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add indexes for frequently queried fields
packageSchema.index({ name: 1 });
packageSchema.index({ isActive: 1 });
packageSchema.index({ vehicleTypes: 1 });

const Package = mongoose.model('Package', packageSchema);
export default Package;
