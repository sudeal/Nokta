import React from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import "../../App.css";
import Home from "../Home";
import Appointments from "../Appointments";
import Profile from "../Profile";
import Statistics from "../Statistics";
import Menu from "../Menu";
import LanguageButton from "../../components/LanguageButton";

const Template8 = () => {
  return (
    <div>
      {/* Navbar */}
      <nav className="navbar-modern">
        <div></div>
        <div className="navbar-center">
          <ul className="navbar-modern-list">
            <li className="navbar-modern-item">
              <Link to="/template8/home" className="navbar-modern-link">
                Home
              </Link>
            </li>
            <li className="navbar-modern-item">
              <Link to="/template8/appointment" className="navbar-modern-link">
                Appointment
              </Link>
            </li>
            <li className="navbar-modern-item">
              <Link to="/template8/statistics" className="navbar-modern-link">
                Statistics
              </Link>
            </li>
            <li className="navbar-modern-item">
              <Link to="/template8/menu" className="navbar-modern-link">
                Menu
              </Link>
            </li>
            <li className="navbar-modern-item">
              <Link to="/template8/profile" className="navbar-modern-link">
                Profile
              </Link>
            </li>
          </ul>
        </div>
        <LanguageButton />
      </nav>

      {/* Routes for Template8 */}
      <div className="template-content">
        <Routes>
          <Route path="/" element={<Navigate to="/template8/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/appointment" element={<Appointments />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/menu" element={<Menu />} />
        </Routes>
      </div>
    </div>
  );
};

export default Template8;
