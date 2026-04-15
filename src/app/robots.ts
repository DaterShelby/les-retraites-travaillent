import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://lesretraitestravaillent.fr";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/profile/", "/legal/"],
        disallow: [
          "/dashboard/",
          "/onboarding/",
          "/login",
          "/register",
          "/api/",
          "/*.json",
          "/*.xml",
          "/admin/",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: ["/", "/profile/", "/legal/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
