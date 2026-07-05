/** @type {import('next').NextConfig} */
const isDevelopment = process.env.NODE_ENV === 'development'

const baseConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: __dirname,
}

if (isDevelopment) {
  module.exports = baseConfig
} else {
  const withPWA = require('@ducanh2912/next-pwa').default({
    dest: 'public',
  })
  module.exports = withPWA(baseConfig)
}
