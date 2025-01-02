import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { validateInput } from '../utils/validationUtils';

// Custom error class for authentication
class AuthError extends Error {
    constructor(message, type) {
        super(message);
        this.name = 'AuthError';
        this.type = type;
    }
}

// Create AuthContext with default values
export const AuthContext = createContext({
    user: null,
    login: async () => {},
    signup: async () => {},
    logout: () => {},
    resetPassword: async () => {},
    updateProfile: async () => {},
    loading: false,
    authError: null,
    isAuthenticated: false
});

// AuthProvider Component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState(null);

    // Check token and set user on initial load
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedUser = jwtDecode(token);
                
                // Verify token is not expired
                if (decodedUser.exp * 1000 > Date.now()) {
                    setUser(decodedUser);
                    setAuthError(null);
                } else {
                    // Token expired, logout
                    logout();
                    setAuthError(new AuthError('Token expired', 'TOKEN_EXPIRED'));
                }
            } catch (error) {
                logout();
                setAuthError(new AuthError('Invalid token', 'INVALID_TOKEN'));
            }
        }
        setLoading(false);
    }, []);

    // Login function
    const login = async (email, password) => {
        // Validate input first
        const loginValidation = validateInput.validateLogin({ email, password });
        if (!loginValidation.isValid) {
            const error = new AuthError(loginValidation.errors[0], 'VALIDATION_ERROR');
            setAuthError(error);
            throw error;
        }

        setLoading(true);
        setAuthError(null);
        try {
            const response = await axios.post('/api/auth/login', { email, password });
            
            // Store token and user info
            localStorage.setItem('token', response.data.token);
            
            // Decode and set user
            const decodedUser = jwtDecode(response.data.token);
            setUser(decodedUser);
            setLoading(false);

            return decodedUser;
        } catch (error) {
            setLoading(false);
            const errorMessage = error.response?.data?.message || 'Login failed';
            const authError = new AuthError(errorMessage, 'LOGIN_FAILED');
            setAuthError(authError);
            throw authError;
        }
    };

    // Register function
    const signup = async (userData) => {
        // Validate input first
        const registrationValidation = validateInput.validateRegistration(userData);
        if (!registrationValidation.isValid) {
            const error = new AuthError(registrationValidation.errors[0], 'VALIDATION_ERROR');
            setAuthError(error);
            throw error;
        }

        setLoading(true);
        setAuthError(null);
        try {
            const response = await axios.post('/api/auth/register', userData);
            
            // Store token and user info
            localStorage.setItem('token', response.data.token);
            
            // Decode and set user
            const decodedUser = jwtDecode(response.data.token);
            setUser(decodedUser);
            setLoading(false);

            return decodedUser;
        } catch (error) {
            setLoading(false);
            const errorMessage = error.response?.data?.message || 'Registration failed';
            const authError = new AuthError(errorMessage, 'REGISTRATION_FAILED');
            setAuthError(authError);
            throw authError;
        }
    };

    // Logout function
    const logout = () => {
        // Remove token from storage
        localStorage.removeItem('token');
        
        // Clear user state
        setUser(null);
        setAuthError(null);
    };

    // Password Reset
    const resetPassword = async (email) => {
        // Validate email first
        const emailValidation = validateInput.email(email);
        if (!emailValidation.isValid) {
            const error = new AuthError(emailValidation.error, 'VALIDATION_ERROR');
            setAuthError(error);
            throw error;
        }

        setLoading(true);
        setAuthError(null);
        try {
            await axios.post('/api/auth/forgot-password', { email });
            setLoading(false);
            return true;
        } catch (error) {
            setLoading(false);
            const errorMessage = error.response?.data?.message || 'Password reset failed';
            const authError = new AuthError(errorMessage, 'PASSWORD_RESET_FAILED');
            setAuthError(authError);
            throw authError;
        }
    };

    // Update Profile
    const updateProfile = async (profileData) => {
        // Optional: Add validation for profile update if needed
        setLoading(true);
        setAuthError(null);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put('/api/auth/profile', profileData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setLoading(false);
            // Update local user data if needed
            return response.data;
        } catch (error) {
            setLoading(false);
            const errorMessage = error.response?.data?.message || 'Profile update failed';
            const authError = new AuthError(errorMessage, 'PROFILE_UPDATE_FAILED');
            setAuthError(authError);
            throw authError;
        }
    };

    // Context value
    const contextValue = {
        user,
        login,
        signup,
        logout,
        resetPassword,
        updateProfile,
        loading,
        authError,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook for using auth context with error handling
export const useAuth = () => {
    const context = useContext(AuthContext);
    
    // Provide default values if context is undefined
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    
    return context;
};

export default AuthContext;
