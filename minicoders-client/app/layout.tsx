import type { Metadata } from "next";


import "./globals.css";
import { Toaster } from "sonner";
import { GoogleProvider } from "@/provider/google-provider";




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
      <body>

        <GoogleProvider>
          {children}
        </GoogleProvider>

        <Toaster  richColors position="top-right" />
      </body>
    </html>
  );
}