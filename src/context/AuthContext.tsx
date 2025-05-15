"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { UserData } from "@/lib/api";
import { ApiService } from "@/lib/api";

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

type AuthContextType = {
  user: UserData | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  refreshUser: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    setLoading(true);
    try {
      // Tambahkan generic <ApiResponse<UserData>>
      const res = await ApiService.request<ApiResponse<UserData>>({
        url: "/admin/me",
        method: "GET",
      });
      
      if (res.data.success) {
        setUser(res.data.data);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser: fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
