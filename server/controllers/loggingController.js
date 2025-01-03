import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from '../config/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logsDir = path.join(__dirname, '../../logs');

// Get all log files
export const getLogFiles = async (req, res) => {
    try {
        const files = await fs.readdir(logsDir);
        const logFiles = files.filter(file => file.endsWith('.log'));
        
        const logStats = await Promise.all(
            logFiles.map(async file => {
                const stats = await fs.stat(path.join(logsDir, file));
                return {
                    name: file,
                    size: stats.size,
                    created: stats.birthtime,
                    modified: stats.mtime
                };
            })
        );

        res.status(200).json({
            success: true,
            data: logStats
        });
    } catch (error) {
        logger.error('Error getting log files:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving log files'
        });
    }
};

// Get log content with pagination
export const getLogContent = async (req, res) => {
    try {
        const { filename, page = 1, limit = 100 } = req.query;
        const filePath = path.join(logsDir, filename);

        // Validate file exists and is a log file
        if (!filename.endsWith('.log')) {
            return res.status(400).json({
                success: false,
                message: 'Invalid file type'
            });
        }

        const content = await fs.readFile(filePath, 'utf-8');
        const logs = content.split('\n')
            .filter(line => line.trim())
            .map(line => {
                try {
                    return JSON.parse(line);
                } catch {
                    return { raw: line };
                }
            });

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedLogs = logs.slice(startIndex, endIndex);

        res.status(200).json({
            success: true,
            data: {
                logs: paginatedLogs,
                pagination: {
                    total: logs.length,
                    pages: Math.ceil(logs.length / limit),
                    currentPage: page,
                    limit
                }
            }
        });
    } catch (error) {
        logger.error('Error reading log file:', error);
        res.status(500).json({
            success: false,
            message: 'Error reading log file'
        });
    }
};

// Get log statistics
export const getLogStats = async (req, res) => {
    try {
        const stats = {
            errorCount: 0,
            warningCount: 0,
            infoCount: 0,
            requestCount: 0,
            averageResponseTime: 0,
            totalResponseTime: 0,
            responseTimeCount: 0,
            statusCodes: {},
            topEndpoints: {},
            recentErrors: []
        };

        const files = await fs.readdir(logsDir);
        const combinedLogs = files.filter(file => file.startsWith('combined-'));
        const errorLogs = files.filter(file => file.startsWith('error-'));

        // Process combined logs for general statistics
        for (const file of combinedLogs.slice(-1)) { // Process only the most recent file
            const content = await fs.readFile(path.join(logsDir, file), 'utf-8');
            const logs = content.split('\n').filter(line => line.trim());

            for (const log of logs) {
                try {
                    const entry = JSON.parse(log);
                    
                    if (entry.level === 'error') stats.errorCount++;
                    if (entry.level === 'warn') stats.warningCount++;
                    if (entry.level === 'info') stats.infoCount++;

                    if (entry.message === 'HTTP Request') {
                        stats.requestCount++;
                        if (entry.status) {
                            stats.statusCodes[entry.status] = (stats.statusCodes[entry.status] || 0) + 1;
                        }
                        if (entry.url) {
                            stats.topEndpoints[entry.url] = (stats.topEndpoints[entry.url] || 0) + 1;
                        }
                        if (entry.duration) {
                            const duration = parseInt(entry.duration);
                            if (!isNaN(duration)) {
                                stats.totalResponseTime += duration;
                                stats.responseTimeCount++;
                            }
                        }
                    }
                } catch (e) {
                    continue;
                }
            }
        }

        // Process error logs for recent errors
        for (const file of errorLogs.slice(-1)) {
            const content = await fs.readFile(path.join(logsDir, file), 'utf-8');
            const logs = content.split('\n')
                .filter(line => line.trim())
                .slice(-10); // Get last 10 errors

            for (const log of logs) {
                try {
                    const entry = JSON.parse(log);
                    stats.recentErrors.push({
                        timestamp: entry.timestamp,
                        message: entry.error?.message || entry.message,
                        stack: entry.error?.stack
                    });
                } catch (e) {
                    continue;
                }
            }
        }

        // Calculate average response time
        if (stats.responseTimeCount > 0) {
            stats.averageResponseTime = stats.totalResponseTime / stats.responseTimeCount;
        }

        // Sort top endpoints
        stats.topEndpoints = Object.entries(stats.topEndpoints)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10)
            .reduce((obj, [key, value]) => ({
                ...obj,
                [key]: value
            }), {});

        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        logger.error('Error getting log statistics:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving log statistics'
        });
    }
};

// Search logs
export const searchLogs = async (req, res) => {
    try {
        const { query, startDate, endDate, level, limit = 100 } = req.query;
        const results = [];

        const files = await fs.readdir(logsDir);
        const logFiles = files.filter(file => file.endsWith('.log'));

        for (const file of logFiles) {
            const content = await fs.readFile(path.join(logsDir, file), 'utf-8');
            const logs = content.split('\n').filter(line => line.trim());

            for (const log of logs) {
                try {
                    const entry = JSON.parse(log);
                    
                    // Apply filters
                    if (level && entry.level !== level) continue;
                    if (startDate && new Date(entry.timestamp) < new Date(startDate)) continue;
                    if (endDate && new Date(entry.timestamp) > new Date(endDate)) continue;
                    
                    // Search in message and error fields
                    const searchText = JSON.stringify(entry).toLowerCase();
                    if (query && !searchText.includes(query.toLowerCase())) continue;

                    results.push(entry);
                    
                    if (results.length >= limit) break;
                } catch (e) {
                    continue;
                }
            }

            if (results.length >= limit) break;
        }

        res.status(200).json({
            success: true,
            data: results
        });
    } catch (error) {
        logger.error('Error searching logs:', error);
        res.status(500).json({
            success: false,
            message: 'Error searching logs'
        });
    }
}; 