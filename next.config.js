/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [{ source: '/feedback', destination: '/contribuer', permanent: true }]
  }
}
module.exports = nextConfig
