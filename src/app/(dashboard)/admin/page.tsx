"use client";

import React, { useState } from "react";
import { useApp } from "../../../context/AppContext";
import { 
  Shield, 
  Users, 
  Zap, 
  DollarSign, 
  Server, 
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Power,
  Database,
  AlertTriangle
} from "lucide-react";

export default function AdminDashboard() {
  const { credits, refreshData } = useApp();
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [cpuLoad, setCpuLoad] = useState(67);
  const [gpuLoad, setGpuLoad] = useState(82);
  const [notification, setNotification] = useState<string | null>(null);

  const mockMetrics = {
    totalUsers: 1247,
    totalCreditsConsumed: 45890,
    totalRevenue: 12450.75,
    activeServers: 8,
    pendingApprovals: 12
  };

  const mockTransactions = [
    { id: "tx1", userId: "u_alex99", type: "purchase", credits: 100, amount: 9.99, status: "success", date: "2026-06-25 02:15" },
    { id: "tx2", userId: "u_sarah88", type: "spend", credits: 3, amount: null, status: "success", date: "2026-06-25 02:12" },
    { id: "tx3", userId: "u_mike77", type: "purchase", credits: 500, amount: 39.99, status: "processing", date: "2026-06-25 02:10" },
    { id: "tx4", userId: "u_emma66", type: "spend", credits: 2, amount: null, status: "success", date: "2026-06-25 02:08" },
    { id: "tx5", userId: "u_john55", type: "purchase", credits: 50, amount: 4.99, status: "failed", date: "2026-06-25 02:05" },
    { id: "tx6", userId: "u_lisa44", type: "spend", credits: 5, amount: null, status: "success", date: "2026-06-25 02:02" }
  ];

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleFlushCache = () => {
    showNotification("Mock cache flushed successfully!");
  };

  const handleGrantBonus = async () => {
    showNotification("Granted +50 credits to all users!");
    await refreshData();
  };

  const toggleMaintenance = () => {
    setMaintenanceMode(!maintenanceMode);
    showNotification(maintenanceMode ? "Maintenance mode disabled" : "Maintenance mode enabled");
  };

  return (
    <div className="w-full space-y-6">
      {/* Admin Mode Banner */}
      <div className="glass-card border border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-yellow-500/20 rounded-xl">
            <Shield className="h-5 w-5 text-yellow-400" />
          </div>
          <div>
            <h2 className="font-display font-bold text-lg text-yellow-300">Admin Mode Active</h2>
            <p className="text-yellow-400/70 text-xs">Full system access enabled</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${maintenanceMode ? "bg-red-500 animate-pulse" : "bg-green-500"}`} />
          <span className="text-xs font-semibold text-yellow-300">
            {maintenanceMode ? "Maintenance Mode" : "System Online"}
          </span>
        </div>
      </div>

      {/* Platform Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card border border-white/10 rounded-2xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-indigo-500/10 rounded-xl">
              <Users className="h-5 w-5 text-indigo-400" />
            </div>
            <div className="text-2xl font-black text-white font-display">{mockMetrics.totalUsers}</div>
          </div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Users</div>
        </div>

        <div className="glass-card border border-white/10 rounded-2xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-purple-500/10 rounded-xl">
              <Zap className="h-5 w-5 text-purple-400" />
            </div>
            <div className="text-2xl font-black text-white font-display">{mockMetrics.totalCreditsConsumed.toLocaleString()}</div>
          </div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Credits Consumed</div>
        </div>

        <div className="glass-card border border-white/10 rounded-2xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-teal-500/10 rounded-xl">
              <DollarSign className="h-5 w-5 text-teal-400" />
            </div>
            <div className="text-2xl font-black text-white font-display">${mockMetrics.totalRevenue.toLocaleString()}</div>
          </div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Revenue</div>
        </div>

        <div className="glass-card border border-white/10 rounded-2xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-pink-500/10 rounded-xl">
              <Server className="h-5 w-5 text-pink-400" />
            </div>
            <div className="text-2xl font-black text-white font-display">{mockMetrics.activeServers}</div>
          </div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active AI Servers</div>
        </div>
      </div>

      {/* System Status Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card border border-white/10 rounded-2xl p-6">
          <h2 className="font-display font-bold text-lg text-white mb-6 flex items-center space-x-2">
            <Activity className="h-5 w-5 text-indigo-400" />
            <span>AI Inference Cluster Status</span>
          </h2>

          <div className="space-y-6">
            {/* CPU Load */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">CPU Load</span>
                <span className="text-sm font-bold text-white">{cpuLoad}%</span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${cpuLoad > 80 ? "bg-red-500" : cpuLoad > 60 ? "bg-yellow-500" : "bg-green-500"}`}
                  style={{ width: `${cpuLoad}%` }}
                />
              </div>
            </div>

            {/* GPU Load */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">GPU Load</span>
                <span className="text-sm font-bold text-white">{gpuLoad}%</span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${gpuLoad > 80 ? "bg-red-500" : gpuLoad > 60 ? "bg-yellow-500" : "bg-green-500"}`}
                  style={{ width: `${gpuLoad}%` }}
                />
              </div>
            </div>

            {/* Memory Usage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Memory Usage</span>
                <span className="text-sm font-bold text-white">45%</span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500" style={{ width: "45%" }} />
              </div>
            </div>

            {/* Storage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Storage Used</span>
                <span className="text-sm font-bold text-white">72%</span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-500" style={{ width: "72%" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Admin Actions */}
        <div className="glass-card border border-white/10 rounded-2xl p-6">
          <h2 className="font-display font-bold text-lg text-white mb-6 flex items-center space-x-2">
            <RefreshCw className="h-5 w-5 text-purple-400" />
            <span>Quick Admin Actions</span>
          </h2>

          <div className="space-y-3">
            <button
              onClick={handleFlushCache}
              className="w-full p-4 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 rounded-xl text-left transition-all group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-500/10 rounded-lg group-hover:bg-indigo-500/20 transition-colors">
                  <Database className="h-4 w-4 text-indigo-400" />
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">Flush Mock Cache</div>
                  <div className="text-slate-500 text-xs">Clear all temporary mock data</div>
                </div>
              </div>
            </button>

            <button
              onClick={handleGrantBonus}
              className="w-full p-4 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 rounded-xl text-left transition-all group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-teal-500/10 rounded-lg group-hover:bg-teal-500/20 transition-colors">
                  <Zap className="h-4 w-4 text-teal-400" />
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">Grant Global +50 Credits</div>
                  <div className="text-slate-500 text-xs">Bonus for all registered users</div>
                </div>
              </div>
            </button>

            <button
              onClick={toggleMaintenance}
              className={`w-full p-4 border rounded-xl text-left transition-all group ${
                maintenanceMode
                  ? "bg-red-500/10 border-red-500/30 hover:bg-red-500/20"
                  : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg group-hover:opacity-80 transition-colors ${
                  maintenanceMode ? "bg-red-500/20" : "bg-yellow-500/10"
                }`}>
                  <Power className={`h-4 w-4 ${maintenanceMode ? "text-red-400" : "text-yellow-400"}`} />
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">
                    {maintenanceMode ? "Disable Maintenance Mode" : "Enable Maintenance Mode"}
                  </div>
                  <div className="text-slate-500 text-xs">
                    {maintenanceMode ? "Bring system back online" : "Take system offline for updates"}
                  </div>
                </div>
              </div>
            </button>

            <div className="p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-xl">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-4 w-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-yellow-300 font-semibold text-sm">Pending Approvals</div>
                  <div className="text-slate-400 text-xs">{mockMetrics.pendingApprovals} items awaiting review</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions & Logs */}
      <div className="glass-card border border-white/10 rounded-2xl p-6">
        <h2 className="font-display font-bold text-lg text-white mb-6 flex items-center space-x-2">
          <Clock className="h-5 w-5 text-indigo-400" />
          <span>Recent Transactions & System Logs</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Transaction ID</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">User ID</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Credits</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody>
              {mockTransactions.map((tx) => (
                <tr key={tx.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 text-sm text-white font-mono">{tx.id}</td>
                  <td className="py-3 px-4 text-sm text-indigo-400">{tx.userId}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      tx.type === "purchase" ? "bg-teal-500/10 text-teal-400" : "bg-purple-500/10 text-purple-400"
                    }`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-white">{tx.credits}</td>
                  <td className="py-3 px-4 text-sm text-white">{tx.amount ? `$${tx.amount}` : "-"}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      {tx.status === "success" && (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-400" />
                          <span className="text-xs font-semibold text-green-400">Success</span>
                        </>
                      )}
                      {tx.status === "processing" && (
                        <>
                          <Clock className="h-4 w-4 text-yellow-400 animate-pulse" />
                          <span className="text-xs font-semibold text-yellow-400">Processing</span>
                        </>
                      )}
                      {tx.status === "failed" && (
                        <>
                          <XCircle className="h-4 w-4 text-red-400" />
                          <span className="text-xs font-semibold text-red-400">Failed</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-400">{tx.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="fixed bottom-4 right-4 glass-card border border-green-500/30 bg-green-500/10 rounded-xl p-4 animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <span className="text-white font-semibold text-sm">{notification}</span>
          </div>
        </div>
      )}
    </div>
  );
}
