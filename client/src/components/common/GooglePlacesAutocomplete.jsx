/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { TextField, Box, Typography } from '@mui/material';
import { Autocomplete } from '@react-google-maps/api';

export const GooglePlacesAutocomplete = ({ onLocationSelect, error }) => {
    const [autocomplete, setAutocomplete] = useState(null);
    const [address, setAddress] = useState('');

    const onLoad = (autocompleteInstance) => {
        setAutocomplete(autocompleteInstance);
    };

    const onPlaceChanged = () => {
        if (autocomplete) {
            const place = autocomplete.getPlace();
            if (place.geometry) {
                const location = {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                    address: place.formatted_address
                };
                onLocationSelect(location);
                setAddress(place.formatted_address);
            }
        }
    };

    return (
        <Box>
            <Autocomplete 
                onLoad={onLoad} 
                onPlaceChanged={onPlaceChanged}
                restrictions={{ country: 'us' }}
            >
                <TextField
                    fullWidth
                    label="Service Location"
                    placeholder="Enter your address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    error={!!error}
                    helperText={error}
                    required
                />
            </Autocomplete>
            {address && (
                <Typography variant="caption" color="textSecondary">
                    Selected Location: {address}
                </Typography>
            )}
        </Box>
    );
};
