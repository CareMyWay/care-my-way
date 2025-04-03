import type { Metadata } from "next";
import { Geist, Geist_Mono, Manrope } from "next/font/google";
// import "./globals.css";
import "@/app/globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["700", "600", "500"],
});

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Care My Way",
  description:
    "Care My Way is a healthcare marketplace that connects clients with trusted Healthcare Professionals. ",
  icons: [
    {
      rel: "icon",
      type: "image/ico",
      sizes: "32x32",
      url: "/favicon.ico",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${manrope.variable} flex-col size-full min-h-screen bg-primary-white antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
