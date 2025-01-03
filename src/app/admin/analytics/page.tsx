'use client';

import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { FaDownload, FaCalendar, FaChartLine } from 'react-icons/fa';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';

interface AnalyticsData {
  revenue: {
    monthly: { date: string; amount: number }[];
    total: number;
    growth: number;
  };
  bookings: {
    monthly: { date: string; count: number }[];
    total: number;
    growth: number;
  };
  services: {
    name: string;
    bookings: number;
    revenue: number;
  }[];
  customerRetention: number;
  averageRating: number;
  topCustomers: {
    name: string;
    bookings: number;
    totalSpent: number;
  }[];
}

const COLORS = ['#FFD700', '#000000', '#FFFFFF', '#808080', '#C0C0C0'];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('6months');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const endDate = new Date();
      const startDate = subMonths(startOfMonth(endDate), 
        timeRange === '6months' ? 6 : timeRange === '12months' ? 12 : 1);

      const response = await fetch(
        `/api/admin/analytics?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }

      const analyticsData = await response.json();
      setData(analyticsData);
    } catch (error) {
      console.error('Analytics fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportData = async (type: 'csv' | 'pdf') => {
    try {
      const response = await fetch(
        `/api/admin/export?type=${type}&startDate=${getStartDate()}&endDate=${new Date().toISOString()}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to export data');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `precision-detailing-report-${format(new Date(), 'yyyy-MM-dd')}.${type}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  const getStartDate = () => {
    const now = new Date();
    switch (timeRange) {
      case '6months':
        return subMonths(startOfMonth(now), 6).toISOString();
      case '12months':
        return subMonths(startOfMonth(now), 12).toISOString();
      default:
        return subMonths(startOfMonth(now), 1).toISOString();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
        <div className="flex items-center gap-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="1month">Last Month</option>
            <option value="6months">Last 6 Months</option>
            <option value="12months">Last 12 Months</option>
          </select>
          <button
            onClick={() => exportData('csv')}
            className="px-4 py-2 bg-gold text-white rounded-lg hover:bg-gold/80 flex items-center gap-2"
          >
            <FaDownload />
            Export CSV
          </button>
          <button
            onClick={() => exportData('pdf')}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-black/80 flex items-center gap-2"
          >
            <FaDownload />
            Export PDF
          </button>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Revenue Overview</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.revenue.monthly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#FFD700"
                name="Revenue"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bookings Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Bookings Overview</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.bookings.monthly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#000000" name="Bookings" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Services Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Services Distribution</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.services}
                  dataKey="bookings"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {data.services.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Key Metrics</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">${data.revenue.total.toLocaleString()}</p>
              </div>
              <span className={`text-sm ${
                data.revenue.growth >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {data.revenue.growth >= 0 ? '+' : ''}{data.revenue.growth}%
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold">{data.bookings.total}</p>
              </div>
              <span className={`text-sm ${
                data.bookings.growth >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {data.bookings.growth >= 0 ? '+' : ''}{data.bookings.growth}%
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Customer Retention</p>
                <p className="text-2xl font-bold">{data.customerRetention}%</p>
              </div>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold">{data.averageRating.toFixed(1)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Customers */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Top Customers</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b">
                <th className="pb-3">Customer</th>
                <th className="pb-3">Total Bookings</th>
                <th className="pb-3">Total Spent</th>
              </tr>
            </thead>
            <tbody>
              {data.topCustomers.map((customer, index) => (
                <tr key={index} className="border-b last:border-0">
                  <td className="py-3">{customer.name}</td>
                  <td className="py-3">{customer.bookings}</td>
                  <td className="py-3">${customer.totalSpent.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 