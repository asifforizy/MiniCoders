import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { GoogleProvider } from "@/provider/google-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});


export const metadata: Metadata = {
  title: "Mini Coders",
  description: "Learn coding with Mini Coders",
};

export default  function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en" suppressHydrationWarning>
       <body className={`${inter.variable} font-sans antialiased`}>
        <GoogleProvider>
          {children}
        </GoogleProvider>

        <Toaster  richColors position="top-right" />
      </body>
    </html>
  );
}