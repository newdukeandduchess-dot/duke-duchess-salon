import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Invoice from '@/models/Invoice';
import Customer from '@/models/Customer';
import Product from '@/models/Product';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const { 
      customerId, 
      items, 
      subtotal, 
      tax, 
      discount, 
      total, 
      paymentMethod 
    } = data;

    await connectToDatabase();

    // 1. Generate Invoice Number
    const lastInvoice = await Invoice.findOne().sort({ createdAt: -1 });
    let nextNum = 1;
    if (lastInvoice && lastInvoice.invoiceNumber) {
      const match = lastInvoice.invoiceNumber.match(/INV-(\d+)/);
      if (match) {
        nextNum = parseInt(match[1], 10) + 1;
      } else {
        const count = await Invoice.countDocuments();
        nextNum = count + 1;
      }
    }
    const invoiceNumber = `INV-${nextNum.toString().padStart(5, '0')}`;

    const userId = (session.user as any).id;
    const isValidObjectId = /^[a-fA-F0-9]{24}$/.test(userId);

    // 2. Create Invoice
    const invoice = await Invoice.create({
      invoiceNumber,
      customer: customerId,
      ...(isValidObjectId && { staff: userId }),
      items,
      subtotal,
      tax,
      discount,
      total,
      paymentMethod,
      status: 'paid'
    });

    // 3. Update Customer Stats
    const loyaltyPointsEarned = Math.floor(total / 100);
    await Customer.findByIdAndUpdate(customerId, {
      $inc: { 
        totalSpent: total,
        loyaltyPoints: loyaltyPointsEarned
      },
      $set: { lastVisit: new Date() }
    });

    // 4. Update Product Stocks
    for (const item of items) {
      if (item.itemType === 'product' && item.itemId) {
        await Product.findByIdAndUpdate(item.itemId, {
          $inc: { stock: -item.quantity }
        });
      }
    }

    return NextResponse.json(invoice, { status: 201 });
  } catch (error: any) {
    console.error("Invoice creation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    const invoices = await Invoice.find({})
      .populate('customer', 'name phone')
      .sort({ createdAt: -1 });
    return NextResponse.json(invoices);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
