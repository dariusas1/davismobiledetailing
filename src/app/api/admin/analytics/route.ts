import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const startDate = new Date(searchParams.get('startDate') || '');
    const endDate = new Date(searchParams.get('endDate') || '');

    // Get previous period for comparison
    const periodLength = endDate.getTime() - startDate.getTime();
    const previousStartDate = new Date(startDate.getTime() - periodLength);
    const previousEndDate = new Date(endDate.getTime() - periodLength);

    // Fetch all required data in parallel
    const [
      currentRevenue,
      previousRevenue,
      currentBookings,
      previousBookings,
      services,
      customerRetention,
      averageRating,
      topCustomers,
      monthlyRevenue,
      monthlyBookings
    ] = await Promise.all([
      // Current period revenue
      prisma.booking.aggregate({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate
          },
          status: 'COMPLETED'
        },
        _sum: {
          totalAmount: true
        }
      }),

      // Previous period revenue
      prisma.booking.aggregate({
        where: {
          createdAt: {
            gte: previousStartDate,
            lte: previousEndDate
          },
          status: 'COMPLETED'
        },
        _sum: {
          totalAmount: true
        }
      }),

      // Current period bookings
      prisma.booking.count({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        }
      }),

      // Previous period bookings
      prisma.booking.count({
        where: {
          createdAt: {
            gte: previousStartDate,
            lte: previousEndDate
          }
        }
      }),

      // Services distribution
      prisma.service.findMany({
        select: {
          name: true,
          _count: {
            select: {
              bookings: {
                where: {
                  createdAt: {
                    gte: startDate,
                    lte: endDate
                  }
                }
              }
            }
          },
          bookings: {
            where: {
              createdAt: {
                gte: startDate,
                lte: endDate
              },
              status: 'COMPLETED'
            },
            select: {
              totalAmount: true
            }
          }
        }
      }),

      // Customer retention (customers with multiple bookings)
      prisma.customer.count({
        where: {
          bookings: {
            some: {
              createdAt: {
                gte: startDate,
                lte: endDate
              }
            },
            every: {
              NOT: {
                status: 'CANCELLED'
              }
            }
          }
        }
      }),

      // Average rating
      prisma.review.aggregate({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        },
        _avg: {
          rating: true
        }
      }),

      // Top customers
      prisma.customer.findMany({
        take: 5,
        where: {
          bookings: {
            some: {
              createdAt: {
                gte: startDate,
                lte: endDate
              }
            }
          }
        },
        select: {
          name: true,
          _count: {
            select: {
              bookings: true
            }
          },
          bookings: {
            where: {
              status: 'COMPLETED'
            },
            select: {
              totalAmount: true
            }
          }
        },
        orderBy: {
          bookings: {
            _count: 'desc'
          }
        }
      }),

      // Monthly revenue
      prisma.booking.groupBy({
        by: ['createdAt'],
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate
          },
          status: 'COMPLETED'
        },
        _sum: {
          totalAmount: true
        }
      }),

      // Monthly bookings
      prisma.booking.groupBy({
        by: ['createdAt'],
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        },
        _count: true
      })
    ]);

    // Calculate growth percentages
    const revenueGrowth = previousRevenue._sum.totalAmount
      ? ((currentRevenue._sum.totalAmount - previousRevenue._sum.totalAmount) / previousRevenue._sum.totalAmount) * 100
      : 0;

    const bookingsGrowth = previousBookings
      ? ((currentBookings - previousBookings) / previousBookings) * 100
      : 0;

    // Format monthly data
    const formattedMonthlyRevenue = monthlyRevenue.map(entry => ({
      date: format(entry.createdAt, 'MMM yyyy'),
      amount: entry._sum.totalAmount || 0
    }));

    const formattedMonthlyBookings = monthlyBookings.map(entry => ({
      date: format(entry.createdAt, 'MMM yyyy'),
      count: entry._count
    }));

    // Format services data
    const formattedServices = services.map(service => ({
      name: service.name,
      bookings: service._count.bookings,
      revenue: service.bookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0)
    }));

    // Format top customers data
    const formattedTopCustomers = topCustomers.map(customer => ({
      name: customer.name,
      bookings: customer._count.bookings,
      totalSpent: customer.bookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0)
    }));

    return NextResponse.json({
      revenue: {
        monthly: formattedMonthlyRevenue,
        total: currentRevenue._sum.totalAmount || 0,
        growth: revenueGrowth
      },
      bookings: {
        monthly: formattedMonthlyBookings,
        total: currentBookings,
        growth: bookingsGrowth
      },
      services: formattedServices,
      customerRetention: customerRetention,
      averageRating: averageRating._avg.rating || 0,
      topCustomers: formattedTopCustomers
    });
  } catch (error) {
    console.error('Analytics fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
} 