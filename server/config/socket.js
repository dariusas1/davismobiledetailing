import { Server } from 'socket.io';
import redis from './redis.js';

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Join admin room if authenticated as admin
    socket.on('join:admin', async (token) => {
      try {
        // Verify admin token here
        socket.join('admin');
        console.log('Admin joined:', socket.id);
      } catch (error) {
        console.error('Admin join error:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  // Subscribe to Redis events for real-time updates
  const subscriber = redis.duplicate();
  subscriber.subscribe('booking:new', 'booking:update', 'review:new', (err) => {
    if (err) {
      console.error('Redis subscription error:', err);
      return;
    }
    console.log('Subscribed to Redis channels');
  });

  subscriber.on('message', (channel, message) => {
    const data = JSON.parse(message);
    switch (channel) {
      case 'booking:new':
        io.to('admin').emit('booking:new', data);
        break;
      case 'booking:update':
        io.to('admin').emit('booking:update', data);
        break;
      case 'review:new':
        io.to('admin').emit('review:new', data);
        break;
    }
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

export const emitEvent = (event, data) => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  io.to('admin').emit(event, data);
}; 