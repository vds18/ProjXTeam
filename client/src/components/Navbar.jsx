import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setMenuOpen(false);
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  if (!token) {
    return null;
  }

  return (
    <>
      <nav className="modern-navbar">
        <div className="navbar-container">

          {/* ================= LOGO ================= */}
          <Link
            to="/dashboard"
            className="navbar-logo"
            onClick={closeMenu}
          >
            <span className="logo-text">ProjXTeam</span>
            <span className="logo-icon">🚀</span>
          </Link>


          {/* ================= DESKTOP NAV ================= */}
          <div className="navbar-links">

            <Link
              to="/dashboard"
              className={`navbar-link ${
                isActive("/dashboard") ? "active" : ""
              }`}
            >
              <span>⌂</span>
              Dashboard
            </Link>

            <Link
              to="/projects"
              className={`navbar-link ${
                isActive("/projects") ? "active" : ""
              }`}
            >
              <span>🔎</span>
              Explore
            </Link>

            <Link
              to="/my-projects"
              className={`navbar-link ${
                isActive("/my-projects") ? "active" : ""
              }`}
            >
              <span>📁</span>
              My Projects
            </Link>

            <Link
              to="/join-requests"
              className={`navbar-link ${
                isActive("/join-requests") ? "active" : ""
              }`}
            >
              <span>📩</span>
              Requests
            </Link>

            <Link
              to="/notifications"
              className={`navbar-link ${
                isActive("/notifications") ? "active" : ""
              }`}
            >
              <span>🔔</span>
              Notifications
            </Link>

            <Link
              to="/matched-projects"
              className={`navbar-link ${
                isActive("/matched-projects") ? "active" : ""
              }`}
            >
              <span>💎</span>
              For You
            </Link>

            <Link
              to="/create-project"
              className={`navbar-create ${
                isActive("/create-project") ? "active" : ""
              }`}
            >
              + Create Project
            </Link>

          </div>


          {/* ================= RIGHT SIDE ================= */}
          <div className="navbar-right">

            <Link
              to="/profile"
              className="navbar-profile"
            >
              <div className="navbar-avatar">
                {user?.name
                  ? user.name.charAt(0).toUpperCase()
                  : "U"}
              </div>

              <span className="navbar-user-name">
                {user?.name || "User"}
              </span>
            </Link>

            <button
              className="navbar-logout"
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>


          {/* ================= MOBILE BUTTON ================= */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
          >
            {menuOpen ? "✕" : "☰"}
          </button>

        </div>


        {/* ================= MOBILE MENU ================= */}
        {menuOpen && (
          <div className="mobile-navbar-menu">

            <Link
              to="/dashboard"
              className={`mobile-navbar-link ${
                isActive("/dashboard") ? "active" : ""
              }`}
              onClick={closeMenu}
            >
              🏠 Dashboard
            </Link>

            <Link
              to="/projects"
              className={`mobile-navbar-link ${
                isActive("/projects") ? "active" : ""
              }`}
              onClick={closeMenu}
            >
              🔎 Explore Projects
            </Link>

            <Link
              to="/my-projects"
              className={`mobile-navbar-link ${
                isActive("/my-projects") ? "active" : ""
              }`}
              onClick={closeMenu}
            >
              📁 My Projects
            </Link>

            <Link
              to="/join-requests"
              className={`mobile-navbar-link ${
                isActive("/join-requests") ? "active" : ""
              }`}
              onClick={closeMenu}
            >
              📩 Join Requests
            </Link>

            <Link
              to="/notifications"
              className={`mobile-navbar-link ${
                isActive("/notifications") ? "active" : ""
              }`}
              onClick={closeMenu}
            >
              🔔 Notifications
            </Link>

            <Link
              to="/matched-projects"
              className={`mobile-navbar-link ${
                isActive("/matched-projects") ? "active" : ""
              }`}
              onClick={closeMenu}
            >
              💎 For You
            </Link>

            <Link
              to="/create-project"
              className="mobile-create-project"
              onClick={closeMenu}
            >
              🚀 Create Project
            </Link>

            <Link
              to="/profile"
              className="mobile-navbar-link"
              onClick={closeMenu}
            >
              👤 Profile
            </Link>

            <button
              className="mobile-logout"
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>
        )}
      </nav>
    </>
  );
}

export default Navbar;