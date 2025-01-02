/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { 
    Container, 
    Grid, 
    TextField, 
    Button, 
    Typography, 
    MenuItem, 
    Select, 
    Box, 
    Alert 
} from '@mui/material';
import PaymentService from '../../services/paymentService';
import BookingService from '../../services/bookingService';
import ErrorHandler from '../../utils/ErrorHandler';
import Logger from '../../utils/Logger';
import LocationService from '../../utils/locationService';
import ServiceAreaMap from '../../components/ServiceAreaMap';

const Booking = () => {
    const [bookingData, setBookingData] = useState({
        serviceType: '',
        vehicleType: '',
        date: '',
        time: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        streetAddress: '',
        city: '',
        state: 'CA',
        zipCode: '',
        cardDetails: {
            cardNumber: '',
            expirationMonth: '',
            expirationYear: '',
            cvv: ''
        }
    });

    const [pricing, setPricing] = useState(null);

    const [availableTimeSlots, setAvailableTimeSlots] = useState([]);

    const [bookingStatus, setBookingStatus] = useState({
        loading: false,
        error: null,
        success: false
    });

    const [serviceAreaCities, setServiceAreaCities] = useState([]);
    const [serviceAvailability, setServiceAvailability] = useState({
        isAvailable: false,
        message: ''
    });

    const serviceTypes = [
        { value: 'basic', label: 'Basic Wash' },
        { value: 'premium', label: 'Premium Detail' },
        { value: 'full-detail', label: 'Full Detailing' }
    ];

    const vehicleTypes = [
        { value: 'sedan', label: 'Sedan' },
        { value: 'suv', label: 'SUV/Crossover' },
        { value: 'truck', label: 'Truck' },
        { value: 'van', label: 'Van' }
    ];

    // Fetch available time slots when date or service type changes
    useEffect(() => {
        const fetchAvailableSlots = async () => {
            if (bookingData.date && bookingData.serviceType) {
                try {
                    const slots = await BookingService.getAvailableTimeSlots(
                        bookingData.date, 
                        bookingData.serviceType
                    );
                    setAvailableTimeSlots(slots);
                } catch (error) {
                    ErrorHandler.handleError(error, 'Fetching Available Time Slots');
                }
            }
        };

        fetchAvailableSlots();
    }, [bookingData.date, bookingData.serviceType]);

    // Calculate pricing when service type or vehicle type changes
    useEffect(() => {
        const calculatePricing = () => {
            if (bookingData.serviceType && bookingData.vehicleType) {
                try {
                    const pricingDetails = BookingService.calculateServicePrice(
                        bookingData.serviceType, 
                        bookingData.vehicleType
                    );
                    setPricing(pricingDetails);
                } catch (error) {
                    ErrorHandler.handleError(error, 'Pricing Calculation');
                }
            }
        };

        calculatePricing();
    }, [bookingData.serviceType, bookingData.vehicleType]);

    useEffect(() => {
        // Fetch nearby service cities
        const cities = LocationService.getNearbyServiceCities();
        setServiceAreaCities(cities);
    }, []);

    const handleAddressValidation = async () => {
        try {
            const fullAddress = `${bookingData.streetAddress}, ${bookingData.city}, ${bookingData.state} ${bookingData.zipCode}`;
            const availability = await LocationService.validateServiceAvailability(fullAddress);

            setServiceAvailability({
                isAvailable: availability.isAvailable,
                message: availability.isAvailable 
                    ? 'Great! We serve your area.' 
                    : 'Sorry, we do not currently service this location.'
            });
        } catch (error) {
            ErrorHandler.handleError(error, 'Address Validation Failed');
            setServiceAvailability({
                isAvailable: false,
                message: 'Unable to validate address. Please check your details.'
            });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Handle nested card details
        if (name.startsWith('cardDetails.')) {
            const cardDetailKey = name.split('.')[1];
            setBookingData(prev => ({
                ...prev,
                cardDetails: {
                    ...prev.cardDetails,
                    [cardDetailKey]: value
                }
            }));
        } else {
            setBookingData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const validateBookingForm = () => {
        const requiredFields = [
            'serviceType', 'vehicleType', 'date', 'time', 
            'firstName', 'lastName', 'email', 'phone', 
            'streetAddress', 'city', 'state', 'zipCode'
        ];

        const missingFields = requiredFields.filter(field => !bookingData[field]);
        
        if (missingFields.length > 0) {
            ErrorHandler.handleError(
                new Error('Please fill in all required fields'), 
                'Booking Validation'
            );
            return false;
        }

        // Validate card details
        const cardValidation = PaymentService.validateCardDetails(bookingData.cardDetails);
        if (!cardValidation.isValid) {
            ErrorHandler.handleError(
                new Error(cardValidation.errors.join(', ')), 
                'Payment Validation'
            );
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate address before submission
        await handleAddressValidation();

        if (!serviceAvailability.isAvailable) {
            return;
        }

        if (!validateBookingForm()) return;

        setBookingStatus({ loading: true, error: null, success: false });

        try {
            // Process payment
            const paymentResult = await PaymentService.processPayment(
                { 
                    ...bookingData,
                    totalAmount: pricing.totalPrice 
                },
                bookingData.cardDetails
            );

            // Create booking
            const bookingResult = await BookingService.createBooking({
                ...bookingData,
                paymentId: paymentResult.paymentId,
                totalAmount: pricing.totalPrice
            });

            // Log successful booking
            Logger.info('Booking created', {
                bookingId: bookingResult.id,
                serviceType: bookingData.serviceType
            });

            setBookingStatus({ 
                loading: false, 
                error: null, 
                success: true 
            });

            // Reset form
            setBookingData({
                serviceType: '',
                vehicleType: '',
                date: '',
                time: '',
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                streetAddress: '',
                city: '',
                state: 'CA',
                zipCode: '',
                cardDetails: {
                    cardNumber: '',
                    expirationMonth: '',
                    expirationYear: '',
                    cvv: ''
                }
            });

        } catch (error) {
            // Handle booking and payment errors
            ErrorHandler.handleError(error, 'Booking Submission Failed');
            
            setBookingStatus({ 
                loading: false, 
                error: error.message, 
                success: false 
            });
        }
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h4" gutterBottom>
                Book Your Detailing Service
            </Typography>

            {/* Service Area Notice */}
            <Alert severity="info" sx={{ marginBottom: 2 }}>
                We currently serve the following areas:
                {serviceAreaCities.map((city, index) => (
                    <span key={city}>
                        {city}{index < serviceAreaCities.length - 1 ? ', ' : ''}
                    </span>
                ))}
            </Alert>

            {/* Service Availability Message */}
            {serviceAvailability.message && (
                <Alert 
                    severity={serviceAvailability.isAvailable ? 'success' : 'error'}
                    sx={{ marginBottom: 2 }}
                >
                    {serviceAvailability.message}
                </Alert>
            )}

            <Grid container spacing={3}>
                <Grid item xs={12} md={7}>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            {/* Service Details */}
                            <Grid item xs={12} sm={6}>
                                <Select
                                    fullWidth
                                    name="serviceType"
                                    value={bookingData.serviceType}
                                    onChange={handleChange}
                                    displayEmpty
                                >
                                    <MenuItem value="" disabled>Select Service Type</MenuItem>
                                    {serviceTypes.map(service => (
                                        <MenuItem key={service.value} value={service.value}>
                                            {service.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Grid>
                            
                            <Grid item xs={12} sm={6}>
                                <Select
                                    fullWidth
                                    name="vehicleType"
                                    value={bookingData.vehicleType}
                                    onChange={handleChange}
                                    displayEmpty
                                >
                                    <MenuItem value="" disabled>Select Vehicle Type</MenuItem>
                                    {vehicleTypes.map(vehicle => (
                                        <MenuItem key={vehicle.value} value={vehicle.value}>
                                            {vehicle.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Grid>

                            {/* Pricing Details */}
                            {pricing && (
                                <Grid item xs={12}>
                                    <Typography variant="h6" gutterBottom>
                                        Pricing Breakdown
                                    </Typography>
                                    <Typography>
                                        Base Price: ${pricing.basePrice.toFixed(2)}
                                    </Typography>
                                    <Typography>
                                        Tax: ${pricing.tax.toFixed(2)}
                                    </Typography>
                                    <Typography>
                                        Service Fee: ${pricing.serviceFee.toFixed(2)}
                                    </Typography>
                                    <Typography variant="h5" color="primary">
                                        Total Price: ${pricing.totalPrice.toFixed(2)}
                                    </Typography>
                                </Grid>
                            )}
 ठर

                            {/* Date and Time */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    type="date"
                                    name="date"
                                    value={bookingData.date}
                                    onChange={handleChange}
                                    InputLabelProps={{ shrink: true }}
                                    label="Booking Date"
                                />
                            </Grid>
                            
                            <Grid item xs={12} sm={6}>
                                <Select
                                    fullWidth
                                    name="time"
                                    value={bookingData.time}
                                    onChange={handleChange}
                                    displayEmpty
                                    disabled={availableTimeSlots.length === 0}
                                >
                                    <MenuItem value="" disabled>
                                        {availableTimeSlots.length > 0 
                                            ? 'Select Time Slot' 
                                            : 'No Available Slots'}
                                    </MenuItem>
                                    {availableTimeSlots.map(slot => (
                                        <MenuItem key={slot} value={slot}>
                                            {slot}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Grid>

                            {/* Personal Details */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name="firstName"
                                    label="First Name"
                                    value={bookingData.firstName}
                                    onChange={handleChange}
                                />
                            </Grid>
                            
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name="lastName"
                                    label="Last Name"
                                    value={bookingData.lastName}
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name="email"
                                    type="email"
                                    label="Email"
                                    value={bookingData.email}
                                    onChange={handleChange}
                                />
                            </Grid>
                            
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name="phone"
                                    type="tel"
                                    label="Phone Number"
                                    value={bookingData.phone}
                                    onChange={handleChange}
                                />
                            </Grid>

                            {/* Address Details */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name="streetAddress"
                                    label="Street Address"
                                    value={bookingData.streetAddress}
                                    onChange={handleChange}
                                />
                            </Grid>
                            
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name="city"
                                    label="City"
                                    value={bookingData.city}
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name="state"
                                    label="State"
                                    value={bookingData.state}
                                    onChange={handleChange}
                                />
                            </Grid>
                            
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name="zipCode"
                                    label="Zip Code"
                                    value={bookingData.zipCode}
                                    onChange={handleChange}
                                />
                            </Grid>

                            {/* Payment Details */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    name="cardDetails.cardNumber"
                                    label="Card Number"
                                    value={bookingData.cardDetails.cardNumber}
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={4}>
                                <TextField
                                    fullWidth
                                    name="cardDetails.expirationMonth"
                                    label="Exp Month"
                                    value={bookingData.cardDetails.expirationMonth}
                                    onChange={handleChange}
                                />
                            </Grid>
                            
                            <Grid item xs={4}>
                                <TextField
                                    fullWidth
                                    name="cardDetails.expirationYear"
                                    label="Exp Year"
                                    value={bookingData.cardDetails.expirationYear}
                                    onChange={handleChange}
                                />
                            </Grid>
                            
                            <Grid item xs={4}>
                                <TextField
                                    fullWidth
                                    name="cardDetails.cvv"
                                    label="CVV"
                                    value={bookingData.cardDetails.cvv}
                                    onChange={handleChange}
                                />
                            </Grid>

                            {/* Submit Button */}
                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    disabled={bookingStatus.loading}
                                >
                                    {bookingStatus.loading 
                                        ? 'Processing...' 
                                        : 'Book Service'}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Grid>
                
                <Grid item xs={12} md={5}>
                    <ServiceAreaMap />
                </Grid>
            </Grid>

            {/* Status Messages */}
            {bookingStatus.error && (
                <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                    {bookingStatus.error}
                </Typography>
            )}

            {bookingStatus.success && (
                <Typography color="primary" variant="body2" sx={{ mt: 2 }}>
                    Booking successful! We'll contact you soon.
                </Typography>
            )}
        </Container>
    );
};

export default Booking;
