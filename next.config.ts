import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: 'standalone',

    async rewrites() {
        return [
            {
                // Proxy toutes les requêtes /api/* vers le backend
                source: '/api/:path*',
                // Change ici le nom/host/port selon ton setup Coolify
                // Option 1 : si même réseau partagé → nom du service
                destination: 'http://backend:8080/api/:path*',   // ← essaie ça en premier
                // Option 2 : si tu as forcé container_name
                // destination: 'http://dashboard-backend:8080/api/:path*',
                // Option 3 : fallback si DNS foire toujours (rare)
                // destination: 'http://172.17.0.x:8080/api/:path*'  // IP interne, trouve-la avec docker inspect
            },
        ];
    },

    // Optionnel : désactive telemetry + optimise pour prod
    poweredByHeader: false,
    reactStrictMode: true,
};

export default nextConfig;