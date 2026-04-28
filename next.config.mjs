/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  turbopack: {
    // If errors persist, this helps set the root folder
    root: '.', 
  },
};

export default nextConfig;