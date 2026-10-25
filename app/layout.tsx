import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { DemoAuthProvider } from "@/components/auth/demo-auth-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JanSeva AI",
  description: "Hindi-first income certificate review dashboard for government officers",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="hi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-100 text-slate-900">
        <DemoAuthProvider>{children}</DemoAuthProvider>
      </body>
    </html>
  );
}
