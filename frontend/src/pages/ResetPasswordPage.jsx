import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, CheckCircle, ArrowRight, Smartphone } from "lucide-react";
import { apiClient } from "../api/client";
import AuthLayout from "../components/templates/AuthLayout";
import InputField from "../components/molecules/InputField";

/**
 * Page: ResetPasswordPage
 * Halaman untuk membuat password baru setelah reset.
 * Menggunakan komponen AuthLayout (template) dan InputField (molecule).
 */
function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password.length < 6) {
      setError("Password harus minimal 6 karakter");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password tidak cocok");
      return;
    }

    setLoading(true);
    const result = await apiClient.resetPassword(token, password);
    setLoading(false);

    if (result.success) {
      setSuccess("Password berhasil diubah!");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } else {
      setError(result.message || "Gagal mereset password");
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
                {success ? "Berhasil!" : "Buat Password Baru"}
              </h1>
              <p className="text-gray-500 text-[11px] sm:text-xs lg:text-sm mt-1">
                {success
                  ? "Password Anda telah diperbarui. Mengalihkan ke halaman masuk..."
                  : "Masukkan password baru Anda di bawah ini."}
              </p>
              <div className="mt-1 w-10 h-0.5 bg-teal-500 rounded-full" />
            </div>

            {/* Success State */}
            {success ? (
              <div className="flex flex-col items-center py-6 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
                  <CheckCircle className="text-emerald-500 w-9 h-9" />
                </div>
                <p className="text-gray-600 text-sm mb-6">{success}</p>
                <button
                  onClick={() => navigate("/login")}
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-2.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-teal-500/25 hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  Kembali ke Halaman Masuk
                  <ArrowRight size={17} />
                </button>
              </div>
            ) : (
              <>
                {/* Alerts */}
                {error && (
                  <div className="mb-3.5 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-medium flex items-start gap-2">
                    <span className="text-red-400 mt-0.5">⚠</span>
                    <span>{error}</span>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-1.5 sm:space-y-2 lg:space-y-2.5">
                  <div>
                    <label className="block text-[11px] sm:text-xs lg:text-sm font-semibold text-gray-700 mb-0.5 sm:mb-1">
                      Password Baru
                    </label>
                    <InputField
                      icon={Lock}
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Masukkan Password Baru"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      rightElement={
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-gray-400 hover:text-teal-500 transition-colors cursor-pointer"
                        >
                          {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                        </button>
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] sm:text-xs lg:text-sm font-semibold text-gray-700 mb-0.5 sm:mb-1">
                      Konfirmasi Password
                    </label>
                    <InputField
                      icon={Lock}
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Ulangi Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      rightElement={
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="text-gray-400 hover:text-teal-500 transition-colors cursor-pointer"
                        >
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
                        Ubah Password
                        <ArrowRight size={17} />
                      </>
                    )}
                  </button>
                </form>

                {/* Footer */}
                <div className="mt-2.5 sm:mt-3.5 pt-2 border-t border-gray-100 text-center">
                  <p className="text-gray-500 text-xs sm:text-sm">
                    Belum punya akun?{" "}
                    <a href="/register" className="text-teal-600 font-bold hover:text-teal-700 transition-colors cursor-pointer">
                      Daftar Sekarang
                    </a>
                  </p>
                </div>
              </>
            )}

            <p className="text-center text-[9px] sm:text-[10px] text-gray-300 mt-1.5 sm:mt-2">
              © 2026 Bank Sampah Bakti Alam · Hak Cipta Dilindungi
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
