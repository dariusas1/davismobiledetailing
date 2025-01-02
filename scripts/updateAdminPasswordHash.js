const bcrypt = require('bcryptjs');
const User = require('../server/models/User');

const mongoose = require('mongoose');
require('dotenv').config();

const updateAdminPassword = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000
        });

        const adminEmail = 'admin@precisiondetailing.com';
        const plainPassword = 'admin123';
        
        // Generate salt and hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(plainPassword, salt);

        // Update admin user with hashed password
        const updatedUser = await User.findOneAndUpdate(
            { email: adminEmail },
            { password: hashedPassword },
            { 
                new: true,
                maxTimeMS: 30000 // Increase timeout for the operation
            }
        );

        if (!updatedUser) {
            console.error('Admin user not found');
            process.exit(1);
        }

        console.log('Admin password successfully updated with hash:', hashedPassword);
        process.exit(0);
    } catch (error) {
        console.error('Error updating admin password:', error);
        process.exit(1);
    }
};

updateAdminPassword();
