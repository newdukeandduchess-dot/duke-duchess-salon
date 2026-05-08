import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Invoice from '@/models/Invoice';
import '@/models/Customer'; // Ensure models are registered
import '@/models/Staff';

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const customerPhone = searchParams.get('customerPhone');
    const staffCode = searchParams.get('staffCode');
    const paymentMethod = searchParams.get('paymentMethod');

    let query: any = {};

    // Date Filter
    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) {
        const toDate = new Date(to);
        toDate.setHours(23, 59, 59, 999);
        query.createdAt.$lte = toDate;
      }
    }

    // Payment Method Filter
    if (paymentMethod && paymentMethod !== 'all') {
      query.paymentMethod = paymentMethod.toLowerCase();
    }

    // Staff Filter (nested in items)
    if (staffCode) {
      query['items.staffCode'] = staffCode;
    }

    // Fetch invoices with population
    const invoices = await Invoice.find(query)
      .populate('customer', 'name phone')
      .sort({ createdAt: -1 });

    // Filter by customer phone manually if needed (or use populate match if preferred)
    let filteredInvoices = invoices;
    if (customerPhone) {
      filteredInvoices = invoices.filter(inv => 
        (inv.customer as any)?.phone?.includes(customerPhone)
      );
    }

    // Aggregations
    const totalRevenue = filteredInvoices.reduce((sum, inv) => sum + inv.total, 0);
    const totalInvoices = filteredInvoices.length;
    const totalTax = filteredInvoices.reduce((sum, inv) => sum + inv.tax, 0);
    const totalDiscount = filteredInvoices.reduce((sum, inv) => sum + inv.discount, 0);

    // Revenue by Payment Method
    const revenueByMethod = filteredInvoices.reduce((acc: any, inv) => {
      const method = inv.paymentMethod || 'cash';
      acc[method] = (acc[method] || 0) + inv.total;
      return acc;
    }, {});

    // Revenue by Staff
    const revenueByStaff: any = {};
    filteredInvoices.forEach(inv => {
      inv.items.forEach((item: any) => {
        const code = item.staffCode || 'Unassigned';
        revenueByStaff[code] = (revenueByStaff[code] || 0) + item.total;
      });
    });

    return NextResponse.json({
      summary: {
        totalRevenue,
        totalInvoices,
        totalTax,
        totalDiscount,
        revenueByMethod,
        revenueByStaff
      },
      invoices: filteredInvoices
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
