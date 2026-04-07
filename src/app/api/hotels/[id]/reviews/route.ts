import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Hotel } from '@/lib/models/Hotel';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    await connectToDatabase();
    const { id } = params;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Hotel ID is required' }, { status: 400 });
    }

    const formData = await req.formData();
    
    // Parse review text fields
    const userName = formData.get('userName') as string || 'Guest User';
    const text = formData.get('text') as string;
    const ratingStr = formData.get('rating') as string;
    const rating = ratingStr ? parseInt(ratingStr, 10) : 5;

    if (!text) {
      return NextResponse.json({ success: false, message: 'Review text is required' }, { status: 400 });
    }

    // Intercept physical file uploads from the Next.js runtime (both Images & Videos)
    const reviewImages = formData.getAll('reviewImages') as File[];
    const reviewVideos = formData.getAll('reviewVideos') as File[];
    
    const uploadedImages: string[] = [];
    const uploadedVideos: string[] = [];

    // System directory for rich-media user reviews safely segregated
    const uploadDir = path.join(process.cwd(), 'public/uploads/reviews');
    try { await mkdir(uploadDir, { recursive: true }); } catch (e) {}

    // Process Images
    for (const file of reviewImages) {
      if (file.name) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const fileName = `${Date.now()}-img-${file.name.replace(/\s+/g, '-')}`;
        const filePath = path.join(uploadDir, fileName);
        await writeFile(filePath, buffer);
        uploadedImages.push(`/uploads/reviews/${fileName}`);
      }
    }

    // Process Videos
    for (const file of reviewVideos) {
      if (file.name) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const fileName = `${Date.now()}-vid-${file.name.replace(/\s+/g, '-')}`;
        const filePath = path.join(uploadDir, fileName);
        await writeFile(filePath, buffer);
        uploadedVideos.push(`/uploads/reviews/${fileName}`);
      }
    }

    // Build sub-document struct
    const newReview = {
      userName,
      rating,
      text,
      images: uploadedImages,
      videos: uploadedVideos,
      createdAt: new Date()
    };

    // Atomically push into Hotel model array
    const updatedHotel = await Hotel.findByIdAndUpdate(
      id,
      { $push: { reviews: newReview } },
      { new: true } // Return the modified document
    );

    if (!updatedHotel) {
      return NextResponse.json({ success: false, message: 'Target Hotel not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, hotel: updatedHotel }, { status: 201 });
  } catch (error: any) {
    console.error('Core review insertion logic error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
