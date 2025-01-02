import React, { createContext, useContext, useReducer, useEffect } from 'react';

const BookingContext = createContext();

const initialState = {
    selectedService: null,
    vehicle: null,
    date: null,
    time: null,
    addOns: [],
    availableAddOns: [],
    promotion: null,
    useLoyaltyPoints: false,
    loyaltyPoints: 0,
    paymentMethod: null,
    loading: false,
    error: null,
    step: 0,
    progress: 0,
    bookingData: null
};

const bookingReducer = (state, action) => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload };
        case 'UPDATE_BOOKING_DATA':
            return { ...state, ...action.payload };
        case 'SET_STEP':
            return { ...state, step: action.payload };
        case 'SET_PROGRESS':
            return { ...state, progress: action.payload };
        case 'RESET_BOOKING':
            return initialState;
        case 'SET_AVAILABLE_ADDONS':
            return { ...state, availableAddOns: action.payload };
        case 'SET_LOYALTY_POINTS':
            return { ...state, loyaltyPoints: action.payload };
        case 'COMPLETE_BOOKING':
            return {
                ...state,
                bookingData: action.payload,
                step: state.step + 1
            };
        default:
            return state;
    }
};

export const BookingProvider = ({ children }) => {
    const [state, dispatch] = useReducer(bookingReducer, initialState);

    // Load saved progress from localStorage
    useEffect(() => {
        const savedProgress = localStorage.getItem('bookingProgress');
        if (savedProgress) {
            try {
                const parsedProgress = JSON.parse(savedProgress);
                dispatch({ type: 'UPDATE_BOOKING_DATA', payload: parsedProgress });
            } catch (error) {
                console.error('Error loading saved progress:', error);
            }
        }
    }, []);

    // Save progress to localStorage when state changes
    useEffect(() => {
        if (state.step > 0) {
            localStorage.setItem('bookingProgress', JSON.stringify({
                selectedService: state.selectedService,
                vehicle: state.vehicle,
                date: state.date,
                time: state.time,
                addOns: state.addOns,
                step: state.step,
                progress: state.progress
            }));
        }
    }, [state]);

    const updateBookingData = (data) => {
        dispatch({ type: 'UPDATE_BOOKING_DATA', payload: data });
        calculateProgress(data);
    };

    const calculateProgress = (data) => {
        let progress = 0;
        if (data.selectedService) progress += 25;
        if (data.vehicle) progress += 25;
        if (data.date && data.time) progress += 25;
        if (data.paymentMethod) progress += 25;
        dispatch({ type: 'SET_PROGRESS', payload: progress });
    };

    const calculateTotal = () => {
        let total = state.selectedService?.price || 0;

        // Add add-ons
        if (state.addOns?.length > 0) {
            total += state.addOns.reduce((sum, addOnId) => {
                const addOn = state.availableAddOns?.find(a => a._id === addOnId);
                return sum + (addOn?.price || 0);
            }, 0);
        }

        // Apply promotion discount
        if (state.promotion) {
            const discount = state.promotion.type === 'percentage'
                ? total * (state.promotion.value / 100)
                : state.promotion.value;
            total -= discount;
        }

        // Apply loyalty points discount
        if (state.useLoyaltyPoints) {
            const pointsDiscount = Math.min(
                state.loyaltyPoints * 0.01, // $0.01 per point
                total * 0.2 // Max 20% discount
            );
            total -= pointsDiscount;
        }

        return total;
    };

    const resetBooking = () => {
        dispatch({ type: 'RESET_BOOKING' });
        localStorage.removeItem('bookingProgress');
    };

    const completeBooking = async () => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            // Process payment with Square
            const paymentResult = await processPayment();

            // Create booking in database
            const bookingResponse = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...state,
                    paymentResult,
                    total: calculateTotal()
                })
            });

            if (!bookingResponse.ok) throw new Error('Failed to create booking');

            const bookingData = await bookingResponse.json();

            // Send confirmation email
            await sendConfirmationEmail(bookingData);

            // Update loyalty points
            await updateLoyaltyPoints(calculateTotal());

            dispatch({ type: 'COMPLETE_BOOKING', payload: bookingData });
            resetBooking();
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const processPayment = async () => {
        if (!state.paymentMethod?.token) {
            throw new Error('No payment method selected');
        }

        const response = await fetch('/api/payments/process', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sourceId: state.paymentMethod.token.token,
                amount: calculateTotal(),
                currency: 'USD'
            })
        });

        if (!response.ok) {
            throw new Error('Payment processing failed');
        }

        return await response.json();
    };

    const sendConfirmationEmail = async (bookingData) => {
        await fetch('/api/notifications/email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'booking_confirmation',
                bookingData
            })
        });
    };

    const updateLoyaltyPoints = async (amount) => {
        await fetch('/api/loyalty/points', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                points: Math.floor(amount), // 1 point per dollar
                type: 'earn'
            })
        });
    };

    const value = {
        ...state,
        updateBookingData,
        calculateTotal,
        resetBooking,
        completeBooking
    };

    return (
        <BookingContext.Provider value={value}>
            {children}
        </BookingContext.Provider>
    );
};

export const useBooking = () => {
    const context = useContext(BookingContext);
    if (!context) {
        throw new Error('useBooking must be used within a BookingProvider');
    }
    return context;
};

export default BookingContext; 