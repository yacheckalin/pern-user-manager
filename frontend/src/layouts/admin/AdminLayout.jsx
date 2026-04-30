import { Outlet } from "react-router-dom";
// import Sidebar from "@layouts/components/sidebar";
import Header from "@layouts/components/headers";
import "./AdminLayout.css";

const AdminLayout = () => {
  return (
    <div className="admin-container">
      {/* <aside className="admin-sidebar">
        <Sidebar />
      </aside> */}
      <div className="admin-main">
        <header className="admin-header">
          <Header />
        </header>
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
