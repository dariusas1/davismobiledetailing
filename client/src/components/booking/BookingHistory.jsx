import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Typography, 
    Paper, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Button,
    Chip,
    Grid
} from '@mui/material';
import axios from 'axios';
import moment from 'moment';

const BookingHistory = () => {
    const [bookings, setBookings] = useState([]);
    const [summary, setSummary] = useState({
        totalBookings: 0,
        totalSpent: 0,
        mostFrequentService: 'N/A'
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookingHistory = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/api/booking-history', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setBookings(response.data.bookings);
                setSummary(response.data.summary);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch booking history');
                setLoading(false);
            }
        };

        fetchBookingHistory();
    }, []);

    const handleCancelBooking = async (bookingId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`/api/booking-history/${bookingId}/cancel`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update local state to reflect cancellation
            setBookings(prev => 
                prev.map(booking => 
                    booking._id === bookingId 
                        ? { ...booking, status: 'Cancelled' } 
                        : booking
                )
            );
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to cancel booking');
        }
    };

    if (loading) return <Typography>Loading booking history...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Booking History
            </Typography>

            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6">Total Bookings</Typography>
                        <Typography variant="h4">{summary.totalBookings}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6">Total Spent</Typography>
                        <Typography variant="h4">${summary.totalSpent.toFixed(2)}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6">Most Frequent Service</Typography>
                        <Typography variant="h4">{summary.mostFrequentService}</Typography>
                    </Paper>
                </Grid>
            </Grid>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Service</TableCell>
                            <TableCell>Vehicle</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {bookings.map((booking) => (
                            <TableRow key={booking._id}>
                                <TableCell>
                                    {moment(booking.bookingDate).format('MMMM Do, YYYY')}
                                </TableCell>
                                <TableCell>{booking.service.name}</TableCell>
                                <TableCell>{booking.vehicle.type}</TableCell>
                                <TableCell>${booking.totalPrice.toFixed(2)}</TableCell>
                                <TableCell>
                                    <Chip 
                                        label={booking.status} 
                                        color={
                                            booking.status === 'Completed' ? 'success' : 
                                            booking.status === 'Cancelled' ? 'error' : 
                                            'warning'
                                        } 
                                        size="small" 
                                    />
                                </TableCell>
                                <TableCell>
                                    {booking.status === 'Upcoming' && (
                                        <Button 
                                            variant="outlined" 
                                            color="error"
                                            size="small"
                                            onClick={() => handleCancelBooking(booking._id)}
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
        </Box>
    );
};

export default BookingHistory;
