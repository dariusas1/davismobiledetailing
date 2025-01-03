'use client';

import { useState, useEffect } from 'react';
import {
  FaCalendarCheck,
  FaUsers,
  FaDollarSign,
  FaStar,
  FaChartLine,
  FaClock
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

interface DashboardData {
  stats: {
    totalBookings: {
      value: number;
      change: string;
      trend: 'up' | 'down';
    };
    activeCustomers: {
      value: number;
      change: string;
      trend: 'up' | 'down';
    };
    monthlyRevenue: {
      value: number;
      change: string;
      trend: 'up' | 'down';
    };
    averageRating: {
      value: number;
      change: string;
      trend: 'up' | 'down';
    };
  };
  recentBookings: {
    id: string;
    customer: string;
    service: string;
    date: string;
    time: string;
    status: string;
  }[];
  recentActivity: {
    id: string;
    type: 'booking' | 'review';
    message: string;
    time: string;
  }[];
}

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState('week');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/dashboard');
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        const dashboardData = await response.json();
        setData(dashboardData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const statIcons = {
    totalBookings: FaCalendarCheck,
    activeCustomers: FaUsers,
    monthlyRevenue: FaDollarSign,
    averageRating: FaStar
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="day">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(data.stats).map(([key, stat]) => {
          const Icon = statIcons[key as keyof typeof statIcons];
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {key === 'monthlyRevenue' ? `$${stat.value.toLocaleString()}` : 
                     key === 'averageRating' ? stat.value.toFixed(1) :
                     stat.value.toLocaleString()}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${
                  stat.trend === 'up' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <Icon className={`text-xl ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`} />
                </div>
              </div>
              <div className="mt-2">
                <span className={`text-sm ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-600"> vs last {timeRange}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
            <button className="text-gold hover:text-gold/80">View all</button>
          </div>
          <div className="space-y-4">
            {data.recentBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{booking.customer}</p>
                  <p className="text-sm text-gray-600">{booking.service}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900">{new Date(booking.date).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-600">{booking.time}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  booking.status === 'confirmed'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <button className="text-gold hover:text-gold/80">View all</button>
          </div>
          <div className="space-y-4">
            {data.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="p-2 bg-gold/10 rounded-full">
                  {activity.type === 'booking' ? (
                    <FaCalendarCheck className="text-gold" />
                  ) : (
                    <FaStar className="text-gold" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-gray-900">{activity.message}</p>
                  <p className="text-sm text-gray-600">
                    {formatDistanceToNow(new Date(activity.time), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-gold/10 rounded-lg text-center hover:bg-gold/20 transition-colors">
            <FaCalendarCheck className="text-gold text-2xl mx-auto mb-2" />
            <span className="text-sm font-medium">New Booking</span>
          </button>
          <button className="p-4 bg-gold/10 rounded-lg text-center hover:bg-gold/20 transition-colors">
            <FaUsers className="text-gold text-2xl mx-auto mb-2" />
            <span className="text-sm font-medium">Add Customer</span>
          </button>
          <button className="p-4 bg-gold/10 rounded-lg text-center hover:bg-gold/20 transition-colors">
            <FaChartLine className="text-gold text-2xl mx-auto mb-2" />
            <span className="text-sm font-medium">View Reports</span>
          </button>
          <button className="p-4 bg-gold/10 rounded-lg text-center hover:bg-gold/20 transition-colors">
            <FaClock className="text-gold text-2xl mx-auto mb-2" />
            <span className="text-sm font-medium">Manage Schedule</span>
          </button>
        </div>
      </div>
    </div>
  );
} 