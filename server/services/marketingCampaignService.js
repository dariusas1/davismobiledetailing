/* eslint-disable no-unused-vars */
const User = require('../models/User');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const moment = require('moment');

class MarketingCampaignService {
    // Generate Personalized Marketing Campaigns
    async generatePersonalizedCampaigns(userId) {
        try {
            const user = await User.findById(userId);
            const pastBookings = await Booking.find({ user: userId })
                .sort({ bookingDate: -1 })
                .limit(10);

            // Analyze user behavior
            const behaviorAnalysis = await this.analyzeUserBehavior(pastBookings);
            const seasonalRecommendations = await this.generateSeasonalRecommendations(user);
            const loyaltyBasedOffers = this.createLoyaltyBasedOffers(user);

            return {
                behaviorBasedCampaigns: behaviorAnalysis.campaigns,
                seasonalCampaigns: seasonalRecommendations,
                loyaltyCampaigns: loyaltyBasedOffers
            };
        } catch (error) {
            throw new Error(`Campaign generation failed: ${error.message}`);
        }
    }

    // Behavior-Based Campaign Generation
    async analyzeUserBehavior(pastBookings) {
        const serviceFrequency = {};
        const vehicleTypes = {};
        const seasonalBookings = {};

        pastBookings.forEach(booking => {
            // Service frequency analysis
            serviceFrequency[booking.service.name] = 
                (serviceFrequency[booking.service.name] || 0) + 1;
            
            // Vehicle type analysis
            vehicleTypes[booking.vehicle.type] = 
                (vehicleTypes[booking.vehicle.type] || 0) + 1;
            
            // Seasonal booking analysis
            const bookingMonth = moment(booking.bookingDate).month();
            seasonalBookings[bookingMonth] = 
                (seasonalBookings[bookingMonth] || 0) + 1;
        });

        // Find most frequent service and vehicle type
        const mostFrequentService = Object.keys(serviceFrequency)
            .reduce((a, b) => serviceFrequency[a] > serviceFrequency[b] ? a : b);

        const mostCommonVehicleType = Object.keys(vehicleTypes)
            .reduce((a, b) => vehicleTypes[a] > vehicleTypes[b] ? a : b);

        // Generate targeted campaigns
        const campaigns = [
            {
                type: 'ServiceSpecific',
                title: `Special Offer: ${mostFrequentService} Package`,
                description: `Enjoy an exclusive discount on your favorite ${mostFrequentService} service!`,
                discount: 15
            },
            {
                type: 'VehicleTypeFocus',
                title: `${mostCommonVehicleType} Detailing Promotion`,
                description: `Tailored detailing solutions for ${mostCommonVehicleType} vehicles.`,
                discount: 10
            }
        ];

        return { campaigns };
    }

    // Seasonal Recommendations
    async generateSeasonalRecommendations(user) {
        const currentMonth = moment().month();
        const seasonalServices = {
            winter: ['Winter Protection Wash', 'Salt Removal Detail'],
            spring: ['Spring Cleaning Package', 'Paint Restoration'],
            summer: ['UV Protection Coating', 'Ceramic Coating'],
            autumn: ['Autumn Prep Detail', 'Paint Sealant']
        };

        const seasonMapping = {
            0: 'winter', 1: 'winter', 2: 'winter',
            3: 'spring', 4: 'spring', 5: 'spring',
            6: 'summer', 7: 'summer', 8: 'summer',
            9: 'autumn', 10: 'autumn', 11: 'autumn'
        };

        const currentSeason = seasonMapping[currentMonth];
        const recommendedServices = seasonalServices[currentSeason];

        // Find services matching seasonal recommendations
        const seasonalCampaigns = await Service.find({
            name: { $in: recommendedServices }
        });

        return seasonalCampaigns.map(service => ({
            type: 'Seasonal',
            title: `${service.name} - Seasonal Special`,
            description: `Perfect for ${currentSeason} car care!`,
            discount: 20,
            service: service
        }));
    }

    // Loyalty-Based Offers
    createLoyaltyBasedOffers(user) {
        const loyaltyTierOffers = {
            'Bronze': [
                {
                    title: 'Welcome Offer',
                    description: 'First-time discount to kickstart your loyalty',
                    discount: 10
                }
            ],
            'Silver': [
                {
                    title: 'Silver Member Perk',
                    description: 'Exclusive discount for our growing members',
                    discount: 15
                }
            ],
            'Gold': [
                {
                    title: 'Gold Tier Celebration',
                    description: 'Premium benefits for our valued customers',
                    discount: 20,
                    freeAddOn: 'Interior Deep Clean'
                }
            ],
            'Platinum': [
                {
                    title: 'Platinum Elite Experience',
                    description: 'Top-tier rewards for our most loyal customers',
                    discount: 25,
                    freeAddOn: 'Full Ceramic Coating',
                    complimentaryService: 'Annual Detailing Package'
                }
            ]
        };

        return loyaltyTierOffers[user.loyaltyTier] || [];
    }

    // Targeted Re-engagement Campaigns
    async generateReEngagementCampaigns(userId) {
        const user = await User.findById(userId);
        const lastBooking = await Booking.findOne({ user: userId })
            .sort({ bookingDate: -1 });

        const daysSinceLastBooking = moment().diff(moment(lastBooking.bookingDate), 'days');

        if (daysSinceLastBooking > 90) {
            return {
                type: 'ReEngagement',
                title: 'We Miss You!',
                description: 'Come back and enjoy a special comeback offer',
                discount: 25,
                eligibilityCriteria: `No booking in the last ${daysSinceLastBooking} days`
            };
        }

        return null;
    }
}

module.exports = new MarketingCampaignService();
