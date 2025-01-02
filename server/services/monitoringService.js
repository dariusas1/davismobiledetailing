const os = require('os');
const v8 = require('v8');
const { performance } = require('perf_hooks');

class MonitoringService {
    // System Resource Monitoring
    static getSystemResources() {
        return {
            cpuUsage: process.cpuUsage(),
            memoryUsage: {
                total: os.totalmem(),
                free: os.freemem(),
                used: os.totalmem() - os.freemem()
            },
            loadAverage: os.loadavg(),
            uptime: os.uptime()
        };
    }

    // Node.js Process Monitoring
    static getProcessMetrics() {
        const memoryUsage = process.memoryUsage();
        const heapStats = v8.getHeapStatistics();

        return {
            pid: process.pid,
            memory: {
                rss: memoryUsage.rss,
                heapTotal: memoryUsage.heapTotal,
                heapUsed: memoryUsage.heapUsed,
                external: memoryUsage.external
            },
            heap: {
                totalHeapSize: heapStats.total_heap_size,
                usedHeapSize: heapStats.used_heap_size,
                heapSizeLimit: heapStats.heap_size_limit
            },
            versions: process.versions
        };
    }

    // Performance Tracking
    static trackPerformance(fn) {
        return async (...args) => {
            const start = performance.now();
            try {
                const result = await fn(...args);
                const end = performance.now();
                
                console.log(`Function ${fn.name} took ${end - start}ms`);
                
                return result;
            } catch (error) {
                console.error(`Performance tracking error in ${fn.name}:`, error);
                throw error;
            }
        };
    }

    // Request Monitoring Middleware
    static requestMonitorMiddleware() {
        return (req, res, next) => {
            const start = performance.now();

            // Capture original end method
            const originalEnd = res.end;
            res.end = function(...args) {
                const end = performance.now();
                const duration = end - start;

                // Log request details
                console.log('Request Monitoring', {
                    method: req.method,
                    path: req.path,
                    status: res.statusCode,
                    duration: `${duration.toFixed(2)}ms`
                });

                // Call original end method
                return originalEnd.apply(this, args);
            };

            next();
        };
    }

    // Health Check
    static healthCheck() {
        return {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            systemResources: this.getSystemResources(),
            processMetrics: this.getProcessMetrics()
        };
    }

    // Error Rate Tracking
    static createErrorRateTracker() {
        let totalRequests = 0;
        let errorRequests = 0;

        return {
            recordRequest: (isError = false) => {
                totalRequests++;
                if (isError) errorRequests++;
            },
            getErrorRate: () => {
                return totalRequests > 0 
                    ? (errorRequests / totalRequests) * 100 
                    : 0;
            },
            reset: () => {
                totalRequests = 0;
                errorRequests = 0;
            }
        };
    }
}

module.exports = MonitoringService;
