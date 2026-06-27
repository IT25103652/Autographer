"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../lib/api";
import { Theme, Seller, PhotographerAd, UserGeneration, Transaction } from "../lib/mockData";
import { useAuth } from "./AuthContext";

interface AppContextType {
  credits: number;
  plan: string;
  themes: Theme[];
  sellers: Seller[];
  photographers: PhotographerAd[];
  generations: UserGeneration[];
  transactions: Transaction[];
  referralCount: number;
  loading: boolean;
  refreshData: () => Promise<void>;
  
  // Credit actions
  spendCredits: (amount: number, description: string) => Promise<boolean>;
  purchaseCredits: (amount: number, price: number, description: string) => Promise<void>;
  upgradePlan: (planName: "Free" | "Premium" | "Pro") => Promise<void>;
  
  // Theme actions
  createTheme: (theme: Omit<Theme, "id" | "isFavorite" | "authorId" | "authorName">) => Promise<Theme>;
  toggleFavorite: (themeId: string) => Promise<void>;
  
  // Creator Marketplace actions
  registerAsSeller: (skills: string[], portfolio: string[]) => Promise<Seller>;
  approveSeller: (sellerId: string, status: "approved" | "rejected") => Promise<void>;
  
  // Photographer Ads actions
  postPhotographerAd: (ad: Omit<PhotographerAd, "id" | "rating" | "reviewCount" | "status" | "isSponsored">) => Promise<PhotographerAd>;
  approvePhotographer: (adId: string, status: "approved" | "rejected", isSponsored?: boolean) => Promise<void>;
  
  // AI Generation actions
  saveGeneration: (tool: UserGeneration["tool"], beforeUrl: string, afterUrl: string, themeName?: string) => Promise<UserGeneration>;
  
  // Referral actions
  referFriend: (name: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [credits, setCredits] = useState(5);
  const [plan, setPlan] = useState("Free");
  const [themes, setThemes] = useState<Theme[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [photographers, setPhotographers] = useState<PhotographerAd[]>([]);
  const [generations, setGenerations] = useState<UserGeneration[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [referralCount, setReferralCount] = useState(1);
  const [loading, setLoading] = useState(true);

  const refreshData = async () => {
    try {
      const [
        userCredits,
        userPlan,
        allThemes,
        allSellers,
        allPhotographers,
        allGenerations,
        allTransactions,
        referredFriends
      ] = await Promise.all([
        api.getCredits(),
        api.getSubscriptionPlan(),
        api.getThemes(),
        api.getSellers(),
        api.getPhotographers(),
        api.getGenerations(),
        api.getTransactions(),
        api.getReferralCount()
      ]);

      setCredits(userCredits);
      setPlan(userPlan);
      setThemes(allThemes);
      setSellers(allSellers);
      setPhotographers(allPhotographers);
      setGenerations(allGenerations);
      setTransactions(allTransactions);
      setReferralCount(referredFriends);
    } catch (err) {
      console.error("Error refreshing application data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Trigger data load on mount or user changes
  useEffect(() => {
    refreshData();
  }, [user]);

  const spendCredits = async (amount: number, description: string): Promise<boolean> => {
    if (credits < amount) {
      return false;
    }
    const updated = await api.updateCredits(-amount);
    setCredits(updated);
    
    await api.createTransaction({
      type: "spend",
      credits: amount,
      description
    });
    
    await refreshData();
    return true;
  };

  const purchaseCredits = async (amount: number, price: number, description: string) => {
    const updated = await api.updateCredits(amount);
    setCredits(updated);
    
    await api.createTransaction({
      type: "purchase",
      credits: amount,
      amount: price,
      description
    });
    
    await refreshData();
  };

  const upgradePlan = async (planName: "Free" | "Premium" | "Pro") => {
    await api.updateSubscriptionPlan(planName);
    await refreshData();
  };

  const createTheme = async (themeData: Omit<Theme, "id" | "isFavorite" | "authorId" | "authorName">) => {
    const response = await api.createTheme({
      ...themeData,
      authorId: user?.id || "guest",
      authorName: user?.name || "Anonymous Creator"
    });
    await refreshData();
    return response;
  };

  const toggleFavorite = async (themeId: string) => {
    await api.toggleFavoriteTheme(themeId);
    // Refresh theme list locally
    setThemes(prev => 
      prev.map(t => t.id === themeId ? { ...t, isFavorite: !t.isFavorite } : t)
    );
  };

  const registerAsSeller = async (skills: string[], portfolio: string[]) => {
    const response = await api.registerSeller({
      name: user?.name || "Anonymous Creator",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
      skills,
      portfolio
    });
    await refreshData();
    return response;
  };

  const approveSeller = async (sellerId: string, status: "approved" | "rejected") => {
    await api.updateSellerStatus(sellerId, status);
    await refreshData();
  };

  const postPhotographerAd = async (adData: Omit<PhotographerAd, "id" | "rating" | "reviewCount" | "status" | "isSponsored">) => {
    const response = await api.registerPhotographer(adData);
    await refreshData();
    return response;
  };

  const approvePhotographer = async (adId: string, status: "approved" | "rejected", isSponsored = false) => {
    await api.updatePhotographerStatus(adId, status, isSponsored);
    await refreshData();
  };

  const saveGeneration = async (tool: UserGeneration["tool"], beforeUrl: string, afterUrl: string, themeName?: string) => {
    const response = await api.createGeneration({
      userId: user?.id || "guest",
      tool,
      beforeUrl,
      afterUrl,
      themeName
    });
    await refreshData();
    return response;
  };

  const referFriend = async (friendName: string) => {
    await api.triggerReferral(friendName);
    await refreshData();
  };

  return (
    <AppContext.Provider
      value={{
        credits,
        plan,
        themes,
        sellers,
        photographers,
        generations,
        transactions,
        referralCount,
        loading,
        refreshData,
        spendCredits,
        purchaseCredits,
        upgradePlan,
        createTheme,
        toggleFavorite,
        registerAsSeller,
        approveSeller,
        postPhotographerAd,
        approvePhotographer,
        saveGeneration,
        referFriend
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
