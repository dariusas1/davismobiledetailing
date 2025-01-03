import { getAvailableSlots } from './bookingService.js';
import socket from './socketService.js';

class SlotAvailabilityService {
  constructor() {
    this.socket = socket;
    this.initialize();
  }

  initialize() {
    // Set up periodic availability updates
    setInterval(() => this.broadcastAvailability(), 30000);
  }

  async broadcastAvailability() {
    try {
      const date = new Date().toISOString().split('T')[0];
      const slots = await getAvailableSlots(date);
      this.socket.emit('slotAvailability', slots);
    } catch (error) {
      console.error('Error broadcasting availability:', error);
    }
  }

  async getRealTimeAvailability() {
    try {
      const date = new Date().toISOString().split('T')[0];
      return await getAvailableSlots(date);
    } catch (error) {
      console.error('Error getting real-time availability:', error);
      return [];
    }
  }
}

const slotAvailabilityService = new SlotAvailabilityService();
export default slotAvailabilityService;
