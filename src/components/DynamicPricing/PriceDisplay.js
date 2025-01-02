import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Chip,
    Tooltip,
    Grid
} from '@mui/material';
import { styled } from '@mui/material/styles';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TimelineIcon from '@mui/icons-material/Timeline';

const PriceCard = styled(Card)(({ theme }) => ({
    background: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[3],
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: theme.shadows[6]
    }
}));

const PriceDisplay = ({ serviceId, vehicleType }) => {
    const [priceData, setPriceData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPrice = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/api/pricing/service/${serviceId}/price`, {
                    params: {
                        vehicleType,
                        bookingTime: new Date().toISOString()
                    }
                });
                setPriceData(response.data.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Error fetching price');
            } finally {
                setLoading(false);
            }
        };

        fetchPrice();
        // Refresh price every 5 minutes
        const interval = setInterval(fetchPrice, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, [serviceId, vehicleType]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" p={3}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box p={2}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    const priceChange = ((priceData.currentPrice - priceData.basePrice) / priceData.basePrice) * 100;
    const isPriceHigher = priceChange > 0;

    return (
        <PriceCard>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h4" component="div" gutterBottom>
                            ${priceData.currentPrice.toFixed(2)}
                            <Tooltip title={`${Math.abs(priceChange).toFixed(1)}% ${isPriceHigher ? 'above' : 'below'} base price`}>
                                <Chip
                                    icon={isPriceHigher ? <TrendingUpIcon /> : <TrendingDownIcon />}
                                    label={`${isPriceHigher ? '+' : '-'}${Math.abs(priceChange).toFixed(1)}%`}
                                    color={isPriceHigher ? 'error' : 'success'}
                                    size="small"
                                    sx={{ ml: 1 }}
                                />
                            </Tooltip>
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            Base Price: ${priceData.basePrice.toFixed(2)}
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Price Factors:
                        </Typography>
                        <Box mt={1}>
                            <Chip
                                label={`Demand: ${(priceData.factors.demandMultiplier * 100).toFixed(0)}%`}
                                size="small"
                                sx={{ mr: 1, mb: 1 }}
                            />
                            <Chip
                                label={`Seasonal: ${(priceData.factors.seasonalMultiplier * 100).toFixed(0)}%`}
                                size="small"
                                sx={{ mr: 1, mb: 1 }}
                            />
                            <Chip
                                label={`Time of Day: ${(priceData.factors.timeOfDayMultiplier * 100).toFixed(0)}%`}
                                size="small"
                                sx={{ mr: 1, mb: 1 }}
                            />
                            <Chip
                                label={`Vehicle Type: ${(priceData.factors.vehicleTypeMultiplier[vehicleType.toLowerCase()] * 100).toFixed(0)}%`}
                                size="small"
                                sx={{ mb: 1 }}
                            />
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        <Box display="flex" alignItems="center" mt={1}>
                            <TimelineIcon sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                                Price updates automatically based on demand and other factors
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </CardContent>
        </PriceCard>
    );
};

export default PriceDisplay; 