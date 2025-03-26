import React from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import "../../App.css";
import Home from "../Home";
import Appointments from "../Appointments";
import Profile from "../Profile";
import Messages from "../Messages";
import Menu from "../Menu";
import Directions from "../Directions";

const Template13 = () => {
  return (
    <div>
      {/* Navbar */}
      <nav className="navbar-modern">
        <ul className="navbar-modern-list">
          <li className="navbar-modern-item">
            <Link to="/template13/home" className="navbar-modern-link">
              Home
            </Link>
          </li>
          <li className="navbar-modern-item">
            <Link to="/template13/appointment" className="navbar-modern-link">
              Appointment
            </Link>
          </li>

          <li className="navbar-modern-item">
            <Link to="/template13/messages" className="navbar-modern-link">
              Messages
            </Link>
          </li>
          <li className="navbar-modern-item">
            <Link to="/template13/menu" className="navbar-modern-link">
              Menu
            </Link>
          </li>
          <li className="navbar-modern-item">
            <Link to="/template13/directions" className="navbar-modern-link">
              Directions
            </Link>
          </li>

          <li className="navbar-modern-item">
            <Link to="/template13/profile" className="navbar-modern-link">
              Profile
            </Link>
          </li>
        </ul>
      </nav>

      {/* Routes for Template13 */}
      <div className="template-content">
        <Routes>
          <Route path="/" element={<Navigate to="/template13/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/appointment" element={<Appointments />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/directions" element={<Directions />} />
        </Routes>
      </div>
    </div>
  );
};

export default Template13;
