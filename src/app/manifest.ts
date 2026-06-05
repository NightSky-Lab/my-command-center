import type { MetadataRoute } from "next";

// PWA manifest — membolehkan laman dipasang sebagai "app" pada telefon/desktop
// (Add to Home Screen / Install app) dengan ikon & nama tersendiri.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MyPI Command Center",
    short_name: "MyPI",
    description: "Pusat Pengurusan Pendidikan Islam Digital",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#013220",
    theme_color: "#0F766E",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
