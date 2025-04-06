import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript:{
    ignoreBuildErrors: true,
  }
};

module.exports = {
  env: {
    MONGO_DB_URI: process.env.MONGO_DB_URI
  },
}

export default nextConfig;
