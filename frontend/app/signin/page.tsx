'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../providers';
import { authApi } from '@/lib/api';

declare global {
  interface Window {
    google: any;
  }
}

export default function SigninPage() {
  const router = useRouter();
  const { user, login } = useAuth();

  useEffect(() => {
    // Redirect if already logged in
    if (user) {
      router.push('/profile');
      return;
    }

    // Load Google Sign-In script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
          callback: handleCredentialResponse,
        });

        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-button'),
          {
            theme: 'outline',
            size: 'large',
            width: 300,
          }
        );
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [user, router]);

  const handleCredentialResponse = async (response: any) => {
    try {
      // Decode the JWT token to get user info
      const base64Url = response.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const userData = JSON.parse(jsonPayload);

      // Send to backend
      const result = await authApi.googleLogin({
        googleId: userData.sub,
        email: userData.email,
        firstName: userData.given_name,
        lastName: userData.family_name,
        picture: userData.picture,
      });

      // Store token and user data
      login(result.access_token, result.user);
      router.push('/profile');
    } catch (error) {
      console.error('Login error:', error);
      alert('Failed to sign in. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
          Welcome
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Sign in with your Google account to continue
        </p>
        <div className="flex justify-center">
          <div id="google-signin-button"></div>
        </div>
      </div>
    </div>
  );
}

