import axios from 'axios';
import Logger from '../utils/Logger.js';

const API_URL = 'http://localhost:5001/api/auth';

class AuthService {
    static async loginAdmin(username, password) {
        const endpoint = `${API_URL}/admin-login`;
        Logger.log(`[${new Date().toISOString()}] Attempting admin login`, {
            username: username
        });

        try {
            const response = await axios.post(endpoint, { username, password });
            
            // Store admin user and token
            localStorage.setItem('adminToken', response.data.token);
            localStorage.setItem('adminUser', JSON.stringify(response.data.user));
            
            Logger.log(`[${new Date().toISOString()}] Admin login successful`, { 
                userId: response.data.user._id,
                username: response.data.user.username
            });
            
            return response.data.user;
        } catch (error) {
            Logger.error(`[${new Date().toISOString()}] Admin login failed`, {
                endpoint: endpoint,
                username: username,
                status: error.response?.status,
                data: error.response?.data,
                message: error.message,
                stack: error.stack
            });
            throw error;
        }
    }

    static async login(credentials) {
        const endpoint = `${API_URL}/login`;
        Logger.log(`[${new Date().toISOString()}] Attempting login at ${endpoint}`, {
            username: credentials.username
        });

        try {
            const response = await axios.post(endpoint, credentials);
            
            // Store user and token
            localStorage.setItem('userToken', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            
            Logger.log(`[${new Date().toISOString()}] Login successful`, { 
                userId: response.data.user._id,
                username: response.data.user.username
            });
            
            return response.data.user;
        } catch (error) {
            Logger.error(`[${new Date().toISOString()}] Login failed`, {
                endpoint: endpoint,
                username: credentials.username,
                status: error.response?.status,
                data: error.response?.data,
                message: error.message,
                stack: error.stack
            });
            throw error;
        }
    }

    static async checkAuthentication() {
        const token = localStorage.getItem('userToken');
        if (!token) return false;

        try {
            await axios.get(`${API_URL}/verify`, {
                headers: { 
                    Authorization: `Bearer ${token}` 
                }
            });
            return true;
        } catch (error) {
            this.logout();
            return false;
        }
    }

    static async getCurrentUser() {
        const token = localStorage.getItem('userToken');
        if (!token) {
            throw new Error('No authentication token found');
        }

        try {
            const response = await axios.get(`${API_URL}/me`, {
                headers: { 
                    Authorization: `Bearer ${token}` 
                }
            });
            
            return response.data;
        } catch (error) {
            this.logout();
            throw error;
        }
    }

    static logout() {
        localStorage.removeItem('userToken');
        localStorage.removeItem('user');
        Logger.log('User logged out');
    }

    static isAuthenticated() {
        return !!localStorage.getItem('userToken');
    }

    static async changePassword(passwordData) {
        try {
            const response = await axios.post(`${API_URL}/change-password`, passwordData, {
                headers: { 
                    Authorization: `Bearer ${localStorage.getItem('userToken')}` 
                }
            });

            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            currentUser.mustChangePassword = false;
            localStorage.setItem('user', JSON.stringify(currentUser));

            Logger.log('Password changed successfully', { userId: currentUser._id });
            return response.data;
        } catch (error) {
            Logger.error('Password change failed', error);
            throw error;
        }
    }

    static isPasswordChangeRequired() {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        return user.mustChangePassword === true;
    }

    static getToken() {
        return localStorage.getItem('userToken');
    }
}

export default AuthService;
