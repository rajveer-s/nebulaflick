import type { Metadata } from "next";
import { inter, outfit } from "./utils/fonts";
import "./globals.css";
import "./styles/video-player.css";

export const metadata: Metadata = {
  title: "NebulaFlick - Stream Your Favorite Movies & Shows",
  description: "NebulaFlick is your premium streaming platform for movies and TV shows.",
  manifest: "/manifest.json",
  themeColor: "#000033",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} bg-black text-white min-h-screen antialiased`}>
      <body className={`${inter.className} ${outfit.className} bg-black text-white min-h-screen antialiased`}>
        {children}
      </body>
    </html>
  );
}
