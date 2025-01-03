'use client';

import { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { FaBell, FaUserCircle, FaCog, FaSignOutAlt, FaCheck } from 'react-icons/fa';
import { useNotifications } from '../../contexts/NotificationContext';
import { formatDistanceToNow } from 'date-fns';

export default function AdminHeader() {
  const { data: session } = useSession();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const handleNotificationClick = (id: string) => {
    markAsRead(id);
    // Add navigation logic based on notification type
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Image
            src="/logo.png"
            alt="Precision Detailing"
            width={40}
            height={40}
            className="mr-4"
          />
          <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-gray-600 hover:text-gray-900 relative"
            >
              <FaBell className="text-xl" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg py-2 border">
                <div className="px-4 py-2 border-b flex items-center justify-between">
                  <h3 className="font-semibold">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-sm text-gold hover:text-gold/80 flex items-center gap-1"
                    >
                      <FaCheck className="text-xs" />
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-3 text-gray-500 text-center">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <button
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification.id)}
                        className={`w-full px-4 py-3 hover:bg-gray-50 flex items-start gap-3 ${
                          !notification.read ? 'bg-gold/5' : ''
                        }`}
                      >
                        <div className={`p-2 rounded-full ${
                          notification.type === 'booking'
                            ? 'bg-blue-100 text-blue-600'
                            : notification.type === 'review'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          <FaBell className="text-sm" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className={`text-sm ${!notification.read ? 'font-medium' : ''}`}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDistanceToNow(notification.time, { addSuffix: true })}
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <FaUserCircle className="text-xl" />
              <span>{session?.user?.name || 'Admin'}</span>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border">
                <button
                  onClick={() => {/* Navigate to profile settings */}}
                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <FaCog className="text-gray-500" />
                  Settings
                </button>
                <button
                  onClick={() => signOut()}
                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <FaSignOutAlt className="text-gray-500" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 