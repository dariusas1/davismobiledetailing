import express from 'express';
import cors from 'cors';
import http from 'http';
import mongoose from 'mongoose';
import morgan from 'morgan';
import compression from 'compression';
import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

// Import configurations and utilities
import { initSocket } from './config/socket.js';
import { scheduleBackups } from './utils/backup.js';
import { startMonitoring } from './utils/monitoring.js';
import { trackActivity } from './middleware/activityTracker.js';

// Import routes and controllers
import { getDashboardStats, exportDashboardCSV, exportDashboardPDF } from './controllers/dashboardController.js';
import { errorHandler } from './middleware/errorHandler.js';

// Initialize express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = initSocket(server);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
})
  .then(() => {
    console.log('Connected to MongoDB');
    // Start backup scheduler
    scheduleBackups();
    // Start system monitoring
    startMonitoring();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(compression());
app.use(morgan('dev'));

// Activity tracking for dashboard routes
app.get('/api/admin/dashboard', trackActivity('VIEW_DASHBOARD'), getDashboardStats);
app.get('/api/admin/dashboard/export/csv', trackActivity('EXPORT_REPORT'), exportDashboardCSV);
app.get('/api/admin/dashboard/export/pdf', trackActivity('EXPORT_REPORT'), exportDashboardPDF);

// Error handling
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
