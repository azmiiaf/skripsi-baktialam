import { Trophy, Award, Star, TrendingUp } from "lucide-react";

/**
 * Organism: User — RankingTab
 * Menampilkan peringkat seluruh nasabah berdasarkan algoritma VIKOR.
 * Nasabah yang sedang login akan di-highlight posisinya.
 * Responsif: card list pada mobile, tabel pada desktop.
 */
function RankingTab({ ranking, currentUserId }) {
  const myRank = ranking.find((r) => r.userId === currentUserId);

  const medalEmoji = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return null;
  };

  const getBadge = (rank) => {
    if (rank === 1) return <span className="badge badge-warning">⭐ Terbaik</span>;
    if (rank === 2) return <span className="badge badge-info">Sangat Baik</span>;
    if (rank === 3) return <span className="badge badge-success">Baik</span>;
    return null;
  };

  return (
    <div className="fade-in">
      <div style={{ marginBottom: "var(--spacing-xl)" }}>
      <h2 style={{ marginBottom: "var(--spacing-sm)" }}>Peringkat Nasabah</h2>
      </div>

      {/* My Rank Card */}
      {myRank ? (
        <div
          style={{
            background: "linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-primary-700) 100%)",
            borderRadius: "var(--radius-xl)",
            padding: "var(--spacing-xl)",
            marginBottom: "var(--spacing-xl)",
            color: "white",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 8px 24px rgba(0,150,136,0.35)",
          }}
        >
          {/* Decorative circle */}
          <div
            style={{
              position: "absolute",
              top: "-20px",
              right: "-20px",
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
            }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-md)", marginBottom: "var(--spacing-md)" }}>
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.75rem",
                flexShrink: 0,
              }}
            >
              {medalEmoji(myRank.rank) || <Trophy size={24} />}
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", opacity: 0.8, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>
                Peringkat Anda
              </div>
              <div style={{ fontSize: "2rem", fontWeight: 800, lineHeight: 1.1 }}>
                #{myRank.rank}
              </div>
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "var(--spacing-md)",
              borderTop: "1px solid rgba(255,255,255,0.2)",
              paddingTop: "var(--spacing-md)",
            }}
          >
            <div>
              <div style={{ fontSize: "0.65rem", opacity: 0.7, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>
                Total Berat
              </div>
              <div style={{ fontSize: "0.95rem", fontWeight: 700 }}>
                {myRank.stats.totalWeight.toFixed(1)} kg
              </div>
            </div>
            <div>
              <div style={{ fontSize: "0.65rem", opacity: 0.7, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>
                Frekuensi
              </div>
              <div style={{ fontSize: "0.95rem", fontWeight: 700 }}>
                {myRank.stats.frequency}×
              </div>
            </div>
            <div>
              <div style={{ fontSize: "0.65rem", opacity: 0.7, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>
                Pendapatan
              </div>
              <div style={{ fontSize: "0.95rem", fontWeight: 700 }}>
                Rp {myRank.stats.totalRevenue.toLocaleString("id-ID")}
              </div>
            </div>
            <div>
              <div style={{ fontSize: "0.65rem", opacity: 0.7, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>
                Variasi
              </div>
              <div style={{ fontSize: "0.95rem", fontWeight: 700 }}>
                {myRank.stats.varietyScore} Jenis
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            background: "var(--color-primary-50)",
            border: "2px dashed var(--color-primary-200)",
            borderRadius: "var(--radius-xl)",
            padding: "var(--spacing-xl)",
            marginBottom: "var(--spacing-xl)",
            textAlign: "center",
          }}
        >
          <TrendingUp size={36} style={{ color: "var(--color-primary-400)", marginBottom: "var(--spacing-md)" }} />
          <h4 style={{ color: "var(--color-primary-700)", marginBottom: "var(--spacing-sm)" }}>
            Anda Belum Masuk Peringkat
          </h4>
          <p style={{ color: "var(--text-secondary)", margin: 0, fontSize: "0.875rem" }}>
            Setor sampah minimal <strong>3 kali</strong> untuk masuk ke papan peringkat!
          </p>
        </div>
      )}

      {/* Full Leaderboard */}
      <div className="card" style={{ marginBottom: "var(--spacing-xl)" }}>
        <div className="card-header">
          <h3 className="card-title" style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)" }}>
            <Trophy size={20} style={{ color: "var(--color-primary-600)" }} />
            Papan Peringkat
          </h3>
        </div>

        {ranking.length === 0 ? (
          <div style={{ padding: "var(--spacing-2xl)", textAlign: "center", color: "var(--text-tertiary)" }}>
            <Award size={48} style={{ opacity: 0.3, marginBottom: "var(--spacing-md)" }} />
            <p>Belum ada nasabah yang memenuhi syarat perankingan.</p>
            <p style={{ fontSize: "0.875rem" }}>
              Minimal <strong>3x setoran</strong> diperlukan untuk masuk peringkat.
            </p>
          </div>
        ) : (
          <>
            {/* ── Desktop: Tabel ────────────────────────────────── */}
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
                  {ranking.map((rank) => {
                    const isMe = rank.userId === currentUserId;
                    return (
                      <tr
                        key={rank.userId}
                        style={{
                          background: isMe ? "var(--color-primary-50)" : undefined,
                          outline: isMe ? "2px solid var(--color-primary-400)" : undefined,
                        }}
                      >
                        <td style={{ padding: "12px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            {medalEmoji(rank.rank) && (
                              <span style={{ fontSize: "1.3rem" }}>{medalEmoji(rank.rank)}</span>
                            )}
                            <span
                              style={{
                                fontWeight: "800",
                                fontSize: "1.1rem",
                                color: rank.rank <= 3 ? "var(--color-primary-600)" : "var(--text-primary)",
                              }}
                            >
                              #{rank.rank}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: "12px 16px", fontWeight: "700" }}>
                          {rank.name}
                          {isMe && (
                            <span
                              style={{
                                marginLeft: "6px",
                                fontSize: "0.65rem",
                                fontWeight: 700,
                                background: "var(--color-primary-500)",
                                color: "white",
                                padding: "2px 6px",
                                borderRadius: "var(--radius-full)",
                              }}
                            >
                              Anda
                            </span>
                          )}
                        </td>
                        <td style={{ padding: "12px 16px", color: "var(--text-secondary)" }}>
                          {rank.rt ? `RT ${rank.rt}` : "—"}
                        </td>
                        <td style={{ padding: "12px 16px", textAlign: "right" }}>
                          {rank.stats.totalWeight.toFixed(2)} kg
                        </td>
                        <td style={{ padding: "12px 16px", textAlign: "right" }}>
                          {rank.stats.frequency}×
                        </td>
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
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* ── Mobile: Card List ──────────────────────────────── */}
            <div className="mobile-only" style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-sm)" }}>
              {ranking.map((rank) => {
                const isMe = rank.userId === currentUserId;
                return (
                  <div
                    key={rank.userId}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--spacing-md)",
                      padding: "var(--spacing-md)",
                      borderRadius: "var(--radius-lg)",
                      border: isMe
                        ? "2px solid var(--color-primary-400)"
                        : "1px solid var(--border-light)",
                      background: isMe ? "var(--color-primary-50)" : "var(--bg-primary)",
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

                    {/* Name & Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                        <span style={{ fontWeight: "700", fontSize: "0.9375rem", color: "var(--text-primary)" }}>
                          {rank.name}
                        </span>
                        {isMe && (
                          <span
                            style={{
                              fontSize: "0.65rem",
                              fontWeight: 700,
                              background: "var(--color-primary-500)",
                              color: "white",
                              padding: "2px 6px",
                              borderRadius: "var(--radius-full)",
                            }}
                          >
                            Anda
                          </span>
                        )}
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
                );
              })}
            </div>
          </>
        )}
      </div>


    </div>
  );
}

export default RankingTab;
