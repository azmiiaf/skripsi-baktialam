import { Leaf, TrendingUp, Shield } from "lucide-react";

/**
 * Template: AuthLayout
 * Panel kiri untuk halaman autentikasi (Login, Register, Reset Password, dll).
 * Menampilkan ilustrasi gambar, tagline, dan badge stats.
 */
function AuthLayout({ tagline, taglineHighlight }) {
  return (
    <div className="lp-left hidden lg:flex flex-col items-center justify-between p-6 lg:p-5 xl:p-8 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-600 via-teal-500 to-emerald-500" />
      {/* Pattern overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />
      {/* Blob decorations */}
      <div className="absolute top-[-60px] right-[-60px] w-72 h-72 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-[-80px] left-[-40px] w-80 h-80 bg-emerald-700/30 rounded-full blur-3xl" />

      {/* Logo + App Name */}
      <div className="relative z-10 w-full">
        <div className="flex items-center gap-3 mb-1">
          <div className="bg-white/20 backdrop-blur-sm p-2 rounded-4xl">
            <img src="/img/logo.png" className="w-12 rounded-4xl" alt="" />
          </div>
          <span className="text-white font-black text-lg tracking-wide">
            Bakti Alam Digital
          </span>
        </div>
      </div>

      {/* Illustration + Tagline */}
      <div className="relative z-10 w-full flex flex-col items-center my-auto">
        {/* Illustration Image */}
        <div className="w-full max-w-[260px] lg:max-w-[280px] xl:max-w-[320px] mb-2">
          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <img
              src="/img/auth-illustration.png"
              alt="Ilustrasi Bank Sampah"
              className="w-full h-auto object-contain drop-shadow-lg ml-4"
              style={{ filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.15))" }}
            />
          </div>
        </div>
        <h2 className="text-white text-2xl xl:text-3xl font-black text-center leading-tight mt-2">
          {tagline}
          <br />
          <span className="text-yellow-300">{taglineHighlight}</span>
        </h2>
        <p className="text-teal-100 text-center text-xs xl:text-sm mt-1.5 max-w-xs leading-relaxed">
          Platform digital pengelolaan sampah yang membantu komunitas lebih bersih dan menghasilkan nilai ekonomi.
        </p>
      </div>

      {/* Stats badges */}
      <div className="relative z-10 w-full grid grid-cols-3 gap-3 mb-2 lg:mb-4">
        {[
          { icon: Leaf, label: "Eco Friendly", val: "100%" },
          { icon: TrendingUp, label: "Reward", val: "Aktif" },
          { icon: Shield, label: "Aman", val: "Terjamin" },
        ].map(({ icon: Icon, label, val }) => (
          <div key={label} className="bg-white/15 backdrop-blur-sm rounded-xl p-2.5 text-center border border-white/20">
            <Icon className="text-white/80 w-4 h-4 mx-auto mb-1" />
            <p className="text-white font-black text-xs xl:text-sm">{val}</p>
            <p className="text-teal-100 text-[10px] xl:text-xs">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AuthLayout;
