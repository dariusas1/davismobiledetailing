/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { 
    TextField, 
    Button, 
    Typography, 
    Box 
} from '@mui/material';
import AuthService from '../../services/authService';

const LoginForm = () => {
    const [loginData, setLoginData] = useState({
        username: '',
        password: ''
    });

    const [loginStatus, setLoginStatus] = useState({
        error: null,
        loading: false
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(`[${new Date().toISOString()}] Login form submitted`);
        setLoginStatus({ error: null, loading: true });

        // Basic validation
        if (!loginData.username || !loginData.password) {
            const errorMsg = 'Username and password are required';
            console.error(`[${new Date().toISOString()}] Validation error: ${errorMsg}`);
            setLoginStatus({ 
                error: errorMsg, 
                loading: false 
            });
            return;
        }

        try {
            console.log(`[${new Date().toISOString()}] Attempting login for: ${loginData.username}`);
            const response = await AuthService.login(loginData);
            console.log(`[${new Date().toISOString()}] Login successful for: ${loginData.username}`);
            window.location.href = '/dashboard';
        } catch (error) {
            const errorMsg = error.message || 'Login failed';
            console.error(`[${new Date().toISOString()}] Login error:`, {
                username: loginData.username,
                error: errorMsg,
                stack: error.stack
            });
            setLoginStatus({ 
                error: errorMsg, 
                loading: false 
            });
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="h5" gutterBottom>
                Login to Precision Detailing
            </Typography>

            <TextField
                fullWidth
                margin="normal"
                label="Username"
                name="username"
                type="text"
                value={loginData.username}
                onChange={handleChange}
                required
            />

            <TextField
                fullWidth
                margin="normal"
                label="Password"
                name="password"
                type="password"
                value={loginData.password}
                onChange={handleChange}
                required
            />

            {loginStatus.error && (
                <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                    {loginStatus.error}
                </Typography>
            )}

            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={loginStatus.loading}
                sx={{ mt: 3, mb: 2 }}
            >
                {loginStatus.loading ? 'Logging In...' : 'Login'}
            </Button>
        </Box>
    );
};

export default LoginForm;
