import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Lock,
  Eye,
  EyeOff,
  Mail,
  ArrowRight,
  Smartphone,
} from "lucide-react";
import { apiClient } from "../api/client";
import AuthLayout from "../components/templates/AuthLayout";
import InputField from "../components/molecules/InputField";

/**
 * Page: LoginPage
 * Halaman autentikasi untuk masuk ke aplikasi.
 * Menggunakan komponen AuthLayout (template) dan InputField (molecule).
 */
function LoginPage({ onLogin }) {
  const [mode, setMode] = useState("login"); // "login" | "forgot"
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resetUrl, setResetUrl] = useState("");
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

  const switchMode = (newMode) => {
    setMode(newMode);
    setError("");
    setSuccess("");
    setResetUrl("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      if (mode === "forgot") {
        const result = await apiClient.forgotPassword(formData.username);
        if (result.success) {
          setSuccess(result.message);
          if (result.resetUrl) {
            setResetUrl(result.resetUrl);
          }
        } else {
          setError(result.message || "Gagal mengirim link reset");
        }
      } else {
        const result = await apiClient.login(formData.username, formData.password);
        if (result.success) {
          localStorage.setItem("banksampah_token", result.token);
          localStorage.setItem("banksampah_current_user", JSON.stringify(result.user));
          onLogin(result.user);
        } else {
          setError(result.message || "Email atau password salah");
        }
      }
    } catch {
      setError("Terjadi kesalahan pada server");
    } finally {
      setLoading(false);
    }
  };

  const isLogin = mode === "login";
  const isForgot = mode === "forgot";

  return (
    <div
      className="fixed inset-0 bg-white sm:bg-gray-50 flex items-center justify-center sm:p-6 lg:p-8 xl:p-12 overflow-hidden"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-5xl bg-white sm:rounded-3xl sm:shadow-xl xl:shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 lg:min-h-[580px]">
        {/* Left Panel (Template) */}
        <AuthLayout
          tagline="Kelola Sampah,"
          taglineHighlight="Raih Manfaat!"
        />

        {/* Right: Form */}
        <div className="flex flex-col p-4 sm:p-6 lg:p-6 xl:p-8 overflow-y-auto h-full bg-white">
          <div className="w-full max-w-md mx-auto my-auto py-1 sm:py-2">
            {/* Mobile Logo */}
            <div className="flex items-center gap-2 mb-4 sm:mb-6 lg:hidden">
              <div className="bg-teal-500 p-2 rounded-xl">
                <Smartphone className="text-white w-5 h-5" />
              </div>
              <span className="text-gray-800 font-black text-lg">Bank Sampah Bakti Alam</span>
            </div>

            {/* Header */}
            <div className="mb-3 sm:mb-4">
              <h1 className="text-xl sm:text-2xl lg:text-2xl font-black text-gray-900 leading-tight">
                {isForgot ? "Reset Password" : "Selamat datang!"}
              </h1>
              <p className="text-gray-500 text-[11px] sm:text-xs lg:text-sm mt-1">
                {isForgot
                  ? "Masukkan email Anda, kami kirimkan link reset."
                  : "Masuk ke dashboard Bank Sampah Bakti Alam."}
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
                {resetUrl && (
                  <a
                    href={resetUrl}
                    className="mt-1 px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-center rounded-lg transition-colors cursor-pointer block"
                  >
                    Buka Tautan Reset (Pengujian Lokal)
                  </a>
                )}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-1.5 sm:space-y-2 lg:space-y-2.5">
              {/* Forgot: email only */}
              {isForgot && (
                <div>
                  <label className="block text-[11px] sm:text-xs lg:text-sm font-semibold text-gray-700 mb-0.5 sm:mb-1">Email</label>
                  <InputField icon={Mail} type="email" name="username" placeholder="nama@email.com" value={formData.username} onChange={handleChange} required />
                </div>
              )}

              {/* Login: email + password */}
              {isLogin && (
                <>
                  <div>
                    <label className="block text-[11px] sm:text-xs lg:text-sm font-semibold text-gray-700 mb-0.5 sm:mb-1">Email</label>
                    <InputField icon={Mail} type="email" name="username" placeholder="nama@email.com" value={formData.username} onChange={handleChange} required />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                      <label className="block text-[11px] sm:text-xs lg:text-sm font-semibold text-gray-700">Password</label>
                      <button
                        type="button"
                        onClick={() => switchMode("forgot")}
                        className="text-[11px] sm:text-xs text-teal-600 font-semibold hover:text-teal-700 transition-colors cursor-pointer"
                      >
                        Lupa password?
                      </button>
                    </div>
                    <InputField
                      icon={Lock}
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password kamu"
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
                </>
              )}

              {isForgot && (
                <button type="button" onClick={() => switchMode("login")} className="text-[11px] sm:text-xs lg:text-sm text-teal-600 font-semibold hover:text-teal-700 transition-colors cursor-pointer">
                  ← Kembali ke halaman masuk
                </button>
              )}

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
                    {isForgot ? "Kirim Link Reset" : "Masuk ke Dashboard"}
                    {!loading && <ArrowRight size={17} />}
                  </>
                )}
              </button>
            </form>

            {/* Footer switch */}
            <div className="mt-2.5 sm:mt-3.5 pt-2 border-t border-gray-100 text-center">
              {isLogin && (
                <p className="text-gray-500 text-xs sm:text-sm">
                  Belum punya akun?{" "}
                  <Link to="/register" className="text-teal-600 font-bold hover:text-teal-700 transition-colors cursor-pointer">
                    Daftar sekarang
                  </Link>
                </p>
              )}
              {isForgot && (
                <p className="text-gray-500 text-xs sm:text-sm">
                  Ingat password?{" "}
                  <button type="button" onClick={() => switchMode("login")} className="text-teal-600 font-bold hover:text-teal-700 transition-colors cursor-pointer">
                    Masuk di sini
                  </button>
                </p>
              )}
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

export default LoginPage;
