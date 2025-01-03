import { ValidationError, NotFoundError } from '../middleware/errorHandler.js';
import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import User from '../models/User.js';
import Review from '../models/Review.js';
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { cacheMiddleware } from '../config/redis.js';
import { Parser } from 'json2csv';
import PDFDocument from 'pdfkit';

// Helper function to fetch dashboard data
const fetchDashboardData = async (startDate, endDate, previousStartDate, previousEndDate) => {
  const [
    currentRevenue,
    previousRevenue,
    currentBookings,
    previousBookings,
    services,
    customerRetention,
    averageRating,
    topCustomers
  ] = await Promise.all([
    // Current month revenue
    Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          status: 'COMPLETED'
        }
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$totalAmount' }
        }
      }
    ]),

    // Previous month revenue
    Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: previousStartDate, $lte: previousEndDate },
          status: 'COMPLETED'
        }
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$totalAmount' }
        }
      }
    ]),

    // Current month bookings
    Booking.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate }
    }),

    // Previous month bookings
    Booking.countDocuments({
      createdAt: { $gte: previousStartDate, $lte: previousEndDate }
    }),

    // Services summary
    Service.aggregate([
      {
        $lookup: {
          from: 'bookings',
          localField: '_id',
          foreignField: 'serviceId',
          as: 'bookings'
        }
      },
      {
        $project: {
          name: 1,
          bookings: {
            $filter: {
              input: '$bookings',
              as: 'booking',
              cond: {
                $and: [
                  { $gte: ['$$booking.createdAt', startDate] },
                  { $lte: ['$$booking.createdAt', endDate] }
                ]
              }
            }
          }
        }
      }
    ]),

    // Customer retention
    User.countDocuments({
      'bookings.createdAt': { $gte: previousStartDate }
    }),

    // Average rating
    Review.aggregate([
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' }
        }
      }
    ]),

    // Top customers
    User.aggregate([
      {
        $lookup: {
          from: 'bookings',
          localField: '_id',
          foreignField: 'userId',
          as: 'bookings'
        }
      },
      {
        $match: {
          'bookings.status': 'COMPLETED'
        }
      },
      {
        $project: {
          name: 1,
          email: 1,
          bookings: {
            $filter: {
              input: '$bookings',
              as: 'booking',
              cond: { $eq: ['$$booking.status', 'COMPLETED'] }
            }
          }
        }
      },
      {
        $sort: { 'bookings': -1 }
      },
      {
        $limit: 5
      }
    ])
  ]);

  // Calculate metrics
  const currentRevenueAmount = currentRevenue[0]?.totalAmount || 0;
  const previousRevenueAmount = previousRevenue[0]?.totalAmount || 0;

  const revenueGrowth = previousRevenueAmount
    ? ((currentRevenueAmount - previousRevenueAmount) / previousRevenueAmount) * 100
    : 0;

  const bookingsGrowth = previousBookings
    ? ((currentBookings - previousBookings) / previousBookings) * 100
    : 0;

  // Format service data
  const serviceStats = services.map(service => ({
    name: service.name,
    bookings: service.bookings.length,
    revenue: service.bookings.reduce((sum, booking) => sum + booking.totalAmount, 0)
  }));

  // Format customer data
  const customerStats = topCustomers.map(customer => ({
    name: customer.name,
    email: customer.email,
    totalBookings: customer.bookings.length,
    totalSpent: customer.bookings.reduce((sum, booking) => sum + booking.totalAmount, 0)
  }));

  return {
    revenue: {
      current: currentRevenueAmount,
      previous: previousRevenueAmount,
      growth: revenueGrowth
    },
    bookings: {
      current: currentBookings,
      previous: previousBookings,
      growth: bookingsGrowth
    },
    services: serviceStats,
    customers: {
      retention: customerRetention,
      topCustomers: customerStats
    },
    ratings: {
      average: averageRating[0]?.averageRating || 0
    }
  };
};

export const getDashboardStats = async (req, res, next) => {
  try {
    const now = new Date();
    const startDate = startOfMonth(now);
    const endDate = endOfMonth(now);
    const previousStartDate = startOfMonth(subMonths(now, 1));
    const previousEndDate = endOfMonth(subMonths(now, 1));

    // Use cache middleware
    const cacheKey = `dashboard:${startDate.toISOString()}:${endDate.toISOString()}`;
    const data = await cacheMiddleware(
      cacheKey,
      () => fetchDashboardData(startDate, endDate, previousStartDate, previousEndDate),
      300 // Cache for 5 minutes
    );

    res.json(data);
  } catch (error) {
    next(error);
  }
};

// Export dashboard data as CSV
export const exportDashboardCSV = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const data = await fetchDashboardData(
      new Date(startDate),
      new Date(endDate),
      new Date(startDate),
      new Date(endDate)
    );

    const fields = [
      { label: 'Current Revenue', value: 'revenue.current' },
      { label: 'Revenue Growth', value: 'revenue.growth' },
      { label: 'Current Bookings', value: 'bookings.current' },
      { label: 'Bookings Growth', value: 'bookings.growth' },
      { label: 'Customer Retention', value: 'customers.retention' },
      { label: 'Average Rating', value: 'ratings.average' }
    ];

    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(data);

    res.header('Content-Type', 'text/csv');
    res.attachment(`dashboard-report-${startDate}-${endDate}.csv`);
    res.send(csv);
  } catch (error) {
    next(error);
  }
};

// Export dashboard data as PDF
export const exportDashboardPDF = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const data = await fetchDashboardData(
      new Date(startDate),
      new Date(endDate),
      new Date(startDate),
      new Date(endDate)
    );

    const doc = new PDFDocument();
    res.header('Content-Type', 'application/pdf');
    res.attachment(`dashboard-report-${startDate}-${endDate}.pdf`);
    doc.pipe(res);

    // Add content to PDF
    doc.fontSize(20).text('Dashboard Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Period: ${startDate} to ${endDate}`);
    doc.moveDown();

    // Revenue section
    doc.fontSize(16).text('Revenue');
    doc.fontSize(12).text(`Current Revenue: $${data.revenue.current}`);
    doc.text(`Growth: ${data.revenue.growth.toFixed(2)}%`);
    doc.moveDown();

    // Bookings section
    doc.fontSize(16).text('Bookings');
    doc.fontSize(12).text(`Current Bookings: ${data.bookings.current}`);
    doc.text(`Growth: ${data.bookings.growth.toFixed(2)}%`);
    doc.moveDown();

    // Services section
    doc.fontSize(16).text('Services');
    data.services.forEach(service => {
      doc.fontSize(12).text(`${service.name}: ${service.bookings} bookings ($${service.revenue})`);
    });
    doc.moveDown();

    // Customers section
    doc.fontSize(16).text('Top Customers');
    data.customers.topCustomers.forEach(customer => {
      doc.fontSize(12).text(`${customer.name}: ${customer.totalBookings} bookings ($${customer.totalSpent})`);
    });

    doc.end();
  } catch (error) {
    next(error);
  }
};
