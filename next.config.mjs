/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Lewati error pengecekan TypeScript saat build di Vercel
    ignoreBuildErrors: true,
  },
  eslint: {
    // Lewati error ESLint saat build di Vercel
    ignoreDuringBuilds: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;