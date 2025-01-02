/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { 
    Container, 
    Typography, 
    Grid, 
    Card, 
    CardContent, 
    CardMedia, 
    Button, 
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Chip,
    Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const services = [
    {
        id: 1,
        title: 'Exterior Detail',
        description: 'Complete exterior wash, clay bar treatment, and premium wax protection.',
        price: 199.99,
        image: '/images/exterior-detail.jpg',
        features: [
            'Full exterior wash',
            'Clay bar treatment',
            'Premium wax protection',
            'Wheel and tire cleaning'
        ]
    },
    {
        id: 2,
        title: 'Interior Detail',
        description: 'Deep cleaning of interior, steam cleaning, leather conditioning, and stain removal.',
        price: 179.99,
        image: '/images/interior-detail.jpg',
        features: [
            'Deep interior cleaning',
            'Steam cleaning',
            'Leather conditioning',
            'Stain removal'
        ]
    },
    {
        id: 3,
        title: 'Full Detailing Package',
        description: 'Comprehensive exterior and interior detailing with paint correction and ceramic coating.',
        price: 399.99,
        image: '/images/full-detail.jpg',
        features: [
            'Exterior and interior detail',
            'Paint correction',
            'Ceramic coating',
            'Premium protection'
        ]
    },
    {
        id: 4,
        title: 'Paint Correction',
        description: 'Professional paint correction to remove swirl marks, scratches, and restore shine.',
        price: 299.99,
        image: '/images/paint-correction.jpg',
        features: [
            'Swirl mark removal',
            'Scratch correction',
            'Paint restoration',
            'High-gloss finish'
        ]
    }
];

const ServiceCard = styled(Card)(({ theme, selected }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    border: selected ? '2px solid #FFD700' : '1px solid #e0e0e0',
    boxShadow: selected 
        ? '0 4px 6px rgba(255, 215, 0, 0.3)' 
        : '0 2px 4px rgba(0,0,0,0.1)',
    '&:hover': {
        transform: 'scale(1.05)',
        boxShadow: '0 6px 8px rgba(0,0,0,0.2)'
    }
}));

const ServicesPage = () => {
    const [selectedService, setSelectedService] = useState(null);
    const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
    const [bookingDetails, setBookingDetails] = useState({
        name: '',
        email: '',
        phone: '',
        vehicleType: '',
        additionalNotes: ''
    });
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleServiceSelect = (service) => {
        setSelectedService(service);
    };

    const handleBookService = () => {
        if (!user) {
            navigate('/login', { 
                state: { 
                    from: '/services', 
                    message: 'Please login to book a service' 
                } 
            });
            return;
        }
        setBookingDialogOpen(true);
    };

    const handleBookingChange = (e) => {
        const { name, value } = e.target;
        setBookingDetails(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const submitBooking = () => {
        // TODO: Implement actual booking submission logic
        console.log('Booking submitted', { 
            service: selectedService, 
            details: bookingDetails 
        });
        setBookingDialogOpen(false);
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography 
                variant="h3" 
                component="h1" 
                gutterBottom 
                sx={{ 
                    textAlign: 'center', 
                    color: '#000',
                    mb: 4 
                }}
            >
                Our Services
            </Typography>

            <Grid container spacing={4}>
                {services.map((service) => (
                    <Grid item xs={12} sm={6} md={3} key={service.id}>
                        <ServiceCard 
                            elevation={3} 
                            selected={selectedService?.id === service.id}
                            onClick={() => handleServiceSelect(service)}
                        >
                            <CardMedia
                                component="img"
                                height="200"
                                image={service.image}
                                alt={service.title}
                            />
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography gutterBottom variant="h5" component="div">
                                    {service.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {service.description}
                                </Typography>
                                <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {service.features.map((feature) => (
                                        <Chip 
                                            key={feature} 
                                            label={feature} 
                                            size="small" 
                                            variant="outlined" 
                                            color="primary"
                                        />
                                    ))}
                                </Box>
                                <Typography variant="h6" sx={{ mt: 2, color: '#000' }}>
                                    ${service.price.toFixed(2)}
                                </Typography>
                            </CardContent>
                            <Box sx={{ p: 2 }}>
                                <Button 
                                    variant="contained" 
                                    fullWidth
                                    onClick={handleBookService}
                                    disabled={!selectedService}
                                    sx={{ 
                                        backgroundColor: selectedService?.id === service.id ? '#FFD700' : '#e0e0e0', 
                                        color: '#000',
                                        '&:hover': { 
                                            backgroundColor: selectedService?.id === service.id ? '#FFC107' : '#e0e0e0' 
                                        } 
                                    }}
                                >
                                    {selectedService?.id === service.id ? 'Book Selected' : 'Select Service'}
                                </Button>
                            </Box>
                        </ServiceCard>
                    </Grid>
                ))}
            </Grid>

            <Dialog 
                open={bookingDialogOpen} 
                onClose={() => setBookingDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    Book {selectedService?.title}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="name"
                                label="Full Name"
                                fullWidth
                                value={bookingDetails.name}
                                onChange={handleBookingChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="email"
                                label="Email"
                                fullWidth
                                value={bookingDetails.email}
                                onChange={handleBookingChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="phone"
                                label="Phone Number"
                                fullWidth
                                value={bookingDetails.phone}
                                onChange={handleBookingChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="vehicleType"
                                label="Vehicle Type"
                                fullWidth
                                value={bookingDetails.vehicleType}
                                onChange={handleBookingChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="additionalNotes"
                                label="Additional Notes"
                                fullWidth
                                multiline
                                rows={4}
                                value={bookingDetails.additionalNotes}
                                onChange={handleBookingChange}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={() => setBookingDialogOpen(false)}
                        color="primary"
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={submitBooking} 
                        variant="contained"
                        sx={{ 
                            backgroundColor: '#FFD700', 
                            color: '#000',
                            '&:hover': { 
                                backgroundColor: '#FFC107' 
                            } 
                        }}
                    >
                        Confirm Booking
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ServicesPage;