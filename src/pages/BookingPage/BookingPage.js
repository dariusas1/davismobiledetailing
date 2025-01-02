/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Stepper, 
  Step, 
  StepLabel, 
  Box, 
  Typography, 
  Paper, 
  Card, 
  CardContent, 
  Chip, 
  CircularProgress, 
  Alert,
  Snackbar
} from '@mui/material';
import WeatherIcon from '@mui/icons-material/WbSunny';
import BookingCalendar from '../../components/BookingCalendar/BookingCalendar';
import BookingForm from '../../components/BookingForm/BookingForm';
import { 
  createBooking,
  checkAvailability,
  calculateLoyaltyPoints,
  processPayment
} from '../../services/bookingService';
import { getWeather, getWeatherRecommendations } from '../../services/weatherService';
import bookingTimeService from '../../services/bookingTimeService';
import slotAvailabilityService from '../../services/slotAvailabilityService';
import './BookingPage.css';

const steps = ['Select Date & Time', 'Enter Details', 'Confirmation'];

const BookingPage = () => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingStep, setBookingStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weather, setWeather] = useState({
    temperature: 65,
    description: 'Partly Cloudy',
    location: 'Santa Cruz'
  });
  const [weatherNotice, setWeatherNotice] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [realTimeAvailability, setRealTimeAvailability] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch weather data
        const weatherData = await getWeather();
        setWeather(weatherData);
        checkWeatherConditions(weatherData);

        // Fetch real-time availability
        const availability = await slotAvailabilityService.getRealTimeAvailability();
        setRealTimeAvailability(availability);
        
        // Set up real-time availability updates
        const availabilitySubscription = slotAvailabilityService.subscribeToAvailabilityUpdates(
          (updatedAvailability) => {
            setRealTimeAvailability(updatedAvailability);
            setSnackbarMessage('Availability updated!');
            setSnackbarOpen(true);
            
            // If selected slot is no longer available, show warning
            if (selectedSlot) {
              const isAvailable = updatedAvailability.some(
                slot => slot.start === selectedSlot.start.toISOString()
              );
              if (!isAvailable) {
                setError('Your selected time slot is no longer available. Please choose another time.');
                setSelectedSlot(null);
                setBookingStep(0);
              }
            }
          }
        );

        return () => {
          availabilitySubscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        setWeatherLoading(false);
      }
    };

    fetchInitialData();
  }, [selectedSlot]);

  const checkWeatherConditions = (weatherData) => {
    const { temperature, description } = weatherData;
    let notice = null;

    if (description.toLowerCase().includes('rain')) {
      notice = {
        severity: 'warning',
        message: 'Rain expected - Please allow extra time for your appointment'
      };
    } else if (temperature > 85) {
      notice = {
        severity: 'info',
        message: 'High temperatures - We recommend scheduling earlier in the day'
      };
    } else if (temperature < 40) {
      notice = {
        severity: 'warning',
        message: 'Cold temperatures - Some services may take longer to complete'
      };
    }

    setWeatherNotice(notice);
  };

  const handleSlotSelect = async (slot) => {
    try {
      setLoading(true);
      
      // Validate selected slot with real-time availability
      const isAvailable = realTimeAvailability.some(
        availableSlot => availableSlot.start === slot.start.toISOString()
      );

      if (!isAvailable) {
        setError('Selected time slot is no longer available. Please choose another time.');
        return;
      }

      if (weatherNotice && weatherNotice.severity === 'warning') {
        const confirm = window.confirm(
          `${weatherNotice.message}\nAre you sure you want to proceed with this booking?`
        );
        if (!confirm) return;
      }

      // Get available time slots for the selected date
      const slots = await bookingTimeService.generateAvailableTimeSlots(
        slot.start.toISOString(),
        'Basic Wash' // Default service type
      );

      setTimeSlots(slots);
      setSelectedSlot(slot);
      setBookingStep(1);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSubmit = async (bookingData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Check slot availability with real-time data
      const availabilityCheck = await bookingTimeService.checkTimeSlotAvailability(
        selectedSlot.start.toISOString(),
        selectedSlot.start.toLocaleTimeString(),
        bookingData.package.id
      );

      if (!availabilityCheck.available) {
        setError({
          message: availabilityCheck.reason || 'Selected time slot is no longer available.',
          details: ['Please choose another time.']
        });
        setBookingStep(0);
        return;
      }

      const completeBookingData = {
        ...bookingData,
        bookingDate: selectedSlot.start,
        preferredTime: selectedSlot.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        totalPrice: bookingData.totalPrice,
        paymentMethod: 'card',
        loyaltyPoints: calculateLoyaltyPoints(bookingData.totalPrice),
        weatherConditions: weather
      };

      // Process payment
      const paymentResult = await processPayment({
        amount: bookingData.totalPrice,
        currency: 'USD',
        customerEmail: bookingData.email,
        description: `Payment for ${bookingData.package.name}`
      });

      if (!paymentResult.success) {
        setError({
          message: 'Payment processing failed',
          details: ['Please try a different payment method.']
        });
        return;
      }

      // Create booking with payment details
      const response = await createBooking({
        ...completeBookingData,
        paymentStatus: paymentResult.status,
        transactionId: paymentResult.transactionId
      });
      
      if (response.error) {
        setError({
          message: response.error || 'Booking creation failed',
          details: response.details || [],
          statusCode: response.statusCode
        });
        return;
      }

      // Successful booking
      setBookingStep(2);
      setTimeout(() => {
        navigate(`/booking-confirmation/${response.booking._id}`, {
          state: {
            booking: response.booking,
            loyaltyPoints: response.loyaltyPoints,
            paymentStatus: response.paymentStatus
          }
        });
      }, 3000);
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        setError({
          message: 'Request timeout',
          details: ['The booking request took too long to process. Please try again.']
        });
      } else {
        setError({
          message: 'An unexpected error occurred',
          details: ['Please try again.']
        });
      }
      console.error('Booking error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box className="booking-page">
      <Typography variant="h3" gutterBottom className="booking-title">
        Schedule Your Detailing Appointment
      </Typography>

      {weatherLoading ? (
        <Box display="flex" justifyContent="center" mb={3}>
          <CircularProgress />
        </Box>
      ) : (
        <Card className="weather-widget" elevation={3}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <WeatherIcon fontSize="large" />
              <Box ml={2}>
                <Typography variant="h6">
                  Current Weather in {weather.location}
                </Typography>
                <Typography variant="body1">
                  {weather.temperature}°F - {weather.description}
                </Typography>
              </Box>
            </Box>
            
            {weatherNotice && (
              <Alert severity={weatherNotice.severity} sx={{ mb: 2 }}>
                {weatherNotice.message}
              </Alert>
            )}

            <Box className="weather-recommendations">
              <Typography variant="subtitle1" gutterBottom>
                Weather Recommendations:
              </Typography>
              {getWeatherRecommendations(weather).map((rec, index) => (
                <Chip 
                  key={index}
                  label={rec}
                  color="primary"
                  variant="outlined"
                  sx={{ mr: 1, mb: 1 }}
                />
              ))}
            </Box>
          </CardContent>
        </Card>
      )}
      
      <Paper elevation={3} className="booking-container">
        <Stepper activeStep={bookingStep} alternativeLabel className="booking-stepper">
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Box className="error-message" sx={{ mb: 2 }}>
            <Alert severity="error">
              <Typography variant="body1" fontWeight="bold">{error.message}</Typography>
              {error.details && error.details.map((detail, index) => (
                <Typography key={index} variant="body2" sx={{ mt: 1 }}>
                  • {detail}
                </Typography>
              ))}
            </Alert>
          </Box>
        )}

        {bookingStep === 0 && (
          <Box className="calendar-section">
            <BookingCalendar 
              onSelectSlot={handleSlotSelect}
              loading={loading}
              realTimeAvailability={realTimeAvailability}
            />
          </Box>
        )}

        {bookingStep === 1 && selectedSlot && (
          <Box className="form-section">
            <BookingForm 
              selectedSlot={selectedSlot}
              timeSlots={timeSlots}
              onSubmit={handleBookingSubmit}
              onBack={() => setBookingStep(0)}
              loading={loading}
              weatherConditions={weather}
            />
          </Box>
        )}

        {bookingStep === 2 && (
          <Box className="confirmation-section">
            <Typography variant="h5" gutterBottom>
              Booking Successful!
            </Typography>
            <Typography variant="body1" gutterBottom>
              You'll receive a confirmation email shortly.
            </Typography>
            <Typography variant="body1">
              Redirecting to confirmation page...
            </Typography>
          </Box>
        )}
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default BookingPage;
