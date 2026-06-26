import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Service from '@/models/Service';

type Params = Promise<{ id: string }>;

export async function PUT(req: Request, segmentData: { params: Params }) {
  try {
    const body = await req.json();
    
    // Enforce name prefixes based on category
    if (body.category && typeof body.name === 'string') {
      const cat = body.category.toUpperCase();
      let name = body.name.trim();
      
      // Remove any existing incorrect prefixes so we can apply the right one if category changed
      const prefixesToRemove = ['MEN- ', 'WOMEN- ', 'MEN-', 'WOMEN-', 'DUKE- ', 'DUCHESS- ', 'DUKE-', 'DUCHESS-'];
      for (const prefix of prefixesToRemove) {
        if (name.toUpperCase().startsWith(prefix)) {
          name = name.substring(prefix.length).trim();
          break;
        }
      }
      
      if (cat.startsWith('MEN')) {
        name = 'DUKE- ' + name;
      } else if (cat.startsWith('WOMEN')) {
        name = 'DUCHESS- ' + name;
      }
      body.name = name;
    }

    await connectToDatabase();
    
    const params = await segmentData.params;
    
    const service = await Service.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
    if (!service) return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    return NextResponse.json(service);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: Request, segmentData: { params: Params }) {
  try {
    await connectToDatabase();
    const params = await segmentData.params;
    const service = await Service.findByIdAndDelete(params.id);
    if (!service) return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    return NextResponse.json({ message: 'Service deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
