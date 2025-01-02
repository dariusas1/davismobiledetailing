import axios from 'axios';

// Configure axios instance
const bookingAPI = axios.create({
  baseURL: process.env.REACT_APP_BOOKING_API_URL || 'http://localhost:5001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

const bookingTimeService = {
  async getAvailableSlots(date) {
    try {
      const response = await bookingAPI.get('/bookings/availability', {
        params: { date }
      });
      
      if (response.status !== 200) {
        throw new Error(`Booking API returned status ${response.status}`);
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching available slots:', error);
      // Return default slots if API fails
      return this.generateDefaultSlots();
    }
  },

  async validateDateTime(startDateTime) {
    try {
      const response = await bookingAPI.post('/bookings/validate', {
        startDateTime
      });
      return response.data;
    } catch (error) {
      console.error('Error validating date/time:', error);
      return {
        valid: false,
        message: error.response?.data?.message || 'Error validating time slot'
      };
    }
  },

  async reserveSlot(slotId) {
    try {
      const response = await bookingAPI.post('/bookings/reserve', {
        slotId
      });
      return response.data;
    } catch (error) {
      console.error('Error reserving slot:', error);
      throw error;
    }
  },

  generateDefaultSlots() {
    // Generate default slots every 2 hours from 8am to 6pm
    const slots = [];
    const startHour = 8;
    const endHour = 18;
    
    for (let hour = startHour; hour <= endHour; hour += 2) {
      slots.push({
        time: `${hour}:00`,
        available: true
      });
    }
    
    return slots;
  },

  async getRecommendedSlots(vehicleType, packageType) {
    try {
      const response = await bookingAPI.get('/bookings/recommendations', {
        params: {
          vehicleType,
          packageType
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting recommended slots:', error);
      return this.generateDefaultSlots();
    }
  }
};

export default bookingTimeService;
