import React from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import "../../App.css";
import Home from "../Home";
import Appointments from "../Appointments";
import Profile from "../Profile";
import Statistics from "../Statistics";
import Menu from "../Menu";
import Directions from "../Directions";

const Template12 = () => {
  return (
    <div>
      {/* Navbar */}
      <nav className="navbar-modern">
        <ul className="navbar-modern-list">
          <li className="navbar-modern-item">
            <Link to="/template12/home" className="navbar-modern-link">
              Home
            </Link>
          </li>
          <li className="navbar-modern-item">
            <Link to="/template12/appointment" className="navbar-modern-link">
              Appointment
            </Link>
          </li>

          <li className="navbar-modern-item">
            <Link to="/template12/statistics" className="navbar-modern-link">
              Statistics
            </Link>
          </li>
          <li className="navbar-modern-item">
            <Link to="/template12/menu" className="navbar-modern-link">
              Menu
            </Link>
          </li>
          <li className="navbar-modern-item">
            <Link to="/template12/directions" className="navbar-modern-link">
              Directions
            </Link>
          </li>

          <li className="navbar-modern-item">
            <Link to="/template12/profile" className="navbar-modern-link">
              Profile
            </Link>
          </li>
        </ul>
      </nav>

      {/* Routes for Template12 */}
      <div className="template-content">
        <Routes>
          <Route path="/" element={<Navigate to="/template12/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/appointment" element={<Appointments />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/directions" element={<Directions />} />
        </Routes>
      </div>
    </div>
  );
};

export default Template12;
