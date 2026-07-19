import { Search } from "lucide-react";

/**
 * Molecule: SearchBar
 * Input pencarian dengan icon search di kiri.
 * Digunakan di berbagai tab dashboard admin.
 */
function SearchBar({ value, onChange, placeholder = "Cari...", style }) {
  return (
    <div className="input-group" style={style}>
      <span className="input-icon">
        <Search size={16} />
      </span>
      <input
        type="text"
        className="form-input"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export default SearchBar;
