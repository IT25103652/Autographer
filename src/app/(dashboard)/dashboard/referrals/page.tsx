"use client";

import React, { useState } from "react";
import { useAuth } from "../../../../context/AuthContext";
import { useApp } from "../../../../context/AppContext";
import { 
  Gift, 
  Copy, 
  Check, 
  Users, 
  Zap, 
  Clock,
  Share2,
  ArrowRight,
  Trophy,
  Star
} from "lucide-react";

export default function ReferralsPage() {
  const { user } = useAuth();
  const { referralCount, referFriend } = useApp();
  const [copied, setCopied] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const referralLink = `https://aiphotostudio.me/invite/${user?.name?.toUpperCase() || "USER"}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  const mockStats = {
    totalReferred: referralCount,
    creditsEarned: referralCount * 20,
    pendingRewards: 0,
    totalEarnings: referralCount * 2.00
  };

  const mockReferredFriends = [
    { id: 1, name: "Alex Johnson", signupDate: "2026-06-24", verified: true, rewardClaimed: true },
    { id: 2, name: "Sarah Williams", signupDate: "2026-06-23", verified: true, rewardClaimed: true },
    { id: 3, name: "Mike Chen", signupDate: "2026-06-22", verified: true, rewardClaimed: true },
    { id: 4, name: "Emma Davis", signupDate: "2026-06-20", verified: false, rewardClaimed: false },
    { id: 5, name: "John Smith", signupDate: "2026-06-18", verified: true, rewardClaimed: true }
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateReferral = async () => {
    await referFriend("New Friend");
    showNotification("Simulated referral! +20 credits earned");
  };

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display font-black text-3xl text-white">Referral Center</h1>
        <p className="text-slate-400 text-sm mt-1">Invite friends and earn free credits together</p>
      </div>

      {/* Invite Card */}
      <div className="glass-card border border-white/10 rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative">
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            <div className="flex-1 space-y-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-xl">
                  <Gift className="h-6 w-6 text-white" />
                </div>
                <h2 className="font-display font-bold text-2xl text-white">Your Unique Referral Link</h2>
              </div>

              <p className="text-slate-400 text-sm leading-relaxed">
                Share this link with friends. When they sign up, both of you get 20 free credits instantly!
              </p>

              <div className="glass-panel border border-white/5 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={referralLink}
                    readOnly
                    className="flex-1 bg-transparent text-indigo-400 font-mono text-sm focus:outline-none"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 text-blue-400 font-semibold rounded-lg transition-all">
                  <Share2 className="h-4 w-4" />
                  <span>Share on Twitter</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600/10 border border-blue-600/20 hover:bg-blue-600/20 text-blue-400 font-semibold rounded-lg transition-all">
                  <Share2 className="h-4 w-4" />
                  <span>Share on Facebook</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 text-indigo-400 font-semibold rounded-lg transition-all">
                  <Share2 className="h-4 w-4" />
                  <span>Share on LinkedIn</span>
                </button>
              </div>
            </div>

            <div className="w-full lg:w-auto">
              <div className="glass-panel border border-white/5 rounded-2xl p-6 space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-black text-indigo-400 font-display">20</div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">Credits Per Referral</div>
                </div>
                <div className="pt-4 border-t border-white/5">
                  <button
                    onClick={handleSimulateReferral}
                    className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center space-x-2"
                  >
                    <Zap className="h-4 w-4" />
                    <span>Simulate Referral</span>
                  </button>
                  <p className="text-center text-slate-500 text-[10px] mt-2">Test the referral system</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Referral Mechanics Guide */}
      <div className="glass-card border border-white/10 rounded-2xl p-6">
        <h2 className="font-display font-bold text-lg text-white mb-6 flex items-center space-x-2">
          <Trophy className="h-5 w-5 text-yellow-400" />
          <span>How It Works</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-center w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
              <Share2 className="h-6 w-6 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm mb-1">1. Share Your Link</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Copy your unique referral link and share it with friends, family, or on social media
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-xl">
              <Users className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm mb-1">2. Friend Joins</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                When your friend signs up using your link, they get 20 free credits instantly
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-center w-12 h-12 bg-teal-500/10 border border-teal-500/20 rounded-xl">
              <Zap className="h-6 w-6 text-teal-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm mb-1">3. Both Get Rewarded</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                You also receive 20 free credits once your friend completes signup
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Earnings Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card border border-white/10 rounded-2xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-indigo-500/10 rounded-xl">
              <Users className="h-5 w-5 text-indigo-400" />
            </div>
            <div className="text-2xl font-black text-white font-display">{mockStats.totalReferred}</div>
          </div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Friends Referred</div>
        </div>

        <div className="glass-card border border-white/10 rounded-2xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-purple-500/10 rounded-xl">
              <Zap className="h-5 w-5 text-purple-400" />
            </div>
            <div className="text-2xl font-black text-white font-display">{mockStats.creditsEarned}</div>
          </div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Credits Earned</div>
        </div>

        <div className="glass-card border border-white/10 rounded-2xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-yellow-500/10 rounded-xl">
              <Clock className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="text-2xl font-black text-white font-display">{mockStats.pendingRewards}</div>
          </div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Rewards</div>
        </div>

        <div className="glass-card border border-white/10 rounded-2xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-teal-500/10 rounded-xl">
              <Trophy className="h-5 w-5 text-teal-400" />
            </div>
            <div className="text-2xl font-black text-white font-display">${mockStats.totalEarnings.toFixed(2)}</div>
          </div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Value</div>
        </div>
      </div>

      {/* Referred Friends Table */}
      <div className="glass-card border border-white/10 rounded-2xl p-6">
        <h2 className="font-display font-bold text-lg text-white mb-6 flex items-center space-x-2">
          <Star className="h-5 w-5 text-yellow-400" />
          <span>Your Referred Friends</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Friend Name</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Signup Date</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Verification Status</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Reward Status</th>
              </tr>
            </thead>
            <tbody>
              {mockReferredFriends.map((friend) => (
                <tr key={friend.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 text-sm text-white font-semibold">{friend.name}</td>
                  <td className="py-3 px-4 text-sm text-slate-400">{friend.signupDate}</td>
                  <td className="py-3 px-4">
                    {friend.verified ? (
                      <div className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-green-400" />
                        <span className="text-xs font-semibold text-green-400">Verified</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-yellow-400" />
                        <span className="text-xs font-semibold text-yellow-400">Pending</span>
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {friend.rewardClaimed ? (
                      <div className="flex items-center space-x-2">
                        <Zap className="h-4 w-4 text-indigo-400" />
                        <span className="text-xs font-semibold text-indigo-400">+20 Credits Claimed</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-slate-400" />
                        <span className="text-xs font-semibold text-slate-400">Awaiting Verification</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {mockReferredFriends.length === 0 && (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-slate-500 mx-auto mb-4" />
            <h3 className="font-display font-bold text-xl text-white mb-2">No referrals yet</h3>
            <p className="text-slate-400 text-sm mb-6">Start sharing your link to earn free credits!</p>
          </div>
        )}
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="fixed bottom-4 right-4 glass-card border border-green-500/30 bg-green-500/10 rounded-xl p-4 animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center space-x-3">
            <Check className="h-5 w-5 text-green-400" />
            <span className="text-white font-semibold text-sm">{notification}</span>
          </div>
        </div>
      )}
    </div>
  );
}
