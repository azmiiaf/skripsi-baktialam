/**
 * Atom: Button
 * Komponen tombol dasar yang dapat digunakan di seluruh aplikasi.
 */
function Button({
  children,
  variant = "primary",
  size,
  type = "button",
  onClick,
  disabled,
  style,
  className,
}) {
  const classes = [
    "btn",
    variant && `btn-${variant}`,
    size && `btn-${size}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      style={style}
    >
      {children}
    </button>
  );
}

export default Button;
