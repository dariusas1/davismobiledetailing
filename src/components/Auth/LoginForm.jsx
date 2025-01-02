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

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState(null);
    const navigate = useNavigate();
    const { login, loading, authError } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setFormError(null);

        // Validate inputs
        const validation = validateInput.validateLogin({ email, password });
        
        if (!validation.isValid) {
            // Set specific field errors
            const newErrors = {};
            validation.errors.forEach(error => {
                if (error.includes('email')) {
                    newErrors.email = error;
                } else if (error.includes('password')) {
                    newErrors.password = error;
                }
            });
            setErrors(newErrors);
            return;
        }

        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setFormError(err.message || 'Login failed');
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
                    Sign in
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
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={!!errors.email}
                        helperText={errors.email}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={!!errors.password}
                        helperText={errors.password}
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
                        {loading ? <CircularProgress size={24} /> : 'Sign In'}
                    </Button>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button 
                            color="primary" 
                            onClick={() => navigate('/forgot-password')}
                        >
                            Forgot Password?
                        </Button>
                        <Button 
                            color="primary" 
                            onClick={() => navigate('/register')}
                        >
                            Create Account
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

export default LoginForm;
