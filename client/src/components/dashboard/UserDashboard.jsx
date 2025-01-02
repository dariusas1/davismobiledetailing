/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Typography, 
    Grid, 
    Paper, 
    Avatar, 
    LinearProgress, 
    Card, 
    CardContent,
    Chip
} from '@mui/material';
import { 
    PieChart, 
    Pie, 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    Legend, 
    ResponsiveContainer 
} from 'recharts';
import axios from 'axios';
import moment from 'moment';

const UserDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/api/user-analytics/dashboard', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setDashboardData(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch dashboard data');
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) return <Typography>Loading dashboard...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;

    const { 
        userProfile, 
        bookingAnalytics, 
        vehicleTypeAnalytics, 
        servicePreferences,
        loyaltyProgram 
    } = dashboardData;

    return (
        <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
                {/* User Profile Section */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                        <Avatar 
                            sx={{ 
                                width: 100, 
                                height: 100, 
                                margin: 'auto', 
                                mb: 2,
                                bgcolor: 'primary.main' 
                            }}
                        >
                            {userProfile.name.charAt(0)}
                        </Avatar>
                        <Typography variant="h5">{userProfile.name}</Typography>
                        <Typography variant="subtitle1">{userProfile.email}</Typography>
                        
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="h6">Loyalty Program</Typography>
                            <Chip 
                                label={`${loyaltyProgram.currentTier} Tier`} 
                                color="primary" 
                                sx={{ mr: 1 }} 
                            />
                            <Typography variant="body2">
                                {loyaltyProgram.pointsToNextTier > 0
                                    ? `${loyaltyProgram.pointsToNextTier} points to next tier`
                                    : 'Top Tier Achieved!'}
                            </Typography>
                            <LinearProgress 
                                variant="determinate" 
                                value={(userProfile.loyaltyPoints % 100)} 
                                sx={{ mt: 1 }} 
                            />
                        </Box>
                    </Paper>
                </Grid>

                {/* Booking Analytics */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6">Booking Overview</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h4">
                                            {bookingAnalytics.totalBookings}
                                        </Typography>
                                        <Typography variant="subtitle1">
                                            Total Bookings
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h4">
                                            ${bookingAnalytics.totalSpent.toFixed(2)}
                                        </Typography>
                                        <Typography variant="subtitle1">
                                            Total Spent
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>

                        {/* Vehicle Type Analytics */}
                        <Box sx={{ mt: 3, height: 300 }}>
                            <Typography variant="h6">Vehicle Type Distribution</Typography>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={vehicleTypeAnalytics}
                                        dataKey="count"
                                        nameKey="_id"
                                        fill="#8884d8"
                                        label
                                    />
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </Box>
                    </Paper>
                </Grid>

                {/* Service Preferences */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6">Service Preferences</Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart 
                                data={servicePreferences}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="serviceName" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="frequency" fill="#8884d8" name="Booking Frequency" />
                                <Bar dataKey="totalSpent" fill="#82ca9d" name="Total Spent" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default UserDashboard;
