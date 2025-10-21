import styles from "./Home.module.css";
import Sidebar from "../Sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import Header from "../Header/Header";

const Home = () => {
  return (
    <div className={`${styles.appContainer} `}>
      <Sidebar />
      <div className={styles.mainContainer}>
        <Header />
        <main className={styles.mainContent}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Home;
