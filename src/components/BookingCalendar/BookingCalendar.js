import React, { useState, useEffect, useCallback } from 'react';
import { 
  format, 
  addDays, 
  startOfWeek, 
  isSameDay, 
  isWeekend,
} from 'date-fns';
import axios from 'axios';
import { 
  Box, 
  Typography, 
  Grid, 
  Button, 
  Paper, 
  Tooltip,
  CircularProgress,
  Alert
} from '@mui/material';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import CloudIcon from '@mui/icons-material/Cloud';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';

// Local fallback data
const FALLBACK_WEATHER = {
  temperature: 65,
  description: 'Partly Cloudy',
  weatherMain: 'Clouds'
};

const FALLBACK_AVAILABILITY = {
  '08:00 AM - 10:00 AM': true,
  '10:00 AM - 12:00 PM': true,
  '12:00 PM - 02:00 PM': false,
  '02:00 PM - 04:00 PM': true,
  '04:00 PM - 06:00 PM': true
};

const BookingCalendar = ({ onSelectSlot, serviceType }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [availability, setAvailability] = useState(FALLBACK_AVAILABILITY);
  const [weatherForecast, setWeatherForecast] = useState(null);
  const [loading, setLoading] = useState({
    weather: true,
    availability: true
  });
  const [error, setError] = useState({
    weather: null,
    availability: null
  });

  const getWeatherIcon = (weatherMain) => {
    switch(weatherMain) {
      case 'Clear': return <WbSunnyIcon color="primary" />;
      case 'Clouds': return <CloudIcon color="secondary" />;
      case 'Rain': return <BeachAccessIcon color="info" />;
      default: return <CloudIcon color="secondary" />;
    }
  };

  const fetchWeatherForecast = useCallback(async () => {
    setLoading(prev => ({ ...prev, weather: true }));
    setError(prev => ({ ...prev, weather: null }));

    try {
      const response = await axios.get('/api/weather', {
        params: { location: 'Santa Cruz' },
        timeout: 5000
      });
      
      const forecast = response.data || FALLBACK_WEATHER;
      setWeatherForecast({
        temperature: Math.round(forecast.temperature || FALLBACK_WEATHER.temperature),
        description: forecast.description || FALLBACK_WEATHER.description,
        icon: getWeatherIcon(forecast.weatherMain || FALLBACK_WEATHER.weatherMain)
      });
    } catch (error) {
      console.error('Weather fetch error:', error);
      setError(prev => ({ 
        ...prev, 
        weather: 'Unable to fetch weather. Using default forecast.' 
      }));
      
      // Use fallback weather
      setWeatherForecast({
        temperature: FALLBACK_WEATHER.temperature,
        description: FALLBACK_WEATHER.description,
        icon: getWeatherIcon(FALLBACK_WEATHER.weatherMain)
      });
    } finally {
      setLoading(prev => ({ ...prev, weather: false }));
    }
  }, []);

  const checkAvailability = useCallback(async () => {
    setLoading(prev => ({ ...prev, availability: true }));
    setError(prev => ({ ...prev, availability: null }));

    try {
      const response = await axios.get('/api/bookings/availability', {
        params: { 
          date: currentDate.toISOString(), 
          serviceType 
        },
        timeout: 5000
      });
      
      const availabilityData = response.data || FALLBACK_AVAILABILITY;
      setAvailability(availabilityData);
    } catch (error) {
      console.error('Availability check error:', error);
      setError(prev => ({ 
        ...prev, 
        availability: 'Unable to check availability. Using default slots.' 
      }));

      // Use fallback availability
      setAvailability(FALLBACK_AVAILABILITY);
    } finally {
      setLoading(prev => ({ ...prev, availability: false }));
    }
  }, [currentDate, serviceType]);

  useEffect(() => {
    fetchWeatherForecast();
    checkAvailability();
  }, [fetchWeatherForecast, checkAvailability]);

  const startDate = startOfWeek(currentDate);
  const days = Array.from({ length: 7 }).map((_, index) => addDays(startDate, index));

  const timeSlots = [
    { time: '08:00 AM - 10:00 AM', label: 'Morning' },
    { time: '10:00 AM - 12:00 PM', label: 'Late Morning' },
    { time: '12:00 PM - 02:00 PM', label: 'Lunch' },
    { time: '02:00 PM - 04:00 PM', label: 'Afternoon' },
    { time: '04:00 PM - 06:00 PM', label: 'Late Afternoon' }
  ];

  const handleDateClick = (date) => {
    setCurrentDate(date);
    setSelectedSlot(null);
    checkAvailability();
  };

  const handleTimeSelect = (timeSlot) => {
    const [startTime, endTime] = timeSlot.time.split(' - ');
    const [startHour, startPeriod] = startTime.split(' ');
    const [hour, minute] = startHour.split(':');
    
    let actualHour = parseInt(hour);
    if (startPeriod === 'PM' && actualHour !== 12) {
      actualHour += 12;
    }
    if (startPeriod === 'AM' && actualHour === 12) {
      actualHour = 0;
    }
    
    const start = new Date(currentDate);
    start.setHours(actualHour, parseInt(minute), 0, 0);
    
    const end = new Date(start);
    end.setHours(actualHour + 2, parseInt(minute), 0, 0);
    
    const selectedSlotData = { 
      ...timeSlot, 
      start, 
      end 
    };

    setSelectedSlot(selectedSlotData);
    onSelectSlot(selectedSlotData);
  };

  return (
    <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
      {error.weather && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {error.weather}
        </Alert>
      )}

      {error.availability && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {error.availability}
        </Alert>
      )}

      {loading.weather ? (
        <Box display="flex" justifyContent="center" mb={2}>
          <CircularProgress />
        </Box>
      ) : weatherForecast && (
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            mb: 2 
          }}
        >
          {weatherForecast.icon}
          <Typography variant="body1" sx={{ ml: 1 }}>
            {weatherForecast.temperature}°F - {weatherForecast.description}
          </Typography>
        </Box>
      )}

      <Grid container spacing={2}>
        {days.map((date, index) => (
          <Grid item xs key={index}>
            <Paper 
              elevation={isSameDay(date, currentDate) ? 3 : 1}
              sx={{ 
                p: 1, 
                textAlign: 'center', 
                cursor: 'pointer',
                bgcolor: isSameDay(date, currentDate) ? 'primary.light' : 'background.default',
                color: isWeekend(date) ? 'error.main' : 'text.primary'
              }}
              onClick={() => handleDateClick(date)}
            >
              <Typography variant="body2">
                {format(date, 'EEE')}
              </Typography>
              <Typography variant="body1">
                {format(date, 'd')}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Available Time Slots
        </Typography>
        {loading.availability ? (
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={2}>
            {timeSlots.map((slot, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <Tooltip 
                  title={
                    availability[slot.time] 
                      ? 'Slot Available' 
                      : 'Slot Fully Booked'
                  }
                >
                  <span>
                    <Button
                      fullWidth
                      variant={selectedSlot?.time === slot.time ? 'contained' : 'outlined'}
                      color="primary"
                      disabled={!availability[slot.time]}
                      onClick={() => handleTimeSelect(slot)}
                    >
                      {slot.time}
                    </Button>
                  </span>
                </Tooltip>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default BookingCalendar;
