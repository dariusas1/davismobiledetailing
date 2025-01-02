import React from 'react';
import {
    Box,
    Typography,
    Divider,
    Chip,
    useTheme,
    alpha
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    DirectionsCar,
    CalendarMonth,
    AccessTime,
    LocalOffer,
    Add
} from '@mui/icons-material';
import { format } from 'date-fns';

const SummaryRow = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: theme.spacing(1.5, 0),
    gap: theme.spacing(2)
}));

const SummaryLabel = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.secondary,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1)
}));

const SummaryValue = styled(Typography)({
    textAlign: 'right'
});

const BookingSummary = ({ data }) => {
    const theme = useTheme();

    if (!data.selectedService) {
        return (
            <Box>
                <Typography color="text.secondary" align="center">
                    Select a service to see booking details
                </Typography>
            </Box>
        );
    }

    const calculateTotal = () => {
        let total = data.selectedService.price;

        // Add add-ons
        if (data.addOns?.length > 0) {
            total += data.addOns.reduce((sum, addOnId) => {
                const addOn = data.availableAddOns?.find(a => a._id === addOnId);
                return sum + (addOn?.price || 0);
            }, 0);
        }

        // Apply promotion discount
        if (data.promotion) {
            const discount = data.promotion.type === 'percentage'
                ? total * (data.promotion.value / 100)
                : data.promotion.value;
            total -= discount;
        }

        // Apply loyalty points discount
        if (data.useLoyaltyPoints) {
            const pointsDiscount = Math.min(
                data.loyaltyPoints * 0.01, // $0.01 per point
                total * 0.2 // Max 20% discount
            );
            total -= pointsDiscount;
        }

        return total;
    };

    return (
        <Box>
            {/* Service Details */}
            <SummaryRow>
                <SummaryLabel>
                    <LocalOffer />
                    Service
                </SummaryLabel>
                <Box>
                    <SummaryValue variant="subtitle2">
                        {data.selectedService.name}
                    </SummaryValue>
                    <Typography variant="body2" color="primary">
                        ${data.selectedService.price}
                    </Typography>
                </Box>
            </SummaryRow>

            {/* Vehicle Details */}
            {data.vehicle && (
                <SummaryRow>
                    <SummaryLabel>
                        <DirectionsCar />
                        Vehicle
                    </SummaryLabel>
                    <Box>
                        <SummaryValue variant="subtitle2">
                            {data.vehicle.year} {data.vehicle.make}
                        </SummaryValue>
                        <Typography variant="body2" color="text.secondary">
                            {data.vehicle.model}
                        </Typography>
                    </Box>
                </SummaryRow>
            )}

            {/* Date & Time */}
            {data.date && data.time && (
                <>
                    <SummaryRow>
                        <SummaryLabel>
                            <CalendarMonth />
                            Date
                        </SummaryLabel>
                        <SummaryValue>
                            {format(data.date, 'MMMM d, yyyy')}
                        </SummaryValue>
                    </SummaryRow>
                    <SummaryRow>
                        <SummaryLabel>
                            <AccessTime />
                            Time
                        </SummaryLabel>
                        <SummaryValue>
                            {data.time}
                        </SummaryValue>
                    </SummaryRow>
                </>
            )}

            {/* Add-ons */}
            {data.addOns?.length > 0 && (
                <Box mt={2}>
                    <Typography variant="subtitle2" gutterBottom>
                        Selected Add-ons:
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                        {data.addOns.map((addOnId) => {
                            const addOn = data.availableAddOns?.find(a => a._id === addOnId);
                            return (
                                <Chip
                                    key={addOnId}
                                    label={`${addOn?.name} (+$${addOn?.price})`}
                                    size="small"
                                    icon={<Add />}
                                />
                            );
                        })}
                    </Box>
                </Box>
            )}

            <Divider sx={{ my: 2 }} />

            {/* Discounts */}
            {(data.promotion || data.useLoyaltyPoints) && (
                <>
                    {data.promotion && (
                        <SummaryRow>
                            <SummaryLabel>
                                Promo Discount
                            </SummaryLabel>
                            <Typography color="error">
                                -{data.promotion.type === 'percentage'
                                    ? `${data.promotion.value}%`
                                    : `$${data.promotion.value}`}
                            </Typography>
                        </SummaryRow>
                    )}
                    {data.useLoyaltyPoints && (
                        <SummaryRow>
                            <SummaryLabel>
                                Loyalty Discount
                            </SummaryLabel>
                            <Typography color="error">
                                Up to 20% off
                            </Typography>
                        </SummaryRow>
                    )}
                    <Divider sx={{ my: 2 }} />
                </>
            )}

            {/* Total */}
            <SummaryRow>
                <Typography variant="h6">
                    Total
                </Typography>
                <Typography variant="h6" color="primary">
                    ${calculateTotal()}
                </Typography>
            </SummaryRow>

            {/* Duration */}
            <Box
                mt={2}
                p={2}
                bgcolor={alpha(theme.palette.info.main, 0.1)}
                borderRadius={theme.shape.borderRadius}
            >
                <Typography variant="body2" align="center">
                    Estimated Duration: {data.selectedService.duration} minutes
                    {data.addOns?.length > 0 && (
                        ` + ${data.addOns.reduce((total, addOnId) => {
                            const addOn = data.availableAddOns?.find(a => a._id === addOnId);
                            return total + (addOn?.duration || 0);
                        }, 0)} minutes for add-ons`
                    )}
                </Typography>
            </Box>
        </Box>
    );
};

export default BookingSummary; 