import type { Metadata } from "next";
import { Inter } from "next/font/google";

import QueryProvider from "@/app/providers/query-provider";
import { AuthProvider } from "@/app/contexts/auth-context";
import "@/app/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "XBorg Tech Challenge",
  description: "User profile management with Google OAuth"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
};