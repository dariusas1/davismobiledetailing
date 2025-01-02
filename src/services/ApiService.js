import CacheManager from '../utils/CacheManager';
import Logger from '../utils/Logger';

class ApiService {
    constructor() {
        this.baseUrl = 'https://api.precisiondetailing.com'; // Mock base URL
        this.cacheManager = CacheManager.getInstance();
    }

    // Generic fetch method with error handling and caching
    async request(endpoint, options = {}, cacheTTL = null) {
        const url = `${this.baseUrl}${endpoint}`;
        const cacheKey = `api_${endpoint}`;

        // Check cache first
        if (options.method === 'GET') {
            const cachedResponse = this.cacheManager.get(cacheKey);
            if (cachedResponse) {
                Logger.info('Returning cached API response', { endpoint });
                return cachedResponse;
            }
        }

        try {
            // Default headers
            const headers = {
                'Content-Type': 'application/json',
                ...options.headers
            };

            const response = await fetch(url, {
                ...options,
                headers
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Cache successful GET responses
            if (options.method === 'GET') {
                this.cacheManager.set(cacheKey, data, cacheTTL);
            }

            Logger.info('API request successful', { endpoint, method: options.method });
            return data;
        } catch (error) {
            Logger.error('API request failed', { 
                endpoint, 
                method: options.method, 
                error: error.message 
            });
            throw error;
        }
    }

    // Service-specific methods
    async getServices() {
        return this.request('/services', { method: 'GET' }, 24 * 60 * 60 * 1000);
    }

    async getPricing() {
        return this.request('/pricing', { method: 'GET' }, 24 * 60 * 60 * 1000);
    }

    async submitBooking(bookingData) {
        return this.request('/bookings', {
            method: 'POST',
            body: JSON.stringify(bookingData)
        });
    }

    async getReferralInfo() {
        return this.request('/referrals', { method: 'GET' }, 24 * 60 * 60 * 1000);
    }

    async getServiceHistory(userId) {
        return this.request(`/users/${userId}/service-history`, { method: 'GET' });
    }

    // Static method for singleton pattern
    static getInstance() {
        if (!this.instance) {
            this.instance = new ApiService();
        }
        return this.instance;
    }
}

export default ApiService;
