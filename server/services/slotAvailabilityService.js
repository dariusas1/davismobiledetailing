import Booking from '../models/Booking.js';
import { DateTime } from 'luxon';

class SlotAvailabilityService {
  constructor() {
    this.initialize();
  }

  initialize() {
    // Any initialization logic if needed
  }

  async getAvailableSlots(date) {
    try {
      const startDate = DateTime.fromISO(date).startOf('day');
      const endDate = startDate.endOf('day');

      const bookings = await Booking.find({
        startDateTime: {
          $gte: startDate.toJSDate(),
          $lte: endDate.toJSDate()
        }
      }).select('startDateTime duration');

      return this.generateTimeSlots(startDate, bookings);
    } catch (error) {
      console.error('Error getting available slots:', error);
      throw error;
    }
  }

  generateTimeSlots(startDate, bookings) {
    const slots = [];
    const startHour = 8; // 8 AM
    const endHour = 18; // 6 PM
    const slotDuration = 60; // 60 minutes

    for (let hour = startHour; hour < endHour; hour++) {
      const slotStart = startDate.set({ hour, minute: 0 });
      const slotEnd = slotStart.plus({ minutes: slotDuration });

      // Check if slot is available
      const isBooked = bookings.some(booking => {
        const bookingStart = DateTime.fromJSDate(booking.startDateTime);
        const bookingEnd = bookingStart.plus({ minutes: booking.duration });
        return slotStart < bookingEnd && slotEnd > bookingStart;
      });

      if (!isBooked) {
        slots.push({
          start: slotStart.toISO(),
          end: slotEnd.toISO(),
          available: true
        });
      }
    }

    return slots;
  }

  async getRealTimeAvailability() {
    try {
      const date = new Date().toISOString().split('T')[0];
      return await this.getAvailableSlots(date);
    } catch (error) {
      console.error('Error getting real-time availability:', error);
      return [];
    }
  }
}

const slotAvailabilityService = new SlotAvailabilityService();
export default slotAvailabilityService; 