module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    //You have to declare where your images come from in the Image Component here.
    domains: [
      "links.papareact.com",
      "platform-lookaside.fbsbx.com",
      "firebasestorage.googleapis.com",
      "lh3.googleusercontent.com",
      "googleusercontent.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};
