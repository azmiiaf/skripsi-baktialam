// LocalStorage utility functions for Bank Sampah

const STORAGE_KEYS = {
  USERS: "banksampah_users",
  TRANSACTIONS: "banksampah_transactions",
  ITEMS: "banksampah_items",
  CURRENT_USER: "banksampah_current_user",
  NOTIFICATIONS: "banksampah_notifications",
};

// Initialize default data
export const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    const defaultUsers = [
      {
        id: "admin-1",
        username: "admin",
        password: "admin123",
        role: "admin",
        name: "Administrator",
        email: "admin@banksampah.id",
        rt: "00",
        createdAt: new Date().toISOString(),
      },
      {
        id: "user-1",
        username: "user1",
        password: "user123",
        role: "user",
        name: "Budi Santoso",
        email: "budi.santoso@email.com",
        rt: "05",
        address: "Jl. Merdeka No. 123",
        phone: "081234567890",
        createdAt: new Date("2024-01-15").toISOString(),
      },
      {
        id: "user-2",
        username: "user2",
        password: "user123",
        role: "user",
        name: "Siti Aminah",
        email: "siti.aminah@email.com",
        rt: "03",
        address: "Jl. Sudirman No. 45",
        phone: "081987654321",
        createdAt: new Date("2024-02-10").toISOString(),
      },
      {
        id: "user-3",
        username: "user3",
        password: "user123",
        role: "user",
        name: "Ahmad Wijaya",
        email: "ahmad.wijaya@email.com",
        rt: "02",
        address: "Jl. Gatot Subroto No. 88",
        phone: "082345678901",
        createdAt: new Date("2024-03-05").toISOString(),
      },
      {
        id: "user-4",
        username: "user4",
        password: "user123",
        role: "user",
        name: "Dewi Lestari",
        email: "dewi.lestari@email.com",
        rt: "05",
        address: "Jl. Ahmad Yani No. 56",
        phone: "083456789012",
        createdAt: new Date("2024-04-20").toISOString(),
      },
      {
        id: "user-5",
        username: "user5",
        password: "user123",
        role: "user",
        name: "Rudi Hartono",
        email: "rudi.hartono@email.com",
        rt: "04",
        address: "Jl. Diponegoro No. 77",
        phone: "084567890123",
        createdAt: new Date("2024-05-12").toISOString(),
      },
    ];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultUsers));
  }

  // PRICES helper for seeding (synced with algorithm)
  const WASTE_PRICES = {
    bottlePlastic: 3000,
    plasticCaps: 2000,
    cardboard: 2000,
    paper: 1500,
    metal: 5000,
    mixed: 1000,
    electronic: 8000,
    oilWaste: 2500,
    cookingOil: 3500,
  };

  const getUserName = (id) => {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || "[]");
    return users.find((u) => u.id === id)?.name || "Unknown";
  };

  if (!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) {
    const defaultData = [
      {
        userId: "user-1",
        date: "2026-01-05",
        items: [
          { type: "bottlePlastic", weight: 5.5 },
          { type: "cardboard", weight: 8.0 },
        ],
      },
      {
        userId: "user-1",
        date: "2026-01-12",
        items: [
          { type: "paper", weight: 4.0 },
          { type: "mixed", weight: 6.0 },
        ],
      },
      {
        userId: "user-1",
        date: "2026-01-18",
        items: [{ type: "metal", weight: 3.0 }],
      },
      {
        userId: "user-2",
        date: "2026-01-08",
        items: [
          { type: "bottlePlastic", weight: 12.0 },
          { type: "cardboard", weight: 15.0 },
          { type: "paper", weight: 8.0 },
          { type: "metal", weight: 5.0 },
        ],
      },
      {
        userId: "user-2",
        date: "2026-01-15",
        items: [
          { type: "electronic", weight: 4.0 },
          { type: "cookingOil", weight: 6.0 },
        ],
      },
      {
        userId: "user-3",
        date: "2026-01-10",
        items: [
          { type: "electronic", weight: 8.0 },
          { type: "metal", weight: 10.0 },
        ],
      },
      {
        userId: "user-4",
        date: "2026-01-03",
        items: [
          { type: "bottlePlastic", weight: 6.0 },
          { type: "cardboard", weight: 5.0 },
        ],
      },
      {
        userId: "user-4",
        date: "2026-01-07",
        items: [{ type: "paper", weight: 7.0 }],
      },
      {
        userId: "user-4",
        date: "2026-01-14",
        items: [
          { type: "cookingOil", weight: 5.0 },
          { type: "oilWaste", weight: 4.0 },
        ],
      },
      {
        userId: "user-4",
        date: "2026-01-19",
        items: [{ type: "mixed", weight: 8.0 }],
      },
      {
        userId: "user-5",
        date: "2026-01-16",
        items: [{ type: "cardboard", weight: 3.0 }],
      },
    ];

    const transactions = [];
    const items = [];

    defaultData.forEach((d, idx) => {
      const txId = `tx-${1000 + idx}`;
      let totalWeight = 0;
      let totalValue = 0;

      d.items.forEach((item, itemIdx) => {
        const itemId = `item-${txId}-${itemIdx}`;
        const itemPrice = WASTE_PRICES[item.type];
        const itemValue = item.weight * itemPrice;

        totalWeight += item.weight;
        totalValue += itemValue;

        items.push({
          id: itemId,
          transaction_id: txId,
          item_type: item.type,
          weight_kg: item.weight,
          price_per_kg: itemPrice,
          total_value: itemValue,
          created_at: new Date(d.date).toISOString(),
        });
      });

      transactions.push({
        id: txId,
        userId: d.userId, // Link for programmatic use
        depositor_name: getUserName(d.userId),
        total_weight_kg: totalWeight,
        total_value: totalValue,
        input_date: d.date,
        created_at: new Date(d.date).toISOString(),
        admin_id: "admin-1",
      });
    });

    localStorage.setItem(
      STORAGE_KEYS.TRANSACTIONS,
      JSON.stringify(transactions),
    );
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
  }

  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]));
  }
};

// User management
export const getUsers = () => {
  const users = localStorage.getItem(STORAGE_KEYS.USERS);
  return users ? JSON.parse(users) : [];
};

export const getUserById = (userId) => {
  const users = getUsers();
  return users.find((user) => user.id === userId);
};

export const addUser = (userData) => {
  const users = getUsers();
  const newUser = {
    id: `user-${Date.now()}`,
    ...userData,
    role: "user",
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  return newUser;
};

export const updateUser = (userId, userData) => {
  const users = getUsers();
  const index = users.findIndex((user) => user.id === userId);
  if (index !== -1) {
    users[index] = { ...users[index], ...userData };
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return users[index];
  }
  return null;
};

export const deleteUser = (userId) => {
  const users = getUsers();
  const filtered = users.filter((user) => user.id !== userId);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(filtered));

  // Also delete user's deposits
  const txs = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || "[]",
  );
  const items = JSON.parse(localStorage.getItem(STORAGE_KEYS.ITEMS) || "[]");

  const userTxs = txs.filter((t) => t.userId === userId);
  const userTxIds = new Set(userTxs.map((t) => t.id));

  const filteredTxs = txs.filter((t) => t.userId !== userId);
  const filteredItems = items.filter((i) => !userTxIds.has(i.transaction_id));

  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(filteredTxs));
  localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(filteredItems));
};

// Deposit/Transaction management
export const getDeposits = () => {
  const txs = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || "[]",
  );
  const items = JSON.parse(localStorage.getItem(STORAGE_KEYS.ITEMS) || "[]");

  // Reconstruct the structure for the UI
  return txs.map((tx) => ({
    id: tx.id,
    userId: tx.userId,
    depositorName: tx.depositor_name, // Support both styles
    date: tx.input_date,
    totalAmount: tx.total_value,
    totalWeight: tx.total_weight_kg,
    createdAt: tx.created_at,
    adminId: tx.admin_id,
    items: items
      .filter((i) => i.transaction_id === tx.id)
      .map((i) => ({
        id: i.id,
        type: i.item_type,
        weight: i.weight_kg,
        price: i.price_per_kg,
        value: i.total_value,
      })),
  }));
};

export const getDepositsByUserId = (userId) => {
  return getDeposits().filter((deposit) => deposit.userId === userId);
};

export const addDeposit = (depositData) => {
  const txs = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || "[]",
  );
  const items = JSON.parse(localStorage.getItem(STORAGE_KEYS.ITEMS) || "[]");

  const txId = `tx-${Date.now()}`;
  const currentUser = getCurrentUser();
  const userData = getUserById(depositData.userId);

  // 1. Create Items
  const newItems = depositData.items.map((item, idx) => {
    // Assuming WASTE_PRICES is needed here to match the schema
    const WASTE_PRICES = {
      bottlePlastic: 3000,
      plasticCaps: 2000,
      cardboard: 2000,
      paper: 1500,
      metal: 5000,
      mixed: 1000,
      electronic: 8000,
      oilWaste: 2500,
      cookingOil: 3500,
    };
    const price = WASTE_PRICES[item.type] || 0;
    const value = item.weight * price;

    return {
      id: `item-${txId}-${idx}`,
      transaction_id: txId,
      item_type: item.type,
      weight_kg: item.weight,
      price_per_kg: price,
      total_value: value,
      created_at: new Date().toISOString(),
    };
  });

  // 2. Create Transaction
  const newTx = {
    id: txId,
    userId: depositData.userId,
    depositor_name: userData ? userData.name : "Unknown",
    total_weight_kg: depositData.items.reduce((sum, i) => sum + i.weight, 0),
    total_value: depositData.totalAmount,
    input_date: depositData.date || new Date().toISOString().split("T")[0],
    created_at: new Date().toISOString(),
    admin_id: currentUser ? currentUser.id : "admin-1",
  };

  txs.push(newTx);
  items.push(...newItems);

  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txs));
  localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));

  // Create notification for user
  addNotification({
    userId: depositData.userId,
    title: "Setoran Baru Ditambahkan",
    message: `Admin telah menambahkan setoran sebesar Rp ${depositData.totalAmount.toLocaleString("id-ID")}`,
    type: "success",
    read: false,
  });

  return newTx;
};

export const updateDeposit = (depositId, depositData) => {
  const txs = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || "[]",
  );
  const items = JSON.parse(localStorage.getItem(STORAGE_KEYS.ITEMS) || "[]");

  const txIndex = txs.findIndex((tx) => tx.id === depositId);
  if (txIndex === -1) return null;

  // 1. Remove old items for this transaction
  const filteredItems = items.filter((i) => i.transaction_id !== depositId);

  // 2. Create new items
  const newItems = depositData.items.map((item, idx) => {
    // Assuming WASTE_PRICES is needed here to match the schema
    const WASTE_PRICES = {
      bottlePlastic: 3000,
      plasticCaps: 2000,
      cardboard: 2000,
      paper: 1500,
      metal: 5000,
      mixed: 1000,
      electronic: 8000,
      oilWaste: 2500,
      cookingOil: 3500,
    };
    const price = WASTE_PRICES[item.type] || 0;
    const value = item.weight * price;

    return {
      id: `item-${depositId}-${idx}-${Date.now()}`, // Ensure unique ID
      transaction_id: depositId,
      item_type: item.type,
      weight_kg: item.weight,
      price_per_kg: price,
      total_value: value,
      created_at: new Date().toISOString(),
    };
  });

  // 3. Update Transaction
  const userData = getUserById(depositData.userId);
  const updatedTx = {
    ...txs[txIndex],
    userId: depositData.userId,
    depositor_name: userData ? userData.name : "Unknown",
    total_weight_kg: depositData.items.reduce((sum, i) => sum + i.weight, 0),
    total_value: depositData.totalAmount,
    input_date: depositData.date,
    updated_at: new Date().toISOString(),
  };

  txs[txIndex] = updatedTx;
  filteredItems.push(...newItems);

  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txs));
  localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(filteredItems));

  return updatedTx;
};

export const deleteDeposit = (depositId) => {
  const txs = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || "[]",
  );
  const items = JSON.parse(localStorage.getItem(STORAGE_KEYS.ITEMS) || "[]");

  const filteredTxs = txs.filter((tx) => tx.id !== depositId);
  const filteredItems = items.filter((i) => i.transaction_id !== depositId);

  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(filteredTxs));
  localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(filteredItems));
};

// Authentication
export const login = (username, password) => {
  const users = getUsers();
  const user = users.find(
    (u) => u.username === username && u.password === password,
  );
  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    localStorage.setItem(
      STORAGE_KEYS.CURRENT_USER,
      JSON.stringify(userWithoutPassword),
    );
    return userWithoutPassword;
  }
  return null;
};

export const register = (userData) => {
  const users = getUsers();

  // Check if username already exists
  if (users.some((u) => u.username === userData.username)) {
    return { success: false, message: "Username sudah digunakan" };
  }

  // Check if email already exists
  if (userData.email && users.some((u) => u.email === userData.email)) {
    return { success: false, message: "Email sudah digunakan" };
  }

  const newUser = {
    id: `user-${Date.now()}`,
    ...userData,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

  return { success: true, user: newUser };
};

export const logout = () => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
};

export const getCurrentUser = () => {
  const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return user ? JSON.parse(user) : null;
};

// Notifications
export const getNotifications = (userId) => {
  const notifications = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
  const allNotifications = notifications ? JSON.parse(notifications) : [];
  return allNotifications.filter((notif) => notif.userId === userId);
};

export const addNotification = (notificationData) => {
  const notifications = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
  const allNotifications = notifications ? JSON.parse(notifications) : [];
  const newNotification = {
    id: `notif-${Date.now()}`,
    ...notificationData,
    createdAt: new Date().toISOString(),
  };
  allNotifications.push(newNotification);
  localStorage.setItem(
    STORAGE_KEYS.NOTIFICATIONS,
    JSON.stringify(allNotifications),
  );
  return newNotification;
};

export const markNotificationAsRead = (notificationId) => {
  const notifications = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
  const allNotifications = notifications ? JSON.parse(notifications) : [];
  const index = allNotifications.findIndex(
    (notif) => notif.id === notificationId,
  );
  if (index !== -1) {
    allNotifications[index].read = true;
    localStorage.setItem(
      STORAGE_KEYS.NOTIFICATIONS,
      JSON.stringify(allNotifications),
    );
  }
};

export const clearAllNotifications = (userId) => {
  const notifications = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
  const allNotifications = notifications ? JSON.parse(notifications) : [];
  const filtered = allNotifications.filter((notif) => notif.userId !== userId);
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(filtered));
};
