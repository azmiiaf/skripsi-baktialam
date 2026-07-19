/**
 * API Client — Bank Sampah Bakti Alam
 * Berkomunikasi dengan backend Express + MySQL via HTTP REST API.
 * Menggantikan koneksi langsung ke Supabase (via supabase.rpc).
 */

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getToken = () => localStorage.getItem("banksampah_token") || "";

const handleUnauthorized = () => {
  localStorage.removeItem("banksampah_token");
  localStorage.removeItem("banksampah_current_user");
  window.location.href = "/login";
};

/**
 * Helper request ke backend dengan token session
 */
const request = async (method, path, body = null) => {
  const headers = {
    "Content-Type": "application/json",
  };

  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options = { method, headers };
  if (body !== null) {
    options.body = JSON.stringify(body);
  }

  try {
    const res = await fetch(`${API_URL}${path}`, options);
    const data = await res.json();

    if (res.status === 401) {
      handleUnauthorized();
      return { success: false, message: "Unauthorized" };
    }

    return data;
  } catch (err) {
    console.error(`API request error [${method} ${path}]:`, err);
    return { success: false, message: "Network error" };
  }
};

const asArray = (result) => {
  if (Array.isArray(result)) return result;
  if (result?.success === false) {
    if (result.message === "Unauthorized") handleUnauthorized();
    return [];
  }
  return [];
};

const asResult = (result, fallbackMessage = "Gagal memproses data") => {
  if (result?.success === false && result.message === "Unauthorized") {
    handleUnauthorized();
  }
  return result || { success: false, message: fallbackMessage };
};

// ─── API Client ───────────────────────────────────────────────────────────────
export const apiClient = {
  // ── Auth ────────────────────────────────────────────────────────────────────
  login: async (username, password) => {
    try {
      const result = await request("POST", "/auth/login", { username, password });
      return asResult(result, "Login gagal");
    } catch (err) {
      console.error("Login Error:", err);
      return { success: false, message: "Network error" };
    }
  },

  register: async (userData) => {
    try {
      const result = await request("POST", "/auth/register", {
        username: userData.username || userData.name,
        name: userData.name,
        email: userData.email,
        rt: userData.rt || null,
        password: userData.password || "user123",
        role: userData.role || "user",
      });
      return asResult(result, "Registrasi gagal");
    } catch (err) {
      console.error("Register Error:", err);
      return { success: false, message: "Network error" };
    }
  },

  forgotPassword: async (email) => {
    try {
      const result = await request("POST", "/auth/forgot-password", {
        email,
        origin: window.location.origin,
      });
      return asResult(result, "Gagal membuat token reset password");
    } catch (err) {
      console.error("Forgot Password Error:", err);
      return { success: false, message: "Network error" };
    }
  },

  resetPassword: async (token, password) => {
    try {
      const result = await request("POST", "/auth/reset-password", { token, password });
      return asResult(result, "Gagal reset password");
    } catch (err) {
      console.error("Reset Password Error:", err);
      return { success: false, message: "Network error" };
    }
  },

  verifyEmail: async (token) => {
    try {
      const result = await request("POST", "/auth/verify-email", { token });
      return asResult(result, "Verifikasi email gagal");
    } catch (err) {
      console.error("Verify Email Error:", err);
      return { success: false, message: "Network error" };
    }
  },

  // ── Users ────────────────────────────────────────────────────────────────────
  getUsers: async () => {
    try {
      const result = await request("GET", "/users");
      return asArray(result);
    } catch (err) {
      console.error("getUsers error:", err);
      return [];
    }
  },

  addUser: async (userData) => {
    try {
      const result = await request("POST", "/users", {
        name: userData.name,
        email: userData.email,
        rt: userData.rt || null,
        password: userData.password || "user123",
      });
      return asResult(result, "Gagal tambah nasabah");
    } catch (err) {
      console.error("addUser error:", err);
      return { success: false, message: "Network error" };
    }
  },

  updateUser: async (id, userData) => {
    try {
      const result = await request("PUT", `/users/${id}`, {
        username: userData.username || null,
        name: userData.name || null,
        email: userData.email || null,
        rt: userData.rt || null,
        password: userData.password || null,
      });
      return asResult(result, "Gagal update nasabah");
    } catch (err) {
      console.error("updateUser error:", err);
      return { success: false, message: "Network error" };
    }
  },

  deleteUser: async (id) => {
    try {
      const result = await request("DELETE", `/users/${id}`);
      return asResult(result, "Gagal hapus nasabah");
    } catch (err) {
      console.error("deleteUser error:", err);
      return { success: false, message: "Network error" };
    }
  },

  // ── Deposits ─────────────────────────────────────────────────────────────────
  getDeposits: async () => {
    try {
      const result = await request("GET", "/deposits");
      return asArray(result);
    } catch (err) {
      console.error("getDeposits error:", err);
      return [];
    }
  },

  getDepositsByUser: async (userId) => {
    try {
      const result = await request("GET", `/deposits/user/${userId}`);
      return asArray(result);
    } catch (err) {
      console.error("getDepositsByUser error:", err);
      return [];
    }
  },

  // ── Ranking (accessible to all authenticated users) ──────────────────────────
  getRankingData: async () => {
    try {
      const result = await request("GET", "/ranking");
      if (result?.success === false) return { users: [], deposits: [] };
      return { users: result.users || [], deposits: result.deposits || [] };
    } catch (err) {
      console.error("getRankingData error:", err);
      return { users: [], deposits: [] };
    }
  },

  addDeposit: async (depositData) => {
    try {
      const result = await request("POST", "/deposits", {
        userId: depositData.userId,
        items: depositData.items || [],
        totalAmount: Number(depositData.totalAmount || 0),
        date: depositData.date,
        status: depositData.status || "completed",
        priority: depositData.priority || "normal",
      });
      return asResult(result, "Gagal tambah setoran");
    } catch (err) {
      console.error("addDeposit error:", err);
      return { success: false, message: "Network error" };
    }
  },

  updateDeposit: async (id, depositData) => {
    try {
      const result = await request("PUT", `/deposits/${id}`, {
        userId: depositData.userId,
        items: depositData.items || [],
        totalAmount: Number(depositData.totalAmount || 0),
        date: depositData.date,
        status: depositData.status || "completed",
        priority: depositData.priority || "normal",
      });
      return asResult(result, "Gagal update setoran");
    } catch (err) {
      console.error("updateDeposit error:", err);
      return { success: false, message: "Network error" };
    }
  },

  deleteDeposit: async (id) => {
    try {
      const result = await request("DELETE", `/deposits/${id}`);
      return asResult(result, "Gagal hapus setoran");
    } catch (err) {
      console.error("deleteDeposit error:", err);
      return { success: false, message: "Network error" };
    }
  },

  // ── Waste Prices ─────────────────────────────────────────────────────────────
  getWastePrices: async () => {
    try {
      const result = await request("GET", "/prices");
      return asArray(result);
    } catch (err) {
      console.error("getWastePrices error:", err);
      return [];
    }
  },

  updateWastePrices: async (prices) => {
    try {
      const result = await request("PUT", "/prices", prices);
      return asResult(result, "Gagal update harga sampah");
    } catch (err) {
      console.error("updateWastePrices error:", err);
      return { success: false, message: "Network error" };
    }
  },

  // ── Notifications ─────────────────────────────────────────────────────────────
  getNotifications: async (userId) => {
    try {
      const result = await request("GET", `/notifications/${userId}`);
      return asArray(result);
    } catch (err) {
      console.error("getNotifications error:", err);
      return [];
    }
  },

  addNotification: async (notifData) => {
    try {
      const result = await request("POST", "/notifications", {
        userId: notifData.userId,
        title: notifData.title,
        message: notifData.message,
        type: notifData.type || "info",
      });
      return asResult(result, "Gagal tambah notifikasi");
    } catch (err) {
      console.error("addNotification error:", err);
      return { success: false, message: "Network error" };
    }
  },

  markAsRead: async (id) => {
    try {
      const result = await request("PUT", `/notifications/${id}/read`);
      return asResult(result, "Gagal update notifikasi");
    } catch (err) {
      console.error("markAsRead error:", err);
      return { success: false, message: "Network error" };
    }
  },

  clearNotifications: async (userId) => {
    try {
      const result = await request("DELETE", `/notifications/user/${userId}`);
      return asResult(result, "Gagal hapus notifikasi");
    } catch (err) {
      console.error("clearNotifications error:", err);
      return { success: false, message: "Network error" };
    }
  },
};
