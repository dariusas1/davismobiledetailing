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
    useTheme,
    useMediaQuery,
    Paper
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    CalendarMonth,
    AccessTime,
    CheckCircle
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, StaticDatePicker } from '@mui/x-date-pickers';
import { format, addDays, isAfter, isBefore, isSameDay } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const StyledCard = styled(Card)(({ theme }) => ({
    borderRadius: theme.shape.borderRadius * 2,
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: theme.shadows[4]
    }
}));

const TimeSlotButton = styled(Button)(({ theme, selected, available }) => ({
    width: '100%',
    padding: theme.spacing(1.5),
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${selected ? theme.palette.primary.main : theme.palette.divider}`,
    backgroundColor: selected
        ? alpha(theme.palette.primary.main, 0.1)
        : 'transparent',
    opacity: available ? 1 : 0.5,
    pointerEvents: available ? 'auto' : 'none',
    '&:hover': {
        backgroundColor: selected
            ? alpha(theme.palette.primary.main, 0.2)
            : alpha(theme.palette.action.hover, 0.1)
    }
}));

const DateTimeSelection = ({ data, onUpdate }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [availableSlots, setAvailableSlots] = useState({});
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);

    useEffect(() => {
        if (selectedDate) {
            fetchAvailableSlots(selectedDate);
        }
    }, [selectedDate]);

    const fetchAvailableSlots = async (date) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/availability?date=${format(date, 'yyyy-MM-dd')}`);
            const data = await response.json();
            setAvailableSlots(data);
        } catch (error) {
            setError('Error fetching available time slots');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        setSelectedTime(null);
        onUpdate({
            ...data,
            date: date,
            time: null
        });
    };

    const handleTimeSelect = (time) => {
        setSelectedTime(time);
        onUpdate({
            ...data,
            time: time
        });
    };

    const shouldDisableDate = (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const maxDate = addDays(today, 30);
        return isBefore(date, today) || isAfter(date, maxDate);
    };

    const renderTimeSlots = () => {
        if (!selectedDate || loading) {
            return (
                <Box display="flex" justifyContent="center" p={4}>
                    <CircularProgress />
                </Box>
            );
        }

        if (!availableSlots || Object.keys(availableSlots).length === 0) {
            return (
                <Alert severity="info">
                    No available time slots for the selected date
                </Alert>
            );
        }

        const morningSlots = [];
        const afternoonSlots = [];
        const eveningSlots = [];

        Object.entries(availableSlots).forEach(([time, available]) => {
            const hour = parseInt(time.split(':')[0]);
            const slot = (
                <Grid item xs={6} sm={4} key={time}>
                    <TimeSlotButton
                        variant="outlined"
                        selected={selectedTime === time}
                        available={available}
                        onClick={() => handleTimeSelect(time)}
                        startIcon={<AccessTime />}
                    >
                        {time}
                    </TimeSlotButton>
                </Grid>
            );

            if (hour < 12) morningSlots.push(slot);
            else if (hour < 17) afternoonSlots.push(slot);
            else eveningSlots.push(slot);
        });

        return (
            <Box>
                {morningSlots.length > 0 && (
                    <Box mb={3}>
                        <Typography variant="subtitle1" gutterBottom>
                            Morning
                        </Typography>
                        <Grid container spacing={2}>
                            {morningSlots}
                        </Grid>
                    </Box>
                )}

                {afternoonSlots.length > 0 && (
                    <Box mb={3}>
                        <Typography variant="subtitle1" gutterBottom>
                            Afternoon
                        </Typography>
                        <Grid container spacing={2}>
                            {afternoonSlots}
                        </Grid>
                    </Box>
                )}

                {eveningSlots.length > 0 && (
                    <Box>
                        <Typography variant="subtitle1" gutterBottom>
                            Evening
                        </Typography>
                        <Grid container spacing={2}>
                            {eveningSlots}
                        </Grid>
                    </Box>
                )}
            </Box>
        );
    };

    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                Select Date & Time
            </Typography>
            <Typography color="text.secondary" paragraph>
                Choose your preferred appointment date and time
            </Typography>

            <Grid container spacing={4}>
                {/* Calendar */}
                <Grid item xs={12} md={6}>
                    <StyledCard>
                        <CardContent>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <StaticDatePicker
                                    displayStaticWrapperAs={isMobile ? "mobile" : "desktop"}
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                    shouldDisableDate={shouldDisableDate}
                                    renderInput={() => null}
                                />
                            </LocalizationProvider>
                        </CardContent>
                    </StyledCard>
                </Grid>

                {/* Time Slots */}
                <Grid item xs={12} md={6}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : 'no-date'}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            <StyledCard>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Available Time Slots
                                    </Typography>
                                    {selectedDate ? (
                                        renderTimeSlots()
                                    ) : (
                                        <Alert severity="info">
                                            Please select a date to view available time slots
                                        </Alert>
                                    )}
                                </CardContent>
                            </StyledCard>
                        </motion.div>
                    </AnimatePresence>
                </Grid>
            </Grid>

            {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            )}

            {selectedDate && selectedTime && (
                <Paper
                    elevation={3}
                    sx={{
                        mt: 3,
                        p: 2,
                        borderRadius: theme.shape.borderRadius * 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        bgcolor: alpha(theme.palette.success.main, 0.1)
                    }}
                >
                    <CheckCircle color="success" />
                    <Typography>
                        Selected appointment: {format(selectedDate, 'MMMM d, yyyy')} at {selectedTime}
                    </Typography>
                </Paper>
            )}
        </Box>
    );
};

export default DateTimeSelection; 