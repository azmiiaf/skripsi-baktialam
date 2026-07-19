import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Loader2, ArrowRight, Smartphone } from "lucide-react";
import { apiClient } from "../api/client";
import AuthLayout from "../components/templates/AuthLayout";

/**
 * Page: VerifyEmailPage
 * Halaman untuk verifikasi email pengguna setelah registrasi.
 * Menggunakan komponen AuthLayout (template) untuk konsistensi tampilan.
 */
function VerifyEmailPage({ onLogin }) {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // "verifying" | "success" | "error"
  const [message, setMessage] = useState("Sedang memverifikasi alamat email Anda...");

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

  useEffect(() => {
    const performVerification = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Token verifikasi tidak ditemukan.");
        return;
      }

      try {
        const result = await apiClient.verifyEmail(token);
        if (result.success) {
          setStatus("success");
          setMessage(result.message || "Email berhasil diverifikasi!");

          // Lakukan auto-login dengan menyimpan data sesi ke localStorage
          if (result.token && result.user) {
            localStorage.setItem("banksampah_token", result.token);
            localStorage.setItem("banksampah_current_user", JSON.stringify(result.user));

            // Tunggu 3 detik kemudian arahkan ke dashboard
            setTimeout(() => {
              onLogin(result.user);
              navigate("/");
            }, 3000);
          }
        } else {
          setStatus("error");
          setMessage(result.message || "Tautan verifikasi tidak valid atau sudah kedaluwarsa.");
        }
      } catch (err) {
        console.error("Verification error:", err);
        setStatus("error");
        setMessage("Terjadi kesalahan jaringan atau server saat memverifikasi.");
      }
    };

    performVerification();
  }, [token, navigate, onLogin]);

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

        {/* Right: Content */}
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
                Verifikasi Email
              </h1>
              <p className="text-gray-500 text-[11px] sm:text-xs lg:text-sm mt-1">
                Bank Sampah Bakti Alam Digital
              </p>
              <div className="mt-1 w-10 h-0.5 bg-teal-500 rounded-full" />
            </div>

            {/* Verifying State */}
            {status === "verifying" && (
              <div className="flex flex-col items-center py-8 text-center">
                <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center mb-4">
                  <Loader2 className="text-teal-500 w-9 h-9 animate-spin" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">Memproses Verifikasi</h3>
                <p className="text-gray-500 text-sm max-w-[280px]">{message}</p>
              </div>
            )}

            {/* Success State */}
            {status === "success" && (
              <div className="flex flex-col items-center py-6 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
                  <CheckCircle className="text-emerald-500 w-9 h-9" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1">Verifikasi Berhasil!</h3>
                <p className="text-emerald-600 font-semibold text-xs mb-1">Akun Anda Telah Aktif</p>
                <p className="text-gray-500 text-sm mb-6 max-w-[280px]">
                  {message} Anda akan dialihkan ke Dashboard dalam beberapa detik...
                </p>
                <button
                  onClick={() => {
                    const user = JSON.parse(localStorage.getItem("banksampah_current_user"));
                    if (user) {
                      onLogin(user);
                      navigate("/");
                    } else {
                      navigate("/login");
                    }
                  }}
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 sm:py-2.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-teal-500/25 hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  Masuk ke Dashboard
                  <ArrowRight size={17} />
                </button>
              </div>
            )}

            {/* Error State */}
            {status === "error" && (
              <div className="flex flex-col items-center py-6 text-center">
                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
                  <XCircle className="text-red-500 w-9 h-9" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">Verifikasi Gagal</h3>
                <p className="text-gray-500 text-sm mb-6 max-w-[280px]">
                  {message}
                </p>
                <button
                  onClick={() => navigate("/login")}
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 sm:py-2.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-teal-500/25 hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  Kembali ke Login
                  <ArrowRight size={17} />
                </button>
              </div>
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

export default VerifyEmailPage;
