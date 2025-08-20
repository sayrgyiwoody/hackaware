"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const data = await fetchMe();
        if (isMounted) setUser(data);
      } catch (err) {
        console.error(err);
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const logout = () => {
    logoutUser();
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
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
