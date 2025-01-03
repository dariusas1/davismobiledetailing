import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getIO } from '@/lib/socket';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const booking = await prisma.booking.create({
      data: {
        ...data,
        customerId: session.user.id,
        status: 'PENDING'
      },
      include: {
        customer: true,
        service: true
      }
    });

    // Emit WebSocket event for new booking
    const io = getIO();
    io.to('admin-room').emit('new-booking', {
      id: booking.id,
      customerName: booking.customer.name,
      serviceName: booking.service.name,
      date: booking.scheduledDate,
      time: booking.scheduledTime
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Booking creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        {
          customer: {
            name: {
              contains: search,
              mode: 'insensitive'
            }
          }
        },
        {
          service: {
            name: {
              contains: search,
              mode: 'insensitive'
            }
          }
        }
      ];
    }

    if (startDate && endDate) {
      where.scheduledDate = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          customer: true,
          service: true
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.booking.count({ where })
    ]);

    return NextResponse.json({
      bookings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Bookings fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const booking = await prisma.booking.update({
      where: { id: data.id },
      data: {
        status: data.status,
        notes: data.notes
      },
      include: {
        customer: true,
        service: true
      }
    });

    // Emit WebSocket event for booking update
    const io = getIO();
    io.to('admin-room').emit('booking-updated', {
      id: booking.id,
      customerName: booking.customer.name,
      serviceName: booking.service.name,
      status: booking.status
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Booking update error:', error);
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    );
  }
} 