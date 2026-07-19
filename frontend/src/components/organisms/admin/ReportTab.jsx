import { useState, Fragment } from "react";
import { Printer } from "lucide-react";
import { WASTE_TYPES } from "../../../utils/vikorAlgorithm";
import { utils, writeFile } from "xlsx";

/**
 * Organism: Admin — ReportTab
 * Menampilkan laporan bulanan dengan fitur export ke Excel
 * dan expand row untuk detail di mobile.
 */
function ReportTab({ monthlyStats }) {
  const [expandedRows, setExpandedRows] = useState(new Set());

  const toggleRow = (month) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(month)) {
      newExpanded.delete(month);
    } else {
      newExpanded.add(month);
    }
    setExpandedRows(newExpanded);
  };

  const exportToExcel = () => {
    const dataForExcel = monthlyStats.map((stat) => {
      const row = {
        Bulan: stat.month,
        "Total Berat (kg)": parseFloat(stat.totalWeight.toFixed(2)),
        "Jumlah Transaksi": stat.count,
        "Total Pendapatan (Rp)": stat.totalAmount,
      };

      Object.keys(WASTE_TYPES).forEach((key) => {
        const wasteData = stat.wasteTypes?.[key];
        const label = WASTE_TYPES[key].toUpperCase();
        if (wasteData) {
          row[`${label} (Berat)`] = parseFloat(wasteData.weight.toFixed(2));
          row[`${label} (Rp)`] = wasteData.amount;
        } else {
          row[`${label} (Berat)`] = 0;
          row[`${label} (Rp)`] = 0;
        }
      });
      return row;
    });

    const worksheet = utils.json_to_sheet(dataForExcel);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Laporan Bulanan");
    writeFile(workbook, "Laporan_Bulanan_BankSampah.xlsx");
  };

  return (
    <div className="fade-in">
      <div
        className="flex-between flex-wrap gap-md"
        style={{ marginBottom: "var(--spacing-xl)" }}
      >
        <h2>Laporan Bulanan</h2>
        <button className="btn btn-primary" onClick={exportToExcel}>
          <Printer size={20} />
          Export Excel
        </button>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="table table-responsive-layout">
            <thead>
              <tr>
                <th style={{ width: "50px", padding: "10px 6px" }} className="mobile-only"></th>
                <th style={{ padding: "10px 12px" }}>Bulan</th>
                <th style={{ padding: "10px 12px", textAlign: "left" }}>Tot. Berat</th>
                <th className="desktop-only" style={{ padding: "10px 12px", textAlign: "left" }}>Jml Trx</th>
                <th style={{ padding: "10px 12px", textAlign: "left" }}>Pendapatan</th>
                <th className="desktop-only" style={{ padding: "10px 12px", textAlign: "left" }}>Detail Sampah</th>
              </tr>
            </thead>
            <tbody>
              {monthlyStats.map((stat) => (
                <Fragment key={stat.month}>
                  <tr>
                    <td style={{ padding: "10px 6px" }} className="mobile-only">
                      <button
                        className={`row-toggle ${expandedRows.has(stat.month) ? "active" : ""}`}
                        onClick={() => toggleRow(stat.month)}
                      >
                        {expandedRows.has(stat.month) ? "−" : "+"}
                      </button>
                    </td>
                    <td style={{ fontWeight: 600, padding: "10px 12px" }}>{stat.month}</td>
                    <td style={{ padding: "10px 12px", textAlign: "left" }}>{stat.totalWeight.toFixed(2)} kg</td>
                    <td className="desktop-only" style={{ padding: "10px 12px", textAlign: "left" }}>{stat.count}</td>
                    <td className="mobile-compact-text" style={{ fontWeight: 700, color: "var(--color-primary-600)", padding: "10px 12px", textAlign: "left" }}>
                      Rp{" "}
                      {Number(stat.totalAmount).toLocaleString("id-ID", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </td>
                    <td className="desktop-only" style={{ padding: "10px 12px", textAlign: "left" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        {Object.entries(WASTE_TYPES).map(([key, label]) => {
                          const data = stat.wasteTypes?.[key];
                          if (!data || data.weight <= 0) return null;
                          return (
                            <div key={key} style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "6px" }}>
                              <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{label}</span>
                              <span style={{ color: "var(--text-tertiary)" }}>•</span>
                              <span>{data.weight.toFixed(2)} kg</span>
                              <span style={{ color: "var(--text-tertiary)" }}>•</span>
                              <span style={{ color: "var(--color-primary-600)", fontWeight: 500 }}>
                                Rp {Number(data.amount).toLocaleString("id-ID", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                  {expandedRows.has(stat.month) && (
                    <tr className="expanded-row mobile-only">
                      <td colSpan="4">
                        <div className="detail-container">
                          <div style={{ marginBottom: "var(--spacing-md)", fontWeight: "700", fontSize: "0.875rem", textTransform: "uppercase", color: "var(--text-tertiary)" }}>
                            Detail Jenis Sampah:
                          </div>
                          <div className="detail-grid">
                            {Object.entries(WASTE_TYPES).map(([key, label]) => {
                              const data = stat.wasteTypes?.[key] || { weight: 0, amount: 0 };
                              const hasData = data.weight > 0;
                              return (
                                <div key={key} className="detail-item" style={{ opacity: hasData ? 1 : 0.5, background: hasData ? "var(--bg-primary)" : "transparent", padding: "var(--spacing-md)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)" }}>
                                  <span className="detail-label">{label}</span>
                                  <span className="detail-value" style={{ fontSize: "1rem", color: hasData ? "var(--text-primary)" : "var(--text-tertiary)" }}>
                                    {data.weight.toFixed(2)}<span style={{ fontSize: "0.65rem" }}> kg/L</span>
                                  </span>
                                  <span className="mobile-compact-text" style={{ fontSize: "0.875rem", fontWeight: "600", color: hasData ? "var(--color-primary-600)" : "var(--text-tertiary)" }}>
                                    Rp {Number(data.amount).toLocaleString("id-ID", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
              {monthlyStats.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "3rem" }}>
                    Belum ada data laporan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ReportTab;
