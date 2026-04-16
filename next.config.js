const nextConfig = {
  images: { remotePatterns: [{ protocol:"https", hostname:"raw.githubusercontent.com" }] },
  async redirects() {
    return [{ source:"/questionnaire", destination:"/contribuer", permanent:true }];
  },
};
module.exports = nextConfig;
