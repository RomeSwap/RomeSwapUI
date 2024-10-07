/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/twitter',
        destination: 'https://x.com/rome_swap',
        permanent: false,
      },
      {
        source: '/telegram',
        destination: 'https://t.me/+bt04jB2Ckv5jNThi',
        permanent: false,
      },
    ]
  },
};

module.exports = nextConfig;
