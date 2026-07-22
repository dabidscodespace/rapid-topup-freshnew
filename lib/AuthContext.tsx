"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";

interface User {
  user_id: number;
  username: string;
  email: string;
  display_name?: string;
  balance?: number;
  whatsapp_number?: string;
  avatar_url?: string;
  token?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (
    username: string,
    password: string,
  ) => Promise<{ success: boolean; message: string }>;
  register: (
    username: string,
    email: string,
    password: string,
    whatsapp_number: string,
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 🌟 1. Define refreshUser FIRST so it can be used safely
  const refreshUser = useCallback(async () => {
    const currentUser =
      user ||
      (localStorage.getItem("arcade_user")
        ? JSON.parse(localStorage.getItem("arcade_user")!)
        : null);
    if (!currentUser?.token) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/headless/v1/auth/me?token=${encodeURIComponent(currentUser.token)}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store", // 🌟 CRITICAL: Forces Next.js to fetch fresh live data
        },
      );
      const data = await res.json();

      if (data.success) {
        const freshUser = { ...currentUser, ...data.data };
        setUser(freshUser);
        localStorage.setItem("arcade_user", JSON.stringify(freshUser));
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
    }
  }, [user]);

  // 🌟 2. Auto-fetch on mount (This was missing the fetch call!)
  useEffect(() => {
    const storedUser = localStorage.getItem("arcade_user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData); // Show cached UI instantly

      // 🌟 CRITICAL FIX: Immediately fetch fresh balance on page load
      const fetchFreshBalance = async () => {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/headless/v1/auth/me?token=${encodeURIComponent(userData.token)}`,
            {
              method: "GET",
              headers: { "Content-Type": "application/json" },
              cache: "no-store",
            },
          );
          const data = await res.json();
          if (data.success) {
            const freshUser = { ...userData, ...data.data };
            setUser(freshUser);
            localStorage.setItem("arcade_user", JSON.stringify(freshUser));
          }
        } catch (error) {
          console.error("Failed to fetch fresh balance on mount:", error);
        }
      };

      if (userData.token) {
        fetchFreshBalance();
      }
    }
    setLoading(false);
  }, []);

  // Listen for cross-tab updates
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "arcade_user") {
        if (e.newValue) {
          setUser(JSON.parse(e.newValue));
        } else {
          setUser(null);
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem("arcade_user", JSON.stringify(updatedUser));
  };

  const login = async (username: string, password: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/headless/v1/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        },
      );
      const data = await res.json();
      if (data.success) {
        setUser(data.data);
        localStorage.setItem("arcade_user", JSON.stringify(data.data));
        return { success: true, message: "Login successful!" };
      }
      return { success: false, message: data.message || "Login failed." };
    } catch (error) {
      return { success: false, message: "Network error." };
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string,
    whatsapp_number: string,
  ) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/headless/v1/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password, whatsapp_number }),
        },
      );
      const data = await res.json();
      if (data.success) {
        setUser(data.data);
        localStorage.setItem("arcade_user", JSON.stringify(data.data));
        return { success: true, message: "Registration successful!" };
      }
      return {
        success: false,
        message: data.message || "Registration failed.",
      };
    } catch (error) {
      return { success: false, message: "Network error." };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("arcade_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
