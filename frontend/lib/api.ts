import axios from "axios";

import { LOCAL_STORAGE_KEYS } from "@/app/constants";

if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not set");
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

// Add token to requests
api.interceptors.request.use(config => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

interface GoogleLoginResponse {
  access_token: string;
  user: UserProfile;
};

interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  picture?: string;
  createdAt: string;
  updatedAt: string;
};

interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
};

const authApi = {
  googleLogin: async (data: {
    googleId: string;
    email: string;
    firstName?: string;
    lastName?: string;
    picture?: string;
  }): Promise<GoogleLoginResponse> => {
    const response = await api.post<GoogleLoginResponse>("/auth/login/google", data);

    return response.data;
  }
};

const userApi = {
  getProfile: async (): Promise<UserProfile> => {
    const response = await api.get<UserProfile>("/user/profile");

    return response.data;
  },
  updateProfile: async (data: UpdateProfileData): Promise<UserProfile> => {
    const response = await api.put<UserProfile>("/user/profile", data);

    return response.data;
  }
};

export type {
  UserProfile,
  UpdateProfileData
};

export {
  authApi,
  userApi
};

export default api;