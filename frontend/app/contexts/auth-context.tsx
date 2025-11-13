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
  // ninja focus touch <
  authApi,
  // ninja focus touch >
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
 * // ninja focus touch <
 * - gates rendering until it knows authentication status
 * - hydrates the user profile with React Query
 * - uses httpOnly cookies for secure token storage (XSS protection)
 * - exposes imperative `login`/`logout` helpers that keep React Query cache in sync
 * // ninja focus touch >
 * Downstream components can safely assume that `user` is either a factual
 * profile or `null`, without worrying about loading states or token drift.
 */

const AuthContext = createContext<{
  user: UserProfile | null;
  // ninja focus touch <
  login: (user: UserProfile) => void;
  logout: () => Promise<void>;
  // ninja focus touch >
} | undefined>(undefined);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // ninja focus touch <
  // Always attempt to fetch user profile - cookies are sent automatically
  // If no valid cookie exists, the request will fail and user will be null
  const {
    data: user,
    isLoading,
    error
  } = useQuery({
    queryKey: QUERY_KEYS.USER_PROFILE,
    queryFn: () => userApi.getProfile(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    // Don't throw on 401/403 - these are expected for unauthenticated users
    throwOnError: false
  });
  console.log("ninja focus touch: user =>", user);
  // ninja focus touch >

  // ninja focus touch <
  // Handle authentication errors - clear cache on auth failures
  useEffect(() => {
    if (error) {
      // Clear user data on authentication errors
      queryClient.removeQueries({ queryKey: QUERY_KEYS.USER_PROFILE });
    }
  }, [error, queryClient]);
  // ninja focus touch >

  if (isLoading) {
    return <LoadingState />;
  }
  
  // ninja focus touch <
  // Don't show error state for authentication failures - just treat as unauthenticated
  // Only show error for unexpected server errors (5xx)
  if (error && error instanceof Error && !error.message.includes("401") && !error.message.includes("403")) {
    return <ErrorState message={error.message} />;
  }
  // ninja focus touch >

  // ninja focus touch <
  const login = (userData: UserProfile) => {
    // Token is stored in httpOnly cookie, so we just update the cache
    queryClient.setQueryData(QUERY_KEYS.USER_PROFILE, userData);
  };
  // ninja focus touch >

  // ninja focus touch <
  const logout = async () => {
    try {
      // Call logout endpoint to clear httpOnly cookie on server
      await authApi.logout();
    } catch (error) {
      // Even if logout fails, clear local state
      console.error("Logout error:", error);
    } finally {
      // Clear React Query cache
      queryClient.removeQueries({ queryKey: QUERY_KEYS.USER_PROFILE });
      router.push(PAGE_URLS.SIGN_IN);
    }
  };
  // ninja focus touch >

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