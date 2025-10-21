import React from "react";
import styles from "./CustomButton.module.css";

type Variant = "primary" | "secondary" | "warning";

interface CustomButtonProps {
  label: string;
  variant?: Variant;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  label,
  variant = "primary",
  onClick,
  type = "button",
  disabled = false,
}) => {
  return (
    <button
      type={type}
      className={`${styles.button} ${styles[variant]}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default CustomButton;
