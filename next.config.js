/** @type {import('next').NextConfig} */
const API_KEY = '1111';

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['proxy.goorm.io', 'plant-s3.s3.ap-northeast-2.amazonaws.com'],
  },
  // async redirects() {
  //   return [
  //     {
  //       source: "/old-blog/:path*",
  //       destination: "/new-blog/:path*",
  //       permanent: false,
  //     },
  //   ];
  // },
  // async rewrites() {
  //   return [
  //     {
  //       source: "/api/movies",
  //       destination: `https://api.themoviedb.org/3/movie/popular?key=${API_KEY}`, //여기에 API 키가 들어가도 유저는 볼 수 없음.
  //     },
  //   ];
  // },
};

module.exports = nextConfig;
