const NodeCache = require('node-cache');
const cache = new NodeCache({
    stdTTL: 300, // 5 minutes default TTL
    checkperiod: 60, // Check for expired keys every 60 seconds
    useClones: false // Store references instead of copies
});

// Cache middleware factory
exports.cacheResponse = (duration = 300) => {
    return (req, res, next) => {
        // Skip caching for non-GET requests
        if (req.method !== 'GET') {
            return next();
        }

        // Generate cache key from URL and query parameters
        const key = generateCacheKey(req);

        // Try to get cached response
        const cachedResponse = cache.get(key);
        if (cachedResponse) {
            // Add cache hit header
            res.set('X-Cache', 'HIT');
            return res.json(cachedResponse);
        }

        // Store the original json method
        const originalJson = res.json;

        // Override json method to cache the response
        res.json = function(body) {
            // Add cache miss header
            res.set('X-Cache', 'MISS');

            // Cache the response
            cache.set(key, body, duration);

            // Call the original json method
            return originalJson.call(this, body);
        };

        next();
    };
};

// Clear cache for specific patterns
exports.clearCache = (pattern) => {
    const keys = cache.keys();
    const matchingKeys = pattern
        ? keys.filter(key => key.includes(pattern))
        : keys;
    
    cache.del(matchingKeys);
};

// Clear all cache
exports.clearAllCache = () => {
    cache.flushAll();
};

// Get cache stats
exports.getCacheStats = () => {
    return {
        keys: cache.keys().length,
        hits: cache.getStats().hits,
        misses: cache.getStats().misses,
        ksize: cache.getStats().ksize,
        vsize: cache.getStats().vsize
    };
};

// Helper function to generate cache key
const generateCacheKey = (req) => {
    const baseUrl = req.originalUrl || req.url;
    const queryParams = req.query;
    const userId = req.user ? req.user._id : 'anonymous';

    // Sort query parameters to ensure consistent keys
    const sortedParams = Object.keys(queryParams)
        .sort()
        .reduce((acc, key) => {
            acc[key] = queryParams[key];
            return acc;
        }, {});

    return `${userId}:${baseUrl}:${JSON.stringify(sortedParams)}`;
};

// Cache middleware with dynamic TTL based on route
exports.dynamicCache = () => {
    return (req, res, next) => {
        if (req.method !== 'GET') {
            return next();
        }

        const ttl = determineTTL(req.path);
        return exports.cacheResponse(ttl)(req, res, next);
    };
};

// Helper function to determine TTL based on route
const determineTTL = (path) => {
    const ttlMap = {
        '/api/services': 3600, // 1 hour for services
        '/api/categories': 3600, // 1 hour for categories
        '/api/availability': 60, // 1 minute for availability
        '/api/promotions': 300, // 5 minutes for promotions
        '/api/reviews': 600 // 10 minutes for reviews
    };

    // Default to 5 minutes if no specific TTL is set
    return ttlMap[path] || 300;
};

// Cache warmer for frequently accessed routes
exports.warmCache = async (routes) => {
    try {
        for (const route of routes) {
            const response = await fetch(`http://localhost:${process.env.PORT}${route}`);
            const data = await response.json();
            const key = generateCacheKey({ originalUrl: route, query: {}, user: null });
            cache.set(key, data, determineTTL(route));
        }
        console.log('Cache warmed successfully');
    } catch (error) {
        console.error('Error warming cache:', error);
    }
};

// Cache middleware with versioning
exports.versionedCache = (duration = 300) => {
    return (req, res, next) => {
        if (req.method !== 'GET') {
            return next();
        }

        const version = req.headers['api-version'] || 'v1';
        const key = `${version}:${generateCacheKey(req)}`;

        const cachedResponse = cache.get(key);
        if (cachedResponse) {
            res.set('X-Cache', 'HIT');
            res.set('X-Cache-Version', version);
            return res.json(cachedResponse);
        }

        const originalJson = res.json;
        res.json = function(body) {
            res.set('X-Cache', 'MISS');
            res.set('X-Cache-Version', version);
            cache.set(key, body, duration);
            return originalJson.call(this, body);
        };

        next();
    };
};

// Cache middleware with compression
exports.compressedCache = (duration = 300) => {
    return async (req, res, next) => {
        if (req.method !== 'GET') {
            return next();
        }

        const key = generateCacheKey(req);
        const cachedResponse = cache.get(key);

        if (cachedResponse) {
            res.set('X-Cache', 'HIT');
            return res.json(cachedResponse);
        }

        const originalJson = res.json;
        res.json = function(body) {
            res.set('X-Cache', 'MISS');
            
            // Compress the response before caching
            const compressed = compressData(body);
            cache.set(key, compressed, duration);
            
            return originalJson.call(this, body);
        };

        next();
    };
};

// Helper function to compress data
const compressData = (data) => {
    // Implement your compression logic here
    // This is a simple example that removes null and undefined values
    const compress = (obj) => {
        return JSON.parse(JSON.stringify(obj));
    };

    return compress(data);
}; 