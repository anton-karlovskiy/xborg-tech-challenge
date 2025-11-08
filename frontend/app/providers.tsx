"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect
} from "react";
import { useRouter } from "next/navigation";

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
  loading: boolean;
  login: (token: string, user: UserProfile) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
    if (token) {
      // Verify token by fetching user profile
      userApi.getProfile()
        .then((profile) => {
          setUser(profile);
        })
        .catch(() => {
          // Token invalid, clear it
          localStorage.removeItem(LOCAL_STORAGE_KEYS.TOKEN);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = (token: string, userData: UserProfile) => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.TOKEN);
    setUser(null);
    router.push(PAGE_URLS.SIGN_IN);
  };

  const refreshUser = async () => {
    try {
      const profile = await userApi.getProfile();
      setUser(profile);
    } catch (error) {
      console.error("Failed to refresh user:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
