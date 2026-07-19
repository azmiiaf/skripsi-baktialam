import { useState, useEffect, useCallback } from "react";
import {
  Users,
  Package,
  Award,
  FileText,
  BarChart3,
  User,
  Trophy,
} from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import { apiClient } from "../api/client";
import {
  calculateVikorRanking,
  getMonthlyDepositStats,
  WASTE_PRICES,
} from "../utils/vikorAlgorithm";

// Organisms — Shared
import AppHeader from "../components/organisms/AppHeader";
import DesktopNav from "../components/organisms/DesktopNav";
import BottomNav from "../components/organisms/BottomNav";
import ProfileModal from "../components/organisms/ProfileModal";

// Organisms — Admin Tabs & Modals
import DashboardTab from "../components/organisms/admin/DashboardTab";
import UsersTab from "../components/organisms/admin/UsersTab";
import DepositsTab from "../components/organisms/admin/DepositsTab";
import RankingTab from "../components/organisms/admin/RankingTab";
import ReportTab from "../components/organisms/admin/ReportTab";
import UserModal from "../components/organisms/admin/UserModal";
import DepositModal from "../components/organisms/admin/DepositModal";

const MySwal = withReactContent(Swal);

/** Helper: konversi price list dari API → map */
const wastePriceListToMap = (priceList) => {
  const map = { ...WASTE_PRICES };
  if (Array.isArray(priceList)) {
    priceList.forEach((item) => {
      if (item?.type) map[item.type] = Number(item.price || 0);
    });
  }
  return map;
};

/**
 * Page: AdminDashboard
 * Halaman utama admin — container yang menyatukan semua organisms:
 * AppHeader + DesktopNav + BottomNav + tab content + modals.
 */
function AdminDashboard({ currentUser, onLogout }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editDepositId, setEditDepositId] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [wastePrices, setWastePrices] = useState(WASTE_PRICES);

  // ─── Load Data ────────────────────────────────────────────────
  const loadData = useCallback(async () => {
    try {
      const allUsers = await apiClient.getUsers();
      const safeUsers = Array.isArray(allUsers)
        ? allUsers.filter((u) => u.role === "user")
        : [];
      setUsers(safeUsers);

      const allDeposits = await apiClient.getDeposits();
      const safeDeposits = Array.isArray(allDeposits) ? allDeposits : [];
      setDeposits(safeDeposits);

      if (safeDeposits.length && safeUsers.length) {
        setRanking(calculateVikorRanking(safeDeposits, safeUsers));
      }
      setMonthlyStats(getMonthlyDepositStats(safeDeposits));

      const priceList = await apiClient.getWastePrices();
      setWastePrices(wastePriceListToMap(priceList));
    } catch (err) {
      console.error("Failed to load data:", err);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => loadData(), 0);
    return () => clearTimeout(timer);
  }, [loadData]);

  // ─── Dark Mode ────────────────────────────────────────────────
  useEffect(() => {
    document.documentElement.classList.toggle("dark-mode", isDarkMode);
  }, [isDarkMode]);

  // ─── Computed Stats ────────────────────────────────────────────
  const totalUsers = users.length;
  const totalDeposits = deposits.length;
  const totalRevenue = deposits.reduce(
    (sum, d) => sum + Number(d.totalAmount || 0),
    0
  );
  const totalWeight = deposits.reduce(
    (sum, d) =>
      sum +
      (Array.isArray(d.items)
        ? d.items.reduce((ws, i) => ws + Number(i.weight || 0), 0)
        : 0),
    0
  );

  // ─── Handlers ─────────────────────────────────────────────────
  const handleLogout = () => {
    MySwal.fire({
      title: "Konfirmasi Logout",
      text: "Apakah Anda yakin ingin keluar dari aplikasi?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Keluar",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("banksampah_token");
        localStorage.removeItem("banksampah_current_user");
        onLogout();
        MySwal.fire("Berhasil logout!", "", "success");
      }
    });
  };

  const handleDeleteUser = (userId) => {
    MySwal.fire({
      title: "Hapus Nasabah?",
      text: "Semua data setoran nasabah ini juga akan dihapus. Tindakan ini tidak dapat dibatalkan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await apiClient.deleteUser(userId);
          if (!res.success) {
            throw new Error(res.message || "Gagal menghapus nasabah");
          }
          loadData();
          MySwal.fire("Terhapus!", "Data nasabah berhasil dihapus.", "success");
        } catch (err) {
          MySwal.fire({
            icon: "error",
            title: "Gagal Menghapus Nasabah",
            text: err.message || "Terjadi kesalahan saat menghubungkan ke server.",
          });
        }
      }
    });
  };

  const handleDeleteDeposit = (depositId) => {
    MySwal.fire({
      title: "Hapus Setoran?",
      text: "Data setoran akan dihapus permanen.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await apiClient.deleteDeposit(depositId);
          if (!res.success) {
            throw new Error(res.message || "Gagal menghapus setoran");
          }
          loadData();
          MySwal.fire("Terhapus!", "Data setoran berhasil dihapus.", "success");
        } catch (err) {
          MySwal.fire({
            icon: "error",
            title: "Gagal Menghapus Setoran",
            text: err.message || "Terjadi kesalahan saat menghubungkan ke server.",
          });
        }
      }
    });
  };

  const handleSaveUser = async (userData) => {
    try {
      if (editingUser) {
        const result = await apiClient.updateUser(editingUser.id, {
          ...userData,
          username: editingUser.username,
        });
        if (!result.success) {
          throw new Error(result.message || "Gagal memperbarui data nasabah");
        }
      } else {
        const result = await apiClient.addUser({
          name: userData.name,
          email: userData.email,
          rt: userData.rt,
          password: userData.password || "user123",
        });
        if (!result.success) {
          throw new Error(result.message || "Gagal menambahkan nasabah baru");
        }
      }
      setShowUserModal(false);
      loadData();
      MySwal.fire({
        icon: "success",
        title: "Berhasil!",
        text: editingUser ? "Data nasabah diperbarui" : "Nasabah baru ditambahkan",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      MySwal.fire({
        icon: "error",
        title: "Gagal Menyimpan Nasabah",
        text: err.message || "Terjadi kesalahan saat menghubungkan ke server.",
      });
    }
  };

  const handleSaveDeposit = async (depositData) => {
    if (editDepositId) {
      MySwal.fire({
        title: "Simpan Perubahan?",
        text: "Pastikan data yang diubah sudah benar.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Ya, Simpan",
        cancelButtonText: "Batal",
        confirmButtonColor: "#009688",
        cancelButtonColor: "#d33",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const response = await apiClient.updateDeposit(editDepositId, depositData);
            if (!response.success) {
              throw new Error(response.message || "Gagal memperbarui data setoran");
            }
            await apiClient.addNotification({
              userId: depositData.userId,
              title: "Setoran Diperbarui",
              message: `Admin telah memperbarui data setoran Anda. Total: Rp ${Number(
                depositData.totalAmount || 0
              ).toLocaleString("id-ID", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
              type: "info",
            });
            setShowDepositModal(false);
            setEditDepositId(null);
            loadData();
            MySwal.fire({ icon: "success", title: "Berhasil!", text: "Data setoran berhasil diperbarui.", timer: 1500, showConfirmButton: false });
          } catch (err) {
            MySwal.fire({
              icon: "error",
              title: "Gagal Memperbarui Setoran",
              text: err.message || "Terjadi kesalahan saat menghubungkan ke server.",
            });
          }
        }
      });
    } else {
      try {
        const result = await apiClient.addDeposit({ ...depositData, status: "completed", priority: "normal" });
        if (!result.success) throw new Error(result.message || "Failed to add deposit");
        await apiClient.addNotification({
          userId: depositData.userId,
          title: "Setoran Baru Ditambahkan",
          message: `Admin telah menambahkan setoran sebesar Rp ${Number(
            depositData.totalAmount || 0
          ).toLocaleString("id-ID", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
          type: "success",
        });
        setShowDepositModal(false);
        setEditDepositId(null);
        loadData();
        MySwal.fire({ icon: "success", title: "Berhasil!", text: "Setoran berhasil ditambahkan.", timer: 1500, showConfirmButton: false });
      } catch (err) {
        MySwal.fire({
          icon: "error",
          title: "Gagal Menambah Setoran",
          text: err.message || "Terjadi kesalahan saat menghubungkan ke server.",
          footer: '<span style="color: #d33">Tip: Pastikan server backend sudah menyala dan Supabase sudah terhubung.</span>',
        });
      }
    }
  };

  // ─── Nav Configuration ─────────────────────────────────────────
  const desktopTabs = [
    { key: "dashboard", label: "Dashboard", icon: <BarChart3 size={18} /> },
    { key: "users", label: "Nasabah", icon: <Users size={18} /> },
    { key: "deposits", label: "Setoran", icon: <Package size={18} /> },
    { key: "ranking", label: "Ranking", icon: <Award size={18} /> },
    { key: "reports", label: "Laporan", icon: <FileText size={18} /> },
  ];

  const bottomNavItems = [
    { icon: <BarChart3 size={22} />, label: "Home", active: activeTab === "dashboard", onClick: () => setActiveTab("dashboard") },
    { icon: <Users size={22} />, label: "Nasabah", active: activeTab === "users", onClick: () => setActiveTab("users") },
    { icon: <Package size={22} />, label: "Setoran", active: activeTab === "deposits", onClick: () => setActiveTab("deposits") },
    { icon: <Trophy size={22} />, label: "Ranking", active: activeTab === "ranking", onClick: () => setActiveTab("ranking") },
    { icon: <User size={22} />, label: "Profil", active: showProfileModal, onClick: () => setShowProfileModal(true) },
  ];

  // ─── Render ────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-secondary)" }}>
      {/* Fixed Navbar */}
      <div className="navbar-fixed-wrapper" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000 }}>
        <AppHeader
          appName="Bakti Alam Admin"
          currentUser={currentUser}
          onProfileClick={() => setShowProfileModal(true)}
        />
        <DesktopNav
          tabs={desktopTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          colorScheme="primary"
        />
      </div>

      {/* Spacers */}
      <div className="navbar-spacer desktop-only" style={{ height: "170px" }} />
      <div className="navbar-spacer mobile-only" style={{ height: "110px" }} />

      {/* Tab Content */}
      <div className="container" style={{ padding: "var(--spacing-xl) var(--spacing-lg)" }}>
        {activeTab === "dashboard" && (
          <DashboardTab
            totalUsers={totalUsers}
            totalDeposits={totalDeposits}
            totalRevenue={totalRevenue}
            totalWeight={totalWeight}
            monthlyStats={monthlyStats}
            deposits={deposits}
            users={users}
          />
        )}
        {activeTab === "users" && (
          <UsersTab
            users={users}
            onAdd={() => { setEditingUser(null); setShowUserModal(true); }}
            onEdit={(user) => { setEditingUser(user); setShowUserModal(true); }}
            onDelete={handleDeleteUser}
          />
        )}
        {activeTab === "deposits" && (
          <DepositsTab
            deposits={deposits}
            users={users}
            onAdd={() => { setEditDepositId(null); setShowDepositModal(true); }}
            onEdit={(deposit) => { setEditDepositId(deposit.id); setShowDepositModal(true); }}
            onDelete={handleDeleteDeposit}
          />
        )}
        {activeTab === "ranking" && <RankingTab ranking={ranking} />}
        {activeTab === "reports" && <ReportTab monthlyStats={monthlyStats} />}
      </div>

      {/* Mobile Bottom Nav */}
      <BottomNav items={bottomNavItems} />

      {/* Modals */}
      {showUserModal && (
        <UserModal
          user={editingUser}
          onClose={() => setShowUserModal(false)}
          onSave={handleSaveUser}
        />
      )}
      {showDepositModal && (
        <DepositModal
          users={users}
          wastePrices={wastePrices}
          onPricesUpdated={(nextPrices) => setWastePrices(nextPrices)}
          initialData={editDepositId ? deposits.find((d) => d.id === editDepositId) : null}
          onClose={() => { setShowDepositModal(false); setEditDepositId(null); }}
          onSave={handleSaveDeposit}
        />
      )}
      {showProfileModal && (
        <ProfileModal
          currentUser={currentUser}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          onLogout={handleLogout}
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </div>
  );
}

export default AdminDashboard;
