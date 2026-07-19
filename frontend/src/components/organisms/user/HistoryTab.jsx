import { Calendar } from "lucide-react";
import { WASTE_TYPES, WASTE_PRICES } from "../../../utils/vikorAlgorithm";

/** Helper: ambil harga item (prioritas: price di item, fallback ke wastePrices, fallback ke WASTE_PRICES) */
const getItemPrice = (item, wastePrices = WASTE_PRICES) =>
  Number(item?.price ?? wastePrices?.[item?.type] ?? WASTE_PRICES[item?.type] ?? 0);

/**
 * Organism: User — HistoryTab
 * Menampilkan riwayat seluruh setoran nasabah dalam bentuk card.
 */
function HistoryTab({ deposits, wastePrices }) {
  if (deposits.length === 0) {
    return (
      <div className="fade-in">
        <h2 style={{ marginBottom: "var(--spacing-xl)" }}>Riwayat Setoran</h2>
        <div className="card" style={{ textAlign: "center", padding: "var(--spacing-3xl)" }}>
          <div style={{ fontSize: "4rem", marginBottom: "var(--spacing-lg)" }}>📦</div>
          <h3 style={{ color: "var(--text-secondary)" }}>Belum Ada Setoran</h3>
          <p style={{ color: "var(--text-tertiary)" }}>
            Setoran Anda akan muncul di sini setelah admin menambahkan data
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <h2 style={{ marginBottom: "var(--spacing-xl)" }}>Riwayat Setoran</h2>

      <div className="grid gap-lg">
        {deposits
          .slice()
          .reverse()
          .map((deposit) => {
            const totalWeight = deposit.items.reduce(
              (sum, item) => sum + item.weight,
              0
            );

            return (
              <div key={deposit.id} className="card card-gradient" style={{ transition: "all var(--transition-base)" }}>
                <div className="flex-between" style={{ marginBottom: "var(--spacing-lg)" }}>
                  <div>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "var(--spacing-xs)", padding: "0.25rem 0.75rem", background: "var(--color-primary-100)", color: "var(--color-primary-700)", borderRadius: "var(--radius-lg)", fontSize: "0.7rem", fontWeight: "700", marginBottom: "var(--spacing-sm)", whiteSpace: "nowrap" }}>
                      <Calendar size={12} style={{ flexShrink: 0 }} />
                      <span>
                        {new Date(deposit.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)" }}>
                      {deposit.items.length} jenis sampah • {totalWeight.toFixed(2)} kg/L
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "0.25rem" }}>Pendapatan</div>
                    <div style={{ fontSize: "1.75rem", fontWeight: "800", color: "var(--color-primary-600)" }}>
                      Rp{" "}
                      {Number(deposit.totalAmount).toLocaleString("id-ID", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </div>
                  </div>
                </div>

                <div style={{ background: "var(--bg-tertiary)", borderRadius: "var(--radius-md)", padding: "var(--spacing-md)" }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: "700", color: "var(--text-secondary)", marginBottom: "var(--spacing-sm)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Detail Sampah:
                  </div>
                  {deposit.items.map((item, idx) => (
                    <div key={idx} className="flex-between" style={{ padding: "var(--spacing-sm) 0", borderBottom: idx < deposit.items.length - 1 ? "1px solid var(--border-light)" : "none" }}>
                      <div>
                        <div style={{ fontSize: "0.875rem", fontWeight: "600", color: "var(--text-primary)" }}>
                          {WASTE_TYPES[item.type]}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)" }}>
                          {item.weight} kg/L × Rp{" "}
                          {Number(getItemPrice(item, wastePrices)).toLocaleString("id-ID", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </div>
                      </div>
                      <div style={{ fontSize: "0.875rem", fontWeight: "700", color: "var(--color-primary-600)" }}>
                        Rp{" "}
                        {Number(Number(item.weight || 0) * getItemPrice(item, wastePrices)).toLocaleString("id-ID", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default HistoryTab;
