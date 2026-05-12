import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Hotel } from '@/lib/models/Hotel';
import cloudinary from '@/config/cloudinary';

const uploadToCloudinary = async (file: File, folder: string) => {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder, resource_type: 'auto' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    ).end(buffer);
  });
};

const uploadUrlToCloudinary = async (url: string, folder: string) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      url,
      { folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
  });
};

export async function GET() {
  try {
    await connectToDatabase();
    const hotels = await Hotel.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, hotels }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching hotels for admin:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    
    const formData = await req.formData();
    const dataString = formData.get('data') as string;
    const data = JSON.parse(dataString);
    
    // Process main hotel images (physical uploads)
    const imageFiles = formData.getAll('imageFiles') as File[];
    const uploadedPaths: string[] = [];

    for (const file of imageFiles) {
      if (file.name) {
        const result: any = await uploadToCloudinary(file, 'mnt_hotels');
        uploadedPaths.push(result.secure_url);
      }
    }

    // Process main hotel images (URLs) - Upload to Cloudinary
    const urlPaths: string[] = [];
    if (data.images && Array.isArray(data.images)) {
      for (const url of data.images) {
        if (typeof url === 'string' && url.startsWith('http')) {
          try {
            const result: any = await uploadUrlToCloudinary(url, 'mnt_hotels');
            urlPaths.push(result.secure_url);
          } catch (e) {
            console.error(`Failed to upload image URL to Cloudinary: ${url}`, e);
            urlPaths.push(url); // Fallback to original URL if upload fails
          }
        } else {
          urlPaths.push(url);
        }
      }
    }

    const finalImages = [...urlPaths, ...uploadedPaths];

    // Process room-specific images
    if (data.rooms && Array.isArray(data.rooms)) {
      for (let i = 0; i < data.rooms.length; i++) {
        const roomFile = formData.get(`roomImage_${i}`) as File;
        if (roomFile && roomFile.name) {
          const result: any = await uploadToCloudinary(roomFile, 'mnt_rooms');
          data.rooms[i].image = result.secure_url;
        }
      }
    }

    // Process Menu Card upload
    let menuCardUrl = data.menuCard || "";
    const menuCardFile = formData.get('menuCardFile') as File;
    if (menuCardFile && menuCardFile.name) {
      const result: any = await uploadToCloudinary(menuCardFile, 'mnt_menus');
      menuCardUrl = result.secure_url;
    }

    // Process Banquet Images
    const banquetImageFiles = formData.getAll('banquetImageFiles') as File[];
    const uploadedBanquetPaths: string[] = data.banquetImages || [];
    for (const file of banquetImageFiles) {
      if (file.name) {
        const result: any = await uploadToCloudinary(file, 'mnt_banquets');
        uploadedBanquetPaths.push(result.secure_url);
      }
    }

    const newHotel = await Hotel.create({
      hotelName: data.hotelName,
      location: data.location,
      address: data.address,
      rooms: data.rooms,
      amenities: data.amenities,
      images: finalImages,
      owner: data.owner,
      googleMapUrl: data.googleMapUrl,
      restaurantPrice: Number(data.restaurantPrice) || 0,
      banquetPrice: Number(data.banquetPrice) || 899,
      menuCard: menuCardUrl,
      banquetImages: uploadedBanquetPaths
    });

    return NextResponse.json({ success: true, hotel: newHotel }, { status: 201 });
  } catch (error: any) {
    console.error('Database insertion catastrophic error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
