import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Typography,
    Card,
    CardContent,
    Button,
    CircularProgress,
    Alert,
    Divider,
    TextField,
    Chip,
    useTheme,
    alpha
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    CreditCard,
    LocalOffer,
    LoyaltyOutlined,
    Receipt,
    CheckCircle
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { SquarePaymentForm } from '@square/web-payments-sdk-react';

const StyledCard = styled(Card)(({ theme }) => ({
    borderRadius: theme.shape.borderRadius * 2,
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: theme.shadows[4]
    }
}));

const SummaryRow = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1, 0)
}));

const PaymentDetails = ({ data, onUpdate }) => {
    const theme = useTheme();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [promoCode, setPromoCode] = useState('');
    const [appliedPromo, setAppliedPromo] = useState(null);
    const [loyaltyPoints, setLoyaltyPoints] = useState(0);
    const [useLoyaltyPoints, setUseLoyaltyPoints] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState(null);

    useEffect(() => {
        fetchLoyaltyPoints();
    }, []);

    const fetchLoyaltyPoints = async () => {
        try {
            const response = await fetch('/api/loyalty/points');
            const data = await response.json();
            setLoyaltyPoints(data.points);
        } catch (error) {
            console.error('Error fetching loyalty points:', error);
        }
    };

    const handlePromoCodeApply = async () => {
        setError(null);
        setLoading(true);

        try {
            const response = await fetch('/api/promotions/validate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ code: promoCode })
            });

            const result = await response.json();

            if (!response.ok) throw new Error(result.message);

            setAppliedPromo(result);
            onUpdate({
                ...data,
                promotion: result
            });
        } catch (err) {
            setError(err.message || 'Invalid promotion code');
        } finally {
            setLoading(false);
        }
    };

    const handleLoyaltyPointsToggle = () => {
        setUseLoyaltyPoints(!useLoyaltyPoints);
        onUpdate({
            ...data,
            useLoyaltyPoints: !useLoyaltyPoints
        });
    };

    const calculateSubtotal = () => {
        const servicePrice = data.selectedService?.price || 0;
        const addOnsTotal = data.addOns?.reduce((total, addOnId) => {
            const addOn = data.availableAddOns?.find(a => a._id === addOnId);
            return total + (addOn?.price || 0);
        }, 0) || 0;

        return servicePrice + addOnsTotal;
    };

    const calculateDiscount = () => {
        const subtotal = calculateSubtotal();
        let discount = 0;

        if (appliedPromo) {
            discount += appliedPromo.type === 'percentage'
                ? subtotal * (appliedPromo.value / 100)
                : appliedPromo.value;
        }

        if (useLoyaltyPoints) {
            discount += Math.min(loyaltyPoints * 0.01, subtotal * 0.2); // $0.01 per point, max 20% discount
        }

        return discount;
    };

    const calculateTotal = () => {
        return calculateSubtotal() - calculateDiscount();
    };

    const handlePaymentMethodChange = (method) => {
        setPaymentMethod(method);
        onUpdate({
            ...data,
            paymentMethod: method
        });
    };

    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                Payment Details
            </Typography>
            <Typography color="text.secondary" paragraph>
                Complete your booking with secure payment
            </Typography>

            <Grid container spacing={4}>
                {/* Payment Form */}
                <Grid item xs={12} md={8}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <StyledCard>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Payment Method
                                </Typography>

                                <Box mb={4}>
                                    <SquarePaymentForm
                                        applicationId={process.env.NEXT_PUBLIC_SQUARE_APP_ID}
                                        locationId={process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID}
                                        cardTokenizeResponseReceived={async (token, buyer) => {
                                            handlePaymentMethodChange({
                                                type: 'square',
                                                token: token
                                            });
                                        }}
                                    />
                                </Box>

                                <Divider sx={{ my: 4 }} />

                                {/* Promo Code */}
                                <Typography variant="subtitle1" gutterBottom>
                                    Promotional Code
                                </Typography>
                                <Box display="flex" gap={2} mb={3}>
                                    <TextField
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value)}
                                        placeholder="Enter code"
                                        size="small"
                                        disabled={loading || appliedPromo}
                                    />
                                    <Button
                                        variant="outlined"
                                        onClick={handlePromoCodeApply}
                                        disabled={loading || !promoCode || appliedPromo}
                                        startIcon={loading ? <CircularProgress size={20} /> : <LocalOffer />}
                                    >
                                        Apply
                                    </Button>
                                </Box>

                                {appliedPromo && (
                                    <Alert
                                        severity="success"
                                        sx={{ mb: 3 }}
                                        action={
                                            <Button
                                                color="inherit"
                                                size="small"
                                                onClick={() => {
                                                    setAppliedPromo(null);
                                                    setPromoCode('');
                                                    onUpdate({
                                                        ...data,
                                                        promotion: null
                                                    });
                                                }}
                                            >
                                                Remove
                                            </Button>
                                        }
                                    >
                                        {appliedPromo.description}
                                    </Alert>
                                )}

                                {/* Loyalty Points */}
                                {loyaltyPoints > 0 && (
                                    <Box>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Loyalty Points
                                        </Typography>
                                        <Box
                                            p={2}
                                            bgcolor={alpha(theme.palette.primary.main, 0.1)}
                                            borderRadius={theme.shape.borderRadius}
                                            display="flex"
                                            justifyContent="space-between"
                                            alignItems="center"
                                        >
                                            <Box>
                                                <Typography variant="subtitle2">
                                                    Available Points: {loyaltyPoints}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Use points for up to 20% discount
                                                </Typography>
                                            </Box>
                                            <Button
                                                variant={useLoyaltyPoints ? "contained" : "outlined"}
                                                onClick={handleLoyaltyPointsToggle}
                                                startIcon={<LoyaltyOutlined />}
                                            >
                                                {useLoyaltyPoints ? "Points Applied" : "Use Points"}
                                            </Button>
                                        </Box>
                                    </Box>
                                )}
                            </CardContent>
                        </StyledCard>
                    </motion.div>
                </Grid>

                {/* Order Summary */}
                <Grid item xs={12} md={4}>
                    <StyledCard>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Order Summary
                            </Typography>

                            <Box my={3}>
                                <SummaryRow>
                                    <Typography>Service</Typography>
                                    <Typography>${data.selectedService?.price || 0}</Typography>
                                </SummaryRow>

                                {data.addOns?.length > 0 && (
                                    <>
                                        <SummaryRow>
                                            <Typography>Add-ons</Typography>
                                            <Typography>
                                                ${data.addOns.reduce((total, addOnId) => {
                                                    const addOn = data.availableAddOns?.find(a => a._id === addOnId);
                                                    return total + (addOn?.price || 0);
                                                }, 0)}
                                            </Typography>
                                        </SummaryRow>
                                    </>
                                )}

                                <Divider sx={{ my: 2 }} />

                                <SummaryRow>
                                    <Typography>Subtotal</Typography>
                                    <Typography>${calculateSubtotal()}</Typography>
                                </SummaryRow>

                                {(appliedPromo || useLoyaltyPoints) && (
                                    <SummaryRow>
                                        <Typography color="error">Discount</Typography>
                                        <Typography color="error">
                                            -${calculateDiscount()}
                                        </Typography>
                                    </SummaryRow>
                                )}

                                <Divider sx={{ my: 2 }} />

                                <SummaryRow>
                                    <Typography variant="h6">Total</Typography>
                                    <Typography variant="h6" color="primary">
                                        ${calculateTotal()}
                                    </Typography>
                                </SummaryRow>
                            </Box>

                            <Box mt={3}>
                                <Typography variant="body2" color="text.secondary" align="center">
                                    You'll earn {Math.floor(calculateTotal())} loyalty points with this booking
                                </Typography>
                            </Box>
                        </CardContent>
                    </StyledCard>
                </Grid>
            </Grid>

            {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            )}
        </Box>
    );
};

export default PaymentDetails; 