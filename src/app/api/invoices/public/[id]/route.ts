import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Invoice from '@/models/Invoice';
import '@/models/Customer'; // Ensure model is registered for population

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await params;
  try {
    const invoice = await Invoice.findById(id).populate('customer', 'name phone');
    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }
    return NextResponse.json(invoice);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch invoice' }, { status: 500 });
  }
}
