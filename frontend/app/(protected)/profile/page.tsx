"use client";

import {
  useState,
  useActionState
} from "react";
import { useFormStatus } from "react-dom";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/app/contexts/auth-context";
import { QUERY_KEYS } from "@/app/constants";
import {
  userApi,
  UpdateUserProfile
} from "@/lib/api";

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex-1 px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? "Saving..." : "Save Changes"}
    </button>
  );
}

function CancelButton({ onCancel }: { onCancel: () => void }) {
  const { pending } = useFormStatus();
  
  return (
    <button
      type="button"
      onClick={onCancel}
      disabled={pending}
      className="flex-1 px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Cancel
    </button>
  );
}

interface FormState {
  error: string | null;
  success: boolean;
}

function Profile() {
  const {
    user,
    logout
  } = useAuth();

  if (!user) {
    throw new Error("User must be authenticated to access this page. This error should not occur as ProtectedLayout should handle authentication.");
  }

  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const updateProfile = async (
    prevState: FormState,
    formData: FormData
  ): Promise<FormState> => {
    try {
      const updateData: UpdateUserProfile = {
        firstName: String(formData.get("firstName")) || undefined,
        lastName: String(formData.get("lastName")) || undefined
      };

      const updatedProfile = await userApi.editProfile(updateData);
      
      // Testing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      queryClient.setQueryData(QUERY_KEYS.USER_PROFILE, updatedProfile);
      
      return { error: null, success: true };
    } catch (error) {
      console.error("Failed to update profile:", error);
      return {
        error: error instanceof Error ? error.message : "Failed to update profile. Please try again.",
        success: false
      };
    }
  };

  const [state, formAction] = useActionState(updateProfile, {
    error: null,
    success: false
  });

  const handleCancel = () => {
    setIsEditing(false);
  };

  // Close editing mode on successful update
  // useEffect(() => {
  //   if (state.success) {
  //     const timer = setTimeout(() => {
  //       handleCancel();
  //     }, 1500); // Close after showing success message for 1.5 seconds
  //     return () => clearTimeout(timer);
  //   }
  // }, [state.success]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Profile</h1>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Sign Out
            </button>
          </div>

          <div className="space-y-6">
            {/* Profile Picture */}
            {user.picture && (
              <div className="flex justify-center">
                <Image
                  src={user.picture}
                  alt="Profile"
                  width={128}
                  height={128}
                  priority
                  className="rounded-full border-4 border-indigo-500"
                />
              </div>
            )}

            {/* Email (read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-600 bg-gray-50"
              />
            </div>

            {/* Profile Form or Read-only View */}
            <form action={isEditing ? formAction : undefined} className="space-y-6">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  defaultValue={user.firstName || ""}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-600 ${isEditing ? "bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" : "bg-gray-50"}`}
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  defaultValue={user.lastName || ""}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-600 ${isEditing ? "bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" : "bg-gray-50"}`}
                />
              </div>

              {/* Error Message */}
              {isEditing && state.error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {state.error}
                </div>
              )}

              {/* Success Message */}
              {/* {isEditing && state.success && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                  Profile updated successfully!
                </div>
              )} */}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                {isEditing ? (
                  <>
                    <CancelButton onCancel={handleCancel} />
                    <SubmitButton />
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors font-medium"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </form>

            {/* Account Info */}
            <div className="pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Account created: {new Date(user.createdAt).toLocaleDateString()}
              </p>
              {user.updatedAt !== user.createdAt && (
                <p className="text-sm text-gray-500 mt-1">
                  Last updated: {new Date(user.updatedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;