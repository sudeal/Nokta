import React from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import "../../App.css";
import Home from "../Home";
import Appointments from "../Appointments";
import Profile from "../Profile";
import Messages from "../Messages";
import Menu from "../Menu";
import LanguageButton from "../../components/LanguageButton";

const Template10 = () => {
  return (
    <div>
      {/* Navbar */}
      <nav className="navbar-modern">
        <div></div>
        <div className="navbar-center">
          <ul className="navbar-modern-list">
            <li className="navbar-modern-item">
              <Link to="/template10/home" className="navbar-modern-link">
                Home
              </Link>
            </li>
            <li className="navbar-modern-item">
              <Link to="/template10/appointment" className="navbar-modern-link">
                Appointment
              </Link>
            </li>
            <li className="navbar-modern-item">
              <Link to="/template10/messages" className="navbar-modern-link">
                Messages
              </Link>
            </li>
            <li className="navbar-modern-item">
              <Link to="/template10/menu" className="navbar-modern-link">
                Menu
              </Link>
            </li>
            <li className="navbar-modern-item">
              <Link to="/template10/profile" className="navbar-modern-link">
                Profile
              </Link>
            </li>
          </ul>
        </div>
        <LanguageButton />
      </nav>

      {/* Routes for Template10 */}
      <div className="template-content">
        <Routes>
          <Route path="/" element={<Navigate to="/template10/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/appointment" element={<Appointments />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/menu" element={<Menu />} />
        </Routes>
      </div>
    </div>
  );
};

export default Template10;
