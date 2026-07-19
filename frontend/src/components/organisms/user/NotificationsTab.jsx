import { Bell, Check, Trash2 } from "lucide-react";

/**
 * Organism: User — NotificationsTab
 * Menampilkan daftar notifikasi nasabah dengan fitur tandai dibaca dan hapus semua.
 */
function NotificationsTab({ notifications, onMarkAsRead, onClearAll }) {
  const safeNotifications = Array.isArray(notifications) ? notifications : [];
  const sortedNotifications = [...safeNotifications].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="fade-in">
      <div className="flex-between" style={{ marginBottom: "var(--spacing-xl)" }}>
        <h2>Notifikasi</h2>
        {safeNotifications.length > 0 && (
          <button
            className="btn btn-outline btn-sm"
            onClick={onClearAll}
            style={{ padding: "4px 10px", fontSize: "0.7rem", height: "auto" }}
          >
            <Trash2 size={12} />
            Hapus Semua
          </button>
        )}
      </div>

      {sortedNotifications.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "var(--spacing-3xl)" }}>
          <div style={{ fontSize: "4rem", marginBottom: "var(--spacing-lg)" }}>🔔</div>
          <h3 style={{ color: "var(--text-secondary)" }}>Tidak Ada Notifikasi</h3>
          <p style={{ color: "var(--text-tertiary)" }}>
            Notifikasi akan muncul di sini ketika admin menambahkan setoran
          </p>
        </div>
      ) : (
        <div className="grid gap-md">
          {sortedNotifications.map((notification) => (
            <div
              key={notification.id}
              className="card"
              style={{
                background: notification.isRead ? "var(--bg-primary)" : "var(--color-primary-50)",
                borderLeft: `4px solid ${notification.isRead ? "var(--border-light)" : "var(--color-primary-600)"}`,
                position: "relative",
              }}
            >
              <div className="flex-between" style={{ marginBottom: "var(--spacing-md)" }}>
                <div className="flex gap-md" style={{ alignItems: "flex-start" }}>
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "var(--radius-lg)",
                      background: notification.type === "success" ? "var(--color-success)" : "var(--color-info)",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Bell size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="flex gap-sm" style={{ alignItems: "center", marginBottom: "var(--spacing-xs)" }}>
                      <h4 style={{ margin: 0, fontSize: "0.875rem" }}>{notification.title}</h4>
                      {!notification.isRead && (
                        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--color-primary-600)", flexShrink: 0 }} />
                      )}
                    </div>
                    <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                      {notification.message}
                    </p>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginTop: "var(--spacing-xs)" }}>
                      {new Date(notification.date).toLocaleString("id-ID", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
                {!notification.isRead && (
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => onMarkAsRead(notification.id)}
                    title="Tandai sudah dibaca"
                  >
                    <Check size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotificationsTab;
