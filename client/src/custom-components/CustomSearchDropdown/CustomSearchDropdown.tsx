import React, { useState, useEffect } from "react";
import styles from "./CustomSearchDropdown.module.css";

interface Option {
  label: string;
  value: string;
}

interface CustomSearchDropdownProps {
  label?: string;
  options: Option[];
  placeholder?: string;
  selectedValues: string[];
  onChange: (selected: string[]) => void;
}

const CustomSearchDropdown: React.FC<CustomSearchDropdownProps> = ({
  label,
  options,
  placeholder = "Search...",
  selectedValues,
  onChange,
}) => {
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<Option[]>(options);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setFiltered(
      options.filter((opt) =>
        opt.label.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, options]);

  const toggleSelection = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  return (
    <div className={styles.dropdownWrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.inputWrapper}>
        <input
          type="text"
          placeholder={placeholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setOpen(true)}
          className={styles.input}
        />
        {open && (
          <div className={styles.dropdownList}>
            {filtered.map((opt) => (
              <div
                key={opt.value}
                className={`${styles.option} ${
                  selectedValues.includes(opt.value) ? styles.selected : ""
                }`}
                onClick={() => toggleSelection(opt.value)}
              >
                {opt.label}
              </div>
            ))}
            {filtered.length === 0 && (
              <div className={styles.noOption}>No results found</div>
            )}
          </div>
        )}
      </div>
      {selectedValues.length > 0 && (
        <div className={styles.selectedList}>
          {selectedValues.map((id) => {
            const label = options.find((o) => o.value === id)?.label || id;
            return (
              <span
                key={id}
                className={styles.selectedChip}
                onClick={() => toggleSelection(id)}
              >
                {label} ✕
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomSearchDropdown;
