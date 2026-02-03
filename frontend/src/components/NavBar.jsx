import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Style/navbar.css";

export default function NavBar() {
  const [isMobile, setIsMobile] = useState(false);
  const [login, setLogin] = useState(
    localStorage.getItem("login")
  );

  const navigate = useNavigate();

  // ✅ Logout function
  const logout = () => {
    localStorage.removeItem("login");
    setLogin(null);
    navigate("/login", { replace: true });
  };

  // ✅ Listen to storage changes (multi-tab support)
  useEffect(() => {
    const handleStorage = () => {
      setLogin(localStorage.getItem("login"));
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="logo">Todo App</div>

      <ul
        className={isMobile ? "nav-links-mobile" : "nav-links"}
        onClick={() => setIsMobile(false)}
      >
        {login && (
          <>
            <li>
              <Link to="/">List</Link>
            </li>

            <li>
              <Link to="/add">Add List</Link>
            </li>

            <li>
              <Link to="/profile">Profile</Link>
            </li>

            <li>
              {/* ✅ Button is better than Link for logout */}
              <button
                onClick={logout}
                className="logout-btn"
              >
                Logout
              </button>
            </li>
          </>
        )}
      </ul>

      <button
        className="mobile-menu-icon"
        onClick={() => setIsMobile(!isMobile)}
      >
        {isMobile ? <>&#10005;</> : <>&#9776;</>}
      </button>
    </nav>
  );
}
