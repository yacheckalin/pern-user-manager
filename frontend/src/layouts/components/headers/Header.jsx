import "./Header.css";

const Header = () => {
  return (
    <div className="header-wrapper">
      <div className="header-left">
        <h1 className="page-title">Users Management</h1>
      </div>

      <div className="header-right">
        <div className="user-info">
          <div className="user-text">
            <span className="user-name">Admin User</span>
            <span className="user-role">Super Admin</span>
          </div>
          <div className="user-avatar">AD</div>
        </div>
      </div>
    </div>
  );
};

export default Header;
