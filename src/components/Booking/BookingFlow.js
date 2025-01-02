import React, { useState, useEffect } from 'react';
import {
    Box,
    Stepper,
    Step,
    StepLabel,
    Button,
    Typography,
    Card,
    CardContent,
    Grid,
    CircularProgress,
    Alert,
    useTheme,
    useMediaQuery,
    Paper,
    Divider,
    Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    DirectionsCar,
    CalendarMonth,
    List,
    Payment,
    CheckCircle
} from '@mui/icons-material';
import ServiceSelection from './steps/ServiceSelection';
import VehicleDetails from './steps/VehicleDetails';
import DateTimeSelection from './steps/DateTimeSelection';
import AddOns from './steps/AddOns';
import PaymentDetails from './steps/PaymentDetails';
import BookingSummary from './BookingSummary';
import { useBooking } from '../../contexts/BookingContext';
import { motion, AnimatePresence } from 'framer-motion';

const StyledCard = styled(Card)(({ theme }) => ({
    background: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: theme.shadows[3],
    overflow: 'visible',
    position: 'relative',
    '&:hover': {
        boxShadow: theme.shadows[6]
    }
}));

const StepContent = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
        padding: theme.spacing(4)
    }
}));

const PriceTag = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: -20,
    right: 20,
    background: theme.palette.primary.main,
    color: theme.palette.primary.contralto,
    padding: theme.spacing(1, 3),
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: theme.shadows[2],
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1)
}));

const steps = [
    {
        label: 'Select Service',
        icon: <List />,
        component: ServiceSelection
    },
    {
        label: 'Vehicle Details',
        icon: <DirectionsCar />,
        component: VehicleDetails
    },
    {
        label: 'Date & Time',
        icon: <CalendarMonth />,
        component: DateTimeSelection
    },
    {
        label: 'Add-ons',
        icon: <List />,
        component: AddOns
    },
    {
        label: 'Payment',
        icon: <Payment />,
        component: PaymentDetails
    }
];

const BookingFlow = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { bookingData, updateBookingData, calculateTotal } = useBooking();

    const handleNext = async () => {
        setError(null);
        setLoading(true);

        try {
            // Validate current step
            const currentStep = steps[activeStep];
            await currentStep.validate?.(bookingData);

            if (activeStep === steps.length - 1) {
                // Process final booking
                await handleBookingSubmit();
            } else {
                setActiveStep((prev) => prev + 1);
            }
        } catch (err) {
            setError(err.message || 'Please complete all required fields');
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
        setError(null);
    };

    const handleBookingSubmit = async () => {
        try {
            // Process payment and create booking
            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingData)
            });

            if (!response.ok) throw new Error('Booking failed');

            // Show success message and redirect
            setActiveStep(steps.length);
        } catch (err) {
            setError('Failed to process booking. Please try again.');
        }
    };

    const CurrentStepComponent = steps[activeStep]?.component;

    return (
        <Box sx={{ width: '100%', mb: 8 }}>
            {/* Progress Stepper */}
            <Stepper
                activeStep={activeStep}
                alternativeLabel={!isMobile}
                orientation={isMobile ? 'vertical' : 'horizontal'}
                sx={{ mb: 4 }}
            >
                {steps.map((step, index) => (
                    <Step key={step.label}>
                        <StepLabel
                            StepIconComponent={() => (
                                <Box
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: activeStep >= index
                                            ? theme.palette.primary.main
                                            : theme.palette.grey[300],
                                        color: activeStep >= index
                                            ? theme.palette.primary.contrastText
                                            : theme.palette.text.secondary
                                    }}
                                >
                                    {step.icon}
                                </Box>
                            )}
                        >
                            {step.label}
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>

            <Grid container spacing={4}>
                {/* Main Content */}
                <Grid item xs={12} md={8}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            <StyledCard>
                                {activeStep < steps.length && (
                                    <PriceTag>
                                        <Typography variant="h6">
                                            ${calculateTotal().toFixed(2)}
                                        </Typography>
                                        <Chip
                                            label="Dynamic Pricing"
                                            size="small"
                                            color="secondary"
                                        />
                                    </PriceTag>
                                )}
                                <CardContent>
                                    {activeStep === steps.length ? (
                                        <Box textAlign="center" py={4}>
                                            <CheckCircle
                                                color="success"
                                                sx={{ fontSize: 64, mb: 2 }}
                                            />
                                            <Typography variant="h4" gutterBottom>
                                                Booking Confirmed!
                                            </Typography>
                                            <Typography color="text.secondary" paragraph>
                                                Your booking has been successfully processed.
                                                You will receive a confirmation email shortly.
                                            </Typography>
                                            <Button
                                                variant="contained"
                                                onClick={() => window.location.href = '/dashboard'}
                                            >
                                                View Booking Details
                                            </Button>
                                        </Box>
                                    ) : (
                                        <StepContent>
                                            <CurrentStepComponent
                                                data={bookingData}
                                                onUpdate={updateBookingData}
                                            />
                                        </StepContent>
                                    )}
                                </CardContent>
                            </StyledCard>
                        </motion.div>
                    </AnimatePresence>

                    {/* Error Message */}
                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {/* Navigation Buttons */}
                    {activeStep < steps.length && (
                        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                            <Button
                                disabled={activeStep === 0 || loading}
                                onClick={handleBack}
                                variant="outlined"
                                sx={{ flex: 1 }}
                            >
                                Back
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleNext}
                                disabled={loading}
                                sx={{ flex: 1 }}
                            >
                                {loading ? (
                                    <CircularProgress size={24} />
                                ) : activeStep === steps.length - 1 ? (
                                    'Confirm Booking'
                                ) : (
                                    'Continue'
                                )}
                            </Button>
                        </Box>
                    )}
                </Grid>

                {/* Booking Summary */}
                <Grid item xs={12} md={4}>
                    <Paper
                        elevation={3}
                        sx={{
                            position: 'sticky',
                            top: theme.spacing(2),
                            p: 3,
                            borderRadius: theme.shape.borderRadius * 2
                        }}
                    >
                        <Typography variant="h6" gutterBottom>
                            Booking Summary
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <BookingSummary data={bookingData} />
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default BookingFlow; 