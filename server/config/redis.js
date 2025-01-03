import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

redis.on('connect', () => {
  console.log('Connected to Redis');
});

export const cacheMiddleware = async (key, callback, expireTime = 300) => {
  try {
    // Try to get cached data
    const cachedData = await redis.get(key);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    // If no cached data, fetch new data
    const newData = await callback();
    
    // Cache the new data
    await redis.setex(key, expireTime, JSON.stringify(newData));
    
    return newData;
  } catch (error) {
    console.error('Cache error:', error);
    // If cache fails, just return the callback result
    return callback();
  }
};

export default redis; 