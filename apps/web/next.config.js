/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@apiguard/db', '@apiguard/sdk'],
}

module.exports = nextConfig
