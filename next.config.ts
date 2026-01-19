import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: 'standalone',
    // Supprimez les rewrites - nginx s'en occupe
};

export default nextConfig;