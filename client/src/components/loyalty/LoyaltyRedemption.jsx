import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Typography, 
    Grid, 
    Paper, 
    Button, 
    Slider, 
    Alert, 
    Card, 
    CardContent 
} from '@mui/material';
import axios from 'axios';

const LoyaltyRedemption = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [pointsToRedeem, setPointsToRedeem] = useState(0);
    const [redemptionResult, setRedemptionResult] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/api/auth/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUserProfile(response.data.user);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch user profile');
            }
        };

        fetchUserProfile();
    }, []);

    const handlePointsRedemption = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('/api/loyalty/redeem', 
                { pointsToRedeem }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setRedemptionResult(response.data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Redemption failed');
            setRedemptionResult(null);
        }
    };

    if (!userProfile) return <Typography>Loading...</Typography>;

    const redemptionRates = {
        'Bronze': { rate: 100, discount: 10 },
        'Silver': { rate: 80, discount: 10 },
        'Gold': { rate: 60, discount: 10 },
        'Platinum': { rate: 50, discount: 10 }
    };

    const currentRate = redemptionRates[userProfile.loyaltyTier] || redemptionRates['Bronze'];

    return (
        <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h5">Loyalty Points Redemption</Typography>
                        <Typography variant="subtitle1">
                            Current Loyalty Tier: {userProfile.loyaltyTier}
                        </Typography>
                        <Typography variant="body2">
                            Available Points: {userProfile.loyaltyPoints}
                        </Typography>

                        <Box sx={{ mt: 3 }}>
                            <Typography gutterBottom>
                                Points to Redeem (Current Rate: {currentRate.rate} points = ${currentRate.discount} off)
                            </Typography>
                            <Slider
                                value={pointsToRedeem}
                                onChange={(e, newValue) => setPointsToRedeem(newValue)}
                                min={0}
                                max={userProfile.loyaltyPoints}
                                step={currentRate.rate}
                                valueLabelDisplay="auto"
                            />
                        </Box>

                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={handlePointsRedemption}
                            disabled={pointsToRedeem === 0}
                            sx={{ mt: 2 }}
                        >
                            Redeem Points
                        </Button>

                        {error && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                                {error}
                            </Alert>
                        )}
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    {redemptionResult && (
                        <Card>
                            <CardContent>
                                <Typography variant="h6">Redemption Successful!</Typography>
                                <Typography>
                                    Redeemed: {pointsToRedeem} points
                                </Typography>
                                <Typography>
                                    Discount: ${redemptionResult.discountAmount}
                                </Typography>
                                <Typography>
                                    Remaining Points: {redemptionResult.remainingPoints}
                                </Typography>
                            </CardContent>
                        </Card>
                    )}

                    <Paper sx={{ p: 3, mt: 2 }}>
                        <Typography variant="h6">Loyalty Benefits</Typography>
                        {userProfile.loyaltyBenefits.map((benefit, index) => (
                            <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                                • {benefit}
                            </Typography>
                        ))}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default LoyaltyRedemption;
