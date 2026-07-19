/**
 * Atom: Label
 * Komponen label form dasar yang dapat digunakan di seluruh aplikasi.
 */
function Label({ children, htmlFor, className, style }) {
  return (
    <label
      htmlFor={htmlFor}
      className={className || "form-label"}
      style={style}
    >
      {children}
    </label>
  );
}

export default Label;
