import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <nav className="sidebar-nav">
      <div className="sidebar-logo">
        <h2>Admin Panel</h2>
      </div>
      <ul className="nav-list">
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            📊 Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/users"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            👥 Users
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/settings"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            ⚙️ Settings
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
