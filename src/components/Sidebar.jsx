import { NavLink, useNavigate } from "react-router-dom";

export const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div
      className="offcanvas offcanvas-start col-md-4 bg-dark text-white "
      tabIndex="-1"
      id="sidebar"
      aria-labelledby="sidebarLabel"
      style={{ width: "300px", position: "fixed" }}
    >
      <div className="offcanvas-header d-md-none">
        <h5 className="offcanvas-title" id="sidebarLabel">
          Menu
        </h5>
        <button
          type="button"
          className="btn-close btn-close-white"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
      </div>

      <div className="offcanvas-body p-3">
        <ul className="nav flex-column">
          <li className="nav-item">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `nav-link text-white ${isActive ? "active-link" : ""}`
              }
            >
              Dashboard
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/projects"
              className={({ isActive }) =>
                `nav-link text-white ${isActive ? "active-link" : ""}`
              }
            >
              Projects
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/teams"
              className={({ isActive }) =>
                `nav-link text-white ${isActive ? "active-link" : ""}`
              }
            >
              Teams
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/reports"
              className={({ isActive }) =>
                `nav-link text-white ${isActive ? "active-link" : ""}`
              }
            >
              Reports
            </NavLink>
          </li>
        </ul>
        <div className="pt-5">
          <button
            className="btn btn-danger btn-sm w-100"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};
