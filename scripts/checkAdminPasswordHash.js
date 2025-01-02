const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Import User model
const User = require('../server/models/User');

async function checkPasswordHash() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // Find admin user
        const adminUser = await User.findOne({ email: 'admin@precisiondetailing.com' });
        
        if (adminUser) {
            console.log('Admin user found. Password hash details:');
            console.log({
                username: adminUser.username,
                email: adminUser.email,
                passwordHash: adminUser.password,
                mustChangePassword: adminUser.mustChangePassword
            });
        } else {
            console.error('Admin user not found');
        }

        // Close connection
        await mongoose.connection.close();
    } catch (error) {
        console.error('Error checking password hash:', error);
        process.exit(1);
    }
}

checkPasswordHash();
