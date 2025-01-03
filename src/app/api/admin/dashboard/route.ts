import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !session.user.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get current date
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Fetch all required data in parallel
    const [
      totalBookings,
      monthlyBookings,
      activeCustomers,
      monthlyRevenue,
      averageRating,
      recentBookings,
      recentActivity
    ] = await Promise.all([
      // Total bookings count
      prisma.booking.count(),
      
      // Monthly bookings count
      prisma.booking.count({
        where: {
          createdAt: {
            gte: startOfMonth,
            lte: endOfMonth
          }
        }
      }),
      
      // Active customers (customers with bookings in last 3 months)
      prisma.customer.count({
        where: {
          bookings: {
            some: {
              createdAt: {
                gte: new Date(now.setMonth(now.getMonth() - 3))
              }
            }
          }
        }
      }),
      
      // Monthly revenue
      prisma.booking.aggregate({
        where: {
          createdAt: {
            gte: startOfMonth,
            lte: endOfMonth
          },
          status: 'COMPLETED'
        },
        _sum: {
          totalAmount: true
        }
      }),
      
      // Average rating
      prisma.review.aggregate({
        _avg: {
          rating: true
        }
      }),
      
      // Recent bookings
      prisma.booking.findMany({
        take: 5,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          customer: true,
          service: true
        }
      }),
      
      // Recent activity (combine recent bookings and reviews)
      Promise.all([
        prisma.booking.findMany({
          take: 3,
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            customer: true
          }
        }),
        prisma.review.findMany({
          take: 3,
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            customer: true
          }
        })
      ])
    ]);

    // Calculate month-over-month changes
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    
    const [lastMonthBookings, lastMonthRevenue] = await Promise.all([
      prisma.booking.count({
        where: {
          createdAt: {
            gte: lastMonth,
            lte: lastMonthEnd
          }
        }
      }),
      prisma.booking.aggregate({
        where: {
          createdAt: {
            gte: lastMonth,
            lte: lastMonthEnd
          },
          status: 'COMPLETED'
        },
        _sum: {
          totalAmount: true
        }
      })
    ]);

    // Combine recent activity
    const [recentBookingsActivity, recentReviews] = recentActivity;
    const combinedActivity = [...recentBookingsActivity.map(booking => ({
      id: `booking-${booking.id}`,
      type: 'booking',
      message: `New booking request from ${booking.customer.name}`,
      time: booking.createdAt
    })), ...recentReviews.map(review => ({
      id: `review-${review.id}`,
      type: 'review',
      message: `New ${review.rating}-star review received from ${review.customer.name}`,
      time: review.createdAt
    }))].sort((a, b) => b.time.getTime() - a.time.getTime()).slice(0, 5);

    // Calculate percentage changes
    const bookingChange = lastMonthBookings ? 
      ((monthlyBookings - lastMonthBookings) / lastMonthBookings) * 100 : 0;
    
    const revenueChange = lastMonthRevenue._sum.totalAmount ?
      ((monthlyRevenue._sum.totalAmount - lastMonthRevenue._sum.totalAmount) / lastMonthRevenue._sum.totalAmount) * 100 : 0;

    return NextResponse.json({
      stats: {
        totalBookings: {
          value: totalBookings,
          change: `${bookingChange.toFixed(1)}%`,
          trend: bookingChange >= 0 ? 'up' : 'down'
        },
        activeCustomers: {
          value: activeCustomers,
          change: '+5%', // This would need its own historical calculation
          trend: 'up'
        },
        monthlyRevenue: {
          value: monthlyRevenue._sum.totalAmount || 0,
          change: `${revenueChange.toFixed(1)}%`,
          trend: revenueChange >= 0 ? 'up' : 'down'
        },
        averageRating: {
          value: averageRating._avg.rating || 0,
          change: '+0.2', // This would need its own historical calculation
          trend: 'up'
        }
      },
      recentBookings: recentBookings.map(booking => ({
        id: booking.id,
        customer: booking.customer.name,
        service: booking.service.name,
        date: booking.scheduledDate,
        time: booking.scheduledTime,
        status: booking.status.toLowerCase()
      })),
      recentActivity: combinedActivity
    });
  } catch (error) {
    console.error('Dashboard data fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
} 