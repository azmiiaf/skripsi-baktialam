import React from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  LayoutDashboard,
  Recycle,
  Wallet,
  TrendingUp,
  Bell,
  Settings,
  LogOut,
  Search,
  Plus,
  Filter,
  MoreHorizontal,
} from "lucide-react";

const data = [
  { name: "Jan", value: 4000, impact: 2400 },
  { name: "Feb", value: 3000, impact: 1398 },
  { name: "Mar", value: 2000, impact: 9800 },
  { name: "Apr", value: 2780, impact: 3908 },
  { name: "May", value: 1890, impact: 4800 },
  { name: "Jun", value: 2390, impact: 3800 },
];

const ModernDashboard = () => {
  return (
    <div className="flex h-screen bg-background text-charcoal font-['Inter']">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-secondary/10 flex flex-col hidden lg:flex">
        <div className="p-8 border-b border-secondary/10">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2.5 rounded-xl">
              <Recycle className="text-white w-5 h-5" />
            </div>
            <span className="text-lg font-black uppercase tracking-tighter">
              BANK
              <span className="text-primary font-black uppercase tracking-tighter">
                SAMPAH
              </span>
            </span>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          {[
            { icon: LayoutDashboard, label: "Dashboard", active: true },
            { icon: Recycle, label: "Setor Sampah" },
            { icon: Wallet, label: "Keuangan" },
            { icon: TrendingUp, label: "Statistik" },
            { icon: Bell, label: "Notifikasi" },
          ].map((item, idx) => (
            <button
              key={idx}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-sm transition-all ${item.active ? "bg-primary/10 text-primary" : "text-secondary hover:bg-secondary/5"}`}
            >
              <item.icon className="w-5 h-5 font-bold text-sm" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-secondary/10 space-y-4">
          <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-sm text-secondary hover:bg-secondary/5 transition-all">
            <Settings className="w-5 h-5 font-bold text-sm" />
            Pengaturan
          </button>
          <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-sm text-red-500 hover:bg-red-50 transition-all">
            <LogOut className="w-5 h-5 font-bold text-sm" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-secondary/10 flex items-center justify-between px-8">
          <div className="flex items-center gap-4 bg-background px-4 py-2 rounded-2xl border border-secondary/5 w-96 max-w-full">
            <Search className="w-4 h-4 text-secondary font-bold text-sm" />
            <input
              type="text"
              placeholder="Cari transaksi..."
              className="bg-transparent border-none outline-none text-sm font-medium w-full"
            />
          </div>
          <div className="flex items-center gap-6">
            <button className="relative p-2.5 bg-background rounded-full border border-secondary/5 hover:bg-secondary/5 transition-colors">
              <Bell className="w-5 h-5 text-secondary font-bold text-sm" />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
            </button>
            <div className="h-10 w-[1px] bg-secondary/10"></div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-black italic">Ahmad Fauzi</p>
                <p className="text-[10px] font-bold text-secondary italic tracking-widest uppercase">
                  Verified Member
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center font-bold text-charcoal shadow-sm uppercase italic">
                AF
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* Welcome Message */}
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-black tracking-tighter italic">
                Selamat Pagi, Ahmad! 👋
              </h2>
              <p className="text-secondary font-medium tracking-wide">
                Berikut adalah ringkasan aktivitas daur ulang Anda hari ini.
              </p>
            </div>
            <button className="bg-primary text-white flex items-center gap-2 px-6 py-3 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all hover:scale-[1.02] active:scale-95 uppercase tracking-widest text-sm italic">
              <Plus className="w-5 h-5" /> Setor Baru
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                label: "Total Saldo",
                value: "Rp 1.420.000",
                change: "+Rp 25k hari ini",
                icon: Wallet,
                color: "bg-primary",
              },
              {
                label: "Sampah Terkumpul",
                value: "24.5 kg",
                change: "+2.4 kg hari ini",
                icon: Recycle,
                color: "bg-secondary",
              },
              {
                label: "Dampak Karbon",
                value: "142 kg CO2",
                change: "85 pohon terselamatkan",
                icon: TrendingUp,
                color: "bg-accent",
              },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-[32px] shadow-sm border border-secondary/5 hover:shadow-md transition-shadow relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 rounded-full -translate-y-12 translate-x-12"></div>
                <div className="relative z-10">
                  <div
                    className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center mb-6`}
                  >
                    <stat.icon
                      className={`${stat.color === "bg-accent" ? "text-charcoal" : "text-white"} w-6 h-6`}
                    />
                  </div>
                  <p className="text-secondary text-sm font-bold italic tracking-widest uppercase mb-1">
                    {stat.label}
                  </p>
                  <h3 className="text-2xl font-black mb-2 tracking-tighter italic uppercase underline decoration-accent decoration-4">
                    {stat.value}
                  </h3>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-primary italic">
                    {stat.change}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-secondary/5">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold italic uppercase tracking-widest">
                  Pertumbuhan Saldo
                </h3>
                <Filter className="w-5 h-5 text-secondary font-bold text-sm" />
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient
                        id="colorValue"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#009688"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#009688"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f1f5f9"
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "16px",
                        border: "none",
                        boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#009688"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorValue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-secondary/5">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold italic uppercase tracking-widest">
                  Dampak Lingkungan
                </h3>
                <MoreHorizontal className="w-5 h-5 text-secondary font-bold text-sm" />
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f1f5f9"
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis hide />
                    <Tooltip
                      cursor={{ fill: "#f8fafc" }}
                      contentStyle={{
                        borderRadius: "16px",
                        border: "none",
                        boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Bar
                      dataKey="impact"
                      fill="#CDDC39"
                      radius={[10, 10, 10, 10]}
                      barSize={20}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ModernDashboard;
