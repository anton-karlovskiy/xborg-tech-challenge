"use client";

import {
  createContext,
  useContext,
  useEffect
} from "react";
import { useRouter } from "next/navigation";
import {
  useQuery,
  useQueryClient
} from "@tanstack/react-query";

import {
  authApi,
  userApi,
  UserProfile
} from "@/lib/api";
import {
  PAGE_URLS,
  QUERY_KEYS
} from "@/app/constants";
import {
  LoadingState,
  ErrorState
} from "@/app/components";

/**
 * AuthProvider adopts the "render authenticated vs unauthenticated trees"
 * pattern popularized by Kent C. Dodds' article on React authentication
 * (https://kentcdodds.com/blog/authentication-in-react-applications).
 *
 * The provider:
 * - gates rendering until it knows authentication status
 * - hydrates the user profile with React Query
 * - uses httpOnly cookies for secure token storage (XSS protection)
 * - exposes imperative `login`/`logout` helpers that keep React Query cache in sync
 * 
 * Downstream components can safely assume that `user` is either a factual
 * profile or `null`, without worrying about loading states or token drift.
 */

const AuthContext = createContext<{
  user: UserProfile | null;
  login: (googleIdToken: string) => Promise<void>;
  logout: () => Promise<void>;
} | undefined>(undefined);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Always attempt to fetch user profile - cookies are sent automatically
  // If no valid cookie exists, the request will fail and user will be null
  const {
    data: user,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: QUERY_KEYS.USER_PROFILE,
    queryFn: () => userApi.getProfile(),
    retry: false,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  // Handle authentication errors - clear cache on auth failures
  useEffect(() => {
    if (error) {
      // Clear user data on authentication errors
      queryClient.removeQueries({ queryKey: QUERY_KEYS.USER_PROFILE });
    }
  }, [error, queryClient]);

  if (isLoading) {
    return <LoadingState />;
  }
  
  // Don't show error state for authentication failures - just treat as unauthenticated
  // Only show error for unexpected server errors (5xx)
  if (error && error instanceof Error && !error.message.includes("401") && !error.message.includes("403")) {
    return <ErrorState message={error.message} />;
  }

  const login = async (googleIdToken: string) => {
    // Send the Google ID token directly to the backend for verification
    // The backend will verify the token with Google, extract user information, and set an httpOnly cookie with the JWT token
    const result = await authApi.login(googleIdToken);

    // Token is stored in httpOnly cookie, so we update the cache optimistically
    // This makes user immediately available across the frontend via useAuth() hook
    queryClient.setQueryData(QUERY_KEYS.USER_PROFILE, result.user);

    // Token is stored in httpOnly cookie automatically by the backend
    // Refetch the user profile to get the latest data from the server
    await refetch();
  };

  const logout = async () => {
    // Call logout endpoint to clear httpOnly cookie on server
    await authApi.logout();

    // Clear React Query cache
    queryClient.removeQueries({ queryKey: QUERY_KEYS.USER_PROFILE });

    // Refetch the user profile to get the latest data from the server
    await refetch();

    // Redirect to sign in page
    router.push(PAGE_URLS.SIGN_IN);
  };

  return (
    <AuthContext.Provider value={{ user: user ?? null, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};

export {
  AuthProvider,
  useAuth
};