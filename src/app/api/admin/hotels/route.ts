import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Hotel } from '@/lib/models/Hotel';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    
    // Using formData to capture potential multimedia uploads natively
    const formData = await req.formData();
    
    // Parse pure stringified JSON parameters securely
    const dataString = formData.get('data') as string;
    const data = JSON.parse(dataString);
    
    // Intercept physical file uploads from the Next.js runtime
    const imageFiles = formData.getAll('imageFiles') as File[];
    const uploadedPaths: string[] = [];

    // Check system directory & bootstrap recursively if missing
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    try { await mkdir(uploadDir, { recursive: true }); } catch (e) {}

    // Async physical writes to local /public storage folder
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

    // Combine raw manual URL Strings and Physical File Upload Paths uniformly
    const finalImages = [...data.images, ...uploadedPaths];

    // Intercept physical room-specific uploads
    if (data.rooms && Array.isArray(data.rooms)) {
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

    // Build the MongoDB Document precisely matching Mongoose schema
    const newHotel = await Hotel.create({
      hotelName: data.hotelName,
      location: data.location,
      address: data.address,
      rooms: data.rooms,
      amenities: data.amenities,
      images: finalImages,
      owner: data.owner,
      googleMapUrl: data.googleMapUrl
    });

    return NextResponse.json({ success: true, hotel: newHotel }, { status: 201 });
  } catch (error: any) {
    console.error('Database insertion catastrophic error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
