"use client";
import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { fetchMe, logoutUser } from "@/lib/authService";

interface AuthContextType {
  user: {
    username: string;
    email: string;
    expertise: string;
    learning_style: string;
    password: string;
  } | null;
  loading: boolean;
  logout: () => void;
  refetch: () => Promise<void>; // 👈 added
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  //  Wrap the fetch logic in useCallback so it's stable
  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchMe();
      setUser(data);
    } catch (err) {
      console.error(err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch(); // run once on mount
  }, [refetch]);

  const logout = () => {
    logoutUser();
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, refetch }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for easy access in components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
