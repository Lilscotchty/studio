// next.config.ts

import type { NextConfig } from 'next';

// --- START OF SPECIAL DEBUGGING CODE ---

// 1. We grab the environment variable exactly as the build process should see it.
const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

// 2. We print it to the log, surrounded by brackets to see any hidden spaces.
console.log(`--- Vercel Build Is Seeing API Key: [${apiKey}] ---`);

// 3. We check if it's missing or obviously wrong. If so, we crash the build with a NEW error.
if (!apiKey || apiKey.length < 20) {
  throw new Error('*** DEBUG TEST FAILED: The Firebase API Key is DEFINITELY missing or too short in Vercel\'s environment! Please check your Vercel settings again. ***');
}

console.log('--- DEBUG TEST PASSED: The API Key appears to be loaded into the environment correctly. ---');

// --- END OF SPECIAL DEBUGGING CODE ---


// Your original Next.js config remains below
const config: NextConfig = {
  // Your other config options like images, typescript, etc. can go here
  // Make sure 'output: "export"' is removed for Vercel
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
    ],
  },
};

export default config;
