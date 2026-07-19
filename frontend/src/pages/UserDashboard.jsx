import { useState, useEffect, useCallback } from "react";
import { Wallet, History, Bell, User, Trophy, FileText } from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import { apiClient } from "../api/client";
import { WASTE_PRICES, calculateVikorRanking } from "../utils/vikorAlgorithm";
import { requestNotificationPermission } from "../utils/notification";

// Organisms — Shared
import AppHeader from "../components/organisms/AppHeader";
import DesktopNav from "../components/organisms/DesktopNav";
import BottomNav from "../components/organisms/BottomNav";
import ProfileModal from "../components/organisms/ProfileModal";

// Organisms — User Tabs
import DashboardTab from "../components/organisms/user/DashboardTab";
import HistoryTab from "../components/organisms/user/HistoryTab";
import NotificationsTab from "../components/organisms/user/NotificationsTab";
import RankingTab from "../components/organisms/user/RankingTab";
import ReportTab from "../components/organisms/user/ReportTab";

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
 * Page: UserDashboard
 * Halaman utama nasabah — container yang menyatukan semua organisms:
 * AppHeader + DesktopNav + BottomNav + tab content + ProfileModal.
 */
function UserDashboard({ currentUser, onLogout }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [deposits, setDeposits] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [balance, setBalance] = useState(0);
  const [showBalance, setShowBalance] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [wastePrices, setWastePrices] = useState(WASTE_PRICES);
  const [ranking, setRanking] = useState([]);

  // ─── Load Data ────────────────────────────────────────────────
  const loadData = useCallback(async () => {
    try {
      const allDeposits = await apiClient.getDepositsByUser(currentUser.id);
      setDeposits(allDeposits);
      setBalance(allDeposits.reduce((sum, d) => sum + parseFloat(d.totalAmount), 0));

      const userNotifs = await apiClient.getNotifications(currentUser.id);
      setNotifications(userNotifs);

      const priceList = await apiClient.getWastePrices();
      setWastePrices(wastePriceListToMap(priceList));

      // Load ranking data — pakai endpoint khusus yang bisa diakses semua user
      const rankingData = await apiClient.getRankingData();
      const { users: rankUsers, deposits: rankDeposits } = rankingData;
      if (rankDeposits.length && rankUsers.length) {
        setRanking(calculateVikorRanking(rankDeposits, rankUsers));
      }
    } catch (err) {
      console.error("Failed to load data:", err);
    }
  }, [currentUser.id]);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    requestNotificationPermission();
    return () => clearInterval(interval);
  }, [loadData]);

  // ─── Dark Mode ────────────────────────────────────────────────
  useEffect(() => {
    document.documentElement.classList.toggle("dark-mode", isDarkMode);
  }, [isDarkMode]);

  // ─── Computed ─────────────────────────────────────────────────
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getMonthlyData = () => {
    const monthlyMap = {};
    deposits.forEach((deposit) => {
      const date = new Date(deposit.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      if (!monthlyMap[monthKey]) {
        monthlyMap[monthKey] = { month: monthKey, amount: 0 };
      }
      monthlyMap[monthKey].amount += parseFloat(deposit.totalAmount);
    });
    return Object.values(monthlyMap).sort((a, b) => a.month.localeCompare(b.month));
  };

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

  const handleMarkAsRead = async (id) => {
    await apiClient.markAsRead(id);
    loadData();
  };

  const handleClearAll = () => {
    MySwal.fire({
      title: "Bersihkan Notifikasi?",
      text: "Semua notifikasi akan dihapus permanen",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Bersihkan",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await apiClient.clearNotifications(currentUser.id);
        loadData();
        MySwal.fire("Terhapus!", "Semua notifikasi berhasil dihapus.", "success");
      }
    });
  };

  // ─── Nav Configuration ─────────────────────────────────────────
  const desktopTabs = [
    { key: "dashboard", label: "Dashboard", icon: <Wallet size={18} /> },
    { key: "history", label: "Riwayat Setoran", icon: <History size={18} /> },
    { key: "reports", label: "Laporan", icon: <FileText size={18} /> },
    {
      key: "notifications",
      label: `Notifikasi${unreadCount > 0 ? ` (${unreadCount})` : ""}`,
      icon: <Bell size={18} />,
      badge: unreadCount,
    },
    { key: "ranking", label: "Ranking", icon: <Trophy size={18} /> },
  ];

  // Bell icon JSX dengan badge untuk bottom nav
  const bellNavIcon = (
    <div style={{ position: "relative" }}>
      <Bell size={22} />
      {unreadCount > 0 && (
        <span
          style={{
            position: "absolute",
            top: "-6px",
            right: "-6px",
            background: "#ef4444",
            color: "white",
            fontSize: "0.6rem",
            fontWeight: "bold",
            minWidth: "16px",
            height: "16px",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid var(--bg-primary)",
            padding: "0 4px",
          }}
        >
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </div>
  );

  const bottomNavItems = [
    { icon: <Wallet size={22} />, label: "Home", active: activeTab === "dashboard", onClick: () => setActiveTab("dashboard") },
    { icon: <History size={22} />, label: "Riwayat", active: activeTab === "history", onClick: () => setActiveTab("history") },
    { icon: <FileText size={22} />, label: "Laporan", active: activeTab === "reports", onClick: () => setActiveTab("reports") },
    { icon: <Trophy size={22} />, label: "Ranking", active: activeTab === "ranking", onClick: () => setActiveTab("ranking") },
    { icon: bellNavIcon, label: "Notif", active: activeTab === "notifications", onClick: () => setActiveTab("notifications") },
    { icon: <User size={22} />, label: "Profil", active: showProfileModal, onClick: () => setShowProfileModal(true) },
  ];

  // ─── Render ────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-secondary)" }}>
      {/* Fixed Navbar */}
      <div className="navbar-fixed-wrapper" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000 }}>
        <AppHeader
          appName="Bakti Alam"
          currentUser={currentUser}
          gradientVar="var(--gradient-secondary)"
          onProfileClick={() => setShowProfileModal(true)}
        />
        <DesktopNav
          tabs={desktopTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          colorScheme="secondary"
        />
      </div>

      {/* Spacers */}
      <div className="navbar-spacer desktop-only" style={{ height: "170px" }} />
      <div className="navbar-spacer mobile-only" style={{ height: "110px" }} />

      {/* Tab Content */}
      <div className="container" style={{ padding: "var(--spacing-xl) var(--spacing-lg)" }}>
        {activeTab === "dashboard" && (
          <DashboardTab
            balance={balance}
            showBalance={showBalance}
            onToggleBalance={() => setShowBalance(!showBalance)}
            deposits={deposits}
            monthlyData={getMonthlyData()}
            currentUser={currentUser}
            wastePrices={wastePrices}
            ranking={ranking}
            currentUserId={currentUser.id}
            onGoToRanking={() => setActiveTab("ranking")}
          />
        )}
        {activeTab === "history" && (
          <HistoryTab deposits={deposits} wastePrices={wastePrices} />
        )}
        {activeTab === "reports" && (
          <ReportTab deposits={deposits} />
        )}
        {activeTab === "ranking" && (
          <RankingTab ranking={ranking} currentUserId={currentUser.id} />
        )}
        {activeTab === "notifications" && (
          <NotificationsTab
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onClearAll={handleClearAll}
          />
        )}
      </div>

      {/* Mobile Bottom Nav */}
      <BottomNav items={bottomNavItems} />

      {/* Profile Modal */}
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

export default UserDashboard;
