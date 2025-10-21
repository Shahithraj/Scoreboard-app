import { useEffect, useState } from "react";
import styles from "./Sidebar.module.css";
import {
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  Plus,
  Trophy,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

const sidebarItems = [
  {
    title: "Dashboard",
    icon: <LayoutDashboard size={18} />,
    path: "/dashboard",
  },
  {
    title: "Create",
    icon: <Plus size={18} />,
    subItems: [
      { name: "Team", path: "/create/team" },
      { name: "Member", path: "/create/member" },
      { name: "Games", path: "/create/game" },
    ],
  },
  {
    title: "Leaderboard",
    icon: <Trophy size={18} />,
    subItems: [
      { name: "Team", path: "/leaderboard/team" },
      { name: "Member", path: "/leaderboard/member" },
    ],
  },
  {
    title: "Add Score",
    icon: <Plus size={18} />,
    path: "/score",
  },
  {
    title: "Team List",
    icon: <LayoutDashboard size={18} />,
    path: "/teams",
  },
  {
    title: "Member List",
    icon: <LayoutDashboard size={18} />,
    path: "/members",
  },
];

const Sidebar = () => {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const location = useLocation();

  // ✅ Accordion behavior: only one section open at a time
  const toggleSection = (title: string) => {
    setOpenSection(openSection === title ? null : title);
  };

  // ✅ Auto-open section based on route
  useEffect(() => {
    const parentItem = sidebarItems.find((item) =>
      item.subItems?.some((sub) => location.pathname.startsWith(sub.path))
    );
    if (parentItem) setOpenSection(parentItem.title);
    else setOpenSection(null);
  }, [location.pathname]);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.title}>🏆 Scoreboard</div>

      {sidebarItems.map((item) => {
        const isOpen = openSection === item.title;
        const isActiveSub =
          item.subItems?.some((sub) =>
            location.pathname.startsWith(sub.path)
          ) ?? false;

        return (
          <div key={item.title} className={styles.section}>
            {item.subItems ? (
              <>
                <button
                  onClick={() => toggleSection(item.title)}
                  aria-expanded={isOpen}
                  className={`${styles.itemButton} ${
                    isActiveSub ? styles.active : ""
                  }`}
                >
                  <span className={styles.itemLabel}>
                    <span className={styles.icon}>{item.icon}</span>
                    {item.title}
                  </span>
                  {isOpen ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </button>

                {isOpen && (
                  <div className={styles.subList}>
                    {item.subItems.map((sub) => (
                      <NavLink
                        key={sub.name}
                        to={sub.path}
                        className={({ isActive }) =>
                          `${styles.subItem} ${
                            isActive ? styles.activeSub : ""
                          }`
                        }
                      >
                        {sub.name}
                      </NavLink>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <NavLink
                to={item.path!}
                className={({ isActive }) =>
                  `${styles.itemButton} ${isActive ? styles.active : ""}`
                }
              >
                <span className={styles.itemLabel}>
                  <span className={styles.icon}>{item.icon}</span>
                  {item.title}
                </span>
              </NavLink>
            )}
          </div>
        );
      })}
    </aside>
  );
};

export default Sidebar;
