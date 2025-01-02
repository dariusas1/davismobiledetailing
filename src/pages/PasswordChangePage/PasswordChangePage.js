import React, { useState, useContext } from 'react';
import { 
    Container, 
    Typography, 
    TextField, 
    Button, 
    Paper, 
    Box,
    IconButton,
    InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../App';
import AuthService from '../../services/authService';
import { toast } from 'react-toastify';

const PasswordChangePage = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { user, setUser } = useContext(AppContext);
    const navigate = useNavigate();

    const validatePassword = (password) => {
        // Password complexity requirements
        const complexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
        return complexityRegex.test(password);
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        // Validation checks
        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error('Please fill in all fields');
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        if (!validatePassword(newPassword)) {
            toast.error('Password must be at least 12 characters long and include uppercase, lowercase, number, and special character');
            return;
        }

        try {
            // Call backend service to change password
            await AuthService.changePassword({
                currentPassword,
                newPassword
            });

            toast.success('Password changed successfully');
            
            // Update user state to indicate password change
            setUser(prevUser => ({
                ...prevUser,
                mustChangePassword: false
            }));

            // Redirect to dashboard
            navigate('/admin');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to change password');
        }
    };

    // If user is not required to change password, redirect
    if (user && !user.mustChangePassword) {
        navigate('/admin');
        return null;
    }

    return (
        <Container maxWidth="xs" sx={{ mt: 10 }}>
            <Paper elevation={6} sx={{ p: 4 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Change Password
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
                    You must change your password before proceeding
                </Typography>
                <form onSubmit={handlePasswordChange}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField 
                            label="Current Password" 
                            type={showCurrentPassword ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                            fullWidth
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            edge="end"
                                        >
                                            {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                        <TextField 
                            label="New Password" 
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            fullWidth
                            helperText="At least 12 characters, include uppercase, lowercase, number, and special character"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            edge="end"
                                        >
                                            {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                        <TextField 
                            label="Confirm New Password" 
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            fullWidth
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            edge="end"
                                        >
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                        <Button 
                            type="submit" 
                            variant="contained" 
                            color="primary"
                            fullWidth
                        >
                            Change Password
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Container>
    );
};

export default PasswordChangePage;
