import React from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import "../../App.css";
import Home from "../Home";
import Appointments from "../Appointments";
import Profile from "../Profile";
import Statistics from "../Statistics";

const Template4 = () => {
  return (
    <div>
      {/* Navbar */}
      <nav className="navbar-modern">
        <ul className="navbar-modern-list">
          <li className="navbar-modern-item">
            <Link to="/template4/home" className="navbar-modern-link">
              Home
            </Link>
          </li>
          <li className="navbar-modern-item">
            <Link to="/template4/appointment" className="navbar-modern-link">
              Appointment
            </Link>
          </li>
          <li className="navbar-modern-item">
            <Link to="/template4/statistics" className="navbar-modern-link">
              Statistics
            </Link>
          </li>
          <li className="navbar-modern-item">
            <Link to="/template4/profile" className="navbar-modern-link">
              Profile
            </Link>
          </li>
        </ul>
      </nav>

      {/* Routes for Template4 */}
      <div className="template-content">
        <Routes>
          <Route path="/" element={<Navigate to="/template4/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/appointment" element={<Appointments />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/statistics" element={<Statistics />} />
        </Routes>
      </div>
    </div>
  );
};

export default Template4;
