import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "beingsde.in | Master System Design",
    short_name: "beingsde",
    description: "Learn High-Level Design (HLD) and Low-Level Design (LLD) for software engineering interviews.",
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#09090b",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
