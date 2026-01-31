/** @type {import('next').NextConfig} */
const nextConfig = {
    // output: "export", // Disabled to allow proxy rewrites
    // eslint config removed (handled in package.json or separate config)
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'api.dicebear.com',
            },
        ],
    },

    compress: true,
    experimental: {
        serverActions: {
            bodySizeLimit: '10mb',
        },
    },
    // rewrites removed as we are using internal API routes now
};

module.exports = nextConfig;
