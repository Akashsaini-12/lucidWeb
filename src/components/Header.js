import React, { Component } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Header() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");

  const logout = () => {
    // Redirect to the login page

    window.localStorage.clear();

    navigate("/");
    window.location.reload();
    //    window.history.pushState(null, '', '/');
    //    window.onpopstate = () => {
    //    window.history.pushState(null, '', '/');
    // };
  };

  const handleLogout = () => {
    if (token && username) {
      logout();
    }
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedToken = localStorage.getItem("token");

    if (storedUsername && storedToken) {
      setUsername(storedUsername);
      setToken(storedToken);
    }
  }, []);
  return (
    <nav className="navbar navbar-fixed-top">
      <div className="container-fluid">
        <div className="navbar-btn">
          <button type="button" className="btn-toggle-offcanvas">
            <i className="fa fa-bars" />
          </button>
        </div>
        <div className="navbar-brand ps-2">
          <Link to="/dashboard" className="d-flex">
            <img
              src="assets/images/medsKeylogo.png"
              className="avatar lg rounded me-3"
              alt="User Profile Picture"
            />
          </Link>
        </div>
        <div className="d-flex flex-grow-1 align-items-center">
          <div className="d-flex"></div>
          <div className="flex-grow-1">
            <ul className="nav navbar-nav flex-row justify-content-end align-items-center">
              <li>
                <a onClick={handleLogout} className="icon-menu">
                  <i className="fa fa-sign-out" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
