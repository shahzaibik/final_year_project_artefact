"use client";

import { useState, useEffect } from "react";
import Layout from "@/components/Dashboard/Layout";
import APIRoutes from "@/constants/apiRoutes";
import { DEFAULT_AVATAR_URL } from "@/constants/assets";

interface User {
  _id: string;
  name: string;
  lastName?: string;
  email: string;
  role: string;
  profileImage?: string | null;
}
// user profile page view + update profile information
const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState({
    name: "",
    lastName: "",
    email: "",
    profileImage: "" as string | null,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
// to fetch logged-in user details
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(APIRoutes.AUTH_ME, { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          setForm({
            name: data.name || "",
            lastName: data.lastName || "",
            email: data.email || "",
            profileImage: data.profileImage || null,
          });
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };
// to upload profile image to server
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "Please select an image file (e.g. JPG, PNG)." });
      return;
    }
    setUploadingImage(true);
    setMessage(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(APIRoutes.AUTH_UPLOAD_PROFILE_IMAGE, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Upload failed");
      }
      const data = await res.json();
      const profileImageUrl = data.profileImageUrl || data.profileImage;
      if (!profileImageUrl) throw new Error("No image URL returned");
      setForm((prev) => ({ ...prev, profileImage: profileImageUrl }));
      setMessage({ type: "success", text: "Profile image uploaded. Click Save to keep changes." });
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to upload image." });
    } finally {
      setUploadingImage(false);
    }
  };
// remove image locally 
  const handleRemoveImage = () => {
    setForm((prev) => ({ ...prev, profileImage: null }));
    setMessage({ type: "success", text: "Profile image removed. Click Save to keep changes." });
  };
// submit updated profile data
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        profileImage: form.profileImage && form.profileImage.trim() ? form.profileImage.trim() : null,
      };
      const res = await fetch(APIRoutes.AUTH_PROFILE, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Update failed");
      }
      setMessage({ type: "success", text: "Profile updated successfully." });
      window.location.reload();
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to update profile.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto p-4 text-primary">Loading...</div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto p-4 text-primary">Please log in to view your profile.</div>
      </Layout>
    );
  }

  const avatarSrc = form.profileImage && form.profileImage.trim()
    ? form.profileImage.trim()
    : DEFAULT_AVATAR_URL;

  return (
    <Layout>
      <div className="container mx-auto p-4 max-w-xl">
        <h1 className="text-2xl font-bold text-primary mb-6">My Profile</h1>

        {message && (
          <div
            className={`mb-4 p-3 rounded-lg text-sm ${
              message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile image */}
          <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4">
            <div className="relative">
              <img
                key={avatarSrc}
                src={avatarSrc}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover border-2 border-primary"
              />
              <label className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1.5 cursor-pointer hover:bg-primary/90">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                  disabled={uploadingImage}
                />
                <span className="text-xs">{uploadingImage ? "..." : "📷"}</span>
              </label>
            </div>
            <div className="text-sm text-gray-600 flex flex-col gap-2">
              <p>Click the camera icon to upload a new profile image.</p>
              <p className="mt-1">Supported: JPG, PNG, GIF</p>
              {form.profileImage && form.profileImage.trim() && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="text-red-600 hover:text-red-700 underline text-left"
                >
                  Remove profile image
                </button>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-primary mb-1">
              First Name
            </label>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-primary"
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-primary mb-1">
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              value={form.lastName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-primary"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-primary mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-primary"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-primary text-white rounded-lg py-3 font-semibold hover:bg-primary/90 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default ProfilePage;
