import { useState, Fragment } from "react";
import { Plus, Edit, Trash2, Search, Eye, EyeOff } from "lucide-react";

/**
 * Organism: Admin — UsersTab
 * Menampilkan daftar nasabah dengan fitur cari, tambah, edit, hapus,
 * dan expand row untuk detail di mobile & desktop.
 */
function UsersTab({ users, onAdd, onEdit, onDelete }) {
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [visiblePasswords, setVisiblePasswords] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");

  const toggleRow = (userId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(userId)) {
      newExpanded.delete(userId);
    } else {
      newExpanded.add(userId);
    }
    setExpandedRows(newExpanded);
  };

  const togglePasswordVisibility = (userId) => {
    const newVisible = new Set(visiblePasswords);
    if (newVisible.has(userId)) {
      newVisible.delete(userId);
    } else {
      newVisible.add(userId);
    }
    setVisiblePasswords(newVisible);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.rt?.includes(searchTerm)
  );

  return (
    <div className="fade-in">
      <div
        className="flex-between flex-wrap gap-md"
        style={{ marginBottom: "var(--spacing-xl)" }}
      >
        <h2 style={{ margin: 0 }}>Data Nasabah</h2>
        <button className="btn btn-primary" onClick={onAdd}>
          <Plus size={20} />
          Tambah Nasabah
        </button>
      </div>

      <div className="card">
        <div className="card-header flex-between flex-wrap gap-md">
          <h3 className="card-title desktop-only">Daftar Nasabah</h3>
          <div
            className="search-wrapper"
            style={{ minWidth: "200px", flexGrow: 1, maxWidth: "400px" }}
          >
            <div className="input-group">
              <span className="input-icon">
                <Search size={18} />
              </span>
              <input
                type="text"
                className="form-input"
                placeholder="Cari nama, email, atau RT..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="table-container">
          <table className="table table-responsive-layout">
            <thead>
              <tr>
                <th style={{ width: "35px", padding: "10px 6px" }} className="mobile-only mobile-tight-padding"></th>
                <th style={{ width: "auto", padding: "10px 12px" }} className="mobile-tight-padding">Nama</th>
                <th className="desktop-only" style={{ width: "auto", padding: "10px 12px" }}>Wilayah</th>
                <th className="desktop-only" style={{ width: "auto", padding: "10px 12px" }}>Email</th>
                <th style={{ width: "80px", padding: "10px 12px" }} className="mobile-tight-padding">Bergabung</th>
                <th style={{ width: "80px", padding: "10px 12px", textAlign: "center" }} className="mobile-tight-padding">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <Fragment key={user.id}>
                  <tr>
                    <td className="mobile-only mobile-tight-padding" style={{ padding: "10px 6px" }}>
                      <button
                        className={`row-toggle ${expandedRows.has(user.id) ? "active" : ""}`}
                        onClick={() => toggleRow(user.id)}
                      >
                        {expandedRows.has(user.id) ? "−" : "+"}
                      </button>
                    </td>
                    <td style={{ fontWeight: "600", color: "var(--text-primary)", padding: "10px 12px" }} className="mobile-tight-padding">
                      {user.name}
                    </td>
                    <td className="desktop-only" style={{ padding: "10px 12px" }}>
                      {user.rt ? `RT ${user.rt}` : "-"}
                    </td>
                    <td className="desktop-only" style={{ padding: "10px 12px" }}>
                      {user.email || "-"}
                    </td>
                    <td style={{ padding: "10px 12px" }} className="mobile-tight-padding">
                      {new Date(user.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "2-digit",
                      })}
                    </td>
                    <td style={{ padding: "10px 12px" }} className="mobile-tight-padding">
                      <div className="flex mobile-tight-gap" style={{ gap: "12px", justifyContent: "center" }}>
                        <button
                          className="btn btn-sm btn-outline mobile-compact-btn"
                          onClick={() => onEdit(user)}
                          style={{ padding: "8px 14px" }}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="btn btn-sm btn-danger mobile-compact-btn"
                          onClick={() => onDelete(user.id)}
                          style={{ padding: "8px 14px" }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedRows.has(user.id) && (
                    <tr className="expanded-row mobile-only">
                      <td colSpan="4" style={{ padding: 0 }}>
                        <div
                          className="detail-container"
                          style={{
                            width: "100%",
                            padding: "var(--spacing-md)",
                            backgroundColor: "var(--color-primary-50)",
                          }}
                        >
                          <div className="detail-grid" style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)", width: "100%" }}>
                            <div className="detail-item">
                              <span className="detail-label" style={{ display: "block", fontSize: "0.75rem", fontWeight: "600", color: "var(--color-secondary-600)", textTransform: "uppercase", marginBottom: "4px", letterSpacing: "0.5px" }}>
                                Wilayah
                              </span>
                              <span className="detail-value" style={{ display: "block", fontSize: "0.9rem", color: "var(--text-primary)", fontWeight: "500" }}>
                                {user.rt ? `RT ${user.rt}` : "-"}
                              </span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label" style={{ display: "block", fontSize: "0.75rem", fontWeight: "600", color: "var(--color-secondary-600)", textTransform: "uppercase", marginBottom: "4px", letterSpacing: "0.5px" }}>
                                Email
                              </span>
                              <span className="detail-value" style={{ display: "block", fontSize: "0.9rem", color: "var(--text-primary)", fontWeight: "500", wordBreak: "break-word" }}>
                                {user.email || "-"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UsersTab;
