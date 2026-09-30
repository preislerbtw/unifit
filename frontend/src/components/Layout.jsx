import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";
import Footer from "./Footer";
import "../styles/Layout.css";

function Layout() {
  return (
    <div className="app-shell">
      <SideBar />
      <div className="app-main">
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;