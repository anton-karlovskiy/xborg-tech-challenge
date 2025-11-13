import axios from "axios";

if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not set");
}

const API_END_POINTS = {
  AUTH_LOGIN_GOOGLE: "/auth/login/google",
  // ninja focus touch <
  AUTH_LOGOUT: "/auth/logout",
  // ninja focus touch >
  USER_PROFILE: "/user/profile"
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json"
  },
  // ninja focus touch <
  withCredentials: true // Enable cookies (httpOnly cookies are sent automatically)
  // ninja focus touch >
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
  googleLogin: async (idToken: string): Promise<GoogleLoginResponse> => {
    const response = await api.post<GoogleLoginResponse>(
      API_END_POINTS.AUTH_LOGIN_GOOGLE,
      { idToken }
    );

    return response.data;
  },
  // ninja focus touch <
  logout: async (): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>(API_END_POINTS.AUTH_LOGOUT);
    return response.data;
  }
  // ninja focus touch >
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