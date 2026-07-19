import { useState } from "react";
import {
  Users,
  TrendingUp,
  DollarSign,
  Package,
  Search,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import StatCard from "../../molecules/StatCard";

/**
 * Organism: Admin — DashboardTab
 * Menampilkan statistik, grafik, dan setoran terbaru di tab Dashboard admin.
 */
function DashboardTab({
  totalUsers,
  totalDeposits,
  totalRevenue,
  totalWeight,
  monthlyStats,
  deposits,
  users,
}) {
  const [searchTerm, setSearchTerm] = useState("");

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
      <h2 style={{ marginBottom: "var(--spacing-xl)" }}>Dashboard Overview</h2>

      {/* Stats Grid */}
      <div
        className="grid grid-4 grid-2-mobile gap-md"
        style={{ marginBottom: "var(--spacing-2xl)" }}
      >
        <StatCard icon={<Users />} label="Total Nasabah" value={totalUsers} variant="primary" />
        <StatCard icon={<Package />} label="Total Setoran" value={totalDeposits} variant="secondary" />
        <StatCard
          icon={<DollarSign />}
          label="Total Pendapatan"
          value={`Rp ${Number(totalRevenue).toLocaleString("id-ID", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}`}
          variant="warning"
        />
        <StatCard
          icon={<TrendingUp />}
          label="Total Berat"
          value={`${totalWeight.toFixed(2)} kg`}
          variant="primary"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-2 gap-lg">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Pendapatan Per Bulan</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                formatter={(value) =>
                  `Rp ${Number(value).toLocaleString("id-ID", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}`
                }
              />
              <Line
                type="monotone"
                dataKey="totalAmount"
                stroke="#2e7d32"
                strokeWidth={3}
                name="Pendapatan"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Berat Sampah Per Bulan</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `${value.toFixed(2)} kg`} />
              <Bar dataKey="totalWeight" fill="#546E7A" name="Berat (kg)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Deposits */}
      <div className="card" style={{ marginTop: "var(--spacing-2xl)" }}>
        <div className="card-header flex-between flex-wrap gap-md">
          <h3 className="card-title">Setoran Terbaru</h3>
          <div
            className="search-wrapper"
            style={{ minWidth: "200px", flexGrow: 1, maxWidth: "300px" }}
          >
            <div className="input-group">
              <span className="input-icon">
                <Search size={16} />
              </span>
              <input
                type="text"
                className="form-input"
                placeholder="Cari..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Nasabah</th>
                <th>Jumlah Item</th>
                <th>Total Berat</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeposits
                .slice(-10)
                .reverse()
                .map((deposit) => {
                  const user = users.find((u) => u.id === deposit.userId);
                  const totalWt = deposit.items.reduce(
                    (sum, item) => sum + item.weight,
                    0
                  );
                  return (
                    <tr key={deposit.id}>
                      <td>
                        {new Date(deposit.date).toLocaleDateString("id-ID")}
                      </td>
                      <td style={{ fontWeight: "600", color: "var(--text-primary)" }}>
                        {user?.name || "Unknown"}
                      </td>
                      <td>{deposit.items.length} item</td>
                      <td>{totalWt.toFixed(2)} kg</td>
                      <td style={{ fontWeight: "700", color: "var(--color-primary-600)" }}>
                        Rp{" "}
                        {Number(deposit.totalAmount).toLocaleString("id-ID", {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DashboardTab;
