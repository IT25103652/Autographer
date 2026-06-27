import { isAppwriteConfigured, databases, account, storage } from "./appwrite";
import { ID, Query } from "appwrite";
import { 
  Theme, 
  Seller, 
  PhotographerAd, 
  UserGeneration, 
  Transaction,
  DEFAULT_THEMES,
  DEFAULT_SELLERS,
  DEFAULT_PHOTOGRAPHERS,
  DEFAULT_GENERATIONS,
  DEFAULT_TRANSACTIONS
} from "./mockData";

// --- DATABASE AND COLLECTION IDS FOR LIVE APPWRITE (FOR REFERENCE) ---
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "ai_photo_studio";
const THEMES_COLLECTION_ID = "themes";
const SELLERS_COLLECTION_ID = "sellers";
const ADS_COLLECTION_ID = "ads";
const GENERATIONS_COLLECTION_ID = "generations";
const TRANSACTIONS_COLLECTION_ID = "transactions";

// Helper to initialize LocalStorage if empty
const initializeLocalStorage = () => {
  if (typeof window === "undefined") return;
  
  if (!localStorage.getItem("ai_studio_themes")) {
    localStorage.setItem("ai_studio_themes", JSON.stringify(DEFAULT_THEMES));
  }
  if (!localStorage.getItem("ai_studio_sellers")) {
    localStorage.setItem("ai_studio_sellers", JSON.stringify(DEFAULT_SELLERS));
  }
  if (!localStorage.getItem("ai_studio_photographers")) {
    localStorage.setItem("ai_studio_photographers", JSON.stringify(DEFAULT_PHOTOGRAPHERS));
  }
  if (!localStorage.getItem("ai_studio_generations")) {
    localStorage.setItem("ai_studio_generations", JSON.stringify(DEFAULT_GENERATIONS));
  }
  if (!localStorage.getItem("ai_studio_transactions")) {
    localStorage.setItem("ai_studio_transactions", JSON.stringify(DEFAULT_TRANSACTIONS));
  }
  if (localStorage.getItem("ai_studio_user_credits") === null) {
    localStorage.setItem("ai_studio_user_credits", "5");
  }
  if (!localStorage.getItem("ai_studio_user_favorites")) {
    localStorage.setItem("ai_studio_user_favorites", JSON.stringify([]));
  }
  if (!localStorage.getItem("ai_studio_user_plan")) {
    localStorage.setItem("ai_studio_user_plan", "Free");
  }
  if (localStorage.getItem("ai_studio_referred_count") === null) {
    localStorage.setItem("ai_studio_referred_count", "1"); // Starts with 1 mock referral
  }
};

// Ensure init is run
if (typeof window !== "undefined") {
  initializeLocalStorage();
}

// --- UTILITIES FOR LOCAL STORAGE GET/SET ---
const getLocalStorageItem = <T>(key: string, defaultValue: T): T => {
  if (typeof window === "undefined") return defaultValue;
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : defaultValue;
};

const setLocalStorageItem = <T>(key: string, value: T): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
};

// --- CORE SYSTEM API ---
export const api = {
  // --- CREDITS & BILLING ---
  getCredits: async (): Promise<number> => {
    if (isAppwriteConfigured) {
      try {
        const user = await account.get();
        const prefs = await account.getPrefs();
        return prefs.credits ?? 0;
      } catch {
        return 0;
      }
    }
    return Number(localStorage.getItem("ai_studio_user_credits") || "5");
  },

  updateCredits: async (amount: number): Promise<number> => {
    if (isAppwriteConfigured) {
      const prefs = await account.getPrefs();
      const current = prefs.credits ?? 0;
      const updated = current + amount;
      await account.updatePrefs({ ...prefs, credits: updated });
      return updated;
    }
    const current = Number(localStorage.getItem("ai_studio_user_credits") || "5");
    const updated = Math.max(0, current + amount);
    localStorage.setItem("ai_studio_user_credits", updated.toString());
    return updated;
  },

  getSubscriptionPlan: async (): Promise<string> => {
    if (isAppwriteConfigured) {
      try {
        const prefs = await account.getPrefs();
        return prefs.plan ?? "Free";
      } catch {
        return "Free";
      }
    }
    return localStorage.getItem("ai_studio_user_plan") || "Free";
  },

  updateSubscriptionPlan: async (plan: "Free" | "Premium" | "Pro"): Promise<string> => {
    let creditsToAdd = 0;
    if (plan === "Premium") creditsToAdd = 100;
    if (plan === "Pro") creditsToAdd = 400;

    if (isAppwriteConfigured) {
      const prefs = await account.getPrefs();
      const updatedPrefs = { 
        ...prefs, 
        plan, 
        credits: (prefs.credits ?? 0) + creditsToAdd 
      };
      await account.updatePrefs(updatedPrefs);
      return plan;
    }

    localStorage.setItem("ai_studio_user_plan", plan);
    const current = Number(localStorage.getItem("ai_studio_user_credits") || "5");
    localStorage.setItem("ai_studio_user_credits", (current + creditsToAdd).toString());
    
    // Add transaction history entry
    await api.createTransaction({
      type: "purchase",
      credits: creditsToAdd,
      amount: plan === "Premium" ? 9.00 : 29.00,
      description: `Upgraded to ${plan} Plan`
    });

    return plan;
  },

  // --- THEMES ---
  getThemes: async (): Promise<Theme[]> => {
    if (isAppwriteConfigured) {
      try {
        const res = await databases.listDocuments(DATABASE_ID, THEMES_COLLECTION_ID);
        return res.documents.map(doc => ({
          id: doc.$id,
          name: doc.name,
          category: doc.category,
          prompt: doc.prompt,
          image: doc.image,
          creditCost: doc.creditCost,
          authorId: doc.authorId,
          authorName: doc.authorName,
          isPopular: doc.isPopular
        }));
      } catch {
        // Fall back to mock if Appwrite DB fails or is not setup
      }
    }
    const themes = getLocalStorageItem<Theme[]>("ai_studio_themes", DEFAULT_THEMES);
    const favorites = getLocalStorageItem<string[]>("ai_studio_user_favorites", []);
    return themes.map(theme => ({
      ...theme,
      isFavorite: favorites.includes(theme.id)
    }));
  },

  createTheme: async (theme: Omit<Theme, "id" | "isFavorite">): Promise<Theme> => {
    const newTheme = {
      ...theme,
      id: "t_" + Math.random().toString(36).substring(2, 9),
      isPopular: false
    };

    if (isAppwriteConfigured) {
      try {
        const doc = await databases.createDocument(
          DATABASE_ID,
          THEMES_COLLECTION_ID,
          ID.unique(),
          newTheme
        );
        return { ...newTheme, id: doc.$id };
      } catch {
        // Fallback to local
      }
    }

    const themes = getLocalStorageItem<Theme[]>("ai_studio_themes", DEFAULT_THEMES);
    themes.push(newTheme);
    setLocalStorageItem("ai_studio_themes", themes);
    return newTheme;
  },

  toggleFavoriteTheme: async (themeId: string): Promise<boolean> => {
    const favorites = getLocalStorageItem<string[]>("ai_studio_user_favorites", []);
    const index = favorites.indexOf(themeId);
    let isFavNow = false;
    
    if (index === -1) {
      favorites.push(themeId);
      isFavNow = true;
    } else {
      favorites.splice(index, 1);
    }
    
    setLocalStorageItem("ai_studio_user_favorites", favorites);
    return isFavNow;
  },

  // --- SELLERS ---
  getSellers: async (): Promise<Seller[]> => {
    if (isAppwriteConfigured) {
      try {
        const res = await databases.listDocuments(DATABASE_ID, SELLERS_COLLECTION_ID);
        return res.documents.map(doc => doc as unknown as Seller);
      } catch {}
    }
    return getLocalStorageItem<Seller[]>("ai_studio_sellers", DEFAULT_SELLERS);
  },

  registerSeller: async (seller: Omit<Seller, "id" | "verificationStatus" | "earnings" | "rating" | "reviewCount">): Promise<Seller> => {
    const newSeller: Seller = {
      ...seller,
      id: "s_" + Math.random().toString(36).substring(2, 9),
      verificationStatus: "pending",
      earnings: 0,
      rating: 5.0,
      reviewCount: 0
    };

    const sellers = getLocalStorageItem<Seller[]>("ai_studio_sellers", DEFAULT_SELLERS);
    sellers.push(newSeller);
    setLocalStorageItem("ai_studio_sellers", sellers);
    return newSeller;
  },

  updateSellerStatus: async (sellerId: string, status: "approved" | "rejected"): Promise<void> => {
    const sellers = getLocalStorageItem<Seller[]>("ai_studio_sellers", DEFAULT_SELLERS);
    const seller = sellers.find(s => s.id === sellerId);
    if (seller) {
      seller.verificationStatus = status;
      setLocalStorageItem("ai_studio_sellers", sellers);
    }
  },

  // --- PHOTOGRAPHERS ---
  getPhotographers: async (): Promise<PhotographerAd[]> => {
    if (isAppwriteConfigured) {
      try {
        const res = await databases.listDocuments(DATABASE_ID, ADS_COLLECTION_ID);
        return res.documents.map(doc => doc as unknown as PhotographerAd);
      } catch {}
    }
    return getLocalStorageItem<PhotographerAd[]>("ai_studio_photographers", DEFAULT_PHOTOGRAPHERS);
  },

  registerPhotographer: async (ad: Omit<PhotographerAd, "id" | "rating" | "reviewCount" | "status" | "isSponsored">): Promise<PhotographerAd> => {
    const newAd: PhotographerAd = {
      ...ad,
      id: "p_" + Math.random().toString(36).substring(2, 9),
      rating: 5.0,
      reviewCount: 0,
      status: "pending",
      isSponsored: false
    };

    const photographers = getLocalStorageItem<PhotographerAd[]>("ai_studio_photographers", DEFAULT_PHOTOGRAPHERS);
    photographers.push(newAd);
    setLocalStorageItem("ai_studio_photographers", photographers);
    return newAd;
  },

  updatePhotographerStatus: async (adId: string, status: "approved" | "rejected", isSponsored = false): Promise<void> => {
    const photographers = getLocalStorageItem<PhotographerAd[]>("ai_studio_photographers", DEFAULT_PHOTOGRAPHERS);
    const ad = photographers.find(p => p.id === adId);
    if (ad) {
      ad.status = status;
      ad.isSponsored = isSponsored;
      setLocalStorageItem("ai_studio_photographers", photographers);
    }
  },

  // --- USER GENERATIONS (UPLOADS & OUTPUTS) ---
  getGenerations: async (): Promise<UserGeneration[]> => {
    if (isAppwriteConfigured) {
      try {
        const res = await databases.listDocuments(DATABASE_ID, GENERATIONS_COLLECTION_ID);
        return res.documents.map(doc => doc as unknown as UserGeneration);
      } catch {}
    }
    return getLocalStorageItem<UserGeneration[]>("ai_studio_generations", DEFAULT_GENERATIONS);
  },

  createGeneration: async (gen: Omit<UserGeneration, "id" | "createdAt">): Promise<UserGeneration> => {
    const newGen: UserGeneration = {
      ...gen,
      id: "g_" + Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString()
    };

    if (isAppwriteConfigured) {
      try {
        await databases.createDocument(
          DATABASE_ID,
          GENERATIONS_COLLECTION_ID,
          ID.unique(),
          newGen
        );
      } catch {}
    }

    const generations = getLocalStorageItem<UserGeneration[]>("ai_studio_generations", DEFAULT_GENERATIONS);
    generations.unshift(newGen); // Add to top of list
    setLocalStorageItem("ai_studio_generations", generations);
    return newGen;
  },

  // --- TRANSACTIONS ---
  getTransactions: async (): Promise<Transaction[]> => {
    if (isAppwriteConfigured) {
      try {
        const res = await databases.listDocuments(DATABASE_ID, TRANSACTIONS_COLLECTION_ID);
        return res.documents.map(doc => doc as unknown as Transaction);
      } catch {}
    }
    return getLocalStorageItem<Transaction[]>("ai_studio_transactions", DEFAULT_TRANSACTIONS);
  },

  createTransaction: async (tx: Omit<Transaction, "id" | "userId" | "date">): Promise<Transaction> => {
    const newTx: Transaction = {
      ...tx,
      id: "tx_" + Math.random().toString(36).substring(2, 9),
      userId: "u1",
      date: new Date().toISOString()
    };

    if (isAppwriteConfigured) {
      try {
        await databases.createDocument(
          DATABASE_ID,
          TRANSACTIONS_COLLECTION_ID,
          ID.unique(),
          newTx
        );
      } catch {}
    }

    const transactions = getLocalStorageItem<Transaction[]>("ai_studio_transactions", DEFAULT_TRANSACTIONS);
    transactions.unshift(newTx);
    setLocalStorageItem("ai_studio_transactions", transactions);
    return newTx;
  },

  // --- REFERRALS ---
  getReferralCount: async (): Promise<number> => {
    return Number(localStorage.getItem("ai_studio_referred_count") || "1");
  },

  triggerReferral: async (friendName: string): Promise<void> => {
    const count = Number(localStorage.getItem("ai_studio_referred_count") || "0");
    localStorage.setItem("ai_studio_referred_count", (count + 1).toString());
    
    // Referral rewards referrer with 10 credits
    await api.updateCredits(10);
    
    await api.createTransaction({
      type: "referral_reward",
      credits: 10,
      description: `Referral signup bonus for friend (${friendName})`
    });
  }
};
