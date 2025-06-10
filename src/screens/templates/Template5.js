import React from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import "../../App.css";
import Home from "../Home";
import Appointments from "../Appointments";
import Profile from "../Profile";
import Messages from "../Messages";
import LanguageButton from "../../components/LanguageButton";

const Template5 = () => {
  return (
    <div>
      {/* Navbar */}
      <nav className="navbar-modern">
        <div></div>
        <div className="navbar-center">
          <ul className="navbar-modern-list">
            <li className="navbar-modern-item">
              <Link to="/template5/home" className="navbar-modern-link">
                Home
              </Link>
            </li>
            <li className="navbar-modern-item">
              <Link to="/template5/appointment" className="navbar-modern-link">
                Appointment
              </Link>
            </li>
            <li className="navbar-modern-item">
              <Link to="/template5/messages" className="navbar-modern-link">
                Messages
              </Link>
            </li>
            <li className="navbar-modern-item">
              <Link to="/template5/profile" className="navbar-modern-link">
                Profile
              </Link>
            </li>
          </ul>
        </div>
        <LanguageButton />
      </nav>

      {/* Routes for Template5 */}
      <div className="template-content">
        <Routes>
          <Route path="/" element={<Navigate to="/template5/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/appointment" element={<Appointments />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/messages" element={<Messages />} />
        </Routes>
      </div>
    </div>
  );
};

export default Template5;
