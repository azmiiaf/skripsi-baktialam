/**
 * Notification Utility
 * Handles browser notification permissions and triggers.
 */

export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    console.log("Browser ini tidak mendukung notifikasi desktop");
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
};

export const sendNotification = (title, options = {}) => {
  if (!("Notification" in window) || Notification.permission !== "granted") {
    return;
  }

  const defaultOptions = {
    icon: "/favicon.svg", // Fallback icon
    badge: "/favicon.svg",
    vibrate: [200, 100, 200],
    tag: "banksampah-notif",
    renotify: true,
  };

  try {
    // Try via service worker if available for background support
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, {
          ...defaultOptions,
          ...options,
        });
      });
    } else {
      // Fallback to standard Notification API
      new Notification(title, {
        ...defaultOptions,
        ...options,
      });
    }
  } catch (err) {
    console.error("Gagal mengirim notifikasi:", err);
  }
};
