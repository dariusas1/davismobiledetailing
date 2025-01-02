import React, { useState } from 'react';
import { 
    Modal, 
    Box, 
    Typography, 
    Button, 
    TextField, 
    Grid 
} from '@mui/material';
import BookingService from '../../services/bookingService';

const PkgModal = ({ open, handleClose, packageDetails }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        serviceType: packageDetails?.name || ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await BookingService.createBooking(formData);
            // Show success notification
            handleClose();
        } catch (error) {
            // Show error notification
            console.error('Booking failed', error);
        }
    };

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="package-booking-modal"
        >
            <Box sx={modalStyle}>
                <Typography 
                    id="package-booking-modal" 
                    variant="h6" 
                    component="h2"
                >
                    Book {packageDetails?.name} Package
                </Typography>
                
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Full Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Phone Number"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button 
                                type="submit" 
                                variant="contained" 
                                color="primary" 
                                fullWidth
                            >
                                Book Now
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Modal>
    );
};

export default PkgModal;