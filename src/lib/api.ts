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

// --- DATABASE AND COLLECTION IDS FOR APPWRITE ---
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "ai_photo_studio";
const THEMES_COLLECTION_ID = "themes";
const SELLERS_COLLECTION_ID = "sellers";
const ADS_COLLECTION_ID = "ads";
const GENERATIONS_COLLECTION_ID = "generations";
const TRANSACTIONS_COLLECTION_ID = "transactions";

// --- CORE SYSTEM API ---
export const api = {
  // --- CREDITS & BILLING ---
  getCredits: async (): Promise<number> => {
    if (!isAppwriteConfigured) {
      throw new Error("Appwrite not configured. Please set NEXT_PUBLIC_APPWRITE_ENDPOINT and NEXT_PUBLIC_APPWRITE_PROJECT_ID");
    }
    try {
      const user = await account.get();
      const prefs = await account.getPrefs();
      return prefs.credits ?? 0;
    } catch (error) {
      console.error("Error getting credits:", error);
      return 0;
    }
  },

  updateCredits: async (amount: number): Promise<number> => {
    if (!isAppwriteConfigured) {
      throw new Error("Appwrite not configured. Please set NEXT_PUBLIC_APPWRITE_ENDPOINT and NEXT_PUBLIC_APPWRITE_PROJECT_ID");
    }
    const prefs = await account.getPrefs();
    const current = prefs.credits ?? 0;
    const updated = Math.max(0, current + amount);
    await account.updatePrefs({ ...prefs, credits: updated });
    return updated;
  },

  getSubscriptionPlan: async (): Promise<string> => {
    if (!isAppwriteConfigured) {
      throw new Error("Appwrite not configured. Please set NEXT_PUBLIC_APPWRITE_ENDPOINT and NEXT_PUBLIC_APPWRITE_PROJECT_ID");
    }
    try {
      const prefs = await account.getPrefs();
      return prefs.plan ?? "Free";
    } catch (error) {
      console.error("Error getting subscription plan:", error);
      return "Free";
    }
  },

  updateSubscriptionPlan: async (plan: "Free" | "Premium" | "Pro"): Promise<string> => {
    if (!isAppwriteConfigured) {
      throw new Error("Appwrite not configured. Please set NEXT_PUBLIC_APPWRITE_ENDPOINT and NEXT_PUBLIC_APPWRITE_PROJECT_ID");
    }
    
    let creditsToAdd = 0;
    if (plan === "Premium") creditsToAdd = 100;
    if (plan === "Pro") creditsToAdd = 400;

    const prefs = await account.getPrefs();
    const updatedPrefs = { 
      ...prefs, 
      plan, 
      credits: (prefs.credits ?? 0) + creditsToAdd 
    };
    await account.updatePrefs(updatedPrefs);
    
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
    if (!isAppwriteConfigured) {
      throw new Error("Appwrite not configured. Please set NEXT_PUBLIC_APPWRITE_ENDPOINT and NEXT_PUBLIC_APPWRITE_PROJECT_ID");
    }
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
        isPopular: doc.isPopular,
        isFavorite: false // Favorites would need a separate collection or user prefs
      }));
    } catch (error) {
      console.error("Error getting themes:", error);
      return DEFAULT_THEMES;
    }
  },

  createTheme: async (theme: Omit<Theme, "id" | "isFavorite">): Promise<Theme> => {
    if (!isAppwriteConfigured) {
      throw new Error("Appwrite not configured. Please set NEXT_PUBLIC_APPWRITE_ENDPOINT and NEXT_PUBLIC_APPWRITE_PROJECT_ID");
    }
    
    const newTheme = {
      ...theme,
      isPopular: false
    };

    const doc = await databases.createDocument(
      DATABASE_ID,
      THEMES_COLLECTION_ID,
      ID.unique(),
      newTheme
    );
    
    return { ...newTheme, id: doc.$id };
  },

  toggleFavoriteTheme: async (themeId: string): Promise<boolean> => {
    // Favorites would be stored in user preferences or a separate collection
    // For now, this is a placeholder
    console.warn("toggleFavoriteTheme not fully implemented with Appwrite");
    return false;
  },

  // --- SELLERS ---
  getSellers: async (): Promise<Seller[]> => {
    if (!isAppwriteConfigured) {
      throw new Error("Appwrite not configured. Please set NEXT_PUBLIC_APPWRITE_ENDPOINT and NEXT_PUBLIC_APPWRITE_PROJECT_ID");
    }
    try {
      const res = await databases.listDocuments(DATABASE_ID, SELLERS_COLLECTION_ID);
      return res.documents.map(doc => doc as unknown as Seller);
    } catch (error) {
      console.error("Error getting sellers:", error);
      return DEFAULT_SELLERS;
    }
  },

  registerSeller: async (seller: Omit<Seller, "id" | "verificationStatus" | "earnings" | "rating" | "reviewCount">): Promise<Seller> => {
    if (!isAppwriteConfigured) {
      throw new Error("Appwrite not configured. Please set NEXT_PUBLIC_APPWRITE_ENDPOINT and NEXT_PUBLIC_APPWRITE_PROJECT_ID");
    }
    
    const newSeller: Seller = {
      ...seller,
      id: "s_" + Math.random().toString(36).substring(2, 9),
      verificationStatus: "pending",
      earnings: 0,
      rating: 5.0,
      reviewCount: 0
    };

    const doc = await databases.createDocument(
      DATABASE_ID,
      SELLERS_COLLECTION_ID,
      ID.unique(),
      newSeller
    );
    
    return { ...newSeller, id: doc.$id };
  },

  updateSellerStatus: async (sellerId: string, status: "approved" | "rejected"): Promise<void> => {
    if (!isAppwriteConfigured) {
      throw new Error("Appwrite not configured. Please set NEXT_PUBLIC_APPWRITE_ENDPOINT and NEXT_PUBLIC_APPWRITE_PROJECT_ID");
    }
    
    // Need to fetch document first, then update
    // This is a simplified version - in production you'd need proper document fetching
    console.warn("updateSellerStatus needs proper document fetching implementation");
  },

  // --- PHOTOGRAPHERS ---
  getPhotographers: async (): Promise<PhotographerAd[]> => {
    if (!isAppwriteConfigured) {
      throw new Error("Appwrite not configured. Please set NEXT_PUBLIC_APPWRITE_ENDPOINT and NEXT_PUBLIC_APPWRITE_PROJECT_ID");
    }
    try {
      const res = await databases.listDocuments(DATABASE_ID, ADS_COLLECTION_ID);
      return res.documents.map(doc => doc as unknown as PhotographerAd);
    } catch (error) {
      console.error("Error getting photographers:", error);
      return DEFAULT_PHOTOGRAPHERS;
    }
  },

  registerPhotographer: async (ad: Omit<PhotographerAd, "id" | "rating" | "reviewCount" | "status" | "isSponsored">): Promise<PhotographerAd> => {
    if (!isAppwriteConfigured) {
      throw new Error("Appwrite not configured. Please set NEXT_PUBLIC_APPWRITE_ENDPOINT and NEXT_PUBLIC_APPWRITE_PROJECT_ID");
    }
    
    const newAd: PhotographerAd = {
      ...ad,
      id: "p_" + Math.random().toString(36).substring(2, 9),
      rating: 5.0,
      reviewCount: 0,
      status: "pending",
      isSponsored: false
    };

    const doc = await databases.createDocument(
      DATABASE_ID,
      ADS_COLLECTION_ID,
      ID.unique(),
      newAd
    );
    
    return { ...newAd, id: doc.$id };
  },

  updatePhotographerStatus: async (adId: string, status: "approved" | "rejected", isSponsored = false): Promise<void> => {
    if (!isAppwriteConfigured) {
      throw new Error("Appwrite not configured. Please set NEXT_PUBLIC_APPWRITE_ENDPOINT and NEXT_PUBLIC_APPWRITE_PROJECT_ID");
    }
    
    // Need to fetch document first, then update
    console.warn("updatePhotographerStatus needs proper document fetching implementation");
  },

  // --- USER GENERATIONS (UPLOADS & OUTPUTS) ---
  getGenerations: async (): Promise<UserGeneration[]> => {
    if (!isAppwriteConfigured) {
      throw new Error("Appwrite not configured. Please set NEXT_PUBLIC_APPWRITE_ENDPOINT and NEXT_PUBLIC_APPWRITE_PROJECT_ID");
    }
    try {
      const res = await databases.listDocuments(DATABASE_ID, GENERATIONS_COLLECTION_ID);
      return res.documents.map(doc => doc as unknown as UserGeneration);
    } catch (error) {
      console.error("Error getting generations:", error);
      return DEFAULT_GENERATIONS;
    }
  },

  createGeneration: async (gen: Omit<UserGeneration, "id" | "createdAt">): Promise<UserGeneration> => {
    if (!isAppwriteConfigured) {
      throw new Error("Appwrite not configured. Please set NEXT_PUBLIC_APPWRITE_ENDPOINT and NEXT_PUBLIC_APPWRITE_PROJECT_ID");
    }
    
    const newGen: UserGeneration = {
      ...gen,
      id: "g_" + Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString()
    };

    const doc = await databases.createDocument(
      DATABASE_ID,
      GENERATIONS_COLLECTION_ID,
      ID.unique(),
      newGen
    );
    
    return { ...newGen, id: doc.$id };
  },

  // --- TRANSACTIONS ---
  getTransactions: async (): Promise<Transaction[]> => {
    if (!isAppwriteConfigured) {
      throw new Error("Appwrite not configured. Please set NEXT_PUBLIC_APPWRITE_ENDPOINT and NEXT_PUBLIC_APPWRITE_PROJECT_ID");
    }
    try {
      const res = await databases.listDocuments(DATABASE_ID, TRANSACTIONS_COLLECTION_ID);
      return res.documents.map(doc => doc as unknown as Transaction);
    } catch (error) {
      console.error("Error getting transactions:", error);
      return DEFAULT_TRANSACTIONS;
    }
  },

  createTransaction: async (tx: Omit<Transaction, "id" | "userId" | "date">): Promise<Transaction> => {
    if (!isAppwriteConfigured) {
      throw new Error("Appwrite not configured. Please set NEXT_PUBLIC_APPWRITE_ENDPOINT and NEXT_PUBLIC_APPWRITE_PROJECT_ID");
    }
    
    const user = await account.get();
    const newTx: Transaction = {
      ...tx,
      id: "tx_" + Math.random().toString(36).substring(2, 9),
      userId: user.$id,
      date: new Date().toISOString()
    };

    const doc = await databases.createDocument(
      DATABASE_ID,
      TRANSACTIONS_COLLECTION_ID,
      ID.unique(),
      newTx
    );
    
    return { ...newTx, id: doc.$id };
  },

  // --- REFERRALS ---
  getReferralCount: async (): Promise<number> => {
    // This would need to be stored in user preferences or a separate collection
    // For now, return a default value
    console.warn("getReferralCount needs proper implementation with Appwrite");
    return 0;
  },

  triggerReferral: async (friendName: string): Promise<void> => {
    if (!isAppwriteConfigured) {
      throw new Error("Appwrite not configured. Please set NEXT_PUBLIC_APPWRITE_ENDPOINT and NEXT_PUBLIC_APPWRITE_PROJECT_ID");
    }
    
    // Referral rewards referrer with 10 credits
    await api.updateCredits(10);
    
    await api.createTransaction({
      type: "referral_reward",
      credits: 10,
      description: `Referral signup bonus for friend (${friendName})`
    });
  }
};
