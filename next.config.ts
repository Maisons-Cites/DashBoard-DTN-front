import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: 'standalone',   // ← Ajoute cette ligne

    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://dashboard-backend:8080/api/:path*',
            },
        ];
    },
};

export default nextConfig;