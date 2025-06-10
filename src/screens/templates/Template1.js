import React from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import "../../App.css";
import Home from "../Home";
import Appointments from "../Appointments";
import Profile from "../Profile";
import LanguageButton from "../../components/LanguageButton";

const Template1 = () => {
  return (
    <div>
      {/* Navbar */}
      <nav className="navbar-modern">
        <div></div>
        <div className="navbar-center">
          <ul className="navbar-modern-list">
            <li className="navbar-modern-item">
              <Link to="/template1/home" className="navbar-modern-link">Home</Link>
            </li>
            <li className="navbar-modern-item">
              <Link to="/template1/appointment" className="navbar-modern-link">Appointment</Link>
            </li>
            <li className="navbar-modern-item">
              <Link to="/template1/profile" className="navbar-modern-link">Profile</Link>
            </li>
          </ul>
        </div>
        <LanguageButton />
      </nav>

      {/* Routes for Template1 */}
      <div className="template-content">
        <Routes>
          <Route path="/" element={<Navigate to="/template1/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/appointment" element={<Appointments />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </div>
  );
};

export default Template1;
