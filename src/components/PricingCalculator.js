import React, { useState } from 'react';
import { 
    Box, 
    Typography, 
    Slider, 
    Select, 
    MenuItem, 
    FormControl, 
    InputLabel, 
    Button, 
    Grid, 
    Paper 
} from '@mui/material';

const serviceTypes = {
    'Basic Wash': {
        basePrice: 50,
        pricePerSqFt: 0.5
    },
    'Interior Detailing': {
        basePrice: 150,
        pricePerSqFt: 1
    },
    'Ceramic Coating': {
        basePrice: 500,
        pricePerSqFt: 2
    },
    'Paint Correction': {
        basePrice: 300,
        pricePerSqFt: 1.5
    }
};

const vehicleTypes = {
    'Sedan': 1,
    'SUV': 1.2,
    'Truck': 1.5,
    'Sports Car': 1.3
};

export default function PricingCalculator() {
    const [serviceType, setServiceType] = useState('Basic Wash');
    const [vehicleType, setVehicleType] = useState('Sedan');
    const [vehicleSize, setVehicleSize] = useState(150);

    const calculatePrice = () => {
        const service = serviceTypes[serviceType];
        const vehicleMultiplier = vehicleTypes[vehicleType];
        
        return Math.round(
            (service.basePrice + (service.pricePerSqFt * vehicleSize)) * vehicleMultiplier
        );
    };

    return (
        <Paper 
            elevation={3} 
            sx={{ 
                p: 4, 
                maxWidth: 500, 
                margin: 'auto',
                backgroundColor: 'rgba(255, 215, 0, 0.05)'
            }}
        >
            <Typography 
                variant="h4" 
                gutterBottom 
                sx={{ 
                    textAlign: 'center', 
                    fontWeight: 'bold',
                    color: 'primary.main' 
                }}
            >
                Pricing Calculator
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <FormControl fullWidth>
                        <InputLabel>Service Type</InputLabel>
                        <Select
                            value={serviceType}
                            label="Service Type"
                            onChange={(e) => setServiceType(e.target.value)}
                        >
                            {Object.keys(serviceTypes).map(type => (
                                <MenuItem key={type} value={type}>{type}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12}>
                    <FormControl fullWidth>
                        <InputLabel>Vehicle Type</InputLabel>
                        <Select
                            value={vehicleType}
                            label="Vehicle Type"
                            onChange={(e) => setVehicleType(e.target.value)}
                        >
                            {Object.keys(vehicleTypes).map(type => (
                                <MenuItem key={type} value={type}>{type}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12}>
                    <Typography gutterBottom>
                        Vehicle Size (sq ft): {vehicleSize}
                    </Typography>
                    <Slider
                        value={vehicleSize}
                        onChange={(e, newValue) => setVehicleSize(newValue)}
                        min={100}
                        max={300}
                        valueLabelDisplay="auto"
                    />
                </Grid>

                <Grid item xs={12}>
                    <Typography 
                        variant="h5" 
                        sx={{ 
                            textAlign: 'center', 
                            fontWeight: 'bold',
                            color: 'primary.main' 
                        }}
                    >
                        Estimated Price: ${calculatePrice()}
                    </Typography>
                </Grid>

                <Grid item xs={12}>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        fullWidth
                        sx={{ 
                            py: 1.5,
                            fontWeight: 'bold' 
                        }}
                    >
                        Book Now
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    );
}
