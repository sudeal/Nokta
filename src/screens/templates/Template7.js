import React from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import "../../App.css";
import Home from "../Home";
import Appointments from "../Appointments";
import Profile from "../Profile";
import Statistics from "../Statistics";
import Directions from "../Directions";

const Template7 = () => {
  return (
    <div>
      {/* Navbar */}
      <nav className="navbar-modern">
        <ul className="navbar-modern-list">
          <li className="navbar-modern-item">
            <Link to="/template7/home" className="navbar-modern-link">
              Home
            </Link>
          </li>
          <li className="navbar-modern-item">
            <Link to="/template7/appointment" className="navbar-modern-link">
              Appointment
            </Link>
          </li>
          <li className="navbar-modern-item">
            <Link to="/template7/statistics" className="navbar-modern-link">
              Statistics
            </Link>
          </li>
          <li className="navbar-modern-item">
            <Link to="/template7/directions" className="navbar-modern-link">
              Directions
            </Link>
          </li>
          <li className="navbar-modern-item">
            <Link to="/template7/profile" className="navbar-modern-link">
              Profile
            </Link>
          </li>
        </ul>
      </nav>

      {/* Routes for Template7 */}
      <div className="template-content">
        <Routes>
          <Route path="/" element={<Navigate to="/template7/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/appointment" element={<Appointments />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/directions" element={<Directions />} />
        </Routes>
      </div>
    </div>
  );
};

export default Template7;
