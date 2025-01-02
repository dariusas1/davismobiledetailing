import React, { useState, useEffect } from 'react';
import { 
    Stepper, 
    Step, 
    StepLabel, 
    Button, 
    Typography, 
    Box, 
    Paper,
    LinearProgress
} from '@mui/material';
import BookingForm from './BookingForm';
import BookingCalendar from './BookingCalendar';
import { validateBookingForm, errorMessages } from '../../utils/errorHandling';
import { serviceRecommendationEngine } from '../../utils/serviceRecommendations';

const BookingWizard = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [bookingData, setBookingData] = useState({});
    const [errors, setErrors] = useState({});
    const [recommendations, setRecommendations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const steps = [
        'Select Service Details',
        'Choose Date and Time',
        'Confirm Booking'
    ];

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
        setBookingData({});
        setErrors({});
        setRecommendations([]);
    };

    const updateBookingData = (newData) => {
        setBookingData(prev => ({
            ...prev,
            ...newData
        }));
    };

    const validateStep = () => {
        switch (activeStep) {
            case 0: // Service Details
                const validationResult = validateBookingForm(bookingData);
                setErrors(validationResult.errors);
                return validationResult.isValid;
            case 1: // Date and Time
                return bookingData.bookingDate && bookingData.bookingTime;
            default:
                return true;
        }
    };

    const generateRecommendations = () => {
        const customerData = {
            vehicleType: bookingData.vehicleType,
            lastService: null,
            season: new Date().getMonth() >= 5 && new Date().getMonth() <= 8 ? 'summer' : 'winter',
            location: bookingData.location
        };

        const generatedRecommendations = serviceRecommendationEngine.determineRecommendations(customerData);
        setRecommendations(generatedRecommendations);
    };

    const handleSubmitBooking = async () => {
        setIsLoading(true);
        try {
            // Implement actual booking submission logic
            await axios.post('/api/bookings/create', bookingData);
            
            // Show success modal or redirect
            alert('Booking successful!');
            handleReset();
        } catch (error) {
            const errorMessage = handleBookingError(error);
            alert(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const renderStepContent = () => {
        switch (activeStep) {
            case 0:
                return (
                    <BookingForm 
                        initialData={bookingData}
                        onDataUpdate={updateBookingData}
                        errors={errors}
                    />
                );
            case 1:
                return (
                    <BookingCalendar 
                        onDateSelect={(date) => updateBookingData({ bookingDate: date })}
                        onTimeSelect={(time) => updateBookingData({ bookingTime: time })}
                    />
                );
            case 2:
                return (
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h6">Booking Summary</Typography>
                        {/* Display booking details and recommendations */}
                        <Box>
                            <Typography>Service: {bookingData.serviceType}</Typography>
                            <Typography>Date: {bookingData.bookingDate?.toString()}</Typography>
                            <Typography>Time: {bookingData.bookingTime}</Typography>
                            
                            {recommendations.length > 0 && (
                                <Box mt={2}>
                                    <Typography variant="subtitle1">Recommendations:</Typography>
                                    {recommendations.map((rec, index) => (
                                        <Typography key={index} variant="body2">
                                            {rec.type}: {rec.reason}
                                        </Typography>
                                    ))}
                                </Box>
                            )}
                        </Box>
                    </Paper>
                );
            default:
                return null;
        }
    };

    useEffect(() => {
        if (activeStep === 0 && bookingData.vehicleType) {
            generateRecommendations();
        }
    }, [activeStep, bookingData.vehicleType]);

    return (
        <Box sx={{ width: '100%', maxWidth: 800, margin: 'auto' }}>
            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            {isLoading && <LinearProgress />}

            {activeStep === steps.length ? (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Typography>All steps completed</Typography>
                    <Button onClick={handleReset}>Reset</Button>
                </Box>
            ) : (
                <Box>
                    {renderStepContent()}
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <Button 
                            color="inherit" 
                            disabled={activeStep === 0} 
                            onClick={handleBack}
                        >
                            Back
                        </Button>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={() => {
                                if (validateStep()) {
                                    activeStep === steps.length - 1 
                                        ? handleSubmitBooking() 
                                        : handleNext();
                                }
                            }}
                        >
                            {activeStep === steps.length - 1 ? 'Submit Booking' : 'Next'}
                        </Button>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default BookingWizard;
