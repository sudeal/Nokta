import React from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import "../../App.css";
import Home from "../Home";
import Appointments from "../Appointments";
import Profile from "../Profile";
import Messages from "../Messages";
import Statistics from "../Statistics";
import Menu from "../Menu";

const Template14 = () => {
  return (
    <div>
      {/* Navbar */}
      <nav className="navbar-modern">
        <ul className="navbar-modern-list">
          <li className="navbar-modern-item">
            <Link to="/template14/home" className="navbar-modern-link">
              Home
            </Link>
          </li>
          <li className="navbar-modern-item">
            <Link to="/template14/appointment" className="navbar-modern-link">
              Appointment
            </Link>
          </li>

          <li className="navbar-modern-item">
            <Link to="/template14/messages" className="navbar-modern-link">
              Messages
            </Link>
          </li>
          <li className="navbar-modern-item">
            <Link to="/template14/statistics" className="navbar-modern-link">
              Statistics
            </Link>
          </li>
          <li className="navbar-modern-item">
            <Link to="/template14/menu" className="navbar-modern-link">
              Menu
            </Link>
          </li>

          <li className="navbar-modern-item">
            <Link to="/template14/profile" className="navbar-modern-link">
              Profile
            </Link>
          </li>
        </ul>
      </nav>

      {/* Routes for Template14 */}
      <div className="template-content">
        <Routes>
          <Route path="/" element={<Navigate to="/template14/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/appointment" element={<Appointments />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/menu" element={<Menu />} />
        </Routes>
      </div>
    </div>
  );
};

export default Template14;
