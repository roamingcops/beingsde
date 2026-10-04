import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "Mediapartners-Google",
        allow: "/",
      },
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/profile",
          "/subscriptions",
          "/forgot",
          "/reset-password",
        ],
      },
    ],
    sitemap: "https://beingsde.in/sitemap.xml",
  };
}
