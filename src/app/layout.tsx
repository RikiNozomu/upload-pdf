import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Upload PDF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className={`bg-slate-400 h-screen w-screen overflow-hidden`}>
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
