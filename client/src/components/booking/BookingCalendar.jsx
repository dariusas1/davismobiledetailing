/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Typography, 
    Grid, 
    Button, 
    Tooltip, 
    useMediaQuery, 
    useTheme 
} from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';
import axios from 'axios';

const BookingCalendar = ({ onDateSelect, onTimeSelect }) => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const fetchAvailableSlots = async (date) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('/api/bookings/availability', {
                params: { date: date.toISOString() }
            });
            setAvailableSlots(response.data.availableSlots);
        } catch (err) {
            setError(err.response?.data?.message || 'Unable to fetch available slots');
            setAvailableSlots([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (newDate) => {
        setSelectedDate(newDate);
        fetchAvailableSlots(newDate);
        onDateSelect(newDate);
    };

    const handleTimeSelect = (time) => {
        onTimeSelect(time);
    };

    const isDateDisabled = (date) => {
        // Disable dates less than 24 hours from now
        const minAllowedDate = moment().add(24, 'hours');
        return date.isBefore(minAllowedDate, 'day');
    };

    return (
        <Box 
            sx={{ 
                width: '100%', 
                display: 'flex', 
                flexDirection: isMobile ? 'column' : 'row',
                gap: 2,
                padding: 2 
            }}
        >
            <Box sx={{ flex: 1 }}>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                    <Tooltip 
                        title="Select a date at least 24 hours in advance" 
                        placement="top"
                    >
                        <DateCalendar
                            value={selectedDate}
                            onChange={handleDateChange}
                            shouldDisableDate={isDateDisabled}
                            sx={{ 
                                width: '100%',
                                '& .MuiPickersDay-root': {
                                    '&.Mui-disabled': {
                                        color: theme.palette.text.disabled,
                                        textDecoration: 'line-through'
                                    }
                                }
                            }}
                        />
                    </Tooltip>
                </LocalizationProvider>
            </Box>

            <Box sx={{ flex: 1 }}>
                <Typography variant="h6" gutterBottom>
                    Available Time Slots
                </Typography>
                {loading ? (
                    <Typography>Loading available slots...</Typography>
                ) : error ? (
                    <Tooltip title={error} placement="top">
                        <Typography color="error">
                            {error}
                        </Typography>
                    </Tooltip>
                ) : availableSlots.length > 0 ? (
                    <Grid container spacing={2}>
                        {availableSlots.map((slot) => (
                            <Grid item xs={6} sm={4} key={slot}>
                                <Tooltip 
                                    title={`Book for ${slot}`} 
                                    placement="top"
                                >
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        fullWidth
                                        onClick={() => handleTimeSelect(slot)}
                                    >
                                        {slot}
                                    </Button>
                                </Tooltip>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Typography variant="body2" color="textSecondary">
                        No available slots for the selected date
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default BookingCalendar;
