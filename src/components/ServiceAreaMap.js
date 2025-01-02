import React from 'react';
import { GoogleMap, LoadScript, Polygon } from '@react-google-maps/api';
import { Box, Typography, Paper } from '@mui/material';
import LocationService from '../utils/locationService';

const mapContainerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
};

const mapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false
};

const ServiceAreaMap = () => {
    const { coordinates, center } = LocationService.serviceArea;

    const polygonOptions = {
        paths: coordinates,
        strokeColor: '#FF6B6B',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FFD93D',
        fillOpacity: 0.35
    };

    return (
        <Paper 
            elevation={3} 
            sx={{ 
                p: 2, 
                mt: 3, 
                backgroundColor: 'background.default' 
            }}
        >
            <Typography 
                variant="h5" 
                gutterBottom 
                sx={{ 
                    color: 'primary.main', 
                    textAlign: 'center',
                    mb: 2 
                }}
            >
                Our Service Area
            </Typography>

            {process.env.REACT_APP_GOOGLE_MAPS_API_KEY ? (
              <LoadScript 
                googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
                loadingElement={<div>Loading...</div>}
              >
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={center}
                    zoom={9}
                    options={mapOptions}
                >
                    <Polygon
                        paths={coordinates}
                        options={polygonOptions}
                    />
                </GoogleMap>
              </LoadScript>
            ) : (
              <Box sx={{ 
                height: '400px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f5f5f5',
                borderRadius: '8px'
              }}>
                <Typography variant="body1" color="text.secondary">
                  Google Maps API key not configured
                </Typography>
              </Box>
            )}

            <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                    We proudly serve Santa Cruz County and surrounding areas
                </Typography>
            </Box>
        </Paper>
    );
};

export default ServiceAreaMap;
