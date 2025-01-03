const bcrypt = require('bcryptjs');
const User = require('../models/User');

const seedAdmin = async () => {
    try {
        await User.deleteMany({ role: 'admin' });
        console.log('Cleaned up existing admin users');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        const admin = new User({
            username: 'admin',
            email: 'admin@precisiondetailing.com',
            password: hashedPassword,
            role: 'admin',
            mustChangePassword: false
        });

        await admin.save();
        console.log('Admin user created successfully');
    } catch (error) {
        console.error('Error seeding admin user:', error);
    }
};

module.exports = seedAdmin;
