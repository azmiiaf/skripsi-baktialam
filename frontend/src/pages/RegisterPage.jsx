import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  Mail,
  MapPin,
  ChevronDown,
  ArrowRight,
  Recycle,
} from "lucide-react";
import { apiClient } from "../api/client";
import AuthLayout from "../components/templates/AuthLayout";
import InputField from "../components/molecules/InputField";

/**
 * Page: RegisterPage
 * Halaman pendaftaran akun baru.
 * Menggunakan komponen AuthLayout (template) dan InputField (molecule).
 */
function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rt: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [localVerifyUrl, setLocalVerifyUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.style.height = "100%";
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.height = "100%";
    return () => {
      document.body.style.overflow = "";
      document.body.style.height = "";
      document.documentElement.style.overflow = "";
      document.documentElement.style.height = "";
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (formData.password.length < 6) {
      setError("Password minimal terdiri dari 6 karakter");
      setLoading(false);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Konfirmasi password tidak cocok");
      setLoading(false);
      return;
    }

    try {
      const generatedUsername =
        formData.name.toLowerCase().replace(/\s+/g, "_") +
        "_" +
        Date.now().toString().slice(-4);

      const result = await apiClient.register({
        username: generatedUsername,
        name: formData.name,
        email: formData.email,
        rt: formData.rt,
        password: formData.password,
        role: "user",
      });

      if (result.success) {
        setSuccess(result.message);
        if (result.verifyUrl) {
          setLocalVerifyUrl(result.verifyUrl);
        } else {
          setTimeout(() => navigate("/login"), 5000);
        }
      } else {
        setError(result.message || "Registrasi gagal");
      }
    } catch {
      setError("Terjadi kesalahan pada server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-white sm:bg-gray-50 flex items-center justify-center sm:p-6 lg:p-8 xl:p-12 overflow-hidden"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-5xl bg-white sm:rounded-3xl sm:shadow-xl xl:shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 lg:min-h-[580px]">
        {/* Left Panel (Template) */}
        <AuthLayout
          tagline="Gabung Sekarang,"
          taglineHighlight="Selamatkan Bumi!"
        />

        {/* Right: Form */}
        <div className="flex flex-col p-4 sm:p-6 lg:p-6 xl:p-8 overflow-y-auto h-full bg-white">
          <div className="w-full max-w-md mx-auto my-auto py-1 sm:py-2">
            {/* Mobile Logo */}
            <div className="flex items-center gap-2 mb-3 sm:mb-6 lg:hidden">
              <div className="bg-teal-500 p-2 rounded-xl">
                <Recycle className="text-white w-5 h-5" />
              </div>
              <span className="text-gray-800 font-black text-lg">Bank Sampah Bakti Alam</span>
            </div>

            {/* Header */}
            <div className="mb-2.5 sm:mb-3">
              <h1 className="text-xl lg:text-2xl font-black text-gray-900 leading-tight">
                Buat Akun Baru
              </h1>
              <p className="text-gray-500 text-[11px] sm:text-xs lg:text-sm mt-1">
                Daftar dan mulai kelola sampah Anda menjadi saldo tabungan.
              </p>
              <div className="mt-1 w-10 h-0.5 bg-teal-500 rounded-full" />
            </div>

            {/* Alerts */}
            {error && (
              <div className="mb-3.5 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-medium flex items-start gap-2">
                <span className="text-red-400 mt-0.5">⚠</span>
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="mb-3.5 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-medium flex flex-col gap-2">
                <div className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">✓</span>
                  <span>{success}</span>
                </div>
                {localVerifyUrl && (
                  <a
                    href={localVerifyUrl}
                    className="mt-1 px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-center rounded-lg transition-colors cursor-pointer block"
                  >
                    Verifikasi Akun (Pengujian Lokal)
                  </a>
                )}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-1.5 sm:space-y-2">
              <div>
                <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 mb-0.5">Nama Lengkap</label>
                <InputField icon={User} name="name" placeholder="Nama lengkap Anda" value={formData.name} onChange={handleChange} required />
              </div>

              <div>
                <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 mb-0.5">Email</label>
                <InputField icon={Mail} type="email" name="email" placeholder="nama@email.com" value={formData.email} onChange={handleChange} required />
              </div>

              {/* RT Select */}
              <div>
                <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 mb-0.5">Wilayah (RT)</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-teal-500 transition-colors">
                    <MapPin size={17} />
                  </div>
                  <select
                    name="rt"
                    value={formData.rt}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-10 py-1.5 sm:py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-sm font-medium focus:outline-none focus:border-teal-500 focus:ring-3 focus:ring-teal-500/10 transition-all appearance-none"
                  >
                    <option value="" disabled>Pilih RT</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                      <option key={n} value={`RT ${n}`}>RT {n}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 mb-0.5">Password</label>
                <InputField
                  icon={Lock}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Minimal 6 karakter"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  rightElement={
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-teal-500 transition-colors cursor-pointer">
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  }
                />
              </div>

              <div>
                <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 mb-0.5">Konfirmasi Password</label>
                <InputField
                  icon={Lock}
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Ulangi password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  rightElement={
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-gray-400 hover:text-teal-500 transition-colors cursor-pointer">
                      {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  }
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-0.5 bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 sm:py-2.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-teal-500/25 hover:-translate-y-0.5 active:translate-y-0 active:shadow-none disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Daftar Sekarang
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-2.5 sm:mt-3 pt-1.5 border-t border-gray-100 text-center">
              <p className="text-gray-500 text-xs sm:text-sm">
                Sudah punya akun?{" "}
                <Link to="/login" className="text-teal-600 font-bold hover:text-teal-700 transition-colors cursor-pointer">
                  Masuk di sini
                </Link>
              </p>
            </div>

            <p className="text-center text-[9px] sm:text-[10px] text-gray-300 mt-1.5 sm:mt-2">
              © 2024 Bank Sampah Bakti Alam · Hak Cipta Dilindungi
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
