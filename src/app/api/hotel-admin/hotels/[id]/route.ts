import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Hotel } from '@/lib/models/Hotel';

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const hotelId = params.id;
    await connectToDatabase();
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return NextResponse.json({ success: false, message: 'Hotel not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, hotel });
  } catch (error: any) {
    console.error('Error fetching hotel inventory:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const hotelId = params.id;
    
    // Process FormData for multimedia support
    const formData = await req.formData();
    const roomsString = formData.get('rooms') as string;
    const rooms = JSON.parse(roomsString);

    if (!rooms) {
      return NextResponse.json({ success: false, message: 'Rooms data is required' }, { status: 400 });
    }

    const { mkdir, writeFile } = await import('fs/promises');
    const path = await import('path');
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    try { await mkdir(uploadDir, { recursive: true }); } catch (e) {}

    // Intercept physical room-specific uploads from hotel admin
    for (let i = 0; i < rooms.length; i++) {
        const roomFile = formData.get(`roomImage_${i}`) as File;
        if (roomFile && roomFile.name) {
            const bytes = await roomFile.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const fileName = `room-${Date.now()}-${roomFile.name.replace(/\s+/g, '-')}`;
            const filePath = path.join(uploadDir, fileName);
            await writeFile(filePath, buffer);
            rooms[i].image = `/uploads/${fileName}`;
        }
    }

    await connectToDatabase();
    const hotel = await Hotel.findByIdAndUpdate(hotelId, { rooms }, { new: true });

    if (!hotel) {
      return NextResponse.json({ success: false, message: 'Hotel not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, hotel });
  } catch (error: any) {
    console.error('Error updating hotel inventory:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
