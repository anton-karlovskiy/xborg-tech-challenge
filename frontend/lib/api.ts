import axios from "axios";

if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not set");
}

const API_END_POINTS = {
  AUTH_LOGIN_GOOGLE: "/auth/login/google",
  AUTH_LOGOUT: "/auth/logout",
  USER_PROFILE: "/user/profile"
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true // Enable cookies (httpOnly cookies are sent automatically by the browser)
});

interface GoogleLoginResponse {
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

interface UpdateUserProfile {
  firstName?: string;
  lastName?: string;
};

const authApi = {
  login: async (idToken: string): Promise<GoogleLoginResponse> => {
    const response = await api.post<GoogleLoginResponse>(
      API_END_POINTS.AUTH_LOGIN_GOOGLE,
      { idToken }
    );

    return response.data;
  },
  logout: async (): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>(API_END_POINTS.AUTH_LOGOUT);
    
    return response.data;
  }
};

const userApi = {
  getProfile: async (): Promise<UserProfile> => {
    const response = await api.get<UserProfile>(API_END_POINTS.USER_PROFILE);

    return response.data;
  },
  editProfile: async (data: UpdateUserProfile): Promise<UserProfile> => {
    const response = await api.put<UserProfile>(API_END_POINTS.USER_PROFILE, data);

    return response.data;
  }
};

export type {
  UserProfile,
  UpdateUserProfile
};

export {
  authApi,
  userApi
};

export default api;