/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/tool",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
