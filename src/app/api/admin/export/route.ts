import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { format } from 'date-fns';
import PDFDocument from 'pdfkit';
import { Parser } from 'json2csv';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const startDate = new Date(searchParams.get('startDate') || '');
    const endDate = new Date(searchParams.get('endDate') || '');

    // Fetch data
    const [bookings, services, customers] = await Promise.all([
      // Bookings with customer and service details
      prisma.booking.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        },
        include: {
          customer: true,
          service: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),

      // Services summary
      prisma.service.findMany({
        include: {
          bookings: {
            where: {
              createdAt: {
                gte: startDate,
                lte: endDate
              }
            }
          }
        }
      }),

      // Customer summary
      prisma.customer.findMany({
        include: {
          bookings: {
            where: {
              createdAt: {
                gte: startDate,
                lte: endDate
              }
            }
          }
        }
      })
    ]);

    // Format data for export
    const formattedBookings = bookings.map(booking => ({
      'Booking ID': booking.id,
      'Customer Name': booking.customer.name,
      'Service': booking.service.name,
      'Date': format(booking.scheduledDate, 'MM/dd/yyyy'),
      'Time': booking.scheduledTime,
      'Status': booking.status,
      'Amount': booking.totalAmount,
      'Created At': format(booking.createdAt, 'MM/dd/yyyy HH:mm')
    }));

    const formattedServices = services.map(service => ({
      'Service Name': service.name,
      'Total Bookings': service.bookings.length,
      'Total Revenue': service.bookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0)
    }));

    const formattedCustomers = customers.map(customer => ({
      'Customer Name': customer.name,
      'Email': customer.email,
      'Phone': customer.phone,
      'Total Bookings': customer.bookings.length,
      'Total Spent': customer.bookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0)
    }));

    if (type === 'csv') {
      // Generate CSV
      const parser = new Parser();
      const csv = {
        bookings: parser.parse(formattedBookings),
        services: parser.parse(formattedServices),
        customers: parser.parse(formattedCustomers)
      };

      return new NextResponse(csv.bookings, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename=bookings-${format(new Date(), 'yyyy-MM-dd')}.csv`
        }
      });
    } else if (type === 'pdf') {
      // Generate PDF
      const doc = new PDFDocument();
      const chunks: Buffer[] = [];

      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => {});

      // Add content to PDF
      doc.fontSize(20).text('Precision Detailing Report', { align: 'center' });
      doc.moveDown();
      doc.fontSize(14).text(`Report Period: ${format(startDate, 'MM/dd/yyyy')} - ${format(endDate, 'MM/dd/yyyy')}`);
      doc.moveDown();

      // Bookings Summary
      doc.fontSize(16).text('Bookings Summary');
      doc.moveDown();
      const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);
      doc.fontSize(12).text(`Total Bookings: ${bookings.length}`);
      doc.fontSize(12).text(`Total Revenue: $${totalRevenue.toLocaleString()}`);
      doc.moveDown();

      // Services Summary
      doc.fontSize(16).text('Services Summary');
      doc.moveDown();
      formattedServices.forEach(service => {
        doc.fontSize(12).text(`${service['Service Name']}`);
        doc.fontSize(10)
          .text(`Bookings: ${service['Total Bookings']}`)
          .text(`Revenue: $${service['Total Revenue'].toLocaleString()}`);
        doc.moveDown();
      });

      // Top Customers
      doc.addPage();
      doc.fontSize(16).text('Top Customers');
      doc.moveDown();
      formattedCustomers
        .sort((a, b) => b['Total Spent'] - a['Total Spent'])
        .slice(0, 5)
        .forEach(customer => {
          doc.fontSize(12).text(`${customer['Customer Name']}`);
          doc.fontSize(10)
            .text(`Bookings: ${customer['Total Bookings']}`)
            .text(`Total Spent: $${customer['Total Spent'].toLocaleString()}`);
          doc.moveDown();
        });

      doc.end();

      const buffer = Buffer.concat(chunks);
      
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename=report-${format(new Date(), 'yyyy-MM-dd')}.pdf`
        }
      });
    }

    return NextResponse.json({ error: 'Invalid export type' }, { status: 400 });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to generate export' },
      { status: 500 }
    );
  }
} 