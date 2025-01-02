/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react';
import { AppContext, useAppContext } from '../../contexts/AppContext';
import { useConfig } from '../../contexts/ConfigContext';
import { getBookingDetails } from '../../services/bookingService';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper, 
    Button,
    Typography,
    Box
} from '@mui/material';

const BookingManagement = () => {
    const [bookings, setBookings] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    const { user } = useContext(AppContext);
    const config = useConfig();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                // Use config logger for logging
                config.logger.debug('Fetching bookings');
                
                // Check granular feature flags
                if (!config.getFeatureFlag('admin', 'dashboard')) {
                    config.logger.warn('Admin dashboard is disabled');
                    return;
                }

                // Check booking-specific configuration
                const maxBookingsPerDay = config.getFeatureFlag('booking', 'maxBookingsPerDay');
                const advanceBookingDays = config.getFeatureFlag('booking', 'advanceBookingDays');

                config.logger.info(`Fetching bookings with constraints: 
                    Max Bookings Per Day: ${maxBookingsPerDay}, 
                    Advance Booking Days: ${advanceBookingDays}`);

                const bookingDetails = await getBookingDetails({
                    maxBookings: maxBookingsPerDay,
                    advanceDays: advanceBookingDays
                });

                setBookings(Array.isArray(bookingDetails) ? bookingDetails : []);
            } catch (error) {
                config.logger.error('Failed to fetch bookings', error);
            }
        };

        fetchBookings();
    }, [config]);

    const handleOpenModal = (booking = null) => {
        // Check if booking cancellation is allowed
        const allowCancellation = config.getFeatureFlag('booking', 'allowCancellation');
        
        if (!allowCancellation && booking) {
            config.logger.warn('Booking cancellation is currently disabled');
            return;
        }

        setSelectedBooking(booking);
        setOpenModal(true);
    };

    // Render logic with configuration-based rendering
    return (
        <Box>
            {config.getFeatureFlag('admin', 'dashboard') ? (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Booking ID</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Service</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {bookings.map((booking) => (
                                <TableRow key={booking._id}>
                                    <TableCell>{booking._id}</TableCell>
                                    <TableCell>{booking.date}</TableCell>
                                    <TableCell>{booking.serviceType}</TableCell>
                                    <TableCell>
                                        {config.getFeatureFlag('booking', 'allowCancellation') && (
                                            <Button 
                                                variant="outlined" 
                                                color="secondary" 
                                                onClick={() => handleOpenModal(booking)}
                                            >
                                                Cancel
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Typography variant="h6" color="error">
                    Admin Dashboard Access Denied
                </Typography>
            )}

        </Box>
    );
};

export default BookingManagement;
