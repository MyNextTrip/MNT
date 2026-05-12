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
    
    // Process new images (physical uploads)
    const imageFiles = formData.getAll('imageFiles') as File[];
    const uploadedPaths: string[] = [];
    
    for (const file of imageFiles) {
      if (file.name) {
        const result: any = await uploadToCloudinary(file, 'mnt_hotels');
        uploadedPaths.push(result.secure_url);
      }
    }

    // Process images (URLs) - Mirror to Cloudinary if not already there
    const urlPaths: string[] = [];
    if (data.images && Array.isArray(data.images)) {
      for (const url of data.images) {
        if (typeof url === 'string' && url.startsWith('http') && !url.includes('cloudinary.com')) {
          try {
            const result: any = await uploadUrlToCloudinary(url, 'mnt_hotels');
            urlPaths.push(result.secure_url);
          } catch (e) {
            console.error(`Failed to upload image URL to Cloudinary: ${url}`, e);
            urlPaths.push(url);
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
        restaurantPrice: Number(data.restaurantPrice) || 0,
        banquetPrice: Number(data.banquetPrice) || 899,
        menuCard: menuCardUrl,
        banquetImages: uploadedBanquetPaths,
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
