import React from "react";
import styles from "./CustomDropdown.module.css";

interface Option {
  label: string;
  value: string;
}

interface CustomDropdownProps {
  label: string;
  name: string;
  options: Option[];
  value: string | string[]; // ✅ supports both single and multi-select
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  multiple?: boolean;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  label,
  name,
  options,
  value,
  onChange,
  required,
  multiple = false,
}) => {
  return (
    <div className={styles.field}>
      <label htmlFor={name} className={styles.label}>
        {label}
        {required && <span className={styles.required}>*</span>}
      </label>

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={styles.select}
        required={required}
        multiple={multiple}
      >
        {!multiple && <option value="">Select...</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CustomDropdown;
