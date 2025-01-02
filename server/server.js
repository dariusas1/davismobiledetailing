/* eslint-disable no-unused-vars */
// Core modules
import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server as socketIo } from 'socket.io';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import morgan from 'morgan';
import compression from 'compression';
import { fileURLToPath } from 'url';

// Configuration and Logging
import configValidator from './config/configValidator.js';
import logger from './config/logger.js';
import database from './config/database.js';

// Middleware
import { globalErrorHandler } from './middleware/errorHandler.js';
import { createRateLimiter } from './middleware/accessControl.js';
import accessControl from './middleware/accessControl.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import configRoutes from './routes/configRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import bookingAnalyticsRoutes from './routes/bookingAnalyticsRoutes.js';
import weatherRoutes from './routes/weatherRoutes.js';
import errorTrackingRoutes from './routes/errorTrackingRoutes.js';
import vehicleRoutes from './routes/vehicleRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Security headers middleware
const securityHeaders = (req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    next();
};

// Initialize express app
const app = express();
const server = http.createServer(app);
const io = new socketIo(server);

// Connect to database
database.connect().catch(err => {
    logger.error('Database connection error:', err);
    process.exit(1);
});

// Middleware setup
app.use(cors());
app.use(securityHeaders);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(morgan('combined', {
    stream: {
        write: message => logger.info(message.trim())
    }
}));
app.use(logger.logRequest);

// Apply rate limiting
const apiLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use('/api/', apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/config', configRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/analytics', bookingAnalyticsRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/errors', errorTrackingRoutes);
app.use('/api/vehicles', vehicleRoutes);

// Error handling
app.use(logger.logError);
app.use(globalErrorHandler);

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception:', err);
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    logger.error('Unhandled Rejection:', err);
    process.exit(1);
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV}`);
});
