const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../server/models/User');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function verifyAdminPassword() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // Get admin user
        const adminUser = await User.findOne({ email: 'admin@precisiondetailing.com' });
        if (!adminUser) {
            console.error('Admin user not found in database');
            process.exit(1);
        }

        // Verify password
        const passwordFromSeeder = 'PrecisionAdmin2024!';
        console.log('Stored password hash:', adminUser.password);
        const isMatch = await bcrypt.compare(passwordFromSeeder, adminUser.password);

        if (isMatch) {
            console.log('Password verification successful: The password matches the hash in the database');
        } else {
            console.error('Password verification failed: The password does not match the hash in the database');
            console.error('Expected hash:', '$2a$10$FUlxp0uJW5ccYeF6tFnghOy2iV68izsgH4jfQ5WzNSXuReCfNxKiC');
        }

        await mongoose.connection.close();
    } catch (error) {
        console.error('Error during password verification:', error);
        process.exit(1);
    }
}

verifyAdminPassword();
