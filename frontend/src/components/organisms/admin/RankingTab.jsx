import { Trophy, Award } from "lucide-react";


/**
 * Organism: Admin — RankingTab
 * Menampilkan ranking nasabah terbaik berdasarkan algoritma VIKOR.
 * Responsif: card list di mobile, tabel di desktop.
 */
function RankingTab({ ranking }) {
  const medalEmoji = (rank) => {
    if (rank === 1) return "";
    if (rank === 2) return "";
    if (rank === 3) return "";
    return null;
  };

  const getBadge = (rank) => {
    if (rank === 1) return <span className="badge badge-warning">Terbaik</span>;
    if (rank === 2) return <span className="badge badge-info">Sangat Baik</span>;
    if (rank === 3) return <span className="badge badge-success">Baik</span>;
    return null;
  };

  const empty = (
    <div style={{ padding: "var(--spacing-2xl)", textAlign: "center", color: "var(--text-tertiary)" }}>
      <Award size={48} style={{ opacity: 0.3, marginBottom: "var(--spacing-md)" }} />
      <p>Belum ada nasabah yang memenuhi syarat perankingan.</p>
      <p style={{ fontSize: "0.875rem", marginTop: "4px" }}>
        Nasabah harus memiliki minimal <strong>3x setoran</strong> untuk masuk ke dalam daftar ranking.
      </p>
    </div>
  );

  return (
    <div className="fade-in">
      <div className="flex-between" style={{ marginBottom: "var(--spacing-xl)" }}>
        <div>
          <h2>Ranking Nasabah Terbaik</h2>
          <p style={{ color: "var(--text-secondary)", marginTop: "var(--spacing-sm)" }}>
            Penentuan ranking dilihat seberapa kecil nilai Q seorang nasabah. Jika nilai Q mendekati 0, maka semakin baik nasabah tersebut.
          </p>
        </div>
      </div>

      <div className="card">
        {ranking.length === 0 ? empty : (
          <>
            {/* ── Desktop: Tabel ─────────────────────────────────── */}
            <div className="desktop-only" style={{ overflowX: "auto" }}>
              <table className="table" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>Peringkat</th>
                    <th style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>Nama</th>
                    <th style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>Wilayah</th>
                    <th style={{ padding: "12px 16px", whiteSpace: "nowrap", textAlign: "right" }}>Total Berat</th>
                    <th style={{ padding: "12px 16px", whiteSpace: "nowrap", textAlign: "right" }}>Frekuensi</th>
                    <th style={{ padding: "12px 16px", whiteSpace: "nowrap", textAlign: "right" }}>Pendapatan</th>
                    <th style={{ padding: "12px 16px", whiteSpace: "nowrap", textAlign: "right" }}>Variasi</th>
                    <th style={{ padding: "12px 16px", whiteSpace: "nowrap", textAlign: "right" }}>Q Score</th>
                    <th style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>Badge</th>
                  </tr>
                </thead>
                <tbody>
                  {ranking.map((rank) => (
                    <tr key={rank.userId}>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          {/* {medalEmoji(rank.rank)
                            ? <span style={{ fontSize: "1.4rem" }}>{medalEmoji(rank.rank)}</span>
                            : null} */}
                          <span style={{ fontWeight: "800", fontSize: "1.1rem", color: rank.rank <= 3 ? "var(--color-primary-600)" : "var(--text-primary)" }}>
                            #{rank.rank}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px", fontWeight: "700" }}>{rank.name}</td>
                      <td style={{ padding: "12px 16px", color: "var(--text-secondary)" }}>{rank.rt ? `RT ${rank.rt}` : "—"}</td>
                      <td style={{ padding: "12px 16px", textAlign: "right" }}>{rank.stats.totalWeight.toFixed(2)} kg</td>
                      <td style={{ padding: "12px 16px", textAlign: "right" }}>{rank.stats.frequency}×</td>
                      <td style={{ padding: "12px 16px", textAlign: "right", color: "var(--color-primary-600)", fontWeight: "600" }}>
                        Rp {rank.stats.totalRevenue.toLocaleString("id-ID")}
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "right" }}>
                        {rank.stats.varietyScore} Jenis
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "right", fontFamily: "monospace", fontSize: "0.85rem" }}>
                        {rank.qScore.toFixed(4)}
                      </td>
                      <td style={{ padding: "12px 16px" }}>{getBadge(rank.rank)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── Mobile: Card List ──────────────────────────────── */}
            <div className="mobile-only" style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-sm)" }}>
              {ranking.map((rank) => (
                <div
                  key={rank.userId}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--spacing-md)",
                    padding: "var(--spacing-md)",
                    borderRadius: "var(--radius-lg)",
                    border: "1px solid var(--border-light)",
                    background: rank.rank <= 3 ? "var(--color-primary-50)" : "var(--bg-primary)",
                  }}
                >
                  {/* Rank Badge */}
                  <div
                    style={{
                      flexShrink: 0,
                      width: "44px",
                      height: "44px",
                      borderRadius: "50%",
                      background: rank.rank <= 3 ? "var(--color-primary-500)" : "var(--bg-tertiary)",
                      color: rank.rank <= 3 ? "white" : "var(--text-secondary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "800",
                      fontSize: rank.rank <= 3 ? "1.3rem" : "0.9rem",
                    }}
                  >
                    {medalEmoji(rank.rank) || `#${rank.rank}`}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                      <span style={{ fontWeight: "700", fontSize: "0.9375rem", color: "var(--text-primary)" }}>
                        {rank.name}
                      </span>
                      {getBadge(rank.rank)}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                      {rank.rt ? `RT ${rank.rt} · ` : ""}
                      {rank.stats.frequency}× setoran · {rank.stats.totalWeight.toFixed(1)} kg · {rank.stats.varietyScore} jenis
                    </div>
                  </div>

                  {/* Revenue + Score */}
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontWeight: "700", color: "var(--color-primary-600)", fontSize: "0.85rem" }}>
                      Rp {rank.stats.totalRevenue.toLocaleString("id-ID")}
                    </div>
                    <div style={{ fontSize: "0.65rem", color: "var(--text-tertiary)", fontFamily: "monospace" }}>
                      Q: {rank.qScore.toFixed(3)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default RankingTab;
