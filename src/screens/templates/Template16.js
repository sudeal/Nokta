import React from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import "../../App.css";
import Home from "../Home";
import Appointments from "../Appointments";
import Profile from "../Profile";
import Messages from "../Messages";
import Statistics from "../Statistics";
import Menu from "../Menu";
import Directions from "../Directions";

const Template16 = () => {
  return (
    <div>
      {/* Navbar */}
      <nav className="navbar-modern">
        <ul className="navbar-modern-list">
          <li className="navbar-modern-item">
            <Link to="/template16/home" className="navbar-modern-link">
              Home
            </Link>
          </li>
          <li className="navbar-modern-item">
            <Link to="/template16/appointment" className="navbar-modern-link">
              Appointment
            </Link>
          </li>

          <li className="navbar-modern-item">
            <Link to="/template16/messages" className="navbar-modern-link">
              Messages
            </Link>
          </li>
          <li className="navbar-modern-item">
            <Link to="/template16/statistics" className="navbar-modern-link">
              Statistics
            </Link>
          </li>
          <li className="navbar-modern-item">
            <Link to="/template16/menu" className="navbar-modern-link">
              Menu
            </Link>
          </li>
          <li className="navbar-modern-item">
            <Link to="/template16/directions" className="navbar-modern-link">
              Directions
            </Link>
          </li>

          <li className="navbar-modern-item">
            <Link to="/template16/profile" className="navbar-modern-link">
              Profile
            </Link>
          </li>
        </ul>
      </nav>

      {/* Routes for Template16 */}
      <div className="template-content">
        <Routes>
          <Route path="/" element={<Navigate to="/template16/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/appointment" element={<Appointments />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/directions" element={<Directions />} />
          <Route path="/menu" element={<Menu />} />
        </Routes>
      </div>
    </div>
  );
};

export default Template16;
