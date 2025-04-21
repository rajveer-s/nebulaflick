import type { Metadata, Viewport } from "next";
import { inter, outfit } from "./utils/fonts";
import "./globals.css";
import BottomNavWrapper from "./components/BottomNavWrapper";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#000033",
};

export const metadata: Metadata = {
  title: "NebulaFlick - Stream Your Favorite Movies & Shows",
  description: "NebulaFlick is your premium streaming platform for movies and TV shows.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} bg-black text-white antialiased`}>
      <body className={`${inter.className} ${outfit.className} min-h-screen bg-gradient-to-b from-black via-nebula-950 to-black`}>
        <main className="min-h-screen">
          {children}
        </main>
        <BottomNavWrapper />
      </body>
    </html>
  );
}
