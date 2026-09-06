import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-playfair",
});

export const viewport: Viewport = {
  themeColor: "#070709",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://nostalgia-music.local"),
  title: "NOSTALGIA — The Songs That Raised Us",
  description:
    "An immersive nostalgic music experience inspired by the sounds and memories of Indian music from 2005–2010.",
  keywords: [
    "nostalgia",
    "indian music 2000s",
    "bollywood 2007",
    "kk",
    "indie pop",
    "retro music player",
  ],
  openGraph: {
    title: "NOSTALGIA — The Songs That Raised Us",
    description:
      "An immersive nostalgic music experience inspired by the sounds and memories of Indian music from 2005–2010.",
    siteName: "NOSTALGIA",
    images: [{ url: "/artwork/song-1.svg", width: 800, height: 800 }],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/artwork/song-1.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased dark`}
    >
      <body className="h-full w-full overflow-hidden bg-[#070709] text-white selection:bg-amber-500/30">
        {children}
      </body>
    </html>
  );
}
