import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RiMenu3Line, RiCloseLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../../redux/actions/authaction";
import "./Navbar.css";

const Navbar = ({ notifyMsg }) => {
  const [toggle, setToggle] = useState(false);
  const dispatch = useDispatch();

  const { accessToken, user } = useSelector((state) => state.auth);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (isLoggedIn && user?.name) {
      notifyMsg("success", `Welcome! ${user.name}, You Logged in Successfully`);
    }
  }, [isLoggedIn, user, notifyMsg]);

  const handleLogin = async () => {
    try {
      await dispatch(login());
      setIsLoggedIn(true);
    } catch (error) {
      notifyMsg("error", "Login failed! Try again.");
      console.error(error);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    notifyMsg("success", "Logged Out Successfully!");
  };

  return (
    <nav className="navbar-container">
      <div className="navbar-logo">
        <Link to="/">
          <img src="/logo.png" alt="SignLang Logo" className="logo" />
        </Link>
      </div>

      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/detect">Detect</Link>
        {accessToken && <Link to="/dashboard">Dashboard</Link>}
        <Link to="/learning">Learn</Link>
        <Link to="/Quiz">Quiz</Link>
      </div>

      <div className="navbar-auth">
        {accessToken ? (
          <div className="user-info">
            <img
              src={user?.photoURL || "/default-user.png"}
              alt="user-icon"
              className="profile-pic"
              onError={(e) => (e.target.src = "/default-user.png")}
            />
            <span className="username">{user?.name || "Anonymous User"}</span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <button className="login-btn" onClick={handleLogin}>
            Login
          </button>
        )}
      </div>

      <div className="navbar-menu">
        {toggle ? (
          <RiCloseLine
            size={28}
            color="#fff"
            onClick={() => setToggle(false)}
          />
        ) : (
          <RiMenu3Line size={28} color="#fff" onClick={() => setToggle(true)} />
        )}
        {toggle && (
          <div className="navbar-menu-dropdown scale-up-center">
            <Link to="/" onClick={() => setToggle(false)}>
              Home
            </Link>
            <Link to="/detect" onClick={() => setToggle(false)}>
              Detect
            </Link>
            <Link to="/learn">Learn</Link>

            {accessToken && (
              <Link to="/dashboard" onClick={() => setToggle(false)}>
                Dashboard
              </Link>
            )}

            <div className="navbar-menu-auth">
              {accessToken ? (
                <>
                  <img
                    src={user?.photoURL || "/default-user.png"}
                    alt="user-icon"
                    className="profile-pic"
                    onError={(e) => (e.target.src = "/default-user.png")}
                  />
                  <button className="logout-btn" onClick={handleLogout}>
                    Logout
                  </button>
                </>
              ) : (
                <button className="login-btn" onClick={handleLogin}>
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
