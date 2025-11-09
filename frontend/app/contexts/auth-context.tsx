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

// ninja focus touch <
interface AuthContextType {
  // loading: boolean;
  // refreshUser: () => Promise<void>;
  user: UserProfile | null;
  login: (token: string, user: UserProfile) => void;
  logout: () => void;
}
// ninja focus touch >

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ninja focus touch <
interface State {
  status: "idle" | "pending" | "resolved" | "rejected";
  user: UserProfile | null;
  error: Error | null;
}
// ninja focus touch >

function AuthProvider({ children }: { children: React.ReactNode }) {
  // ninja focus touch <
  const [state, setState] = useState<State>({
    status: 'idle',
    error: null,
    user: null
  });
  // const [user, setUser] = useState<UserProfile | null>(null);
  // const [loading, setLoading] = useState(true);
  // ninja focus touch >
  const router = useRouter();

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
    // ninja focus touch <
    if (token) {
      (async () => {
        setState(prev => ({ ...prev, status: "pending" }));
        try {
          // Verify token by fetching user profile
          const profile = await userApi.getProfile();
          setState(prev => ({ ...prev, status: "resolved", user: profile }));
        } catch (error) {
          setState(prev => ({ ...prev, status: "rejected", error: error as Error }));
          localStorage.removeItem(LOCAL_STORAGE_KEYS.TOKEN);
        }
      })();
    }
    // if (token) {
    //   // Verify token by fetching user profile
    //   userApi.getProfile()
    //     .then(profile => {
    //       setUser(profile);
    //     })
    //     .catch(() => {
    //       // Token invalid, clear it
    //       localStorage.removeItem(LOCAL_STORAGE_KEYS.TOKEN);
    //     })
    //     .finally(() => {
    //       setLoading(false);
    //     });
    // } else {
    //   setLoading(false);
    // }
    // ninja focus touch >
  }, []);

  // ninja focus touch <
  if (state.status === "pending") {
    return <div>Loading...</div>;
  }

  if (state.status === "rejected") {
    return <div>Error: {state.error?.message}</div>;
  }
  // ninja focus touch >

  const login = (token: string, userData: UserProfile) => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, token);
    // ninja focus touch <
    setState(prev => ({ ...prev, user: userData }));
    // ninja focus touch >
  };

  const logout = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.TOKEN);
    // ninja focus touch <
    setState(prev => ({ ...prev, user: null }));
    // ninja focus touch >
    router.push(PAGE_URLS.SIGN_IN);
  };

  // ninja focus touch <
  // const refreshUser = async () => {
  //   try {
  //     const profile = await userApi.getProfile();
  //     setUser(profile);
  //   } catch (error) {
  //     console.error("Failed to refresh user:", error);
  //   }
  // };
  // ninja focus touch >

  return (
    <AuthContext.Provider value={{ user: state.user, login, logout }}>
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