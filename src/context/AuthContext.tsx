"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { UserData, ApiResponse } from "@/types/api";
import apiClient from "@/lib/apiClient";

type AuthContextType = {
  user: UserData | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  isVerified: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  refreshUser: async () => {},
  isVerified: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get<ApiResponse<UserData>>("/admin/me");
      setUser(res.data.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const isVerified = !!user?.email_verified_at;

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser: fetchUser, isVerified }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
