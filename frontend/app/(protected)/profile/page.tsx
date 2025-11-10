"use client";

import { useState } from "react";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/app/contexts/auth-context";
import { QUERY_KEYS } from "@/app/constants";
import { userApi, UpdateProfileData } from "@/lib/api";

function Profile() {
  const queryClient = useQueryClient();
  
  const {
    user,
    logout
  } = useAuth();

  if (!user) {
    throw new Error("User must be authenticated to access this page. This error should not occur as ProtectedLayout should handle authentication.");
  }

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UpdateProfileData>({
    firstName: user.firstName || "",
    lastName: user.lastName || ""
  });
  const [saving, setSaving] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedProfile = await userApi.editProfile(formData);
      // Invalidate and refetch the user profile query
      queryClient.setQueryData(QUERY_KEYS.USER_PROFILE, updatedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || ""
      });
    }
    setIsEditing(false);
  };

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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>

            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg ${
                  isEditing
                    ? "bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    : "bg-gray-50 text-gray-600"
                }`}
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
                value={formData.lastName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg ${
                  isEditing
                    ? "bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    : "bg-gray-50 text-gray-600"
                }`}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors font-medium"
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="flex-1 px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors font-medium disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </>
              )}
            </div>

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
};

export default Profile;