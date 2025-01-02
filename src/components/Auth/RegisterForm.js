import React, { useState } from 'react';
import { 
    TextField, 
    Button, 
    Typography, 
    Box, 
    Grid 
} from '@mui/material';
import AuthService from '../../services/authService';

const RegisterForm = () => {
    const [registerData, setRegisterData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const [registerStatus, setRegisterStatus] = useState({
        error: null,
        loading: false
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRegisterData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setRegisterStatus({ error: null, loading: true });

        // Basic password validation
        if (registerData.password !== registerData.confirmPassword) {
            setRegisterStatus({ 
                error: 'Passwords do not match', 
                loading: false 
            });
            return;
        }

        try {
            await AuthService.register(registerData);
            window.location.href = '/dashboard';
        } catch (error) {
            setRegisterStatus({ 
                error: error.message || 'Registration failed', 
                loading: false 
            });
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="h5" gutterBottom>
                Create Your Account
            </Typography>

            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="First Name"
                        name="firstName"
                        value={registerData.firstName}
                        onChange={handleChange}
                        required
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Last Name"
                        name="lastName"
                        value={registerData.lastName}
                        onChange={handleChange}
                        required
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={registerData.email}
                        onChange={handleChange}
                        required
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Phone Number"
                        name="phone"
                        type="tel"
                        value={registerData.phone}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type="password"
                        value={registerData.password}
                        onChange={handleChange}
                        required
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        value={registerData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </Grid>
            </Grid>

            {registerStatus.error && (
                <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                    {registerStatus.error}
                </Typography>
            )}

            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={registerStatus.loading}
                sx={{ mt: 3, mb: 2 }}
            >
                {registerStatus.loading ? 'Registering...' : 'Register'}
            </Button>
        </Box>
    );
};

export default RegisterForm;
