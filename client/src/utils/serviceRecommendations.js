/* eslint-disable no-unused-vars */
import { SERVICES, VEHICLE_TYPES, ADDITIONAL_SERVICES } from './pricingUtils';

class ServiceRecommendationEngine {
    constructor() {
        this.recommendationRules = [
            {
                condition: (vehicleType, lastService) => 
                    vehicleType === 'SUV' && (!lastService || lastService.timeSinceLastService > 6),
                recommendation: {
                    service: 'Premium Detailing',
                    reason: 'Large vehicles require more thorough cleaning every 6 months'
                }
            },
            {
                condition: (vehicleType, lastService) => 
                    vehicleType === 'Truck' && (!lastService || lastService.timeSinceLastService > 4),
                recommendation: {
                    service: 'Premium Detailing',
                    additionalServices: ['Engine Bay Cleaning'],
                    reason: 'Heavy-duty vehicles need comprehensive maintenance'
                }
            },
            {
                condition: (vehicleType, lastService) => 
                    vehicleType === 'Sedan' && (!lastService || lastService.timeSinceLastService > 3),
                recommendation: {
                    service: 'Basic Wash',
                    additionalServices: ['Headlight Restoration'],
                    reason: 'Regular maintenance keeps your sedan looking fresh'
                }
            }
        ];

        this.seasonalRecommendations = [
            {
                season: 'winter',
                recommendation: {
                    additionalServices: ['Ceramic Coating'],
                    reason: 'Protect your vehicle from winter road salt and harsh conditions'
                }
            },
            {
                season: 'summer',
                recommendation: {
                    additionalServices: ['Interior Deep Clean'],
                    reason: 'Combat summer dust and keep your interior fresh'
                }
            }
        ];
    }

    determineRecommendations(customerData) {
        const { 
            vehicleType, 
            lastService, 
            season, 
            location 
        } = customerData;

        let recommendations = [];

        // Vehicle-specific recommendations
        const vehicleRecommendation = this.recommendationRules.find(rule => 
            rule.condition(vehicleType, lastService)
        );

        if (vehicleRecommendation) {
            recommendations.push({
                type: 'Vehicle-Specific',
                ...vehicleRecommendation.recommendation
            });
        }

        // Seasonal recommendations
        const seasonalRec = this.seasonalRecommendations.find(rec => 
            rec.season === season
        );

        if (seasonalRec) {
            recommendations.push({
                type: 'Seasonal',
                ...seasonalRec.recommendation
            });
        }

        // Location-based recommendations (placeholder for future enhancement)
        if (location && location.climate === 'coastal') {
            recommendations.push({
                type: 'Location-Based',
                additionalServices: ['Ceramic Coating'],
                reason: 'Protect against salt and moisture in coastal areas'
            });
        }

        return recommendations;
    }

    generatePersonalizedPackage(recommendations) {
        const baseService = recommendations.find(rec => rec.service)?.service || 'Basic Wash';
        const additionalServices = recommendations.flatMap(rec => rec.additionalServices || []);

        return {
            baseService: SERVICES.find(s => s.name === baseService),
            additionalServices: additionalServices.map(serviceName => 
                ADDITIONAL_SERVICES.find(s => s.name === serviceName)
            ),
            totalPrice: this.calculateTotalPrice(baseService, additionalServices)
        };
    }

    calculateTotalPrice(baseServiceName, additionalServiceNames) {
        const baseService = SERVICES.find(s => s.name === baseServiceName);
        const additionalServices = additionalServiceNames.map(name => 
            ADDITIONAL_SERVICES.find(s => s.name === name)
        );

        const basePrice = baseService ? baseService.basePrice : 50;
        const additionalServicesCost = additionalServices.reduce((total, service) => 
            total + (service ? service.price : 0), 0
        );

        return basePrice + additionalServicesCost;
    }
}

export const serviceRecommendationEngine = new ServiceRecommendationEngine();
