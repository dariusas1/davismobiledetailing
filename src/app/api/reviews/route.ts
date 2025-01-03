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

    const review = await prisma.review.create({
      data: {
        ...data,
        customerId: session.user.id
      },
      include: {
        customer: true,
        booking: {
          include: {
            service: true
          }
        }
      }
    });

    // Emit WebSocket event for new review
    const io = getIO();
    io.to('admin-room').emit('new-review', {
      id: review.id,
      customerName: review.customer.name,
      rating: review.rating,
      serviceName: review.booking.service.name
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error('Review creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const rating = searchParams.get('rating');
    const search = searchParams.get('search');

    const where: any = {};

    if (rating) {
      where.rating = parseInt(rating);
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
          comment: {
            contains: search,
            mode: 'insensitive'
          }
        }
      ];
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          customer: true,
          booking: {
            include: {
              service: true
            }
          }
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.review.count({ where })
    ]);

    return NextResponse.json({
      reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Reviews fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
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

    const review = await prisma.review.update({
      where: { id: data.id },
      data: {
        featured: data.featured,
        response: data.response
      },
      include: {
        customer: true,
        booking: {
          include: {
            service: true
          }
        }
      }
    });

    // Emit WebSocket event for review update
    const io = getIO();
    io.to('admin-room').emit('review-updated', {
      id: review.id,
      customerName: review.customer.name,
      rating: review.rating,
      featured: review.featured
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error('Review update error:', error);
    return NextResponse.json(
      { error: 'Failed to update review' },
      { status: 500 }
    );
  }
} 