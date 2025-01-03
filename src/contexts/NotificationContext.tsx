import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';

interface Notification {
  id: string;
  type: 'booking' | 'review' | 'system';
  message: string;
  time: Date;
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      const socketInstance = io(process.env.NEXT_PUBLIC_APP_URL!, {
        path: '/api/socket',
      });

      socketInstance.on('connect', () => {
        console.log('Connected to WebSocket');
        socketInstance.emit('join-admin', session.user.id);
      });

      socketInstance.on('new-booking', (booking) => {
        const notification: Notification = {
          id: `booking-${booking.id}`,
          type: 'booking',
          message: `New booking request from ${booking.customerName}`,
          time: new Date(),
          read: false,
        };
        addNotification(notification);
      });

      socketInstance.on('new-review', (review) => {
        const notification: Notification = {
          id: `review-${review.id}`,
          type: 'review',
          message: `New ${review.rating}-star review from ${review.customerName}`,
          time: new Date(),
          read: false,
        };
        addNotification(notification);
      });

      setSocket(socketInstance);

      return () => {
        socketInstance.disconnect();
      };
    }
  }, [session]);

  const addNotification = (notification: Notification) => {
    setNotifications((prev) => [notification, ...prev]);
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">
                {notification.message}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Just now
              </p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gold hover:text-gold/80 focus:outline-none"
          >
            Close
          </button>
        </div>
      </div>
    ));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, read: true }))
    );
  };

  const clearNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notif) => notif.id !== id)
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        clearNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
} 