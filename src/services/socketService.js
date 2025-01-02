import io from 'socket.io-client';
import AuthService from './authService';

class SocketService {
    constructor() {
        this.socket = null;
    }

    connect() {
        // Connect to socket server
        this.socket = io('http://localhost:5000', {
            auth: {
                token: AuthService.getToken()
            }
        });

        // Connection handlers
        this.socket.on('connect', () => {
            console.log('Socket connected');
        });

        this.socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });

        this.socket.on('disconnect', () => {
            console.log('Socket disconnected');
        });
    }

    // Get dashboard stats
    getDashboardStats(callback) {
        if (!this.socket) {
            this.connect();
        }

        this.socket.emit('getDashboardStats');
        this.socket.on('dashboardStats', callback);
    }

    // Disconnect socket
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }
}

export default new SocketService();
