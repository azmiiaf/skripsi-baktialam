import { useState, Fragment } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { WASTE_TYPES, WASTE_PRICES } from "../../../utils/vikorAlgorithm";

/**
 * Organism: Admin — DepositsTab
 * Menampilkan daftar setoran dengan fitur cari, tambah, edit, hapus,
 * dan expand row untuk detail di mobile.
 */
function DepositsTab({ deposits, users, onAdd, onEdit, onDelete }) {
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");

  const toggleRow = (depositId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(depositId)) {
      newExpanded.delete(depositId);
    } else {
      newExpanded.add(depositId);
    }
    setExpandedRows(newExpanded);
  };

  const filteredDeposits = deposits.filter((deposit) => {
    const user = users.find((u) => u.id === deposit.userId);
    const userName = user ? user.name.toLowerCase() : "nasabah terhapus";
    const dateStr = new Date(deposit.date).toLocaleDateString("id-ID");
    return (
      userName.includes(searchTerm.toLowerCase()) ||
      dateStr.includes(searchTerm)
    );
  });

  return (
    <div className="fade-in">
      <div
        className="flex-between flex-wrap gap-md"
        style={{ marginBottom: "var(--spacing-xl)" }}
      >
        <h2 style={{ margin: 0 }}>Data Setoran</h2>
        <button className="btn btn-primary" onClick={onAdd}>
          <Plus size={20} />
          Tambah Setoran
        </button>
      </div>

      <div className="card">
        <div className="card-header flex-between flex-wrap gap-md">
          <h3 className="card-title desktop-only">Daftar Setoran</h3>
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
                placeholder="Cari nama nasabah atau tanggal..."
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
                <th style={{ padding: "10px 12px" }} className="mobile-tight-padding">Tanggal</th>
                <th style={{ padding: "10px 12px" }} className="mobile-tight-padding">Nasabah</th>
                <th className="desktop-only text-right" style={{ padding: "10px 12px", textAlign: "left" }}>Rincian Item</th>
                <th className="desktop-only" style={{ padding: "10px 12px", textAlign: "left" }}>Tot. Berat</th>
                <th className="mobile-compact-text mobile-tight-padding" style={{ padding: "10px 12px", textAlign: "left" }}>Total</th>
                <th style={{ width: "80px", padding: "10px 12px", textAlign: "center" }} className="mobile-tight-padding">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeposits
                .slice()
                .reverse()
                .map((deposit) => {
                  const user = users.find((u) => u.id === deposit.userId);
                  const totalWeight = deposit.items.reduce(
                    (sum, item) => sum + item.weight,
                    0
                  );
                  return (
                    <Fragment key={deposit.id}>
                      <tr>
                        <td style={{ padding: "10px 6px" }} className="mobile-only mobile-tight-padding">
                          <button
                            className={`row-toggle ${expandedRows.has(deposit.id) ? "active" : ""}`}
                            onClick={() => toggleRow(deposit.id)}
                          >
                            {expandedRows.has(deposit.id) ? "−" : "+"}
                          </button>
                        </td>
                        <td style={{ fontSize: "0.75rem", whiteSpace: "nowrap", padding: "10px 12px" }} className="mobile-tight-padding">
                          {new Date(deposit.date).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "numeric",
                            year: "2-digit",
                          })}
                        </td>
                        <td style={{ fontWeight: "600", padding: "10px 12px" }} className="mobile-tight-padding">
                          {user ? user.name : "Nasabah Terhapus"}
                        </td>
                        <td className="desktop-only" style={{ padding: "10px 12px", textAlign: "left" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                            {deposit.items.map((item, idx) => (
                              <div key={idx} style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "6px" }}>
                                <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{WASTE_TYPES[item.type]}</span>
                                <span style={{ color: "var(--text-tertiary)" }}>•</span>
                                <span>
                                  {Number(item.weight).toFixed(2)} kg x Rp{" "}
                                  {Number(item.price || WASTE_PRICES[item.type]).toLocaleString("id-ID", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="desktop-only" style={{ padding: "10px 12px", textAlign: "left" }}>
                          {totalWeight.toFixed(2)} kg
                        </td>
                        <td className="mobile-compact-text mobile-tight-padding" style={{ fontWeight: "800", color: "var(--color-primary-600)", padding: "10px 12px", textAlign: "left" }}>
                          Rp{" "}
                          {Number(deposit.totalAmount).toLocaleString("id-ID", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </td>
                        <td style={{ padding: "10px 12px" }} className="mobile-tight-padding">
                          <div className="flex mobile-tight-gap" style={{ gap: "12px", justifyContent: "center" }}>
                            <button className="btn btn-sm btn-outline mobile-compact-btn" onClick={() => onEdit(deposit)} style={{ padding: "8px 14px" }}>
                              <Edit size={16} />
                            </button>
                            <button className="btn btn-sm btn-danger mobile-compact-btn" onClick={() => onDelete(deposit.id)} style={{ padding: "8px 14px" }}>
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expandedRows.has(deposit.id) && (
                        <tr className="expanded-row mobile-only">
                          <td colSpan="5">
                            <div className="detail-container">
                              <div style={{ marginBottom: "var(--spacing-md)", fontWeight: "700", fontSize: "0.875rem", textTransform: "uppercase", color: "var(--text-tertiary)" }}>
                                Rincian Item:
                              </div>
                              <div style={{ display: "grid", gap: "var(--spacing-sm)", background: "var(--bg-primary)", padding: "var(--spacing-md)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)" }}>
                                {deposit.items.map((item, idx) => (
                                  <div key={idx} style={{ display: "flex", justifyContent: "space-between", paddingBottom: "8px", borderBottom: idx < deposit.items.length - 1 ? "1px solid var(--border-light)" : "none" }}>
                                    <div>
                                      <div style={{ fontWeight: "600" }}>{WASTE_TYPES[item.type]}</div>
                                      <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)" }}>
                                        Harga: Rp {WASTE_PRICES[item.type].toLocaleString("id-ID")}/kg
                                      </div>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                      <div style={{ fontWeight: "700" }}>{item.weight} kg</div>
                                      <div style={{ fontSize: "0.875rem", color: "var(--color-primary-600)", fontWeight: "600" }}>
                                        Rp {Number(item.weight * item.price).toLocaleString("id-ID", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DepositsTab;
