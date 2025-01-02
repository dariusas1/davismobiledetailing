const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Import User model
const User = require('../server/models/User');

async function checkAdminUser() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // Find admin user
        const adminUser = await User.findOne({ 
            email: 'admin@precisiondetailing.com' 
        });

        if (adminUser) {
            console.log('Admin user found:');
            console.log({
                username: adminUser.username,
                email: adminUser.email,
                role: adminUser.role,
                passwordHash: adminUser.password,
                mustChangePassword: adminUser.mustChangePassword,
                lastPasswordChange: adminUser.lastPasswordChange
            });
        } else {
            console.error('Admin user not found');
        }

        // Close connection
        await mongoose.connection.close();
    } catch (error) {
        console.error('Error checking admin user:', error);
        process.exit(1);
    }
}

checkAdminUser();
