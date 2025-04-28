import type { Metadata } from "next";
import { Ubuntu } from "next/font/google";
import "./globals.css";
import config from "@/config";

const ubuntu = Ubuntu({
  weight: ["300", "400", "500", "700"],
  variable: "--font-ubuntu",
});

export const metadata: Metadata = {
  title: config.appName,
  description: config.appTitle,
  applicationName: config.appName,
  authors: [config.author],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${ubuntu.variable} antialiased`}>{children}</body>
    </html>
  );
}
