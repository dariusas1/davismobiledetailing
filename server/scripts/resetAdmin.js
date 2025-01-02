require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const seedAdmin = require('../seeders/adminSeeder');

const resetAdmin = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		});
		console.log('Connected to MongoDB');

		// Delete existing admin user
		await User.deleteOne({ 
			$or: [
				{ email: 'admin@precisiondetailing.com' },
				{ username: 'admin' }
			]
		});
		console.log('Existing admin user deleted');

		// Create new admin user
		await seedAdmin();
		console.log('Admin user reset completed');
		
		process.exit(0);
	} catch (error) {
		console.error('Error resetting admin:', error);
		process.exit(1);
	}
};

resetAdmin();