require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
    console.log('Starting MongoDB connection test...');
    console.log('Environment:', process.env.NODE_ENV || 'development');
    console.log('MongoDB URI:', process.env.MONGODB_URI ? process.env.MONGODB_URI.replace(/:[^:]*@/, ':****@') : 'Not found');
    
    if (!process.env.MONGODB_URI) {
        console.error('Error: MONGODB_URI environment variable is not defined');
        process.exit(1);
    }

    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000
        });

        console.log('\nDatabase connection successful!');
        console.log('Connection Details:');
        console.log('- Host:', connection.connection.host);
        console.log('- Port:', connection.connection.port);
        console.log('- Database:', connection.connection.db.databaseName);
        console.log('- Ready State:', connection.connection.readyState);
        
        process.exit(0);
    } catch (error) {
        console.error('\nDatabase connection failed:');
        console.error('- Error Name:', error.name);
        console.error('- Error Code:', error.code);
        console.error('- Error Message:', error.message);
        
        if (error.name === 'MongoNetworkError') {
            console.error('Network Error Details:');
            console.error('- Check your internet connection');
            console.error('- Verify MongoDB server is running');
            console.error('- Check firewall settings');
        }
        
        process.exit(1);
    }
}

testConnection();
