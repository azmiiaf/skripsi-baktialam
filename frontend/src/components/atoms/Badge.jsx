/**
 * Atom: Badge
 * Komponen badge/label kecil untuk status dan kategori.
 */
function Badge({ children, variant = "primary", style }) {
  return (
    <span className={`badge badge-${variant}`} style={style}>
      {children}
    </span>
  );
}

export default Badge;
