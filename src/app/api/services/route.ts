import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Service from '@/models/Service';

export async function GET() {
  try {
    await connectToDatabase();
    const services = await Service.find({}).sort({ createdAt: -1 });
    return NextResponse.json(services);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Enforce name prefixes based on category
    if (body.category && typeof body.name === 'string') {
      const cat = body.category.toUpperCase();
      let name = body.name.trim();
      
      if (cat.startsWith('MEN')) {
        // Only prefix if it doesn't already have it
        if (!name.toUpperCase().startsWith('DUKE-')) {
          name = 'DUKE- ' + name;
        }
      } else if (cat.startsWith('WOMEN')) {
        if (!name.toUpperCase().startsWith('DUCHESS-')) {
          name = 'DUCHESS- ' + name;
        }
      }
      body.name = name;
    }

    await connectToDatabase();
    const service = await Service.create(body);
    return NextResponse.json(service, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
