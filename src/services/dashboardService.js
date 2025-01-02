import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Logger from '../utils/Logger';
import ErrorHandler from '../utils/ErrorHandler';

class DashboardService {
    // Image Upload Service
    static async uploadImage(file, options = {}) {
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await axios.post('http://localhost:5000/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            return response.data;
        } catch (error) {
            ErrorHandler.handleError(error, 'Image upload failed');
            throw error;
        }
    }

    // Enhanced Project Management
    async fetchProjects(options = {}) {
        try {
            const { 
                page = 1, 
                limit = 10, 
                sortBy = 'createdAt', 
                order = 'desc' 
            } = options;

            const response = await axios.get('http://localhost:5000/api/dashboard/projects', {
                params: { page, limit, sortBy, order },
                headers: { 
                    Authorization: `Bearer ${localStorage.getItem('userToken')}` 
                }
            });
            
            // Ensure we return a clean array of project objects
            const projects = response.data.data || [];
            return projects.map(project => this._sanitizeProjectData(project));
        } catch (error) {
            ErrorHandler.handleError(error, 'Failed to fetch projects');
            return [];
        }
    }

    async createProject(projectData) {
        try {
            // Validate project data
            this._validateProjectData(projectData);

            // Prepare project payload
            const projectPayload = {
                ...projectData,
                id: uuidv4(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                status: 'active'
            };

            // Create FormData for file uploads
            const formData = new FormData();
            Object.keys(projectPayload).forEach(key => {
                if (key === 'images') {
                    projectPayload[key].forEach((image, index) => {
                        formData.append(`images`, image);
                    });
                } else {
                    formData.append(key, JSON.stringify(projectPayload[key]));
                }
            });

            const response = await axios.post('http://localhost:5000/api/dashboard/projects', formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('userToken')}`
                }
            });

            // Log project creation
            Logger.log('Project created successfully', response.data);

            return this._sanitizeProjectData(response.data);
        } catch (error) {
            ErrorHandler.handleError(error, 'Project creation failed');
            throw error;
        }
    }

    async updateProject(projectId, updateData) {
        try {
            const response = await axios.patch(`http://localhost:5000/api/dashboard/projects/${projectId}`, updateData, {
                headers: { 
                    Authorization: `Bearer ${localStorage.getItem('userToken')}` 
                }
            });

            return this._sanitizeProjectData(response.data);
        } catch (error) {
            ErrorHandler.handleError(error, 'Project update failed');
            throw error;
        }
    }

    async deleteProject(projectId) {
        try {
            await axios.delete(`http://localhost:5000/api/dashboard/projects/${projectId}`, {
                headers: { 
                    Authorization: `Bearer ${localStorage.getItem('userToken')}` 
                }
            });

            Logger.log('Project deleted successfully', { projectId });
            return true;
        } catch (error) {
            ErrorHandler.handleError(error, 'Project deletion failed');
            throw error;
        }
    }

    // Reviews Management
    static async fetchReviews() {
        try {
            const response = await axios.get('http://localhost:5000/api/dashboard/reviews', {
                headers: { 
                    Authorization: `Bearer ${localStorage.getItem('userToken')}` 
                }
            });
            return response.data.data;
        } catch (error) {
            ErrorHandler.handleError(error, 'Failed to fetch reviews');
            throw error;
        }
    }

    static async createReview(reviewData) {
        try {
            const reviewWithId = {
                ...reviewData,
                id: uuidv4(),
                createdAt: new Date().toISOString()
            };

            const formData = new FormData();
            Object.keys(reviewWithId).forEach(key => {
                formData.append(key, reviewWithId[key]);
            });

            const response = await axios.post('http://localhost:5000/api/dashboard/reviews', formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('userToken')}` 
                }
            });
            
            Logger.info('Review created', {
                reviewId: reviewWithId.id,
                rating: reviewData.rating
            });

            return response.data.data;
        } catch (error) {
            ErrorHandler.handleError(error, 'Failed to create review');
            throw error;
        }
    }

    // Packages Management
    static async fetchPackages() {
        try {
            const response = await axios.get('http://localhost:5000/api/dashboard/packages', {
                headers: { 
                    Authorization: `Bearer ${localStorage.getItem('userToken')}` 
                }
            });
            return response.data.data;
        } catch (error) {
            ErrorHandler.handleError(error, 'Failed to fetch packages');
            throw error;
        }
    }

    static async createPackage(packageData) {
        try {
            const packageWithId = {
                ...packageData,
                id: uuidv4(),
                createdAt: new Date().toISOString()
            };

            const formData = new FormData();
            Object.keys(packageWithId).forEach(key => {
                formData.append(key, packageWithId[key]);
            });

            const response = await axios.post('http://localhost:5000/api/dashboard/packages', formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('userToken')}` 
                }
            });
            
            Logger.info('Package created', {
                packageId: packageWithId.id,
                title: packageData.title
            });

            return response.data.data;
        } catch (error) {
            ErrorHandler.handleError(error, 'Failed to create package');
            throw error;
        }
    }

    // Dashboard Analytics
    static async fetchDashboardAnalytics() {
        try {
            const response = await axios.get('http://localhost:5000/api/dashboard/analytics', {
                headers: { 
                    Authorization: `Bearer ${localStorage.getItem('userToken')}` 
                }
            });
            return response.data.data;
        } catch (error) {
            ErrorHandler.handleError(error, 'Failed to fetch dashboard analytics');
            throw error;
        }
    }

    // Utility Methods
    static generateUniqueId() {
        return uuidv4();
    }

    // Image Compression (Fallback)
    static async compressImage(file, options = {}) {
        const defaultOptions = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true
        };
        const mergedOptions = { ...defaultOptions, ...options };

        try {
            const imageCompression = await import('browser-image-compression');
            return await imageCompression.default(file, mergedOptions);
        } catch (error) {
            console.warn('Image compression failed, using original file', error);
            return file;
        }
    }

    // Fetch dashboard data
    async getDashboardData() {
        try {
            const response = await axios.get('http://localhost:5000/api/dashboard', {
                headers: { 
                    Authorization: `Bearer ${this.getToken()}` 
                }
            });

            // Log dashboard data retrieval
            Logger.info('Dashboard data retrieved', {
                userId: this.getCurrentUser().id
            });

            return response.data;
        } catch (error) {
            // Handle and log dashboard data fetch error
            ErrorHandler.handleError(error, 'Dashboard Data Retrieval Failed');
            throw error;
        }
    }

    // Fetch recent bookings
    async getRecentBookings() {
        try {
            const response = await axios.get('http://localhost:5000/api/bookings/recent', {
                headers: { 
                    Authorization: `Bearer ${this.getToken()}` 
                }
            });

            // Log recent bookings retrieval
            Logger.info('Recent bookings retrieved', {
                count: response.data.length
            });

            return response.data;
        } catch (error) {
            // Handle and log recent bookings fetch error
            ErrorHandler.handleError(error, 'Recent Bookings Retrieval Failed');
            throw error;
        }
    }

    // Fetch revenue statistics
    async getRevenueStatistics() {
        try {
            const response = await axios.get('http://localhost:5000/api/dashboard/revenue', {
                headers: { 
                    Authorization: `Bearer ${this.getToken()}` 
                }
            });

            // Log revenue statistics retrieval
            Logger.info('Revenue statistics retrieved', {
                totalRevenue: response.data.totalRevenue
            });

            return response.data;
        } catch (error) {
            // Handle and log revenue statistics fetch error
            ErrorHandler.handleError(error, 'Revenue Statistics Retrieval Failed');
            throw error;
        }
    }

    // Update user dashboard preferences
    async updateDashboardPreferences(preferences) {
        try {
            const response = await axios.post('http://localhost:5000/api/dashboard/preferences', 
                preferences,
                {
                    headers: { 
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${this.getToken()}` 
                    }
                }
            );

            // Log dashboard preferences update
            Logger.info('Dashboard preferences updated', {
                preferences
            });

            return response.data;
        } catch (error) {
            // Handle and log preferences update error
            ErrorHandler.handleError(error, 'Dashboard Preferences Update Failed');
            throw error;
        }
    }

    // Helper methods (these should be imported from AuthService)
    getToken() {
        return localStorage.getItem('token');
    }

    getCurrentUser() {
        const userJson = localStorage.getItem('user');
        return userJson ? JSON.parse(userJson) : {};
    }

    // Private helper methods
    _sanitizeProjectData(project) {
        return {
            id: project.id || uuidv4(),
            title: project.title || 'Untitled Project',
            description: project.description || '',
            images: Array.isArray(project.images) ? project.images : [],
            tags: Array.isArray(project.tags) ? project.tags : [],
            createdAt: project.createdAt || new Date().toISOString(),
            updatedAt: project.updatedAt || new Date().toISOString(),
            status: project.status || 'active'
        };
    }

    _validateProjectData(projectData) {
        const errors = {};

        if (!projectData.title || projectData.title.trim().length < 3) {
            errors.title = 'Project title must be at least 3 characters long';
        }

        if (!projectData.description || projectData.description.trim().length < 10) {
            errors.description = 'Project description must be at least 10 characters long';
        }

        if (!projectData.images || projectData.images.length === 0) {
            errors.images = 'At least one image is required';
        }

        if (Object.keys(errors).length > 0) {
            const validationError = new Error('Project validation failed');
            validationError.details = errors;
            throw validationError;
        }
    }
}

export default DashboardService;
