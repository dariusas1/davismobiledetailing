import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Grid,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Stepper,
    Step,
    StepLabel,
    TextField,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    useMediaQuery,
    useTheme
} from '@mui/material';

import SlotAvailabilityService from '../../services/slotAvailabilityService';
import PricingService from '../../services/pricingService';
import BookingService from '../../services/bookingService';

const MobileBookingView = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [activeStep, setActiveStep] = useState(0);
    const [bookingData, setBookingData] = useState({
        serviceType: '',
        vehicleType: '',
        date: '',
        time: '',
        name: '',
        phone: '',
        email: ''
    });

    const [pricingPreview, setPricingPreview] = useState(null);
    const { slots, isLoading: slotsLoading } = SlotAvailabilityService.useSlotAvailability(
        bookingData.date, 
        bookingData.serviceType
    );

    // Steps configuration
    const steps = [
        'Select Service',
        'Choose Time',
        'Personal Details',
        'Confirm Booking'
    ];

    // Service and vehicle types
    const serviceTypes = [
        'Basic Wash', 
        'Premium Wash', 
        'Elite Ceramic Package'
    ];

    const vehicleTypes = [
        'Small Car', 
        'Sedan', 
        'SUV', 
        'Truck'
    ];

    useEffect(() => {
        if (bookingData.serviceType) {
            const preview = PricingService.getPricingPreview(bookingData.serviceType);
            setPricingPreview(preview);
        }
    }, [bookingData.serviceType]);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBookingData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmitBooking = async () => {
        try {
            const booking = await BookingService.createBooking(bookingData);
            // Show success dialog or navigate
        } catch (error) {
            // Handle booking error
        }
    };

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Service Type</InputLabel>
                                <Select
                                    name="serviceType"
                                    value={bookingData.serviceType}
                                    onChange={handleInputChange}
                                >
                                    {serviceTypes.map(type => (
                                        <MenuItem key={type} value={type}>
                                            {type}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        {pricingPreview && (
                            <Grid item xs={12}>
                                <Typography variant="body2">
                                    Base Price: ${pricingPreview.basePrice}
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                );
            case 1:
                return (
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Preferred Date"
                                name="date"
                                value={bookingData.date}
                                onChange={handleInputChange}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Available Time Slots</InputLabel>
                                <Select
                                    name="time"
                                    value={bookingData.time}
                                    onChange={handleInputChange}
                                    disabled={slotsLoading}
                                >
                                    {slots.map(slot => (
                                        <MenuItem key={slot} value={slot}>
                                            {slot}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                );
            case 2:
                return (
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Full Name"
                                name="name"
                                value={bookingData.name}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Phone Number"
                                name="phone"
                                value={bookingData.phone}
                                onChange={handleInputChange}
                                placeholder="(408) 634-9181"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Email Address"
                                name="email"
                                value={bookingData.email}
                                onChange={handleInputChange}
                                type="email"
                            />
                        </Grid>
                    </Grid>
                );
            case 3:
                return (
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h6">Booking Summary</Typography>
                            <Typography>
                                Service: {bookingData.serviceType}
                            </Typography>
                            <Typography>
                                Date: {bookingData.date}
                            </Typography>
                            <Typography>
                                Time: {bookingData.time}
                            </Typography>
                            <Typography>
                                Name: {bookingData.name}
                            </Typography>
                        </Grid>
                    </Grid>
                );
            default:
                return 'Unknown step';
        }
    };

    return (
        <Box sx={{ width: '100%', maxWidth: 600, margin: 'auto' }}>
            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            <Box sx={{ mt: 2, mb: 2 }}>
                {renderStepContent(activeStep)}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button 
                    disabled={activeStep === 0} 
                    onClick={handleBack}
                >
                    Back
                </Button>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={
                        activeStep === steps.length - 1 
                            ? handleSubmitBooking 
                            : handleNext
                    }
                >
                    {activeStep === steps.length - 1 ? 'Confirm' : 'Next'}
                </Button>
            </Box>
        </Box>
    );
};

export default MobileBookingView;
