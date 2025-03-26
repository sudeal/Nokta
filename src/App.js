import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import Template1 from "./screens/templates/Template1";
import Template2 from "./screens/templates/Template2";
import Template3 from "./screens/templates/Template3";
import Template4 from "./screens/templates/Template4";
import Template5 from "./screens/templates/Template5";
import Template6 from "./screens/templates/Template6";
import Template7 from "./screens/templates/Template7";
import Template8 from "./screens/templates/Template8";
import Template9 from "./screens/templates/Template9";
import Template10 from "./screens/templates/Template10";
import Template11 from "./screens/templates/Template11";
import Template12 from "./screens/templates/Template12";
import Template13 from "./screens/templates/Template13";
import Template14 from "./screens/templates/Template14";
import Template15 from "./screens/templates/Template15";
import Template16 from "./screens/templates/Template16";
import logo from "./images/NoktaLogo.png";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Login and Signup routes */}
        <Route
          path="/"
          element={
            <HeaderLayout>
              <Login />
            </HeaderLayout>
          }
        />
        <Route
          path="/signup"
          element={
            <HeaderLayout>
              <Signup />
            </HeaderLayout>
          }
        />

        {/* Dynamic template routes */}
        <Route path="/template1/*" element={<Template1 />} />
        <Route path="/template2/*" element={<Template2 />} />
        <Route path="/template3/*" element={<Template3 />} />
        <Route path="/template4/*" element={<Template4 />} />
        <Route path="/template5/*" element={<Template5 />} />
        <Route path="/template6/*" element={<Template6 />} />
        <Route path="/template7/*" element={<Template7 />} />
        <Route path="/template8/*" element={<Template8 />} />
        <Route path="/template9/*" element={<Template9 />} />
        <Route path="/template10/*" element={<Template10 />} />
        <Route path="/template11/*" element={<Template11 />} />
        <Route path="/template12/*" element={<Template12 />} />
        <Route path="/template13/*" element={<Template13 />} />
        <Route path="/template14/*" element={<Template14 />} />
        <Route path="/template15/*" element={<Template15 />} />
        <Route path="/template16/*" element={<Template16 />} />
      </Routes>
    </Router>
  );
}

/* Header layout for Login and Signup */
const HeaderLayout = ({ children }) => {
  return (
    <div className="App">
      <header className="App-header">
        <div className="logo-container">
          <img src={logo} alt="Nokta Logo" className="logo" />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <button style={buttonStyle}>
            <Link to="/" style={linkStyle}>
              Login
            </Link>
          </button>
          <button style={buttonStyle}>
            <Link to="/signup" style={linkStyle}>
              Signup
            </Link>
          </button>
        </div>
      </header>
      {children}
    </div>
  );
};

/* Styles for buttons and links */
const buttonStyle = {
  backgroundColor: "white",
  color: "#004080",
  border: "1px solid #004080",
  padding: "10px 20px",
  cursor: "pointer",
  marginRight: "5px",
};

const linkStyle = {
  textDecoration: "none",
  color: "#004080",
};

export default App;
