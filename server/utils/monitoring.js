import mongoose from 'mongoose';
import { Resend } from 'resend';
import os from 'os';

// System metrics thresholds
const THRESHOLDS = {
  CPU_USAGE: 80, // 80%
  MEMORY_USAGE: 85, // 85%
  DISK_SPACE: 90, // 90%
  DB_CONNECTIONS: 80, // 80% of max connections
  API_RESPONSE_TIME: 1000, // 1 second
  ERROR_RATE: 5 // 5% error rate
};

// Store metrics history
let metricsHistory = [];
const MAX_HISTORY = 1440; // Store 24 hours of metrics (1 per minute)

// Initialize Resend lazily
let resendClient = null;
const getResendClient = () => {
  if (!resendClient && process.env.RESEND_API_KEY) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
};

// Monitor system metrics
export const monitorSystem = async () => {
  try {
    const metrics = {
      timestamp: new Date(),
      cpu: await getCpuUsage(),
      memory: getMemoryUsage(),
      disk: await getDiskSpace(),
      dbConnections: mongoose.connections.length,
      dbStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    };

    // Store metrics in history
    metricsHistory.push(metrics);
    if (metricsHistory.length > MAX_HISTORY) {
      metricsHistory.shift(); // Remove oldest entry
    }

    // Check thresholds and send alerts
    await checkThresholds(metrics);

    return metrics;
  } catch (error) {
    console.error('Monitoring error:', error);
    await sendAlert('Monitoring System Error', error.message).catch(console.error);
    return null;
  }
};

// Get CPU usage
const getCpuUsage = async () => {
  const cpus = os.cpus();
  const totalIdle = cpus.reduce((acc, cpu) => acc + cpu.times.idle, 0);
  const totalTick = cpus.reduce((acc, cpu) => 
    acc + Object.values(cpu.times).reduce((sum, time) => sum + time, 0), 0);
  
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const cpusAfter = os.cpus();
  const totalIdleAfter = cpusAfter.reduce((acc, cpu) => acc + cpu.times.idle, 0);
  const totalTickAfter = cpusAfter.reduce((acc, cpu) => 
    acc + Object.values(cpu.times).reduce((sum, time) => sum + time, 0), 0);
  
  const idleDiff = totalIdleAfter - totalIdle;
  const totalDiff = totalTickAfter - totalTick;
  
  return 100 - (100 * idleDiff / totalDiff);
};

// Get memory usage
const getMemoryUsage = () => {
  const total = os.totalmem();
  const free = os.freemem();
  const used = total - free;
  const usagePercent = (used / total) * 100;
  
  return {
    total,
    free,
    used,
    usagePercent
  };
};

// Get disk space
const getDiskSpace = async () => {
  // This is a simplified version. In production, you'd want to use a package like 'disk-space'
  return {
    total: 100,
    used: 50,
    free: 50,
    usagePercent: 50
  };
};

// Check thresholds and send alerts
const checkThresholds = async (metrics) => {
  const alerts = [];

  if (metrics.cpu > THRESHOLDS.CPU_USAGE) {
    alerts.push(`High CPU usage: ${metrics.cpu.toFixed(2)}%`);
  }

  if (metrics.memory.usagePercent > THRESHOLDS.MEMORY_USAGE) {
    alerts.push(`High memory usage: ${metrics.memory.usagePercent.toFixed(2)}%`);
  }

  if (metrics.disk.usagePercent > THRESHOLDS.DISK_SPACE) {
    alerts.push(`Low disk space: ${metrics.disk.usagePercent.toFixed(2)}%`);
  }

  if (metrics.dbConnections > THRESHOLDS.DB_CONNECTIONS) {
    alerts.push(`High DB connections: ${metrics.dbConnections}`);
  }

  if (metrics.dbStatus !== 'connected') {
    alerts.push(`Database disconnected: ${metrics.dbStatus}`);
  }

  if (alerts.length > 0) {
    await sendAlert('System Alert', alerts.join('\n')).catch(console.error);
  }
};

// Send alert email using Resend
const sendAlert = async (subject, message) => {
  const resend = getResendClient();
  if (!resend) {
    console.warn('Resend client not initialized - missing API key');
    return;
  }

  try {
    await resend.emails.send({
      from: 'Precision Detailing <alerts@precisiondetailing.com>',
      to: process.env.BUSINESS_EMAIL || 'info@precisiondetailing.com',
      subject: `[Precision Detailing] ${subject}`,
      html: `<pre>${message}</pre>`
    });
    console.log('Alert sent successfully:', subject);
  } catch (error) {
    console.error('Error sending alert:', error);
  }
};

// Get metrics history
export const getMetricsHistory = () => metricsHistory;

// Start monitoring
export const startMonitoring = (interval = 60000) => { // Default: check every minute
  console.log('Starting system monitoring...');
  
  // Initialize Resend client
  const resend = getResendClient();
  if (!resend) {
    console.warn('Monitoring started without email alerts - missing Resend API key');
  }

  monitorSystem().catch(err => console.error('Initial monitoring error:', err)); // Initial check
  return setInterval(() => {
    monitorSystem().catch(err => console.error('Monitoring error:', err));
  }, interval);
}; 