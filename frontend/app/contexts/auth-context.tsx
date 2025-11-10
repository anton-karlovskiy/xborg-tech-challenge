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
  
  // Lazy initialization to check token on mount
  const [hasToken, setHasToken] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return !!localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
    }
    return false;
  });

  // Use react-query to fetch user profile
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