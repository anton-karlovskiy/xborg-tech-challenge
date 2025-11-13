"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/app/contexts/auth-context";
import { PAGE_URLS } from "@/app/constants";

/**
 * Protected Layout - Handles authentication for all routes in this group.
 * This is "higher in the tree" - all child pages are automatically protected.
 * 
 * Routes in this group:
 * - /profile
 * - Any other routes you add here
 */
function ProtectedLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push(PAGE_URLS.SIGN_IN);
    }
  }, [user, router]);

  // Show nothing while redirecting
  if (!user) {
    return null;
  }

  // User is authenticated, render children
  return <>{children}</>;
}

export default ProtectedLayout;