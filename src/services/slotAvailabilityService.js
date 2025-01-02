const { getAvailableSlots } = require('./bookingService');
const socket = require('./socketService');

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

  subscribeToAvailabilityUpdates(callback) {
    return this.socket.on('slotAvailability', callback);
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

module.exports = new SlotAvailabilityService();
