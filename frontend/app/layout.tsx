import type { Metadata } from "next";
import { Inter } from "next/font/google";

import QueryProvider from "@/app/providers/query-provider";
import { AuthProvider } from "@/app/contexts/auth-context";
import "@/app/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "XBorg Tech Challenge",
  description: "User profile management with Google OAuth",
};

/**
 * Root layout component that wraps the entire application.
 * Provides providers and global styling.
 * @param root0 - The props object
 * @param root0.children - The child components to render
 * @returns The root layout JSX
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <AuthProvider>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100">{children}</div>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
