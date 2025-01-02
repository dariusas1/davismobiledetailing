require('dotenv').config();
const mongoose = require('mongoose');
const seedAdmin = require('../seeders/adminSeeder');

const runSeed = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		});
		console.log('Connected to MongoDB');

		await seedAdmin();
		console.log('Admin seeding completed');
		
		process.exit(0);
	} catch (error) {
		console.error('Error running seed:', error);
		process.exit(1);
	}
};

runSeed();