import React from "react";
import styles from "./CustomInput.module.css";

interface CustomInputProps {
  label: string;
  name: string;
  value: string;
  type?: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  name,
  value,
  type = "text",
  placeholder,
  onChange,
  required,
}) => {
  return (
    <div className={styles.field}>
      <label htmlFor={name} className={styles.label}>
        {label}
        {required && <span className={styles.required}>*</span>}
      </label>
      <input
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        className={styles.input}
        required={required}
      />
    </div>
  );
};

export default CustomInput;
