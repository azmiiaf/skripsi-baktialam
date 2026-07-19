/**
 * Molecule: InputField
 * Gabungan icon + input field + optional right element.
 * Digunakan di halaman Login dan Register.
 */
function InputField({
  icon: Icon,
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  required,
  rightElement,
  children,
}) {
  return (
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-teal-500 transition-colors duration-200">
        <Icon size={17} />
      </div>
      {children || (
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full pl-12 pr-12 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-sm font-medium placeholder-gray-400 focus:outline-none focus:border-teal-500 focus:ring-3 focus:ring-teal-500/10 transition-all duration-200"
        />
      )}
      {rightElement && (
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
          {rightElement}
        </div>
      )}
    </div>
  );
}

export default InputField;
