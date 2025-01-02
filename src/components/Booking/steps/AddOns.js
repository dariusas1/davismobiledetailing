import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Typography,
    Card,
    CardContent,
    Checkbox,
    FormControlLabel,
    CircularProgress,
    Alert,
    Chip,
    IconButton,
    Collapse,
    useTheme,
    alpha
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    Add,
    Remove,
    Star,
    LocalOffer,
    Timer,
    Info,
    CheckCircle
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const StyledCard = styled(Card)(({ theme, selected }) => ({
    height: '100%',
    borderRadius: theme.shape.borderRadius * 2,
    transition: 'all 0.3s ease',
    border: `2px solid ${selected ? theme.palette.primary.main : 'transparent'}`,
    cursor: 'pointer',
    position: 'relative',
    overflow: 'visible',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: theme.shadows[4]
    }
}));

const PopularBadge = styled(Box)(({ theme }) => ({
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

const PriceTag = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: -10,
    left: 20,
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    padding: theme.spacing(0.5, 2),
    borderRadius: theme.shape.borderRadius,
    fontSize: '0.875rem',
    fontWeight: 'bold',
    boxShadow: theme.shadows[2],
    zIndex: 1
}));

const AddOns = ({ data, onUpdate }) => {
    const theme = useTheme();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [addOns, setAddOns] = useState([]);
    const [expandedId, setExpandedId] = useState(null);
    const [selectedAddOns, setSelectedAddOns] = useState(data.addOns || []);

    useEffect(() => {
        fetchAddOns();
    }, []);

    const fetchAddOns = async () => {
        try {
            const response = await fetch('/api/addons');
            const data = await response.json();
            setAddOns(data);
        } catch (error) {
            setError('Error fetching add-ons');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddOnToggle = (addOn) => {
        const newSelectedAddOns = selectedAddOns.includes(addOn._id)
            ? selectedAddOns.filter(id => id !== addOn._id)
            : [...selectedAddOns, addOn._id];

        setSelectedAddOns(newSelectedAddOns);
        onUpdate({
            ...data,
            addOns: newSelectedAddOns
        });
    };

    const handleExpandClick = (addOnId) => {
        setExpandedId(expandedId === addOnId ? null : addOnId);
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
                Enhance Your Service
            </Typography>
            <Typography color="text.secondary" paragraph>
                Customize your detailing experience with our premium add-ons
            </Typography>

            <Grid container spacing={3}>
                {addOns.map((addOn) => (
                    <Grid item xs={12} md={6} key={addOn._id}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <StyledCard
                                selected={selectedAddOns.includes(addOn._id)}
                                onClick={() => handleAddOnToggle(addOn)}
                            >
                                {addOn.popular && (
                                    <PopularBadge>Popular Choice</PopularBadge>
                                )}
                                <PriceTag>
                                    ${addOn.price}
                                </PriceTag>
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                        <Box>
                                            <Typography variant="h6">
                                                {addOn.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {addOn.shortDescription}
                                            </Typography>
                                        </Box>
                                        <Checkbox
                                            checked={selectedAddOns.includes(addOn._id)}
                                            color="primary"
                                            icon={<Add />}
                                            checkedIcon={<Remove />}
                                            onClick={(e) => e.stopPropagation()}
                                            onChange={() => handleAddOnToggle(addOn)}
                                        />
                                    </Box>

                                    <Box display="flex" gap={1} mb={2}>
                                        <Chip
                                            icon={<Timer />}
                                            label={`${addOn.duration} mins`}
                                            size="small"
                                            variant="outlined"
                                        />
                                        {addOn.recommended && (
                                            <Chip
                                                icon={<Star />}
                                                label="Recommended"
                                                size="small"
                                                color="secondary"
                                            />
                                        )}
                                        {addOn.discount && (
                                            <Chip
                                                icon={<LocalOffer />}
                                                label={`Save ${addOn.discount}%`}
                                                size="small"
                                                color="error"
                                            />
                                        )}
                                    </Box>

                                    <Collapse in={expandedId === addOn._id}>
                                        <Box mt={2}>
                                            <Typography variant="subtitle2" gutterBottom>
                                                Benefits:
                                            </Typography>
                                            <Grid container spacing={1}>
                                                {addOn.benefits.map((benefit, index) => (
                                                    <Grid item xs={12} key={index}>
                                                        <Box display="flex" alignItems="center" gap={1}>
                                                            <CheckCircle color="success" fontSize="small" />
                                                            <Typography variant="body2">
                                                                {benefit}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </Box>
                                    </Collapse>

                                    <Box display="flex" justifyContent="center" mt={2}>
                                        <IconButton
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleExpandClick(addOn._id);
                                            }}
                                            sx={{
                                                transform: expandedId === addOn._id
                                                    ? 'rotate(180deg)'
                                                    : 'rotate(0deg)',
                                                transition: 'transform 0.3s'
                                            }}
                                        >
                                            <Info />
                                        </IconButton>
                                    </Box>
                                </CardContent>
                            </StyledCard>
                        </motion.div>
                    </Grid>
                ))}
            </Grid>

            {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            )}

            {selectedAddOns.length > 0 && (
                <Box
                    mt={3}
                    p={2}
                    bgcolor={alpha(theme.palette.primary.main, 0.1)}
                    borderRadius={theme.shape.borderRadius * 2}
                >
                    <Typography variant="subtitle1" gutterBottom>
                        Selected Add-ons:
                    </Typography>
                    <Grid container spacing={1}>
                        {selectedAddOns.map((addOnId) => {
                            const addOn = addOns.find(a => a._id === addOnId);
                            return (
                                <Grid item key={addOnId}>
                                    <Chip
                                        label={`${addOn.name} - $${addOn.price}`}
                                        onDelete={() => handleAddOnToggle(addOn)}
                                        color="primary"
                                    />
                                </Grid>
                            );
                        })}
                    </Grid>
                </Box>
            )}
        </Box>
    );
};

export default AddOns; 