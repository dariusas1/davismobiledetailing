/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo } from 'react';
import { 
    Box, 
    Typography, 
    TextField, 
    Button, 
    Grid, 
    MenuItem, 
    Tooltip, 
    Paper,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Alert,
    Chip,
    useMediaQuery,
    useTheme
} from '@mui/material';
import axios from 'axios';
import * as Yup from 'yup';
import BookingCalendar from './BookingCalendar';
import { GooglePlacesAutocomplete } from '../common/GooglePlacesAutocomplete';
import { 
    SERVICES, 
    VEHICLE_TYPES, 
    ADDITIONAL_SERVICES, 
    calculateTotalPrice 
} from '../../utils/pricingUtils';
import { serviceRecommendationEngine } from '../../utils/serviceRecommendations';

const validationSchema = Yup.object().shape({
    name: Yup.string()
        .required('Name is required')
        .min(2, 'Name must be at least 2 characters'),
    email: Yup.string()
        .email('Invalid email format')
        .required('Email is required'),
    phone: Yup.string()
        .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
        .required('Phone number is required'),
    serviceType: Yup.number().required('Service type is required'),
    vehicleType: Yup.number().required('Vehicle type is required'),
    bookingDate: Yup.date().required('Booking date is required'),
    bookingTime: Yup.string().required('Booking time is required'),
    location: Yup.object().shape({
        address: Yup.string().required('Location is required')
    }).required('Location is required')
});

const BookingForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        serviceType: '',
        vehicleType: '',
        additionalServices: [],
        bookingDate: null,
        bookingTime: null,
        location: null
    });

    const [errors, setErrors] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);
    const [recommendations, setRecommendations] = useState([]);
    const [personalizedPackage, setPersonalizedPackage] = useState(null);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const price = calculateTotalPrice(
            formData.serviceType, 
            formData.vehicleType, 
            formData.additionalServices
        );
        setTotalPrice(price);
    }, [formData.serviceType, formData.vehicleType, formData.additionalServices]);

    useEffect(() => {
        if (formData.vehicleType) {
            const customerData = {
                vehicleType: VEHICLE_TYPES.find(v => v.id === formData.vehicleType).name,
                lastService: null, // In future, fetch from user's service history
                season: new Date().getMonth() >= 5 && new Date().getMonth() <= 8 ? 'summer' : 'winter',
                location: formData.location
            };

            const generatedRecommendations = serviceRecommendationEngine.determineRecommendations(customerData);
            const personalizedPackage = serviceRecommendationEngine.generatePersonalizedPackage(generatedRecommendations);

            setRecommendations(generatedRecommendations);
            setPersonalizedPackage(personalizedPackage);
        }
    }, [formData.vehicleType, formData.location]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAdditionalServiceChange = (serviceId) => {
        setFormData(prev => {
            const currentServices = prev.additionalServices;
            const updatedServices = currentServices.includes(serviceId)
                ? currentServices.filter(id => id !== serviceId)
                : [...currentServices, serviceId];
            
            return {
                ...prev,
                additionalServices: updatedServices
            };
        });
    };

    const handleDateSelect = (date) => {
        setFormData(prev => ({
            ...prev,
            bookingDate: date
        }));
    };

    const handleTimeSelect = (time) => {
        setFormData(prev => ({
            ...prev,
            bookingTime: time
        }));
    };

    const validateForm = async () => {
        try {
            await validationSchema.validate(formData, { abortEarly: false });
            setErrors({});
            return true;
        } catch (err) {
            const validationErrors = {};
            err.inner.forEach(error => {
                validationErrors[error.path] = error.message;
            });
            setErrors(validationErrors);
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isValid = await validateForm();
        
        if (!isValid) {
            return;
        }

        try {
            const response = await axios.post('/api/bookings/create', {
                ...formData,
                totalPrice,
                businessName: 'Precision Detailing',
                contactNumber: '408-634-9181',
                serviceLocation: 'Santa Cruz, CA'
            });

            // Handle successful booking
            alert('Booking successful! We will contact you shortly.');
        } catch (error) {
            console.error('Booking submission error:', error);
            alert('Failed to submit booking. Please try again.');
        }
    };

    const renderRecommendationChips = () => {
        return recommendations.map((rec, index) => (
            <Chip 
                key={index} 
                label={`${rec.type}: ${rec.reason}`} 
                color="primary" 
                variant="outlined"
                sx={{ margin: 0.5 }}
            />
        ));
    };

    const renderPersonalizedPackage = () => {
        if (!personalizedPackage) return null;

        return (
            <Box sx={{ 
                border: `1px solid ${theme.palette.primary.main}`, 
                borderRadius: 2, 
                padding: 2, 
                marginTop: 2 
            }}>
                <Typography variant="h6" gutterBottom>
                    Personalized Service Package
                </Typography>
                <Typography>
                    Base Service: {personalizedPackage.baseService.name} - 
                    ${personalizedPackage.baseService.basePrice}
                </Typography>
                {personalizedPackage.additionalServices.length > 0 && (
                    <Box>
                        <Typography variant="subtitle1">
                            Recommended Additional Services:
                        </Typography>
                        {personalizedPackage.additionalServices.map(service => (
                            <Typography key={service.id} variant="body2">
                                {service.name} - ${service.price}
                            </Typography>
                        ))}
                    </Box>
                )}
                <Typography variant="h6" color="primary">
                    Total Price: ${personalizedPackage.totalPrice}
                </Typography>
            </Box>
        );
    };

    return (
        <Box 
            component={Paper} 
            elevation={3} 
            sx={{ 
                padding: 3, 
                maxWidth: 800, 
                margin: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 2
            }}
        >
            <Typography variant="h4" align="center" gutterBottom>
                Book Your Detailing Service
            </Typography>

            <BookingCalendar 
                onDateSelect={handleDateSelect}
                onTimeSelect={handleTimeSelect}
            />

            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Tooltip title="Enter your full name" placement="top">
                            <TextField
                                fullWidth
                                label="Name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                error={!!errors.name}
                                helperText={errors.name}
                                required
                            />
                        </Tooltip>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Tooltip title="Enter your contact email" placement="top">
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                error={!!errors.email}
                                helperText={errors.email}
                                required
                            />
                        </Tooltip>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Tooltip title="Enter your phone number" placement="top">
                            <TextField
                                fullWidth
                                label="Phone Number"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleInputChange}
                                error={!!errors.phone}
                                helperText={errors.phone}
                                required
                            />
                        </Tooltip>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Tooltip title="Select your service type" placement="top">
                            <TextField
                                select
                                fullWidth
                                label="Service Type"
                                name="serviceType"
                                value={formData.serviceType}
                                onChange={handleInputChange}
                                error={!!errors.serviceType}
                                helperText={errors.serviceType}
                                required
                            >
                                {SERVICES.map((service) => (
                                    <MenuItem key={service.id} value={service.id}>
                                        {service.name} - ${service.basePrice}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Tooltip>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Tooltip title="Select your vehicle type" placement="top">
                            <TextField
                                select
                                fullWidth
                                label="Vehicle Type"
                                name="vehicleType"
                                value={formData.vehicleType}
                                onChange={handleInputChange}
                                error={!!errors.vehicleType}
                                helperText={errors.vehicleType}
                                required
                            >
                                {VEHICLE_TYPES.map((vehicle) => (
                                    <MenuItem key={vehicle.id} value={vehicle.id}>
                                        {vehicle.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Tooltip>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6">Additional Services</Typography>
                        <FormGroup row>
                            {ADDITIONAL_SERVICES.map((service) => (
                                <FormControlLabel
                                    key={service.id}
                                    control={
                                        <Checkbox
                                            checked={formData.additionalServices.includes(service.id)}
                                            onChange={() => handleAdditionalServiceChange(service.id)}
                                        />
                                    }
                                    label={`${service.name} - $${service.price}`}
                                />
                            ))}
                        </FormGroup>
                    </Grid>
                    <Grid item xs={12}>
                        <GooglePlacesAutocomplete 
                            onLocationSelect={(location) => {
                                setFormData(prev => ({
                                    ...prev,
                                    location
                                }));
                            }}
                            error={errors.location}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6">
                            Total Price: ${totalPrice}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Button 
                            type="submit" 
                            variant="contained" 
                            color="primary" 
                            fullWidth
                            disabled={!formData.bookingDate || !formData.bookingTime}
                        >
                            Book Now
                        </Button>
                    </Grid>
                </Grid>
            </form>
            {recommendations.length > 0 && (
                <Box>
                    <Typography variant="h6">Personalized Recommendations</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                        {renderRecommendationChips()}
                    </Box>
                    {renderPersonalizedPackage()}
                </Box>
            )}
        </Box>
    );
};

export default BookingForm;
