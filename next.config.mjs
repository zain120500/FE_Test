/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        BASE_URL : 'http://127.0.0.1:8000/api',
      },
      images: {
    
        formats:['image/webp']
      },
};

export default nextConfig;
