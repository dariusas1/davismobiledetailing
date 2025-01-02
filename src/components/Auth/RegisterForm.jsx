import React, { useState } from 'react';
import { 
    TextField, 
    Button, 
    Container, 
    Typography, 
    Box, 
    CircularProgress, 
    Alert 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { validateInput } from '../../utils/validationUtils';

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState(null);
    const navigate = useNavigate();
    const { signup, loading, authError } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setFormError(null);

        // Validate inputs
        const validation = validateInput.validateRegistration(formData);
        
        if (!validation.isValid) {
            // Set specific field errors
            const newErrors = {};
            validation.errors.forEach(error => {
                if (error.includes('email')) {
                    newErrors.email = error;
                } else if (error.includes('password')) {
                    newErrors.password = error;
                } else if (error.includes('firstName')) {
                    newErrors.firstName = error;
                } else if (error.includes('lastName')) {
                    newErrors.lastName = error;
                } else if (error.includes('phone')) {
                    newErrors.phone = error;
                }
            });
            setErrors(newErrors);
            return;
        }

        try {
            await signup(formData);
            navigate('/dashboard');
        } catch (err) {
            setFormError(err.message || 'Registration failed');
        }
    };

    return (
        <Container maxWidth="xs">
            <Box 
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    Create Account
                </Typography>
                
                {formError && (
                    <Alert 
                        severity="error" 
                        sx={{ width: '100%', mt: 2 }}
                    >
                        {formError}
                    </Alert>
                )}

                {authError && (
                    <Alert 
                        severity="error" 
                        sx={{ width: '100%', mt: 2 }}
                    >
                        {authError.message}
                    </Alert>
                )}

                <Box 
                    component="form" 
                    onSubmit={handleSubmit} 
                    noValidate 
                    sx={{ mt: 1, width: '100%' }}
                >
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="firstName"
                            label="First Name"
                            name="firstName"
                            autoFocus
                            value={formData.firstName}
                            onChange={handleChange}
                            error={!!errors.firstName}
                            helperText={errors.firstName}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="lastName"
                            label="Last Name"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            error={!!errors.lastName}
                            helperText={errors.lastName}
                        />
                    </Box>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={errors.email}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        id="phone"
                        label="Phone Number"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        error={!!errors.phone}
                        helperText={errors.phone}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        value={formData.password}
                        onChange={handleChange}
                        error={!!errors.password}
                        helperText={errors.password || 'At least 8 characters, include uppercase, lowercase, and number'}
                    />
                    
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ 
                            mt: 3, 
                            mb: 2,
                            backgroundColor: '#FFD700',
                            color: '#000',
                            '&:hover': {
                                backgroundColor: '#FFC107'
                            }
                        }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Create Account'}
                    </Button>

                    <Box sx={{ textAlign: 'center' }}>
                        <Button 
                            color="primary" 
                            onClick={() => navigate('/login')}
                        >
                            Already have an account? Sign In
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

export default RegisterForm;
