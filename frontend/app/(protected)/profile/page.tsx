"use client";

import {
  useState,
  useActionState,
  useId
} from "react";
import { useFormStatus } from "react-dom";
import {
  useMutation,
  useQueryClient
} from "@tanstack/react-query";

import { useAuth } from "@/app/contexts/auth-context";
import { QUERY_KEYS } from "@/app/constants";
import {
  userApi,
  UpdateUserProfile
} from "@/lib/api";
// ninja focus touch <
import {
  Button,
  type ButtonProps,
  Input,
  Card,
  Avatar,
  Alert,
  PageHeader
} from "@/app/components";
// ninja focus touch >

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <Button
      type="submit"
      disabled={pending}
      fullWidth>
      {pending ? "Saving..." : "Save Changes"}
    </Button>
  );
}

function CancelButton(props: ButtonProps) {
  const { pending } = useFormStatus();
  
  return (
    <Button
      type="button"
      variant="secondary"
      disabled={pending}
      fullWidth
      {...props}>
      Cancel
    </Button>
  );
}

interface FormState {
  error: string | null;
  success: boolean;
}

const FIRST_NAME_FIELD = "firstName";
const LAST_NAME_FIELD = "lastName";
const EMAIL_FIELD = "email";

function Profile() {
  const { user, logout } = useAuth();

  if (!user) {
    throw new Error("User must be authenticated to access this page. This error should not occur as ProtectedLayout should handle authentication.");
  }

  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);

  const id = useId();
  const emailId = `${id}-${EMAIL_FIELD}`;
  const firstNameId = `${id}-${FIRST_NAME_FIELD}`;
  const lastNameId = `${id}-${LAST_NAME_FIELD}`;

  const updateProfileMutation = useMutation({
    mutationFn: async (updateData: UpdateUserProfile) => {
      // Testing delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      return userApi.editProfile(updateData)
    },
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(QUERY_KEYS.USER_PROFILE, updatedProfile);
    }
  });

  const updateProfile = async (
    prevState: FormState,
    formData: FormData
  ): Promise<FormState> => {
    try {
      const updateData: UpdateUserProfile = {
        firstName: String(formData.get(FIRST_NAME_FIELD)) || undefined,
        lastName: String(formData.get(LAST_NAME_FIELD)) || undefined
      };

      await updateProfileMutation.mutateAsync(updateData);
      
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <PageHeader
            title="Profile"
            action={
              <Button
                variant="danger"
                onClick={logout}>
                Sign Out
              </Button>
            }
          />

          <div className="space-y-6">
            {/* Profile Picture */}
            {user.picture && (
              <Avatar
                src={user.picture}
                alt="Profile"
                size={128}
                className="mx-auto" />
            )}

            {/* Email (read-only) */}
            <Input
              id={emailId}
              type="email"
              label="Email"
              value={user.email}
              readOnly
              disabled />

            <form action={isEditing ? formAction : undefined} className="space-y-6">
              {/* First Name */}
              <Input
                id={firstNameId}
                type="text"
                name={FIRST_NAME_FIELD}
                label="First Name"
                defaultValue={user.firstName ?? ""}
                disabled={!isEditing} />

              {/* Last Name */}
              <Input
                id={lastNameId}
                type="text"
                name={LAST_NAME_FIELD}
                label="Last Name"
                defaultValue={user.lastName ?? ""}
                disabled={!isEditing} />

              {/* Error Message */}
              {isEditing && state.error && (
                <Alert variant="error">{state.error}</Alert>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                {isEditing ? (
                  <>
                    <CancelButton onClick={() => setIsEditing(false)} />
                    <SubmitButton />
                  </>
                ) : (
                  <Button
                    onClick={() => setIsEditing(true)}
                    fullWidth>
                    Edit Profile
                  </Button>
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
        </Card>
      </div>
    </div>
  );
}

export default Profile;