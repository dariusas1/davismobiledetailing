const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../server/models/User');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function resetPasswordFlag() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // Find and update admin user
        const result = await User.findOneAndUpdate(
            { email: 'admin@precisiondetailing.com' },
            { $set: { mustChangePassword: false } },
            { new: true }
        );

        if (result) {
            console.log('Admin user updated successfully:');
            console.log({
                username: result.username,
                email: result.email,
                mustChangePassword: result.mustChangePassword
            });
        } else {
            console.error('Admin user not found');
        }

        // Close connection
        await mongoose.connection.close();
    } catch (error) {
        console.error('Error updating admin user:', error);
        process.exit(1);
    }
}

resetPasswordFlag();
