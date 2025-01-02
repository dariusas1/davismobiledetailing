class CacheManager {
    constructor(storageType = 'localStorage') {
        this.storageType = storageType;
        this.storage = storageType === 'localStorage' ? window.localStorage : window.sessionStorage;
    }

    // Set item with optional expiration
    set(key, value, ttl = null) {
        try {
            const item = {
                value: value,
                expiry: ttl ? Date.now() + ttl : null
            };
            this.storage.setItem(key, JSON.stringify(item));
        } catch (error) {
            console.error('Cache set error:', error);
        }
    }

    // Get item with expiration check
    get(key) {
        try {
            const itemStr = this.storage.getItem(key);
            if (!itemStr) return null;

            const item = JSON.parse(itemStr);

            // Check if item is expired
            if (item.expiry && Date.now() > item.expiry) {
                this.remove(key);
                return null;
            }

            return item.value;
        } catch (error) {
            console.error('Cache get error:', error);
            return null;
        }
    }

    // Remove specific item
    remove(key) {
        this.storage.removeItem(key);
    }

    // Clear all cache
    clear() {
        this.storage.clear();
    }

    // Check if item exists and is not expired
    has(key) {
        return this.get(key) !== null;
    }

    // Bulk set items
    setMultiple(items, ttl = null) {
        Object.entries(items).forEach(([key, value]) => {
            this.set(key, value, ttl);
        });
    }

    // Bulk get items
    getMultiple(keys) {
        return keys.reduce((acc, key) => {
            acc[key] = this.get(key);
            return acc;
        }, {});
    }

    // Static method for easy access
    static getInstance(storageType = 'localStorage') {
        if (!this.instance) {
            this.instance = new CacheManager(storageType);
        }
        return this.instance;
    }
}

export default CacheManager;
