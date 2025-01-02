const mongoose = require('mongoose');
const User = require('../server/models/User');
require('dotenv').config();

async function verifyAdminCredentials() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        const admin = await User.findOne({ username: 'precisionadmin' });
        
        if (!admin) {
            console.error('Admin user not found');
            process.exit(1);
        }

        console.log('Admin user found:');
        console.log('Username:', admin.username);
        console.log('Email:', admin.email);
        console.log('Password hash:', admin.password);
        console.log('Role:', admin.role);

        const passwordMatch = await admin.comparePassword('admin123');
        console.log('Password verification result:', passwordMatch);

        process.exit(0);
    } catch (error) {
        console.error('Error verifying admin credentials:', error);
        process.exit(1);
    }
}

verifyAdminCredentials();
