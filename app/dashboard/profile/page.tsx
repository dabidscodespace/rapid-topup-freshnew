"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/AuthContext";
import { User, Phone, Save, Loader2, Lock, Camera, Upload } from "lucide-react";

export default function ProfilePage() {
  const { user, updateUser, refreshUser } = useAuth();
  const fileInputRef = useRef(null);

  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);

  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);

  const [profileMessage, setProfileMessage] = useState({ type: "", text: "" });
  const [passwordMessage, setPasswordMessage] = useState({
    type: "",
    text: "",
  });
  const [avatarMessage, setAvatarMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setDisplayName(user.display_name || user.username || "");
      setWhatsapp(user.whatsapp_number || "");
      setAvatarPreview(user.avatar_url || "");
    }
  }, [user]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMessage({ type: "", text: "" });

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/headless/v1/auth/profile`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token || ""}`,
          },
          body: JSON.stringify({
            display_name: displayName,
            whatsapp_number: whatsapp,
            token: user?.token,
          }),
        },
      );
      const data = await res.json();
      console.log("Profile response:", data);

      if (data.success) {
        setProfileMessage({
          type: "success",
          text: data.message || "Profile updated!",
        });
        updateUser(data.data);
        setTimeout(() => {
          refreshUser();
        }, 500);
      } else {
        setProfileMessage({
          type: "error",
          text: data.message || "Failed to update.",
        });
      }
    } catch (err) {
      console.error("Profile error:", err);
      setProfileMessage({ type: "error", text: "Network error." });
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordMessage({ type: "", text: "" });

    if (newPassword !== confirmPassword) {
      setPasswordMessage({
        type: "error",
        text: "New passwords do not match.",
      });
      setPasswordLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/headless/v1/auth/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token || ""}`,
          },
          body: JSON.stringify({
            current_password: currentPassword,
            new_password: newPassword,
            token: user?.token,
          }),
        },
      );
      const data = await res.json();

      if (data.success) {
        setPasswordMessage({
          type: "success",
          text: "Password changed successfully!",
        });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordMessage({
          type: "error",
          text: data.message || "Failed to change password.",
        });
      }
    } catch (err) {
      setPasswordMessage({ type: "error", text: "Network error." });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;

    setAvatarLoading(true);
    setAvatarMessage({ type: "", text: "" });

    const formData = new FormData();
    formData.append("avatar", avatarFile);
    formData.append("token", user?.token || "");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/headless/v1/auth/upload-avatar`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${user?.token || ""}` },
          body: formData,
        },
      );
      const data = await res.json();

      if (data.success) {
        setAvatarMessage({
          type: "success",
          text: "Avatar uploaded successfully!",
        });
        setAvatarFile(null);
        updateUser({ avatar_url: data.data.avatar_url });
        setAvatarPreview(data.data.avatar_url);
      } else {
        setAvatarMessage({
          type: "error",
          text: data.message || "Failed to upload.",
        });
      }
    } catch (err) {
      setAvatarMessage({ type: "error", text: "Network error." });
    } finally {
      setAvatarLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-4 border-[#00f0ff] bg-[#1a0b2e] p-6 shadow-hard-cyan relative">
        <div className="absolute inset-0 crt-overlay opacity-10 pointer-events-none" />
        <div className="relative z-10 flex items-center gap-3">
          <User className="h-8 w-8 text-[#00f0ff]" />
          <h1 className="font-pixel text-xl text-[#fcee0a] text-glow-yellow">
            PLAYER PROFILE
          </h1>
        </div>
      </div>

      <div className="border-4 border-[#fcee0a] bg-[#1a0b2e] p-6 md:p-8 shadow-hard-yellow relative">
        <div className="absolute inset-0 crt-overlay opacity-10 pointer-events-none" />
        <div className="relative z-10">
          <h2 className="font-pixel text-sm text-[#fcee0a] mb-4 uppercase">
            Profile Picture
          </h2>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-32 h-32 border-4 border-[#00f0ff] bg-[#0a0118] flex items-center justify-center overflow-hidden shadow-hard-cyan">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-16 w-16 text-[#00f0ff]" />
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 w-10 h-10 border-2 border-[#fcee0a] bg-[#1a0b2e] flex items-center justify-center text-[#fcee0a] hover:bg-[#fcee0a] hover:text-black transition-all btn-press"
              >
                <Camera className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <p className="font-sans text-sm text-white mb-2">
                Upload a new profile picture. JPG, PNG, GIF, or WEBP. Max 2MB.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarSelect}
                className="hidden"
              />
              <button
                type="button"
                onClick={handleAvatarUpload}
                disabled={!avatarFile || avatarLoading}
                className="inline-flex items-center gap-2 border-2 border-[#fcee0a] bg-[#0a0118] px-4 py-2 font-sans text-sm font-bold text-[#fcee0a] hover:bg-[#fcee0a] hover:text-black transition-all btn-press disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {avatarLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                {avatarLoading ? "UPLOADING..." : "UPLOAD AVATAR"}
              </button>
              {avatarMessage.text && (
                <p
                  className={`mt-2 text-xs font-bold ${avatarMessage.type === "success" ? "text-[#00f0ff]" : "text-[#ff00de]"}`}
                >
                  {avatarMessage.text}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="border-4 border-[#ff00de] bg-[#1a0b2e] p-6 md:p-8 shadow-hard-pink relative">
        <div className="absolute inset-0 crt-overlay opacity-10 pointer-events-none" />
        <div className="relative z-10">
          <h2 className="font-pixel text-sm text-[#ff00de] mb-4 uppercase">
            Account Information
          </h2>
          <form onSubmit={handleProfileSave} className="space-y-6 max-w-2xl">
            <div>
              <label className="block font-pixel text-[10px] text-gray-400 mb-2 uppercase">
                Username
              </label>
              <input
                type="text"
                value={username}
                readOnly
                className="w-full border-4 border-gray-700 bg-[#0a0118]/50 p-3 font-sans text-sm text-gray-400 cursor-not-allowed"
              />
              <p className="text-[10px] text-gray-500 mt-1">
                Username cannot be changed after registration.
              </p>
            </div>
            <div>
              <label className="block font-pixel text-[10px] text-gray-400 mb-2 uppercase">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full border-4 border-[#00f0ff] bg-[#0a0118] p-3 font-sans text-sm text-white placeholder-gray-600 focus:border-[#fcee0a] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-pixel text-[10px] text-gray-400 mb-2 uppercase">
                WhatsApp Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#00f0ff]" />
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full border-4 border-[#00f0ff] bg-[#0a0118] p-3 pl-10 font-sans text-sm text-white placeholder-gray-600 focus:border-[#fcee0a] focus:outline-none"
                  placeholder="e.g., +8801XXXXXXXXX"
                />
              </div>
            </div>
            {profileMessage.text && (
              <div
                className={`border-4 p-3 font-sans text-sm text-center font-bold ${profileMessage.type === "success" ? "border-[#00f0ff] bg-[#00f0ff]/10 text-[#00f0ff]" : "border-[#ff00de] bg-[#ff00de]/10 text-[#ff00de]"}`}
              >
                {profileMessage.text}
              </div>
            )}
            <button
              type="submit"
              disabled={profileLoading}
              className="flex items-center justify-center gap-2 border-4 border-[#fcee0a] bg-[#ff00de] px-6 py-3 font-sans font-bold text-white shadow-hard-pink btn-press hover:bg-[#fcee0a] hover:text-black hover:border-black transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase"
            >
              {profileLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Save className="h-5 w-5" />
              )}
              {profileLoading ? "SAVING..." : "SAVE CHANGES"}
            </button>
          </form>
        </div>
      </div>

      <div className="border-4 border-[#00f0ff] bg-[#1a0b2e] p-6 md:p-8 shadow-hard-cyan relative">
        <div className="absolute inset-0 crt-overlay opacity-10 pointer-events-none" />
        <div className="relative z-10">
          <h2 className="font-pixel text-sm text-[#00f0ff] mb-4 uppercase flex items-center gap-2">
            <Lock className="h-5 w-5" /> Change Password
          </h2>
          <form onSubmit={handlePasswordChange} className="space-y-6 max-w-2xl">
            <div>
              <label className="block font-pixel text-[10px] text-gray-400 mb-2 uppercase">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full border-4 border-[#00f0ff] bg-[#0a0118] p-3 font-sans text-sm text-white placeholder-gray-600 focus:border-[#fcee0a] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-pixel text-[10px] text-gray-400 mb-2 uppercase">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full border-4 border-[#00f0ff] bg-[#0a0118] p-3 font-sans text-sm text-white placeholder-gray-600 focus:border-[#fcee0a] focus:outline-none"
                placeholder="Min 6 characters"
              />
            </div>
            <div>
              <label className="block font-pixel text-[10px] text-gray-400 mb-2 uppercase">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full border-4 border-[#00f0ff] bg-[#0a0118] p-3 font-sans text-sm text-white placeholder-gray-600 focus:border-[#fcee0a] focus:outline-none"
                placeholder="Re-enter new password"
              />
            </div>
            {passwordMessage.text && (
              <div
                className={`border-4 p-3 font-sans text-sm text-center font-bold ${passwordMessage.type === "success" ? "border-[#00f0ff] bg-[#00f0ff]/10 text-[#00f0ff]" : "border-[#ff00de] bg-[#ff00de]/10 text-[#ff00de]"}`}
              >
                {passwordMessage.text}
              </div>
            )}
            <button
              type="submit"
              disabled={passwordLoading}
              className="flex items-center justify-center gap-2 border-4 border-[#fcee0a] bg-[#ff00de] px-6 py-3 font-sans font-bold text-white shadow-hard-pink btn-press hover:bg-[#fcee0a] hover:text-black hover:border-black transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase"
            >
              {passwordLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Lock className="h-5 w-5" />
              )}
              {passwordLoading ? "CHANGING..." : "CHANGE PASSWORD"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
