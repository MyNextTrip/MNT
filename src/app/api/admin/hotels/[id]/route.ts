import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Hotel } from '@/lib/models/Hotel';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    await connectToDatabase();
    const { id } = params;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Hotel ID is required' }, { status: 400 });
    }

    const deletedHotel = await Hotel.findByIdAndDelete(id);

    if (!deletedHotel) {
      return NextResponse.json({ success: false, message: 'Hotel not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Hotel listing successfully removed from MongoDB database.' }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting hotel:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    await connectToDatabase();
    const { id } = params;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Hotel ID is required' }, { status: 400 });
    }

    const formData = await req.formData();
    const dataString = formData.get('data') as string;
    const data = JSON.parse(dataString);
    
    // Process new images if any
    const imageFiles = formData.getAll('imageFiles') as File[];
    const uploadedPaths: string[] = [];
    
    if (imageFiles.length > 0) {
      const uploadDir = path.join(process.cwd(), 'public/uploads');
      try { await mkdir(uploadDir, { recursive: true }); } catch (e) {}

      for (const file of imageFiles) {
        if (file.name) {
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);
          const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
          const filePath = path.join(uploadDir, fileName);
          await writeFile(filePath, buffer);
          uploadedPaths.push(`/uploads/${fileName}`);
        }
      }
    }

    const finalImages = [...data.images, ...uploadedPaths];

    // Intercept physical room-specific uploads
    if (data.rooms && Array.isArray(data.rooms)) {
      const uploadDir = path.join(process.cwd(), 'public/uploads');
      try { await mkdir(uploadDir, { recursive: true }); } catch (e) {}

      for (let i = 0; i < data.rooms.length; i++) {
        const roomFile = formData.get(`roomImage_${i}`) as File;
        if (roomFile && roomFile.name) {
          const bytes = await roomFile.arrayBuffer();
          const buffer = Buffer.from(bytes);
          const fileName = `room-${Date.now()}-${roomFile.name.replace(/\s+/g, '-')}`;
          const filePath = path.join(uploadDir, fileName);
          await writeFile(filePath, buffer);
          data.rooms[i].image = `/uploads/${fileName}`;
        }
      }
    }

    const updatedHotel = await Hotel.findByIdAndUpdate(
      id,
      {
        hotelName: data.hotelName,
        location: data.location,
        address: data.address,
        rooms: data.rooms,
        amenities: data.amenities,
        images: finalImages,
        owner: data.owner,
        ...(data.googleMapUrl ? { googleMapUrl: data.googleMapUrl } : {})
      },
      { new: true }
    );

    if (!updatedHotel) {
      return NextResponse.json({ success: false, message: 'Hotel not found for update' }, { status: 404 });
    }

    return NextResponse.json({ success: true, hotel: updatedHotel }, { status: 200 });
  } catch (error: any) {
    console.error('Database update error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
