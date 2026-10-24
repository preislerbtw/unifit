import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";
import Footer from "./Footer";

function Layout() {
  return (
    <div className="flex min-h-screen">
      <SideBar />
      <div className="flex-1 min-w-0 flex flex-col">
        <main className="flex-1 flex flex-col">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
