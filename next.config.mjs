/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    BASE_API_URL:          process.env.BASE_API_URL,
    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
    GOOGLE_PAY_MERCHANT_ID: process.env.GOOGLE_PAY_MERCHANT_ID,
  },
};

export default nextConfig;
