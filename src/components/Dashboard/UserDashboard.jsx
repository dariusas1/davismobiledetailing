import React from 'react';
import { 
    Container, 
    Typography, 
    Box, 
    Grid, 
    Paper, 
    Button 
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

const UserDashboard = () => {
    const { user, logout } = useAuth();

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Welcome, {user?.firstName || 'User'}
                </Typography>
                
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <Paper 
                            elevation={3} 
                            sx={{ 
                                p: 3, 
                                textAlign: 'center',
                                backgroundColor: '#f5f5f5' 
                            }}
                        >
                            <Typography variant="h6">Profile Information</Typography>
                            <Typography variant="body1">
                                Email: {user?.email}
                            </Typography>
                            <Button 
                                variant="outlined" 
                                color="primary" 
                                sx={{ mt: 2 }}
                            >
                                Edit Profile
                            </Button>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Paper 
                            elevation={3} 
                            sx={{ 
                                p: 3, 
                                textAlign: 'center',
                                backgroundColor: '#f5f5f5' 
                            }}
                        >
                            <Typography variant="h6">Booking History</Typography>
                            <Typography variant="body1">
                                No recent bookings
                            </Typography>
                            <Button 
                                variant="outlined" 
                                color="primary" 
                                sx={{ mt: 2 }}
                            >
                                View Bookings
                            </Button>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Paper 
                            elevation={3} 
                            sx={{ 
                                p: 3, 
                                textAlign: 'center',
                                backgroundColor: '#f5f5f5' 
                            }}
                        >
                            <Typography variant="h6">Loyalty Program</Typography>
                            <Typography variant="body1">
                                Current Tier: Basic
                            </Typography>
                            <Button 
                                variant="outlined" 
                                color="primary" 
                                sx={{ mt: 2 }}
                            >
                                View Rewards
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>

                <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Button 
                        variant="contained" 
                        color="secondary"
                        onClick={logout}
                        sx={{ 
                            backgroundColor: '#FFD700', 
                            color: '#000',
                            '&:hover': {
                                backgroundColor: '#FFC107'
                            }
                        }}
                    >
                        Logout
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default UserDashboard;
