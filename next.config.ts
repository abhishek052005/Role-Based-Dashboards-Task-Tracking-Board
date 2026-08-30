import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };


/** @type {import('next').NextStep} */
const nextConfig = {
  output: 'export',
  // If your images are using Next.js Image component, unoptimized images are required for static export:
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
export default nextConfig;
