/**
 * Organism: BankSampahIllustration
 * Ilustrasi SVG Bank Sampah yang digunakan di halaman Login dan Register.
 */
function BankSampahIllustration() {
  return (
    <svg
      viewBox="0 0 400 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-sm mx-auto"
    >
      <defs>
        <linearGradient id="glow-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255, 255, 255, 0.25)" />
          <stop offset="100%" stopColor="rgba(255, 255, 255, 0.05)" />
        </linearGradient>
        <linearGradient id="coin-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFE082" />
          <stop offset="100%" stopColor="#FFB300" />
        </linearGradient>
        <linearGradient id="bin-green" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#A5D6A7" />
          <stop offset="100%" stopColor="#66BB6A" />
        </linearGradient>
        <linearGradient id="bin-blue" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#80DEEA" />
          <stop offset="100%" stopColor="#26C6DA" />
        </linearGradient>
        <linearGradient id="bin-orange" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFCC80" />
          <stop offset="100%" stopColor="#FFA726" />
        </linearGradient>
        <filter id="svg-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow
            dx="0"
            dy="4"
            stdDeviation="4"
            floodColor="#00332c"
            floodOpacity="0.1"
          />
        </filter>
      </defs>

      {/* Background glow circle */}
      <circle
        cx="200"
        cy="140"
        r="110"
        fill="url(#glow-grad)"
        stroke="rgba(255, 255, 255, 0.15)"
        strokeWidth="1.5"
      />

      {/* Base Ground lines */}
      <line
        x1="50"
        y1="230"
        x2="350"
        y2="230"
        stroke="rgba(255, 255, 255, 0.3)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="80"
        y1="240"
        x2="320"
        y2="240"
        stroke="rgba(255, 255, 255, 0.15)"
        strokeWidth="2"
        strokeDasharray="6 6"
      />

      {/* THREE SORTING BINS */}
      <g id="sorting-bins" transform="translate(60, 130)" filter="url(#svg-shadow)">
        <g transform="translate(0, 0)">
          <rect x="0" y="10" width="24" height="42" rx="3" fill="url(#bin-green)" />
          <rect x="-2" y="6" width="28" height="5" rx="1.5" fill="#4CAF50" />
          <path d="M 12 22 C 8 22, 7 28, 12 32 C 17 28, 16 22, 12 22 Z" fill="#E8F5E9" opacity="0.9" />
          <text x="12" y="46" textAnchor="middle" fill="#1B5E20" fontSize="5" fontWeight="bold">ORG</text>
        </g>
        <g transform="translate(30, 0)">
          <rect x="0" y="10" width="24" height="42" rx="3" fill="url(#bin-blue)" />
          <rect x="-2" y="6" width="28" height="5" rx="1.5" fill="#00ACC1" />
          <rect x="10" y="21" width="4" height="10" rx="1" fill="#E0F7FA" opacity="0.9" />
          <rect x="11.5" y="19" width="1" height="2" fill="#E0F7FA" opacity="0.9" />
          <text x="12" y="46" textAnchor="middle" fill="#006064" fontSize="5" fontWeight="bold">ANO</text>
        </g>
        <g transform="translate(60, 0)">
          <rect x="0" y="10" width="24" height="42" rx="3" fill="url(#bin-orange)" />
          <rect x="-2" y="6" width="28" height="5" rx="1.5" fill="#FB8C00" />
          <rect x="8" y="21" width="8" height="10" rx="0.5" fill="#FFF3E0" opacity="0.9" />
          <line x1="10" y1="24" x2="14" y2="24" stroke="#FB8C00" strokeWidth="0.8" />
          <line x1="10" y1="27" x2="14" y2="27" stroke="#FB8C00" strokeWidth="0.8" />
          <text x="12" y="46" textAnchor="middle" fill="#E65100" fontSize="5" fontWeight="bold">KRT</text>
        </g>
      </g>

      {/* WEIGHING SCALE */}
      <g id="weighing-scale" transform="translate(165, 120)" filter="url(#svg-shadow)">
        <rect x="0" y="80" width="70" height="12" rx="4" fill="#B2DFDB" stroke="#00796B" strokeWidth="1.5" />
        <rect x="5" y="83" width="60" height="6" rx="1" fill="#00796B" opacity="0.2" />
        <path d="M 58 80 L 58 35" stroke="#00796B" strokeWidth="4" strokeLinecap="round" />
        <g transform="translate(42, 12)">
          <rect x="0" y="0" width="32" height="20" rx="3" fill="#37474F" stroke="#00796B" strokeWidth="1" />
          <rect x="2" y="2" width="28" height="16" rx="1.5" fill="#E0F2F1" />
          <text x="16" y="13" textAnchor="middle" fill="#00796B" fontSize="9" fontWeight="bold" fontFamily="monospace">15.4</text>
          <text x="26" y="16" textAnchor="middle" fill="#00796B" fontSize="4">kg</text>
        </g>
        <g transform="translate(10, 25)">
          <path d="M 8 55 C 2 55, 0 35, 10 15 C 15 5, 25 5, 30 15 C 40 35, 38 55, 32 55 Z" fill="rgba(255, 255, 255, 0.45)" stroke="#004D40" strokeWidth="1.5" />
          <path d="M 18 10 C 15 5, 25 5, 22 10" stroke="#004D40" strokeWidth="2" fill="none" />
          <circle cx="20" cy="11" r="2.5" fill="#004D40" />
          <g transform="translate(10, 22)">
            <rect x="2" y="8" width="8" height="15" rx="1" fill="#80DEEA" stroke="#00ACC1" strokeWidth="1" opacity="0.8" transform="rotate(25 6 15)" />
            <rect x="14" y="6" width="7" height="16" rx="1" fill="#80DEEA" stroke="#00ACC1" strokeWidth="1" opacity="0.8" transform="rotate(-15 17 14)" />
            <circle cx="10" cy="22" r="3" fill="#FF8A80" opacity="0.7" />
          </g>
        </g>
      </g>

      {/* SAVINGS BOOK & COINS */}
      <g id="savings-and-coins" transform="translate(265, 125)" filter="url(#svg-shadow)">
        <g transform="translate(10, 20) rotate(-10)">
          <rect x="0" y="0" width="48" height="64" rx="4" fill="#2E7D32" stroke="#1B5E20" strokeWidth="1.5" />
          <rect x="4" y="4" width="40" height="56" rx="2" fill="none" stroke="#A5D6A7" strokeWidth="1" strokeDasharray="2 2" />
          <rect x="8" y="16" width="32" height="14" rx="2" fill="#E8F5E9" />
          <text x="24" y="25" textAnchor="middle" fill="#1B5E20" fontSize="5" fontWeight="black">TABUNGAN</text>
          <circle cx="24" cy="42" r="8" fill="#FFE082" />
          <text x="24" y="45.5" textAnchor="middle" fill="#FF8F00" fontSize="10" fontWeight="bold">♻</text>
        </g>
        <g transform="translate(0, 70)">
          <ellipse cx="12" cy="6" rx="12" ry="4" fill="#FF8F00" />
          <rect x="0" y="2" width="24" height="4" fill="#FFB300" />
          <ellipse cx="12" cy="2" rx="12" ry="4" fill="#FFE082" stroke="#FF8F00" strokeWidth="0.5" />
          <text x="12" y="4.5" textAnchor="middle" fill="#FF8F00" fontSize="5" fontWeight="bold">Rp</text>
        </g>
        <g transform="translate(18, 73)">
          <ellipse cx="10" cy="5" rx="10" ry="3.5" fill="#FF8F00" />
          <rect x="0" y="2.5" width="20" height="2.5" fill="#FFB300" />
          <ellipse cx="10" cy="2.5" rx="10" ry="3.5" fill="#FFE082" stroke="#FF8F00" strokeWidth="0.5" />
          <text x="10" y="4.5" textAnchor="middle" fill="#FF8F00" fontSize="4" fontWeight="bold">Rp</text>
        </g>
        <g transform="translate(4, 63)">
          <ellipse cx="11" cy="5" rx="11" ry="3.5" fill="#FF8F00" />
          <rect x="0" y="2" width="22" height="3" fill="#FFB300" />
          <ellipse cx="11" cy="2" rx="11" ry="3.5" fill="#FFE082" stroke="#FF8F00" strokeWidth="0.5" />
          <text x="11" y="4.5" textAnchor="middle" fill="#FF8F00" fontSize="4.5" fontWeight="bold">Rp</text>
        </g>
      </g>

      {/* Floating Leaves */}
      <path d="M 230 80 C 225 70, 240 65, 238 72 C 236 78, 232 80, 232 80" fill="#81C784" transform="rotate(15 230 80)" filter="url(#svg-shadow)" />
      <path d="M 130 90 C 125 80, 140 75, 138 82 C 136 88, 132 90, 132 90" fill="#4CAF50" transform="rotate(-25 130 90)" filter="url(#svg-shadow)" />
      <path d="M 330 110 C 325 100, 340 95, 338 102 C 336 108, 332 110, 332 110" fill="#81C784" transform="rotate(35 330 110)" filter="url(#svg-shadow)" />

      {/* Floating Sparkles */}
      <path d="M 220 50 L 223 55 L 228 56 L 223 57 L 220 62 L 217 57 L 212 56 L 217 55 Z" fill="#FFF59D" />
      <path d="M 290 85 L 292 88 L 295 89 L 292 90 L 290 93 L 288 90 L 285 89 L 288 88 Z" fill="#FFF59D" />

      {/* Conversion Arrow */}
      <path d="M 230 145 Q 255 135 260 160" stroke="#FFF59D" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="4 4" fill="none" />
      <path d="M 255 162 L 261 161 L 261 155" stroke="#FFF59D" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export default BankSampahIllustration;
