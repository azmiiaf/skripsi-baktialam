import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Trash2,
  Archive,
  FileText,
  Package,
  Zap,
  Droplets,
} from "lucide-react";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { WASTE_TYPES, WASTE_PRICES } from "../../../utils/vikorAlgorithm";
import { apiClient } from "../../../api/client";
import ModernDatePicker from "../../Elements/ModernDatePicker";

const MySwal = withReactContent(Swal);

/** Kategori jenis sampah untuk grouping di select */
const WASTE_CATEGORIES = {
  Plastik: ["bottlePlastic", "plasticCaps", "mixed"],
  Kertas: ["cardboard", "paper"],
  Logam: ["metal"],
  Elektronik: ["electronic"],
  Cairan: ["oilWaste", "cookingOil"],
};

/** Helper: konversi price map → list untuk API */
const wastePriceMapToList = (priceMap) =>
  Object.entries(WASTE_TYPES).map(([type, label], index) => ({
    type,
    label,
    price: Number(priceMap[type] || 0),
    sortOrder: index + 1,
  }));

/** Icon sesuai jenis sampah */
const getWasteIcon = (type) => {
  switch (type) {
    case "bottlePlastic":
    case "plasticCaps":
    case "mixed":
      return <Archive size={18} />;
    case "cardboard":
    case "paper":
      return <FileText size={18} />;
    case "metal":
      return <Package size={18} />;
    case "electronic":
      return <Zap size={18} />;
    case "oilWaste":
    case "cookingOil":
      return <Droplets size={18} />;
    default:
      return <Package size={18} />;
  }
};

/** Unit satuan sesuai jenis sampah */
const getUnit = (type) =>
  type === "oilWaste" || type === "cookingOil" ? "L" : "kg";

/**
 * Organism: Admin — DepositModal
 * Modal form untuk menambah atau mengedit data setoran nasabah,
 * termasuk pengaturan harga sampah.
 */
function DepositModal({
  users,
  onClose,
  onSave,
  initialData,
  wastePrices,
  onPricesUpdated,
}) {
  const getPrice = useCallback(
    (type) => Number(wastePrices?.[type] ?? WASTE_PRICES[type] ?? 0),
    [wastePrices]
  );

  const [priceDraft, setPriceDraft] = useState(() => ({
    ...WASTE_PRICES,
    ...(wastePrices || {}),
  }));

  const [formData, setFormData] = useState(() => {
    if (initialData) {
      return {
        ...initialData,
        date: initialData.date ? new Date(initialData.date) : new Date(),
      };
    }
    return {
      userId: "",
      date: new Date(),
      items: [],
    };
  });

  const [currentItem, setCurrentItem] = useState({
    type: "bottlePlastic",
    weight: "",
  });

  const [isAdding, setIsAdding] = useState(false);
  const [isSavingPrices, setIsSavingPrices] = useState(false);

  useEffect(() => {
    const nextPrices = { ...WASTE_PRICES, ...(wastePrices || {}) };
    setPriceDraft(nextPrices);
  }, [wastePrices]);

  const getActivePrice = useCallback(
    (type) => Number(priceDraft?.[type] ?? getPrice(type) ?? 0),
    [priceDraft, getPrice]
  );

  const handlePriceDraftChange = (type, value) => {
    setPriceDraft((prev) => ({ ...prev, [type]: Number(value || 0) }));
  };

  const handleSavePrices = async () => {
    try {
      setIsSavingPrices(true);
      const payload = wastePriceMapToList(priceDraft);
      const result = await apiClient.updateWastePrices(payload);
      if (!result.success) throw new Error(result.message || "Gagal menyimpan harga sampah");
      onPricesUpdated?.(priceDraft);
      MySwal.fire({ icon: "success", title: "Harga diperbarui", text: "Harga sampah terbaru sudah disimpan.", timer: 1500, showConfirmButton: false });
    } catch (err) {
      MySwal.fire({ icon: "error", title: "Gagal update harga", text: err.message || "Terjadi kesalahan saat menyimpan harga sampah." });
    } finally {
      setIsSavingPrices(false);
    }
  };

  const addItem = () => {
    if (currentItem.weight && parseFloat(currentItem.weight) > 0) {
      setFormData({
        ...formData,
        items: [...formData.items, { type: currentItem.type, weight: parseFloat(currentItem.weight) }],
      });
      setCurrentItem({ type: "bottlePlastic", weight: "" });
      setIsAdding(false);
    }
  };

  const removeItem = (index) => {
    setFormData({ ...formData, items: formData.items.filter((_, i) => i !== index) });
  };

  const updateItem = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const calculateTotal = () =>
    formData.items.reduce((sum, item) => sum + Number(item.weight || 0) * getActivePrice(item.type), 0);

  const calculateTotalWeight = () =>
    formData.items.reduce((sum, item) => sum + Number(item.weight || 0), 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.items.length === 0) {
      MySwal.fire({ icon: "error", title: "Validasi Gagal", text: "Tambahkan minimal 1 item sampah!" });
      return;
    }
    const itemsWithActivePrices = formData.items.map((item) => ({ ...item, price: getActivePrice(item.type) }));
    onSave({
      ...formData,
      items: itemsWithActivePrices,
      totalAmount: itemsWithActivePrices.reduce((sum, item) => sum + Number(item.weight || 0) * Number(item.price || 0), 0),
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal modal-lg fade-in"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "920px", maxHeight: "90vh", display: "flex", flexDirection: "column" }}
      >
        <div className="modal-header">
          <div>
            <h3 className="modal-title" style={{ color: "var(--color-primary-700)" }}>
              {initialData ? "Edit Data Setoran" : "Tambah Setoran Baru"}
            </h3>
            <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--text-tertiary)" }}>
              {initialData ? "Ubah rincian setoran nasabah" : "Catat berat sampah dan pendapatan nasabah"}
            </p>
          </div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div className="modal-body" style={{ overflowY: "auto", flex: 1, padding: "24px" }}>

            {/* Price Settings */}
            <div style={{ background: "var(--bg-primary)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-xl)", padding: "20px", marginBottom: "24px", boxShadow: "var(--shadow-sm)" }}>
              <div className="flex-between flex-stack-mobile gap-md" style={{ marginBottom: "16px", alignItems: "flex-start" }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: "1rem" }}>Pengaturan Harga Sampah</h4>
                  <p style={{ margin: "4px 0 0", fontSize: "0.8rem", color: "var(--text-tertiary)" }}>
                    Harga di bawah ini adalah sumber utama. Rincian setoran otomatis memakai harga dari sini.
                  </p>
                </div>
                <button type="button" className="btn btn-primary btn-sm" onClick={handleSavePrices} disabled={isSavingPrices}>
                  {isSavingPrices ? "Menyimpan..." : "Simpan Harga"}
                </button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
                {Object.entries(WASTE_TYPES).map(([type, label]) => (
                  <div key={type} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-lg)", padding: "12px" }}>
                    <label className="form-label-sm" style={{ display: "block", marginBottom: "8px", color: "var(--text-primary)" }}>{label}</label>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontWeight: "700", color: "var(--color-primary-700)" }}>Rp</span>
                      <input
                        type="number"
                        min="0"
                        className="form-input"
                        value={priceDraft[type] ?? 0}
                        onChange={(e) => handlePriceDraftChange(type, e.target.value)}
                        style={{ height: "40px", flex: 1 }}
                      />
                      <span style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", minWidth: "48px" }}>/{getUnit(type)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* User & Date Selection */}
            <div className="flex gap-lg flex-stack-mobile" style={{ marginBottom: "24px" }}>
              <div className="form-group" style={{ flex: 2 }}>
                <label className="form-label" style={{ fontWeight: "600" }}>Pilih Nasabah</label>
                <select
                  className="form-select"
                  value={formData.userId}
                  onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                  style={{ paddingLeft: "12px", border: "2px solid var(--border-light)", height: "45px" }}
                  required
                >
                  <option value="">-- Cari Nama Nasabah --</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.rt ? `RT ${user.rt}` : "Umum"})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label" style={{ fontWeight: "600" }}>Tanggal</label>
                <ModernDatePicker
                  selected={formData.date}
                  onChange={(date) => setFormData({ ...formData, date })}
                />
              </div>
            </div>

            {/* Item Input Section */}
            <div style={{ background: "var(--bg-secondary)", padding: "20px", borderRadius: "var(--radius-xl)", border: "2px dashed var(--border-light)", marginBottom: "24px" }}>
              <div className="flex-between" style={{ marginBottom: "16px" }}>
                <h4 style={{ margin: 0, fontSize: "1rem" }}>Rincian Sampah</h4>
                {!isAdding && (
                  <button type="button" className="btn btn-sm btn-primary" onClick={() => setIsAdding(true)}>
                    <Plus size={16} /> Tambah Item
                  </button>
                )}
              </div>

              {isAdding && (
                <div className="fade-in">
                  <div className="flex gap-md flex-stack-mobile" style={{ marginBottom: "12px" }}>
                    <div style={{ flex: 2 }}>
                      <label className="form-label-sm">Jenis Sampah</label>
                      <select
                        className="form-select"
                        value={currentItem.type}
                        onChange={(e) => setCurrentItem({ ...currentItem, type: e.target.value })}
                        style={{ height: "45px" }}
                      >
                        {Object.entries(WASTE_CATEGORIES).map(([category, types]) => (
                          <optgroup key={category} label={category}>
                            {types.map((type) => (
                              <option key={type} value={type}>{WASTE_TYPES[type]}</option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>
                    <div style={{ flex: 1 }}>
                      <label className="form-label-sm">Berat (kg/L)</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-input"
                        placeholder="0.00"
                        value={currentItem.weight}
                        onChange={(e) => setCurrentItem({ ...currentItem, weight: e.target.value })}
                        style={{ height: "45px" }}
                        autoFocus
                      />
                    </div>
                  </div>
                  <div className="flex gap-md" style={{ justifyContent: "flex-end" }}>
                    <button type="button" className="btn btn-outline btn-sm" onClick={() => setIsAdding(false)}>Batal</button>
                    <button type="button" className="btn btn-primary btn-sm" onClick={addItem} disabled={!currentItem.weight || currentItem.weight <= 0}>Konfirmasi</button>
                  </div>
                </div>
              )}

              {!isAdding && formData.items.length === 0 && (
                <div className="flex gap-md flex-wrap" style={{ justifyContent: "center", padding: "10px 0" }}>
                  {["bottlePlastic", "cardboard", "mixed", "cookingOil"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      className="btn btn-outline btn-sm"
                      style={{ borderRadius: "var(--radius-full)", padding: "4px 12px" }}
                      onClick={() => { setCurrentItem({ type, weight: "" }); setIsAdding(true); }}
                    >
                      {getWasteIcon(type)}
                      <span style={{ marginLeft: "6px" }}>{WASTE_TYPES[type]}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Items List */}
            {formData.items.length > 0 && (
              <div style={{ marginBottom: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
                {formData.items.map((item, index) => (
                  <div key={index} style={{ background: "var(--bg-primary)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-lg)", padding: "16px", position: "relative", boxShadow: "var(--shadow-sm)" }}>
                    <button
                      type="button"
                      className="text-danger"
                      style={{ position: "absolute", top: "12px", right: "12px", border: "none", background: "rgba(239, 68, 68, 0.1)", padding: "6px", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                      onClick={() => removeItem(index)}
                    >
                      <Trash2 size={16} />
                    </button>
                    <div className="flex flex-stack-mobile" style={{ gap: "16px", marginTop: "8px" }}>
                      <div className="flex gap-sm" style={{ alignItems: "center", flex: "1 1 auto" }}>
                        <div style={{ width: "40px", height: "40px", borderRadius: "var(--radius-md)", background: "var(--color-primary-50)", color: "var(--color-primary-600)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {getWasteIcon(item.type)}
                        </div>
                        <span style={{ fontWeight: "700", fontSize: "1.1rem" }}>{WASTE_TYPES[item.type]}</span>
                      </div>
                      <div className="flex gap-md flex-stack-mobile" style={{ flex: "1 1 auto", alignItems: "flex-end" }}>
                        <div style={{ flex: 1 }}>
                          <label className="form-label-sm" style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginBottom: "4px", display: "block" }}>Berat (kg/L)</label>
                          <input
                            type="number"
                            step="0.01"
                            className="form-input"
                            style={{ width: "100%", height: "36px", padding: "4px 12px" }}
                            value={item.weight}
                            onChange={(e) => updateItem(index, "weight", Number(e.target.value || 0))}
                          />
                        </div>
                      </div>
                    </div>
                    <div style={{ marginTop: "16px", paddingTop: "12px", borderTop: "1px dashed var(--border-light)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>Subtotal Item:</span>
                      <span style={{ fontWeight: "800", color: "var(--color-primary-600)", fontSize: "1.1rem" }}>
                        Rp {Number(Number(item.weight || 0) * getActivePrice(item.type)).toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Summary */}
            <div className="flex gap-lg flex-stack-mobile">
              <div style={{ flex: 1, padding: "16px", background: "var(--bg-primary)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-light)", textAlign: "center" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginBottom: "4px" }}>Total Berat</div>
                <div style={{ fontSize: "1.25rem", fontWeight: "800", color: "var(--text-primary)" }}>
                  {calculateTotalWeight().toFixed(2)} <span style={{ fontSize: "0.875rem", fontWeight: "400" }}>kg/L</span>
                </div>
              </div>
              <div style={{ flex: 1.5, padding: "16px", background: "var(--gradient-primary)", borderRadius: "var(--radius-lg)", color: "white", textAlign: "center", boxShadow: "var(--shadow-md)" }}>
                <div style={{ fontSize: "0.75rem", opacity: 0.9, marginBottom: "4px" }}>Total Pendapatan Nasabah</div>
                <div style={{ fontSize: "1.5rem", fontWeight: "800" }}>Rp {calculateTotal().toLocaleString("id-ID")}</div>
              </div>
            </div>
          </div>

          <div className="modal-footer" style={{ padding: "20px 24px" }}>
            <button type="button" className="btn btn-outline" onClick={onClose} style={{ fontWeight: "600" }}>Batalkan</button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: "10px 32px", fontWeight: "700" }}
              disabled={formData.items.length === 0 || !formData.userId}
            >
              {initialData ? "Simpan Perubahan" : "Konfirmasi Setoran"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DepositModal;
