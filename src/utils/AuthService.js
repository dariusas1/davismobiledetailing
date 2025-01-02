import CacheManager from './CacheManager';
import Logger from './Logger';

class AuthService {
    constructor() {
        this.cacheManager = CacheManager.getInstance();
    }

    // Simulate login (replace with actual backend authentication)
    login(email, password) {
        return new Promise((resolve, reject) => {
            // Simulated authentication
            if (this.validateCredentials(email, password)) {
                const user = {
                    id: this.generateUserId(),
                    email: email,
                    token: this.generateToken()
                };

                // Cache user data
                this.cacheManager.set('user', user, 24 * 60 * 60 * 1000); // 24 hours

                // Log successful login
                Logger.info('User logged in', { email });

                resolve(user);
            } else {
                // Log failed login attempt
                Logger.warn('Login failed', { email });
                reject(new Error('Invalid credentials'));
            }
        });
    }

    // Logout user
    logout() {
        // Remove user data from cache
        this.cacheManager.remove('user');
        
        // Log logout
        Logger.info('User logged out');
    }

    // Check if user is authenticated
    isAuthenticated() {
        const user = this.cacheManager.get('user');
        return user !== null;
    }

    // Get current user
    getCurrentUser() {
        return this.cacheManager.get('user');
    }

    // Validate credentials (mock implementation)
    validateCredentials(email, password) {
        // In a real app, this would be a backend API call
        const validEmail = 'user@precisiondetailing.com';
        const validPassword = 'PrecisionDetail2024!';

        return email === validEmail && password === validPassword;
    }

    // Generate a mock user ID
    generateUserId() {
        return Math.random().toString(36).substring(2, 15) + 
               Math.random().toString(36).substring(2, 15);
    }

    // Generate a mock token
    generateToken() {
        return Math.random().toString(36).substring(2) + 
               Date.now().toString(36);
    }

    // Password reset request
    requestPasswordReset(email) {
        return new Promise((resolve, reject) => {
            // Simulate password reset request
            if (this.isValidEmail(email)) {
                // Log password reset request
                Logger.info('Password reset requested', { email });
                resolve(true);
            } else {
                // Log failed password reset request
                Logger.warn('Invalid email for password reset', { email });
                reject(new Error('Invalid email'));
            }
        });
    }

    // Email validation
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Static method for singleton pattern
    static getInstance() {
        if (!this.instance) {
            this.instance = new AuthService();
        }
        return this.instance;
    }
}

export default AuthService;
