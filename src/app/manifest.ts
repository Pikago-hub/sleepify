import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sleepify",
    short_name: "Sleepify",
    description:
      "Process YouTube audio for better sleep listening",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#232946",
    theme_color: "#232946",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
}
