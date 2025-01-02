import React, { useEffect } from 'react';
import { 
    Grid, 
    Paper, 
    Typography, 
    Box, 
    CircularProgress 
} from '@mui/material';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    Legend, 
    ResponsiveContainer 
} from 'recharts';

import { useDashboard } from '../../contexts/DashboardContext';
import ErrorBoundary from '../ErrorBoundary/GlobalErrorBoundary';

const DashboardAnalytics = () => {
    const { 
        analytics, 
        fetchDashboardAnalytics, 
        isLoading 
    } = useDashboard();

    useEffect(() => {
        fetchDashboardAnalytics();
    }, []);

    if (isLoading) {
        return (
            <Box 
                display="flex" 
                justifyContent="center" 
                alignItems="center" 
                height="100%"
            >
                <CircularProgress />
            </Box>
        );
    }

    if (!analytics) {
        return (
            <Typography variant="h6" color="error">
                No analytics data available
            </Typography>
        );
    }

    // Transform analytics data for chart
    const chartData = [
        { 
            name: 'Projects', 
            count: analytics.projects || 0 
        },
        { 
            name: 'Reviews', 
            count: analytics.reviews || 0 
        },
        { 
            name: 'Packages', 
            count: analytics.packages || 0 
        }
    ];

    return (
        <ErrorBoundary>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper 
                        elevation={3} 
                        sx={{ 
                            p: 2, 
                            height: '400px', 
                            display: 'flex', 
                            flexDirection: 'column' 
                        }}
                    >
                        <Typography 
                            variant="h6" 
                            gutterBottom
                        >
                            Dashboard Overview
                        </Typography>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart 
                                data={chartData}
                                margin={{ 
                                    top: 20, 
                                    right: 30, 
                                    left: 0, 
                                    bottom: 0 
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar 
                                    dataKey="count" 
                                    fill="#8884d8" 
                                    name="Total Count" 
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
                
                <Grid item xs={12} md={6}>
                    <Paper 
                        elevation={3} 
                        sx={{ 
                            p: 2, 
                            height: '400px', 
                            display: 'flex', 
                            flexDirection: 'column', 
                            justifyContent: 'center' 
                        }}
                    >
                        <Typography variant="h6" gutterBottom>
                            Quick Stats
                        </Typography>
                        <Box>
                            <Typography variant="body1">
                                Total Projects: {analytics.projects || 0}
                            </Typography>
                            <Typography variant="body1">
                                Total Reviews: {analytics.reviews || 0}
                            </Typography>
                            <Typography variant="body1">
                                Total Packages: {analytics.packages || 0}
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </ErrorBoundary>
    );
};

export default DashboardAnalytics;
