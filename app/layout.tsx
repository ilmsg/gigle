import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Sidebar } from "./components/Sidebar";

import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "gigle.ilmsg.in.th",
  description: "สรุปย่อหนังสือ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-3" style={{ 'fontSize': 12.5 }}>
              <Sidebar />
            </div>
            <div className="col-sm-9">
              <div className="container-fluid">{children}</div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
