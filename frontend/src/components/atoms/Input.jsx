/**
 * Atom: Input
 * Komponen input dasar yang dapat digunakan di seluruh aplikasi.
 */
function Input({
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  required,
  disabled,
  className,
  style,
  step,
  min,
  max,
  autoFocus,
}) {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      className={className || "form-input"}
      style={style}
      step={step}
      min={min}
      max={max}
      autoFocus={autoFocus}
    />
  );
}

export default Input;
