/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  experimental: {
    turbo: {
      // Agar error barkarar rahe, to ye line root folder set karne mein help karegi
      root: '.', 
    },
  },
};

export default nextConfig;