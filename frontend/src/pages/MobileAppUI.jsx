import React, { useState } from "react";
import {
  Home,
  Recycle,
  History,
  User,
  Wallet,
  Zap,
  ArrowUpRight,
  ChevronRight,
  Bell,
  QrCode,
  TrendingUp,
  Leaf,
  Plus,
} from "lucide-react";

const MobileAppUI = () => {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#212121] font-sans pb-24 selection:bg-[#009688]/10">
      {/* App Container */}
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl relative overflow-hidden">
        {/* Header */}
        <header className="px-6 pt-8 pb-4 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-lg z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#009688]/10 flex items-center justify-center">
              <User className="w-5 h-5 text-[#009688]" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#546E7A] uppercase tracking-wider">
                Selamat Pagi,
              </p>
              <h1 className="text-sm font-black">Ahmad Fauzi 👋</h1>
            </div>
          </div>
          <button className="relative p-2 rounded-xl bg-[#FAFAFA] hover:bg-gray-100 transition-colors">
            <Bell className="w-5 h-5 text-[#546E7A]" />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
          </button>
        </header>

        {/* Hero Balance Card */}
        <div className="px-6 py-4">
          <div className="bg-[#009688] rounded-[32px] p-6 text-white shadow-xl shadow-[#009688]/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform duration-700"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <p className="text-xs font-medium text-white/80 mb-1">
                    Total Saldo Anda
                  </p>
                  <h2 className="text-3xl font-black tracking-tight italic">
                    Rp 420.500
                  </h2>
                </div>
                <div className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-md">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="flex justify-between items-end">
                <div className="flex items-center gap-3">
                  <div className="text-left">
                    <p className="text-[10px] font-bold text-white/60 mb-0.5 uppercase tracking-widest">
                      Poin Emas
                    </p>
                    <p className="text-sm font-black italic">
                      1.240 <span className="text-[10px] font-bold">PTS</span>
                    </p>
                  </div>
                  <div className="w-[1px] h-6 bg-white/20"></div>
                  <div className="text-left">
                    <p className="text-[10px] font-bold text-white/60 mb-0.5 uppercase tracking-widest">
                      Dampak CO₂
                    </p>
                    <p className="text-sm font-black italic">
                      14.2 <span className="text-[10px] font-bold">KG</span>
                    </p>
                  </div>
                </div>
                <button className="bg-[#CDDC39] text-[#212121] px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-lg shadow-[#CDDC39]/20 hover:scale-105 transition-transform active:scale-95">
                  Tukar Saldo
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action Grid */}
        <div className="px-6 py-6 grid grid-cols-3 gap-4">
          {[
            {
              icon: Recycle,
              label: "Setor",
              color: "bg-[#009688]/10 text-[#009688]",
            },
            {
              icon: TrendingUp,
              label: "Statistik",
              color: "bg-[#546E7A]/10 text-[#546E7A]",
            },
            {
              icon: QrCode,
              label: "Scan QR",
              color: "bg-[#CDDC39]/20 text-[#212121]",
            },
          ].map((action, idx) => (
            <button
              key={idx}
              className="flex flex-col items-center gap-2 group"
            >
              <div
                className={`w-14 h-14 rounded-2xl ${action.color} flex items-center justify-center shadow-sm group-hover:scale-110 group-active:scale-90 transition-all duration-300`}
              >
                <action.icon className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-[#546E7A] uppercase tracking-tighter">
                {action.label}
              </span>
            </button>
          ))}
        </div>

        {/* Impact Stats */}
        <div className="px-6 py-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black uppercase tracking-widest italic">
              Lingkungan Saya
            </h3>
            <button className="text-[11px] font-black text-[#009688] uppercase tracking-widest">
              Lihat Semua
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#FAFAFA] border border-[#546E7A]/5 p-4 rounded-3xl group hover:border-[#009688]/20 transition-colors">
              <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-sm mb-3 text-[#009688]">
                <Leaf className="w-5 h-5" />
              </div>
              <p className="text-[10px] font-bold text-[#546E7A] uppercase tracking-widest mb-1">
                Total Sampah
              </p>
              <h4 className="text-lg font-black italic tracking-tighter uppercase">
                24.5 <span className="text-[10px]">KG</span>
              </h4>
              <div className="mt-2 flex items-center gap-1 text-[9px] font-black text-[#009688] uppercase">
                <ArrowUpRight className="w-3 h-3" /> 12% Minggu Ini
              </div>
            </div>
            <div className="bg-[#FAFAFA] border border-[#546E7A]/5 p-4 rounded-3xl group hover:border-[#CDDC39]/40 transition-colors">
              <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-sm mb-3 text-[#212121]">
                <Zap className="w-5 h-5 text-[#CDDC39]" />
              </div>
              <p className="text-[10px] font-bold text-[#546E7A] uppercase tracking-widest mb-1">
                Energi Hemat
              </p>
              <h4 className="text-lg font-black italic tracking-tighter uppercase">
                8.2 <span className="text-[10px]">KWH</span>
              </h4>
              <div className="mt-2 flex items-center gap-1 text-[9px] font-black text-[#009688] uppercase">
                <ArrowUpRight className="w-3 h-3" /> 8% Minggu Ini
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-black uppercase tracking-widest italic">
              Aktivitas Terakhir
            </h3>
            <button className="text-[11px] font-black text-[#546E7A]/60 uppercase tracking-widest group flex items-center gap-1">
              Filter{" "}
              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
          <div className="space-y-4">
            {[
              {
                label: "Setoran Plastik",
                type: "Deposit",
                val: "+2.4 kg",
                date: "Hari ini, 08:30",
                pts: "+48 Pts",
                icon: Recycle,
                color: "text-[#009688]",
                bg: "bg-[#009688]/10",
              },
              {
                label: "Penarikan Saldo",
                type: "Withdrawal",
                val: "-Rp 50.000",
                date: "Kemarin, 14:20",
                pts: "-0 Pts",
                icon: Wallet,
                color: "text-red-500",
                bg: "bg-red-50",
              },
              {
                label: "Setoran Kertas",
                type: "Deposit",
                val: "+5.0 kg",
                date: "2 Jan 2026",
                pts: "+25 Pts",
                icon: Recycle,
                color: "text-[#009688]",
                bg: "bg-[#009688]/10",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 bg-white border border-[#546E7A]/5 rounded-3xl hover:shadow-md transition-shadow active:scale-[0.98]"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center ${item.color}`}
                  >
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="text-[13px] font-black tracking-tight">
                      {item.label}
                    </h5>
                    <p className="text-[10px] font-bold text-[#546E7A] uppercase tracking-widest">
                      {item.date}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-[13px] font-black ${item.color}`}>
                    {item.val}
                  </p>
                  <p className="text-[9px] font-bold text-[#CDDC39] uppercase tracking-widest bg-[#212121] px-1.5 py-0.5 rounded italic inline-block">
                    {item.pts}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Action Button Entry Point (Extra visual flavor) */}
        <div className="fixed bottom-24 right-6 lg:right-[calc(50%-180px)] z-30">
          <button className="w-14 h-14 rounded-full bg-[#212121] text-white flex items-center justify-center shadow-2xl shadow-black/20 hover:scale-110 active:scale-90 transition-all border-4 border-white">
            <Plus className="w-7 h-7" />
          </button>
        </div>

        {/* Dynamic Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-[#546E7A]/10 px-8 py-4 flex items-center justify-between z-40 max-w-md mx-auto">
          {[
            { id: "home", icon: Home, label: "Beranda" },
            { id: "setor", icon: Recycle, label: "Setor" },
            { id: "history", icon: History, label: "Riwayat" },
            { id: "profile", icon: User, label: "Profil" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex flex-col items-center gap-1.5 relative group"
            >
              <tab.icon
                className={`w-6 h-6 transition-all duration-300 ${activeTab === tab.id ? "text-[#009688] scale-110" : "text-[#546E7A]/40 group-hover:text-[#546E7A]"}`}
              />
              <span
                className={`text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${activeTab === tab.id ? "text-[#009688] opacity-100" : "text-[#546E7A]/40 opacity-0 group-hover:opacity-60"}`}
              >
                {tab.label}
              </span>
              {activeTab === tab.id && (
                <span className="absolute -top-1 w-1 h-1 bg-[#009688] rounded-full shadow-[0_0_8px_#009688]"></span>
              )}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default MobileAppUI;
