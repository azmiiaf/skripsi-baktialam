import { Eye, EyeOff, Calendar, Award, Trophy, TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { WASTE_TYPES, WASTE_PRICES } from "../../../utils/vikorAlgorithm";

/**
 * Organism: User — DashboardTab
 * Menampilkan saldo, grafik pendapatan, setoran terakhir,
 * daftar harga sampah, dan tips untuk nasabah.
 */
function DashboardTab({
  balance,
  showBalance,
  onToggleBalance,
  deposits,
  monthlyData,
  wastePrices,
  ranking = [],
  currentUserId,
  onGoToRanking,
}) {
  const totalDeposits = deposits.length;
  const totalWeight = deposits.reduce((sum, d) => {
    return sum + d.items.reduce((itemSum, item) => itemSum + item.weight, 0);
  }, 0);

  const lastDeposit = deposits.length > 0 ? deposits[deposits.length - 1] : null;
  const myRank = ranking.find((r) => r.userId === currentUserId);

  const medalEmoji = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return null;
  };

  return (
    <div className="fade-in">
      <div className="mobile-only" style={{ marginBottom: "var(--spacing-lg)" }}>
        <h2 style={{ fontSize: "1.5rem" }}>Dashboard Saya</h2>
      </div>
      <h2 className="desktop-only" style={{ marginBottom: "var(--spacing-xl)" }}>
        Dashboard Saya
      </h2>

      {/* M-Banking Style Balance Card */}
      <div className="mb-card" style={{ marginBottom: "var(--spacing-xl)" }}>
        <div className="mb-card-header">
          <div className="mb-card-label">Saldo Anda</div>
        </div>
        <div className="mb-balance-value" style={{ display: "flex", alignItems: "center", gap: "var(--spacing-md)" }}>
          <span>
            {showBalance
              ? `Rp ${Number(balance).toLocaleString("id-ID", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
              : "Rp ••••••••"}
          </span>
          <button className="mb-balance-toggle" onClick={onToggleBalance} style={{ width: "32px", height: "32px" }}>
            {showBalance ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <div className="mb-card-footer">
          <div className="mb-card-info">
            <div className="info-label">Total Setoran</div>
            <div className="info-value">{totalDeposits} Kali</div>
          </div>
          <div className="mb-card-info">
            <div className="info-label">Total Berat</div>
            <div className="info-value">{totalWeight.toFixed(2)} kg</div>
          </div>
        </div>
      </div>

      {/* Mini Rank Card */}
      <div
        onClick={onGoToRanking}
        style={{
          marginBottom: "var(--spacing-xl)",
          background: myRank
            ? "linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-primary-700) 100%)"
            : "var(--color-primary-50)",
          border: myRank ? "none" : "2px dashed var(--color-primary-300)",
          borderRadius: "var(--radius-xl)",
          padding: "var(--spacing-lg) var(--spacing-xl)",
          display: "flex",
          alignItems: "center",
          gap: "var(--spacing-md)",
          cursor: onGoToRanking ? "pointer" : "default",
          boxShadow: myRank ? "0 6px 20px rgba(0,150,136,0.3)" : "none",
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            background: myRank ? "rgba(255,255,255,0.2)" : "var(--color-primary-100)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: myRank ? "1.5rem" : "1rem",
            flexShrink: 0,
          }}
        >
          {myRank ? (medalEmoji(myRank.rank) || <Trophy size={22} style={{ color: "white" }} />) : <TrendingUp size={22} style={{ color: "var(--color-primary-500)" }} />}
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "1px",
              color: myRank ? "rgba(255,255,255,0.8)" : "var(--color-primary-600)",
            }}
          >
            Peringkat Saya
          </div>
          <div
            style={{
              fontSize: myRank ? "1.5rem" : "0.9rem",
              fontWeight: 800,
              color: myRank ? "white" : "var(--color-primary-700)",
              lineHeight: 1.2,
            }}
          >
            {myRank ? `#${myRank.rank} dari ${ranking.length} nasabah` : "Belum masuk peringkat"}
          </div>
          {!myRank && (
            <div style={{ fontSize: "0.75rem", color: "var(--color-primary-600)", marginTop: "2px" }}>
              Minimal 3x setoran untuk masuk peringkat
            </div>
          )}
        </div>
        {onGoToRanking && (
          <div style={{ color: myRank ? "rgba(255,255,255,0.7)" : "var(--color-primary-400)", fontSize: "1.2rem" }}>›</div>
        )}
      </div>

      {/* Chart */}
      {monthlyData.length > 0 && (
        <div className="card" style={{ marginBottom: "var(--spacing-2xl)" }}>
          <div className="card-header">
            <h3 className="card-title">Grafik Pendapatan Per Bulan</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                formatter={(value) =>
                  `Rp ${Number(value).toLocaleString("id-ID", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
                }
                labelFormatter={(label) => `Bulan: ${label}`}
              />
              <Line type="monotone" dataKey="amount" stroke="#009688" strokeWidth={3} name="Pendapatan" dot={{ fill: "#009688", r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recent Activity */}
      <div className="grid grid-2 gap-lg">
        {/* Last Deposit */}
        <div className="card card-gradient">
          <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-md)", marginBottom: "var(--spacing-lg)" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "var(--radius-lg)", background: "var(--color-primary-100)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>
              <Calendar />
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: "1rem" }}>Setoran Terakhir</h4>
              <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                {lastDeposit
                  ? new Date(lastDeposit.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
                  : "Belum ada setoran"}
              </p>
            </div>
          </div>

          {lastDeposit && (
            <>
              <div style={{ padding: "var(--spacing-md)", background: "var(--bg-tertiary)", borderRadius: "var(--radius-md)", marginBottom: "var(--spacing-md)" }}>
                {lastDeposit.items.map((item, idx) => (
                  <div key={idx} className="flex-between" style={{ padding: "var(--spacing-sm) 0", borderBottom: idx < lastDeposit.items.length - 1 ? "1px solid var(--border-light)" : "none" }}>
                    <span style={{ fontSize: "0.875rem" }}>{WASTE_TYPES[item.type]}</span>
                    <span style={{ fontSize: "0.875rem", fontWeight: "600" }}>{item.weight} kg/L</span>
                  </div>
                ))}
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Total:</div>
                <div style={{ fontSize: "1.5rem", fontWeight: "800", color: "var(--color-primary-600)" }}>
                  Rp {Number(lastDeposit.totalAmount).toLocaleString("id-ID", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Waste Price Guide */}
        <div className="card card-gradient">
          <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-md)", marginBottom: "var(--spacing-lg)" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "var(--radius-lg)", background: "var(--color-secondary-100)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>
              <Award />
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: "1rem" }}>Harga Sampah</h4>
              <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--text-secondary)" }}>Per kilogram/liter</p>
            </div>
          </div>
          <div style={{ padding: "var(--spacing-md)", background: "var(--bg-tertiary)", borderRadius: "var(--radius-md)", maxHeight: "200px", overflowY: "auto" }}>
            {Object.entries(WASTE_TYPES).map(([key, label]) => (
              <div key={key} className="flex-between" style={{ padding: "var(--spacing-sm) 0", fontSize: "0.875rem" }}>
                <span>{label}</span>
                <span style={{ fontWeight: "700", color: "var(--color-primary-600)" }}>
                  Rp {Number(wastePrices?.[key] ?? WASTE_PRICES[key]).toLocaleString("id-ID", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Info / Tips Card */}
      <div className="card" style={{ marginTop: "var(--spacing-2xl)", background: "var(--color-primary-50)", border: "2px solid var(--color-primary-200)" }}>
        <div className="flex gap-md" style={{ alignItems: "flex-start" }}>
          <div style={{ fontSize: "2rem" }}>💡</div>
          <div>
            <h4 style={{ marginBottom: "var(--spacing-sm)" }}>Tips Maksimalkan Pendapatan!</h4>
            <ul style={{ paddingLeft: "var(--spacing-lg)", lineHeight: "1.8", color: "var(--text-secondary)" }}>
              <li>Pisahkan sampah berdasarkan jenisnya untuk mendapat harga terbaik</li>
              <li>Setor sampah secara rutin untuk meningkatkan ranking Anda</li>
              <li>Simpan sampah elektronik dan logam karena memiliki harga tertinggi</li>
              <li>Kumpulkan minyak jelantah dari rumah tangga</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardTab;
