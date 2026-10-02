import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Client and testimonial logos are served from the same media store as gembaconcepts.com.
    remotePatterns: [
      { protocol: "https", hostname: "gembaconceptswebsite.blob.core.windows.net", pathname: "/media/**" },
      { protocol: "https", hostname: "gembaconcepts.com", pathname: "/images/**" },
    ],
  },
};

export default nextConfig;
