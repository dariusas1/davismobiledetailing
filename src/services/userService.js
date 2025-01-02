import axios from 'axios';
import Logger from '../utils/Logger';

const API_URL = '/api/users';

class UserService {
    static async fetchAllUsers() {
        try {
            const response = await axios.get(API_URL, {
                headers: { 
                    Authorization: `Bearer ${localStorage.getItem('userToken')}` 
                }
            });
            
            Logger.log('Users fetched successfully');
            return response.data;
        } catch (error) {
            Logger.error('Failed to fetch users', error);
            throw error;
        }
    }

    static async createUser(userData) {
        try {
            const response = await axios.post(API_URL, userData, {
                headers: { 
                    Authorization: `Bearer ${localStorage.getItem('userToken')}` 
                }
            });
            
            Logger.log('User created successfully', { username: userData.username });
            return response.data;
        } catch (error) {
            Logger.error('Failed to create user', error);
            throw error;
        }
    }

    static async updateUserRole(userId, newRole) {
        try {
            const response = await axios.patch(`${API_URL}/${userId}/role`, { role: newRole }, {
                headers: { 
                    Authorization: `Bearer ${localStorage.getItem('userToken')}` 
                }
            });
            
            Logger.log('User role updated successfully', { userId, newRole });
            return response.data;
        } catch (error) {
            Logger.error('Failed to update user role', error);
            throw error;
        }
    }

    static async deleteUser(userId) {
        try {
            const response = await axios.delete(`${API_URL}/${userId}`, {
                headers: { 
                    Authorization: `Bearer ${localStorage.getItem('userToken')}` 
                }
            });
            
            Logger.log('User deleted successfully', { userId });
            return response.data;
        } catch (error) {
            Logger.error('Failed to delete user', error);
            throw error;
        }
    }

    static async getUserProfile() {
        try {
            const response = await axios.get(`${API_URL}/profile`, {
                headers: { 
                    Authorization: `Bearer ${localStorage.getItem('userToken')}` 
                }
            });
            
            Logger.log('User profile fetched successfully');
            return response.data;
        } catch (error) {
            Logger.error('Failed to fetch user profile', error);
            throw error;
        }
    }
}

export default UserService;
