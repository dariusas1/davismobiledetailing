import axios from 'axios';
import ErrorHandler from './ErrorHandler';
import Logger from './Logger';

class LocationService {
    constructor() {
        this.apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
        this.serviceArea = {
            // Santa Cruz County, CA area coordinates (more precise polygon)
            coordinates: [
                { lat: 36.9741, lng: -122.1879 },  // Santa Cruz
                { lat: 37.0449, lng: -121.9613 },  // Scotts Valley
                { lat: 37.1415, lng: -121.9053 },  // Los Gatos
                { lat: 37.0572, lng: -121.7251 },  // Morgan Hill
                { lat: 36.9097, lng: -121.7794 },  // Watsonville
                { lat: 36.9741, lng: -122.1879 }   // Back to Santa Cruz
            ],
            center: { 
                lat: 36.9741, 
                lng: -122.0308 
            },
            maxRadius: 50 // kilometers
        };
    }

    // Geocode address to get latitude and longitude
    async geocodeAddress(address) {
        try {
            const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
                params: {
                    address: address,
                    key: this.apiKey
                }
            });

            const result = response.data.results[0];
            if (!result) {
                throw new Error('Address not found');
            }

            const { lat, lng } = result.geometry.location;

            // Log successful geocoding
            Logger.info('Address geocoded', { address, lat, lng });

            return { lat, lng };
        } catch (error) {
            ErrorHandler.handleError(error, 'Address Geocoding Failed');
            throw error;
        }
    }

    // Check if address is within service area
    isAddressInServiceArea(lat, lng) {
        // Primary check: Point-in-polygon method
        const polygonCheck = this.pointInPolygon({ lat, lng }, this.serviceArea.coordinates);
        
        // Secondary check: Distance from service area center
        const distanceFromCenter = this.calculateDistance(
            { lat, lng }, 
            this.serviceArea.center
        );

        // Log service area check details
        Logger.info('Service area check', {
            coordinates: { lat, lng },
            inPolygon: polygonCheck,
            distanceFromCenter: distanceFromCenter
        });

        return polygonCheck || distanceFromCenter <= this.serviceArea.maxRadius;
    }

    // Point-in-polygon algorithm (ray casting method)
    pointInPolygon(point, polygon) {
        let inside = false;
        const x = point.lng, y = point.lat;
        
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            const xi = polygon[i].lng, yi = polygon[i].lat;
            const xj = polygon[j].lng, yj = polygon[j].lat;
            
            const intersect = ((yi > y) !== (yj > y)) &&
                (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            
            if (intersect) inside = !inside;
        }
        
        return inside;
    }

    // Calculate distance between two points
    calculateDistance(origin, destination) {
        const R = 6371; // Earth's radius in kilometers
        const dLat = this.toRadians(destination.lat - origin.lat);
        const dLon = this.toRadians(destination.lng - origin.lng);
        
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(this.toRadians(origin.lat)) * Math.cos(this.toRadians(destination.lat)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c; // Distance in kilometers
        
        return distance;
    }

    // Convert degrees to radians
    toRadians(degrees) {
        return degrees * (Math.PI/180);
    }

    // Validate service availability
    async validateServiceAvailability(address) {
        try {
            const { lat, lng } = await this.geocodeAddress(address);
            const isInServiceArea = this.isAddressInServiceArea(lat, lng);

            // Log service availability check
            Logger.info('Service availability checked', { 
                address, 
                isInServiceArea 
            });

            return {
                isAvailable: isInServiceArea,
                coordinates: { lat, lng }
            };
        } catch (error) {
            ErrorHandler.handleError(error, 'Service Availability Check Failed');
            throw error;
        }
    }

    // Get nearby cities in service area
    getNearbyServiceCities() {
        return [
            'Santa Cruz',
            'Scotts Valley',
            'Capitola',
            'Aptos',
            'Watsonville',
            'Los Gatos',
            'Morgan Hill'
        ];
    }
}

export default new LocationService();
