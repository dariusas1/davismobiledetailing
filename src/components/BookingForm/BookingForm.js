/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { 
  TextField, 
  Button, 
  Grid, 
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Autocomplete
} from '@mui/material';
import { searchAddress } from '../../services/locationService';

import { useNavigate } from 'react-router-dom';
import bookingTimeService from '../../services/bookingTimeService';

const packages = [
    { 
        id: 1, 
        name: 'Basic Wash', 
        price: 50, 
        description: 'Quick exterior wash',
        estimatedTime: '1 hour',
        recommendedFor: 'Regular maintenance'
    },
    { 
        id: 2, 
        name: 'Premium Detailing', 
        price: 120, 
        description: 'Comprehensive interior and exterior cleaning',
        estimatedTime: '3-4 hours',
        recommendedFor: 'Monthly deep clean'
    },
    { 
        id: 3, 
        name: 'Full Service', 
        price: 200, 
        description: 'Complete detailing with ceramic coating',
        estimatedTime: '6-8 hours',
        recommendedFor: 'Luxury and high-end vehicles'
    }
];

const vehicleTypes = [
    { id: 1, name: 'Sedan', multiplier: 1.0 },
    { id: 2, name: 'SUV', multiplier: 1.2 },
    { id: 3, name: 'Truck', multiplier: 1.5 },
    { id: 4, name: 'Sports Car', multiplier: 1.3 }
];

const additionalServices = [
    { id: 1, name: 'Engine Bay Cleaning', price: 50 },
    { id: 2, name: 'Headlight Restoration', price: 75 },
    { id: 3, name: 'Pet Hair Removal', price: 40 }
];

const BookingForm = ({ selectedSlot, onSubmit, onBack, loading, timeSlots, weatherConditions }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [addressOptions, setAddressOptions] = useState([]);
    const [addressLoading, setAddressLoading] = useState(false);
    const [addressError, setAddressError] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState(null);

    const handleAddressSearch = async (event, value) => {
      if (value.length < 3) return;
      
      try {
        setAddressLoading(true);
        setAddressError(null);
        const results = await searchAddress(value);
        setAddressOptions(results);
      } catch (error) {
        setAddressError(error.message);
        setAddressOptions([]);
      } finally {
        setAddressLoading(false);
      }
    };

    const [selectedPackage, setSelectedPackage] = useState(null);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [selectedAdditionalServices, setSelectedAdditionalServices] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [bookingConfirmation, setBookingConfirmation] = useState(null);
    const [slotLoading, setSlotLoading] = useState(false);
    const [slotError, setSlotError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Calculate total price based on package, vehicle type, and additional services
        if (selectedPackage && selectedVehicle) {
            const basePrice = selectedPackage.price * selectedVehicle.multiplier;
            const additionalServicesPrice = selectedAdditionalServices.reduce(
                (total, service) => total + service.price, 
                0
            );
            setTotalPrice(Math.round(basePrice + additionalServicesPrice));
        }
    }, [selectedPackage, selectedVehicle, selectedAdditionalServices]);

    const toggleAdditionalService = (service) => {
        setSelectedAdditionalServices(prev => 
            prev.some(s => s.id === service.id)
                ? prev.filter(s => s.id !== service.id)
                : [...prev, service]
        );
    };

    const handleFormSubmit = async (data) => {
        try {
            setSlotLoading(true);
            setSlotError(null);

            // Client-side validation for selected slot
            if (!selectedSlot || !selectedSlot.start) {
                setSlotError('Please select a valid time slot');
                return;
            }

            const currentTime = new Date();
            if (selectedSlot.start < currentTime) {
                setSlotError('Selected time slot is in the past');
                return;
            }

            // Server-side validation of the selected time slot
            const slotValidation = await bookingTimeService.validateDateTime(
                selectedSlot.start.toISOString(),
                selectedSlot.start.toLocaleTimeString()
            );

            if (!slotValidation.valid) {
                setSlotError(slotValidation.message || 'Selected time slot is no longer available');
                return;
            }

            // Check if slot is within business hours (8am-6pm)
            const slotHour = selectedSlot.start.getHours();
            if (slotHour < 8 || slotHour > 18) {
                setSlotError('Selected time is outside business hours (8am-6pm)');
                return;
            }

            const bookingData = {
                ...data,
                package: selectedPackage,
                totalPrice: totalPrice,
                coordinates: null,
                vehicleType: selectedVehicle,
                additionalServices: selectedAdditionalServices,
                selectedSlot: selectedSlot,
                weatherConditions: weatherConditions,
                estimatedDuration: selectedPackage.estimatedTime,
                status: 'Pending',
                paymentStatus: 'Unpaid',
                createdAt: new Date().toISOString()
            };

            const response = await onSubmit(bookingData);
            setBookingConfirmation(response);
            
            // Store booking in local storage for tracking
            localStorage.setItem('latestBooking', JSON.stringify(response));
        } catch (error) {
            setSlotError(error.message || 'An error occurred while processing your booking');
            console.error('Booking submission error:', error);
        } finally {
            setSlotLoading(false);
        }
    };

    const handleCloseConfirmation = () => {
        setBookingConfirmation(null);
        navigate('/dashboard');
    };

    return (
        <Box sx={{ 
            maxWidth: 600, 
            margin: 'auto', 
            p: 3,
            backgroundColor: 'background.paper',
            borderRadius: 2
        }}>
            <Typography 
                variant="h4" 
                gutterBottom 
                sx={{ 
                    textAlign: 'center', 
                    fontWeight: 'bold',
                    color: 'primary.main' 
                }}
            >
                Book Your Detailing Service
            </Typography>

            {slotError && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {slotError}
                </Alert>
            )}

            {/* Package Selection */}
            <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                Select Package
            </Typography>
            <Grid container spacing={2}>
                {packages.map(pkg => (
                    <Grid item xs={12} sm={4} key={pkg.id}>
                        <Box
                            onClick={() => setSelectedPackage(pkg)}
                            sx={{
                                border: selectedPackage?.id === pkg.id 
                                    ? '2px solid gold' 
                                    : '1px solid rgba(0,0,0,0.12)',
                                borderRadius: 2,
                                p: 2,
                                textAlign: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    boxShadow: '0 10px 20px rgba(255,215,0,0.2)'
                                }
                            }}
                        >
                            <Typography variant="h6">{pkg.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                ${pkg.price}
                            </Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>

            {/* Vehicle Type Selection */}
            <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                Select Vehicle Type
            </Typography>
            <Grid container spacing={2}>
                {vehicleTypes.map(vehicle => (
                    <Grid item xs={6} sm={3} key={vehicle.id}>
                        <Box
                            onClick={() => setSelectedVehicle(vehicle)}
                            sx={{
                                border: selectedVehicle?.id === vehicle.id 
                                    ? '2px solid gold' 
                                    : '1px solid rgba(0,0,0,0.12)',
                                borderRadius: 2,
                                p: 2,
                                textAlign: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    boxShadow: '0 10px 20px rgba(255,215,0,0.2)'
                                }
                            }}
                        >
                            <Typography variant="h6">{vehicle.name}</Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>

            {/* Additional Services */}
            <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                Additional Services
            </Typography>
            <Grid container spacing={2}>
                {additionalServices.map(service => (
                    <Grid item xs={12} sm={4} key={service.id}>
                        <Box
                            onClick={() => toggleAdditionalService(service)}
                            sx={{
                                border: selectedAdditionalServices.some(s => s.id === service.id)
                                    ? '2px solid gold' 
                                    : '1px solid rgba(0,0,0,0.12)',
                                borderRadius: 2,
                                p: 2,
                                textAlign: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    boxShadow: '0 10px 20px rgba(255,215,0,0.2)'
                                }
                            }}
                        >
                            <Typography variant="h6">{service.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                +${service.price}
                            </Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>

            {/* Total Price and Booking */}
            <Box sx={{ 
                mt: 4, 
                p: 2, 
                bgcolor: 'rgba(255,215,0,0.1)', 
                borderRadius: 2,
                textAlign: 'center'
            }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    Total Price: ${totalPrice}
                </Typography>
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Full Name"
                            {...register('name', { required: 'Name is required' })}
                            error={!!errors.name}
                            helperText={errors.name?.message}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Autocomplete
                            options={addressOptions}
                            loading={addressLoading}
                            onInputChange={handleAddressSearch}
                            onChange={(event, value) => setSelectedAddress(value)}
                            getOptionLabel={(option) => option.displayName}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Address"
                                    fullWidth
                                    required
                                    error={!!addressError}
                                    helperText={addressError || 'Start typing your address'}
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <>
                                                {addressLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                                {params.InputProps.endAdornment}
                                            </>
                                        ),
                                    }}
                                />
                            )}
                        />
                    </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                {...register('email', { 
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address"
                                    }
                                })}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Phone Number"
                                type="tel"
                                {...register('phone', { 
                                    required: 'Phone number is required',
                                    pattern: {
                                        value: /^[0-9]{10}$/,
                                        message: "Invalid phone number"
                                    }
                                })}
                                error={!!errors.phone}
                                helperText={errors.phone?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button 
                                type="submit" 
                                variant="contained" 
                                color="primary" 
                                fullWidth
                                disabled={!selectedPackage || !selectedVehicle || slotLoading}
                            >
                                {slotLoading ? <CircularProgress size={24} /> : 'Book Now'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>

            <Dialog 
                open={!!bookingConfirmation} 
                onClose={handleCloseConfirmation}
            >
                <DialogTitle>Booking Confirmed</DialogTitle>
                <DialogContent>
                    <Typography>
                        Your booking has been successfully submitted.
                        Booking Reference: {bookingConfirmation?.referenceNumber}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmation}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default BookingForm;
