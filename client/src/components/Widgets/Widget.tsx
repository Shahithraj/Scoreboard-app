import React from "react";
import styles from "./widget.module.css";

// 🎨 Define prop types
interface WidgetProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string; // optional color (hex, rgb, etc.)
}

const Widget: React.FC<WidgetProps> = ({ title, value, icon, color }) => {
  return (
    <div className={styles.widgetCard}>
      <div className={styles.widgetContent}>
        <div className={styles.textContainer}>
          <span className={styles.title}>{title}</span>
          <span className={styles.value} style={{ color }}>
            {value}
          </span>
        </div>

        <div
          className={styles.iconContainer}
          style={{ backgroundColor: color }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

export default Widget;
