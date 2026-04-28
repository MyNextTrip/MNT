import { MetadataRoute } from 'next';
import dbConnect from '@/lib/mongodb';
import { Hotel } from '@/lib/models/Hotel';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.mynexttrip.in';

  // 1. Static Routes
  const staticRoutes = [
    '',
    '/hotels',
    '/destinations',
    '/flights',
    '/packages',
    '/support',
    '/policies',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // 2. Dynamic Hotel Routes
  let hotelRoutes: any[] = [];
  try {
    await dbConnect();
    const hotels = await Hotel.find({}, { _id: 1, updatedAt: 1 });
    
    hotelRoutes = hotels.map((hotel) => ({
      url: `${baseUrl}/hotels/${hotel._id}`,
      lastModified: hotel.updatedAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.error('Sitemap generation error:', error);
  }

  return [...staticRoutes, ...hotelRoutes];
}
