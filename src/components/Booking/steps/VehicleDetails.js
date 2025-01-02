import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    TextField,
    Typography,
    MenuItem,
    Button,
    Card,
    CardContent,
    Divider,
    CircularProgress,
    Alert,
    Collapse,
    IconButton,
    Chip,
    useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    DirectionsCar,
    Add,
    Edit,
    Delete,
    ExpandMore,
    Check
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const StyledCard = styled(Card)(({ theme }) => ({
    borderRadius: theme.shape.borderRadius * 2,
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: theme.shadows[4]
    }
}));

const vehicleTypes = [
    'Sedan',
    'SUV',
    'Truck',
    'Van',
    'Sports Car',
    'Luxury Vehicle',
    'Electric Vehicle'
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

const VehicleDetails = ({ data, onUpdate }) => {
    const theme = useTheme();
    const [loading, setLoading] = useState(true);
    const [savedVehicles, setSavedVehicles] = useState([]);
    const [showNewVehicleForm, setShowNewVehicleForm] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        make: '',
        model: '',
        year: currentYear,
        type: '',
        color: '',
        licensePlate: '',
        vin: '',
        specialInstructions: ''
    });

    useEffect(() => {
        fetchSavedVehicles();
    }, []);

    const fetchSavedVehicles = async () => {
        try {
            const response = await fetch('/api/vehicles');
            const data = await response.json();
            setSavedVehicles(data);
        } catch (error) {
            console.error('Error fetching vehicles:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field) => (event) => {
        const value = event.target.value;
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSavedVehicleSelect = (vehicle) => {
        onUpdate({
            ...data,
            vehicle: vehicle
        });
        setShowNewVehicleForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await fetch('/api/vehicles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Failed to save vehicle');

            const newVehicle = await response.json();
            setSavedVehicles(prev => [...prev, newVehicle]);
            handleSavedVehicleSelect(newVehicle);
            setShowNewVehicleForm(false);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteVehicle = async (vehicleId) => {
        try {
            await fetch(`/api/vehicles/${vehicleId}`, {
                method: 'DELETE'
            });
            setSavedVehicles(prev => prev.filter(v => v._id !== vehicleId));
            if (data.vehicle?._id === vehicleId) {
                onUpdate({
                    ...data,
                    vehicle: null
                });
            }
        } catch (error) {
            console.error('Error deleting vehicle:', error);
        }
    };

    if (loading && savedVehicles.length === 0) {
        return (
            <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                Vehicle Details
            </Typography>
            <Typography color="text.secondary" paragraph>
                Select a saved vehicle or add a new one
            </Typography>

            {/* Saved Vehicles */}
            {savedVehicles.length > 0 && (
                <Grid container spacing={3} mb={4}>
                    {savedVehicles.map((vehicle) => (
                        <Grid item xs={12} md={6} key={vehicle._id}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <StyledCard
                                    onClick={() => handleSavedVehicleSelect(vehicle)}
                                    sx={{
                                        border: data.vehicle?._id === vehicle._id
                                            ? `2px solid ${theme.palette.primary.main}`
                                            : 'none',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <CardContent>
                                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <DirectionsCar color="primary" />
                                                <Typography variant="h6">
                                                    {vehicle.year} {vehicle.make} {vehicle.model}
                                                </Typography>
                                            </Box>
                                            <Box>
                                                <IconButton
                                                    size="small"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteVehicle(vehicle._id);
                                                    }}
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </Box>
                                        </Box>

                                        <Grid container spacing={2}>
                                            <Grid item xs={6}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Type
                                                </Typography>
                                                <Typography variant="body1">
                                                    {vehicle.type}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Color
                                                </Typography>
                                                <Typography variant="body1">
                                                    {vehicle.color}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant="body2" color="text.secondary">
                                                    License Plate
                                                </Typography>
                                                <Typography variant="body1">
                                                    {vehicle.licensePlate}
                                                </Typography>
                                            </Grid>
                                        </Grid>

                                        {vehicle.specialInstructions && (
                                            <Box mt={2}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Special Instructions
                                                </Typography>
                                                <Typography variant="body2">
                                                    {vehicle.specialInstructions}
                                                </Typography>
                                            </Box>
                                        )}
                                    </CardContent>
                                </StyledCard>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Add New Vehicle Button */}
            <Button
                variant={showNewVehicleForm ? "outlined" : "contained"}
                startIcon={showNewVehicleForm ? <ExpandMore /> : <Add />}
                onClick={() => setShowNewVehicleForm(!showNewVehicleForm)}
                fullWidth
                sx={{ mb: 3 }}
            >
                {showNewVehicleForm ? "Cancel" : "Add New Vehicle"}
            </Button>

            {/* New Vehicle Form */}
            <Collapse in={showNewVehicleForm}>
                <StyledCard>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Make"
                                        value={formData.make}
                                        onChange={handleInputChange('make')}
                                        fullWidth
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Model"
                                        value={formData.model}
                                        onChange={handleInputChange('model')}
                                        fullWidth
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        select
                                        label="Year"
                                        value={formData.year}
                                        onChange={handleInputChange('year')}
                                        fullWidth
                                        required
                                    >
                                        {years.map((year) => (
                                            <MenuItem key={year} value={year}>
                                                {year}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        select
                                        label="Vehicle Type"
                                        value={formData.type}
                                        onChange={handleInputChange('type')}
                                        fullWidth
                                        required
                                    >
                                        {vehicleTypes.map((type) => (
                                            <MenuItem key={type} value={type}>
                                                {type}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Color"
                                        value={formData.color}
                                        onChange={handleInputChange('color')}
                                        fullWidth
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="License Plate"
                                        value={formData.licensePlate}
                                        onChange={handleInputChange('licensePlate')}
                                        fullWidth
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="VIN (Optional)"
                                        value={formData.vin}
                                        onChange={handleInputChange('vin')}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Special Instructions (Optional)"
                                        value={formData.specialInstructions}
                                        onChange={handleInputChange('specialInstructions')}
                                        multiline
                                        rows={3}
                                        fullWidth
                                    />
                                </Grid>
                            </Grid>

                            {error && (
                                <Alert severity="error" sx={{ mt: 2 }}>
                                    {error}
                                </Alert>
                            )}

                            <Box mt={3} display="flex" justifyContent="flex-end">
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={loading}
                                    startIcon={loading ? <CircularProgress size={20} /> : <Check />}
                                >
                                    Save Vehicle
                                </Button>
                            </Box>
                        </form>
                    </CardContent>
                </StyledCard>
            </Collapse>
        </Box>
    );
};

export default VehicleDetails; 