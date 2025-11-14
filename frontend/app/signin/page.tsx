"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/app/contexts/auth-context";
import { Card, CardHeader } from "@/app/components";
import { PAGE_URLS } from "@/app/constants";

if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
  throw new Error("NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set");
}

interface CredentialResponse {
  credential: string;
  select_by?: string;
}

interface GoogleAccounts {
  accounts: {
    id: {
      initialize: (config: {
        client_id: string;
        callback: (response: CredentialResponse) => void;
      }) => void;
      renderButton: (
        element: HTMLElement | null,
        options: {
          theme?: string;
          size?: string;
          width?: number;
        }
      ) => void;
    };
  };
}

declare global {
  interface Window {
    google?: GoogleAccounts;
  }
}

const STR_GOOGLE_SIGNIN_BUTTON = "google-signin-button";

/**
 * Sign-in page component with Google OAuth integration.
 * @returns The sign-in page component JSX
 */
function Signin() {
  const router = useRouter();

  const { user, login } = useAuth();

  const googleSigninCallback = useCallback(
    async (response: CredentialResponse) => {
      try {
        await login(response.credential);
        router.push(PAGE_URLS.PROFILE);
      } catch (error) {
        console.error("Login error:", error);
        alert("Failed to sign in. Please try again.");
      }
    },
    [login, router]
  );

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
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        if (!clientId) {
          throw new Error("NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set");
        }
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: googleSigninCallback,
        });

        window.google.accounts.id.renderButton(document.getElementById(STR_GOOGLE_SIGNIN_BUTTON), {
          theme: "outline",
          size: "large",
          width: 300,
        });
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [user, router, googleSigninCallback]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full">
        <Card className="space-y-8">
          <CardHeader
            title="Welcome"
            description="Sign in with your Google account to continue"
            className="text-center"
          />
          <div className="flex justify-center">
            <div id={STR_GOOGLE_SIGNIN_BUTTON} />
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Signin;
