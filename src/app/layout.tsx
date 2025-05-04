import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "@/app/globals.css";
import Auth from "@/components/auth/auth";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["700", "600", "500"],
  display: "swap",
});

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${manrope.variable} overflow-x-hidden font-manrope flex-col size-full min-h-screen bg-primary-white antialiased`}
        suppressHydrationWarning
      >
        <Auth>{children}</Auth>
      </body>
    </html>
  );
}
