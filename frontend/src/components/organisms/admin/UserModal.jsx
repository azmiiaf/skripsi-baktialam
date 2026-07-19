import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

const MySwal = withReactContent(Swal);

/**
 * Organism: Admin — UserModal
 * Modal form untuk menambah atau mengedit data nasabah.
 */
function UserModal({ user, onClose, onSave }) {
  const [showPasswordModalField, setShowPasswordModalField] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    rt: user?.rt || "",
    password: user?.passwordPlain || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) {
      MySwal.fire({
        icon: "error",
        title: "Validasi Gagal",
        text: "Nama wajib diisi!",
      });
      return;
    }
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            {user ? "Edit Nasabah" : "Tambah Nasabah"}
          </h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Nama Lengkap</label>
              <input
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Wilayah (RT)</label>
              <select
                className="form-select"
                value={formData.rt}
                onChange={(e) => setFormData({ ...formData, rt: e.target.value })}
                required
              >
                <option value="" disabled>Pilih Wilayah</option>
                {[...Array(10)].map((_, i) => {
                  const rtNum = (i + 1).toString().padStart(2, "0");
                  return (
                    <option key={rtNum} value={rtNum}>RT {rtNum}</option>
                  );
                })}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <input
                  type={showPasswordModalField ? "text" : "password"}
                  className="form-input"
                  style={{ paddingRight: "45px" }}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!user}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordModalField(!showPasswordModalField)}
                  style={{ position: "absolute", right: "12px", background: "none", border: "none", cursor: "pointer", color: "var(--text-tertiary)", display: "flex", alignItems: "center", justifyContent: "center", padding: "4px" }}
                >
                  {showPasswordModalField ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>Batal</button>
            <button type="submit" className="btn btn-primary">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserModal;
