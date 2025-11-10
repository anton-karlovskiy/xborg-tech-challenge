"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  startTransition
} from "react";
import { useRouter } from "next/navigation";
import {
  useQuery,
  useQueryClient
} from "@tanstack/react-query";

import {
  userApi,
  UserProfile
} from "@/lib/api";
import {
  PAGE_URLS,
  LOCAL_STORAGE_KEYS
} from "@/app/constants";

/**
 * AuthProvider adopts the "render authenticated vs unauthenticated trees"
 * pattern popularized by Kent C. Dodds' article on React authentication
 * (https://kentcdodds.com/blog/authentication-in-react-applications).
 *
 * The provider:
 * - gates rendering until it knows whether a persisted token exists
 * - hydrates the user profile with React Query when a token is present
 * - clears invalid tokens eagerly, keeping the rest of the app isolated
 * - exposes imperative `login`/`logout` helpers that keep localStorage and
 *   the React Query cache in sync
 *
 * Downstream components can safely assume that `user` is either a factual
 * profile or `null`, without worrying about loading states or token drift.
 */

interface AuthContextType {
  user: UserProfile | null;
  login: (token: string, user: UserProfile) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const errorHandledRef = useRef(false);

  const [hasToken, setHasToken] = useState(false);

  // Detect any persisted token after mount so the SSR markup stays consistent
  // with the initial client render. This mirrors the "delay rendering until
  // auth status is known" approach from the referenced article.
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
    startTransition(() => {
      setHasToken(!!token);
    });
  }, []);

  // Run the guarded React Query request only when a token exists. Until then,
  // the rest of the app is held back by the loading state returned below.
  const {
    data: user,
    isLoading,
    error
  } = useQuery({
    queryKey: ["user", "profile"],
    queryFn: () => userApi.getProfile(),
    enabled: hasToken, // Only run query if token exists
    retry: false,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  // Handle error: remove invalid token
  useEffect(() => {
    if (error && hasToken && !errorHandledRef.current) {
      errorHandledRef.current = true;
      if (typeof window !== "undefined") {
        localStorage.removeItem(LOCAL_STORAGE_KEYS.TOKEN);
      }
      // Use startTransition to mark state update as non-urgent
      startTransition(() => {
        setHasToken(false);
      });
      queryClient.removeQueries({ queryKey: ["user", "profile"] });
    }
    // Reset error handled flag when error clears
    if (!error) {
      errorHandledRef.current = false;
    }
  }, [error, hasToken, queryClient]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Error: {error.message}</div>
      </div>
    );
  }

  const login = (token: string, userData: UserProfile) => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, token);
    setHasToken(true);
    // Set the query data directly to avoid refetch
    queryClient.setQueryData(["user", "profile"], userData);
  };

  const logout = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.TOKEN);
    setHasToken(false);
    queryClient.removeQueries({ queryKey: ["user", "profile"] });
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