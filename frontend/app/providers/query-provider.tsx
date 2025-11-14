"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/**
 * Query provider component that wraps the application with React Query client.
 * Creates a new QueryClient instance for each request (SSR-safe).
 * @param root0 - The props object
 * @param root0.children - The child components to render
 * @returns The query provider component JSX
 */
function QueryProvider({ children }: { children: React.ReactNode }) {
  // Create a new QueryClient instance for each request (SSR-safe)
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // With SSR, we usually want to set some default staleTime
            // to prevent refetching immediately on the client
            staleTime: 60 * 1000, // 60 seconds
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

export default QueryProvider;
