"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { isAppwriteConfigured, account } from "../lib/appwrite";
import { ID } from "appwrite";

export type UserRole = "user" | "seller" | "photographer" | "admin";

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: UserSession | null;
  loading: boolean;
  login: (email: string, password: String) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USER: UserSession = {
  id: "u1",
  name: "Guest Student",
  email: "student@photostudio.com",
  role: "user",
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!isAppwriteConfigured) {
        console.error("Appwrite not configured. Please set NEXT_PUBLIC_APPWRITE_ENDPOINT and NEXT_PUBLIC_APPWRITE_PROJECT_ID");
        setUser(null);
        setLoading(false);
        return;
      }
      
      try {
        const appwriteUser = await account.get();
        // Load role from prefs or default to user
        const prefs = await account.getPrefs();
        setUser({
          id: appwriteUser.$id,
          name: appwriteUser.name,
          email: appwriteUser.email,
          role: (prefs.role as UserRole) || "user",
        });
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email: string, password: String) => {
    setLoading(true);
    if (isAppwriteConfigured) {
      try {
        await account.createEmailPasswordSession(email, password as string);
        const appwriteUser = await account.get();
        const prefs = await account.getPrefs();
        setUser({
          id: appwriteUser.$id,
          name: appwriteUser.name,
          email: appwriteUser.email,
          role: (prefs.role as UserRole) || "user",
        });
      } catch (err) {
        setLoading(false);
        throw err;
      }
    } else {
      throw new Error("Appwrite not configured. Please set NEXT_PUBLIC_APPWRITE_ENDPOINT and NEXT_PUBLIC_APPWRITE_PROJECT_ID");
    }
    setLoading(false);
  };

  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    if (isAppwriteConfigured) {
      try {
        await account.create(ID.unique(), email, password, name);
        // Automatically login
        await account.createEmailPasswordSession(email, password);
        const appwriteUser = await account.get();
        setUser({
          id: appwriteUser.$id,
          name: appwriteUser.name,
          email: appwriteUser.email,
          role: "user",
        });
      } catch (err) {
        setLoading(false);
        throw err;
      }
    } else {
      throw new Error("Appwrite not configured. Please set NEXT_PUBLIC_APPWRITE_ENDPOINT and NEXT_PUBLIC_APPWRITE_PROJECT_ID");
    }
    setLoading(false);
  };

  const logout = async () => {
    if (!isAppwriteConfigured) {
      throw new Error("Appwrite not configured. Please set NEXT_PUBLIC_APPWRITE_ENDPOINT and NEXT_PUBLIC_APPWRITE_PROJECT_ID");
    }
    
    setLoading(true);
    try {
      await account.deleteSession("current");
    } catch (e) {
      console.error(e);
    }
    setUser(null);
    setLoading(false);
  };

  const switchRole = async (role: UserRole) => {
    if (!user || !isAppwriteConfigured) {
      throw new Error("Appwrite not configured. Please set NEXT_PUBLIC_APPWRITE_ENDPOINT and NEXT_PUBLIC_APPWRITE_PROJECT_ID");
    }
    
    const updated = { ...user, role };
    setUser(updated);
    
    try {
      const prefs = await account.getPrefs();
      await account.updatePrefs({ ...prefs, role });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
