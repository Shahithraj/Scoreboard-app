import React from "react";
import { useLocation } from "react-router-dom";
import styles from "./Header.module.css";

const Header = () => {
  const location = useLocation();
  const pathParts = location.pathname.split("/").filter(Boolean); // remove empty parts like ''

  let title = "🏆 Scoreboard";
  let subtitle = "";

  if (pathParts.length === 1) {
    // Example: /dashboard or /members
    title = capitalize(pathParts[0]);
  } else if (pathParts.length === 2) {
    // Example: /create/team → Create / Team
    subtitle = capitalize(pathParts[0]);
    title = capitalize(pathParts[1]);
  } else if (pathParts.length > 2) {
    // For deeper paths like /leaderboard/member/details
    subtitle = capitalize(pathParts[pathParts.length - 2]);
    title = capitalize(pathParts[pathParts.length - 1]);
  }

  return (
    <header className={styles.header}>
      {subtitle ? (
        <h1 className={styles.headerTitle}>
          <span className={styles.subtitle}>{subtitle}</span>
          <span className={styles.separator}> / </span>
          <span>{title}</span>
        </h1>
      ) : (
        <h1 className={styles.headerTitle}>{title}</h1>
      )}
    </header>
  );
};

// Capitalize helper
function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default Header;
