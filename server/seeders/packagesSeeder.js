const Package = require('../models/Package');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const envPath = path.resolve(__dirname, '../../.env');
if (!fs.existsSync(envPath)) {
  console.error('Error: .env file not found at', envPath);
  process.exit(1);
}

const envConfig = require('dotenv').config({ path: envPath });

if (envConfig.error) {
  console.error('Error loading .env file:', envConfig.error);
  process.exit(1);
}

console.log('Environment variables loaded successfully');
console.log('All environment variables:', process.env);

const packages = [
  {
    name: 'Basic Wash',
    description: 'Exterior wash and interior vacuum',
    price: 50,
    services: ['Exterior Wash', 'Interior Vacuum'],
    duration: 1,
    image: '/images/basic-wash.jpg'
  },
  {
    name: 'Premium Detail',
    description: 'Full exterior and interior detailing',
    price: 150,
    services: ['Exterior Wash', 'Wax', 'Interior Vacuum', 'Leather Conditioning'],
    duration: 3,
    image: '/images/premium-detail.jpg',
    isPopular: true
  },
  {
    name: 'Interior Deep Clean',
    description: 'Complete interior cleaning and conditioning',
    price: 100,
    services: ['Interior Vacuum', 'Carpet Shampoo', 'Leather Conditioning'],
    duration: 2,
    image: '/images/interior-clean.jpg'
  },
  {
    name: 'Exterior Protection',
    description: 'Wash, wax, and paint protection',
    price: 120,
    services: ['Exterior Wash', 'Wax', 'Paint Sealant'],
    duration: 2,
    image: '/images/exterior-protection.jpg'
  }
];

const seedPackages = async () => {
  try {
    console.log('MONGODB_URI:', process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI);
    await Package.deleteMany();
    await Package.insertMany(packages);
    console.log('Packages seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding packages:', error);
    process.exit(1);
  }
};

seedPackages();
