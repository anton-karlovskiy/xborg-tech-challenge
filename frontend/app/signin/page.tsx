"use client";

import {
  useEffect,
  useCallback
} from "react";
import { useRouter } from "next/navigation";

import { useAuth } from '@/app/contexts/auth-context';
import { authApi } from "@/lib/api";
import { PAGE_URLS } from '@/app/constants';
import {
  Card,
  CardHeader
} from "@/app/components";

if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
  throw new Error("NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set");
}

declare global {
  interface Window {
    google: any;
  }
}

const STR_GOOGLE_SIGNIN_BUTTON = "google-signin-button";

function Signin() {
  const router = useRouter();

  const { user, login } = useAuth();

  const googleSigninCallback = useCallback(async (response: any) => {
    try {
      // Decode the Google JWT token payload to extract user info
      // JWT format: header.payload.signature - we need the middle part (payload)
      // The payload is base64url-encoded JSON containing user data from Google
      const base64Url = response.credential.split(".")[1]; // Extract payload (middle part)
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/"); // Convert base64url to base64
      const jsonPayload = decodeURIComponent(
        atob(base64) // Decode base64 to string
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)) // Convert to URL-encoded hex
          .join("")
      );
      const userData = JSON.parse(jsonPayload); // Parse JSON to get user object

      // Send to backend
      const result = await authApi.googleLogin({
        googleId: userData.sub,
        email: userData.email,
        firstName: userData.given_name,
        lastName: userData.family_name,
        picture: userData.picture
      });

      // Store token and user data
      // Note: result.access_token is our backend's JWT (different from Google's JWT)
      // This token is used to authenticate future API requests to our backend
      login(result.access_token, result.user);
      router.push(PAGE_URLS.PROFILE);
    } catch (error) {
      console.error("Login error:", error);
      alert("Failed to sign in. Please try again.");
    }
  }, [login, router]);

  useEffect(() => {
    // Redirect if already logged in
    if (user) {
      router.push(PAGE_URLS.PROFILE);
      return;
    }

    // Load Google Sign-In script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: googleSigninCallback
        });

        window.google.accounts.id.renderButton(
          document.getElementById(STR_GOOGLE_SIGNIN_BUTTON),
          {
            theme: "outline",
            size: "large",
            width: 300
          }
        );
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [user, router, googleSigninCallback]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full">
        <Card className="space-y-8">
          <CardHeader
            title="Welcome"
            description="Sign in with your Google account to continue"
            className="text-center" />
          <div className="flex justify-center">
            <div id={STR_GOOGLE_SIGNIN_BUTTON}></div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Signin;