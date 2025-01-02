import React, { useState } from 'react';
import { 
    Box, 
    Typography, 
    Grid, 
    Card, 
    CardContent, 
    Button, 
    LinearProgress 
} from '@mui/material';

const loyaltyTiers = [
    {
        name: 'Bronze',
        pointsRequired: 0,
        benefits: [
            '5% off first service',
            'Birthday discount'
        ],
        color: '#CD7F32'
    },
    {
        name: 'Silver',
        pointsRequired: 500,
        benefits: [
            'Bronze tier benefits',
            '10% off every 5th service',
            'Free basic wash'
        ],
        color: '#C0C0C0'
    },
    {
        name: 'Gold',
        pointsRequired: 1500,
        benefits: [
            'Silver tier benefits',
            '15% off every service',
            'Free interior detailing',
            'Priority booking'
        ],
        color: '#FFD700'
    }
];

export default function LoyaltyProgram() {
    const [customerPoints, setCustomerPoints] = useState(750);

    const getCurrentTier = () => {
        return loyaltyTiers.reduce((currentTier, tier) => {
            return customerPoints >= tier.pointsRequired ? tier : currentTier;
        }, loyaltyTiers[0]);
    };

    const getNextTier = () => {
        const currentTierIndex = loyaltyTiers.findIndex(tier => tier.name === getCurrentTier().name);
        return currentTierIndex < loyaltyTiers.length - 1 
            ? loyaltyTiers[currentTierIndex + 1] 
            : null;
    };

    const calculateProgressToNextTier = () => {
        const currentTier = getCurrentTier();
        const nextTier = getNextTier();

        if (!nextTier) return 100;

        const pointsInCurrentTier = customerPoints - currentTier.pointsRequired;
        const pointsToNextTier = nextTier.pointsRequired - currentTier.pointsRequired;

        return (pointsInCurrentTier / pointsToNextTier) * 100;
    };

    return (
        <Box sx={{ py: 6, bgcolor: 'background.paper' }}>
            <Typography 
                variant="h3" 
                align="center" 
                gutterBottom 
                sx={{ 
                    fontWeight: 'bold',
                    mb: 4,
                    color: 'primary.main' 
                }}
            >
                Precision Detailing Loyalty Program
            </Typography>

            <Grid container spacing={3} justifyContent="center">
                <Grid item xs={12} md={8}>
                    <Card 
                        sx={{ 
                            p: 3, 
                            borderRadius: 2,
                            boxShadow: '0 8px 20px rgba(255, 215, 0, 0.2)' 
                        }}
                    >
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography variant="h6">
                                    Your Current Tier: {getCurrentTier().name}
                                </Typography>
                                <Typography variant="h6">
                                    Points: {customerPoints}
                                </Typography>
                            </Box>

                            {getNextTier() && (
                                <>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        Points to {getNextTier().name} Tier
                                    </Typography>
                                    <LinearProgress 
                                        variant="determinate" 
                                        value={calculateProgressToNextTier()}
                                        sx={{ 
                                            height: 10, 
                                            borderRadius: 5,
                                            backgroundColor: 'rgba(255, 215, 0, 0.2)' 
                                        }}
                                    />
                                </>
                            )}

                            <Grid container spacing={2} sx={{ mt: 3 }}>
                                {loyaltyTiers.map((tier) => (
                                    <Grid item xs={12} sm={4} key={tier.name}>
                                        <Card 
                                            sx={{ 
                                                height: '100%', 
                                                border: customerPoints >= tier.pointsRequired 
                                                    ? `2px solid ${tier.color}` 
                                                    : '1px solid rgba(0,0,0,0.12)',
                                                opacity: customerPoints >= tier.pointsRequired ? 1 : 0.6
                                            }}
                                        >
                                            <CardContent>
                                                <Typography 
                                                    variant="h5" 
                                                    sx={{ 
                                                        color: tier.color, 
                                                        fontWeight: 'bold',
                                                        mb: 2 
                                                    }}
                                                >
                                                    {tier.name} Tier
                                                </Typography>
                                                <Typography variant="body2" sx={{ mb: 2 }}>
                                                    Points Required: {tier.pointsRequired}
                                                </Typography>
                                                <Typography variant="body2">
                                                    Benefits:
                                                    <ul>
                                                        {tier.benefits.map((benefit, index) => (
                                                            <li key={index}>{benefit}</li>
                                                        ))}
                                                    </ul>
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>

                            <Button 
                                variant="contained" 
                                color="primary" 
                                fullWidth 
                                sx={{ mt: 3, py: 1.5 }}
                            >
                                Redeem Points
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
