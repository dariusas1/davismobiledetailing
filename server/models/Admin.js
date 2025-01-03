import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'superadmin'],
    default: 'admin'
  },
  lastLogin: {
    type: Date
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Hash password before saving
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
adminSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Create initial admin user if none exists
adminSchema.statics.createInitialAdmin = async function() {
  try {
    const adminCount = await this.countDocuments();
    if (adminCount === 0) {
      await this.create({
        email: process.env.ADMIN_EMAIL || 'info@precisiondetailing.com',
        password: process.env.ADMIN_PASSWORD || 'admin123',
        name: 'Admin',
        role: 'superadmin'
      });
      console.log('Initial admin user created');
    }
  } catch (error) {
    console.error('Error creating initial admin:', error);
  }
};

const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);

// Create initial admin user
Admin.createInitialAdmin();

export default Admin; 