import React, { useState, useEffect } from 'react';
import {
    Grid,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Box,
    Chip,
    IconButton,
    Collapse,
    CircularProgress,
    useTheme,
    alpha
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    Check,
    ExpandMore,
    Star,
    AccessTime,
    LocalOffer
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const ServiceCard = styled(Card)(({ theme, selected }) => ({
    cursor: 'pointer',
    height: '100%',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'visible',
    borderRadius: theme.shape.borderRadius * 2,
    border: `2px solid ${selected ? theme.palette.primary.main : 'transparent'}`,
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: theme.shadows[8]
    }
}));

const ExpandButton = styled(IconButton)(({ theme, expanded }) => ({
    transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
    transition: 'transform 0.3s',
    position: 'absolute',
    bottom: -20,
    right: 20,
    background: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
    '&:hover': {
        background: theme.palette.background.paper
    }
}));

const ServiceBadge = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: -10,
    right: 20,
    background: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    padding: theme.spacing(0.5, 2),
    borderRadius: theme.shape.borderRadius,
    fontSize: '0.875rem',
    fontWeight: 'bold',
    boxShadow: theme.shadows[2],
    zIndex: 1
}));

const ServiceSelection = ({ data, onUpdate }) => {
    const theme = useTheme();
    const [loading, setLoading] = useState(true);
    const [services, setServices] = useState([]);
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await fetch('/api/services');
            const data = await response.json();
            setServices(data);
        } catch (error) {
            console.error('Error fetching services:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleServiceSelect = (service) => {
        onUpdate({
            ...data,
            selectedService: service
        });
    };

    const handleExpandClick = (serviceId) => {
        setExpandedId(expandedId === serviceId ? null : serviceId);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                Select Your Service Package
            </Typography>
            <Typography color="text.secondary" paragraph>
                Choose from our premium detailing packages tailored to your needs
            </Typography>

            <Grid container spacing={3}>
                {services.map((service) => (
                    <Grid item xs={12} md={6} key={service._id}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ServiceCard
                                selected={data.selectedService?._id === service._id}
                                onClick={() => handleServiceSelect(service)}
                            >
                                {service.popular && (
                                    <ServiceBadge>Most Popular</ServiceBadge>
                                )}
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={service.image}
                                    alt={service.name}
                                    sx={{
                                        objectFit: 'cover',
                                        filter: data.selectedService?._id === service._id
                                            ? 'none'
                                            : 'grayscale(0.3)'
                                    }}
                                />
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                        <Typography variant="h6" gutterBottom>
                                            {service.name}
                                        </Typography>
                                        <Box display="flex" alignItems="center" gap={0.5}>
                                            <Star sx={{ color: theme.palette.warning.main }} />
                                            <Typography variant="subtitle1">
                                                {service.rating}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box display="flex" gap={1} mb={2}>
                                        <Chip
                                            icon={<AccessTime />}
                                            label={`${service.duration} mins`}
                                            size="small"
                                        />
                                        <Chip
                                            icon={<LocalOffer />}
                                            label={`$${service.price}`}
                                            size="small"
                                            color="primary"
                                        />
                                    </Box>

                                    <Typography color="text.secondary" paragraph>
                                        {service.shortDescription}
                                    </Typography>

                                    <Collapse in={expandedId === service._id}>
                                        <Box mt={2}>
                                            <Typography variant="subtitle2" gutterBottom>
                                                What's Included:
                                            </Typography>
                                            <Grid container spacing={1}>
                                                {service.features.map((feature, index) => (
                                                    <Grid item xs={12} key={index}>
                                                        <Box display="flex" alignItems="center" gap={1}>
                                                            <Check color="success" fontSize="small" />
                                                            <Typography variant="body2">
                                                                {feature}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </Box>
                                    </Collapse>

                                    <ExpandButton
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleExpandClick(service._id);
                                        }}
                                        expanded={expandedId === service._id}
                                    >
                                        <ExpandMore />
                                    </ExpandButton>
                                </CardContent>
                            </ServiceCard>
                        </motion.div>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default ServiceSelection; 