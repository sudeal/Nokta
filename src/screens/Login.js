import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLoginSuccess = async (email) => {
    try {
      // Fetch all businesses to get the complete business data
      const response = await fetch(
        "https://nokta-appservice.azurewebsites.net/api/Business",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch business details");

      const businesses = await response.json();
      
      // Find the business that matches the email
      const business = businesses.find(b => b.email === email);
      
      if (!business) {
        throw new Error("Business not found");
      }
      
      // Store business data in localStorage with correct businessID
      localStorage.setItem("userData", JSON.stringify({
        ...business,
        id: business.businessID // Ensure ID is available in both formats
      }));

      // Navigate to the appropriate template based on webSiteTemplateID
      navigate(`/template${business.webSiteTemplateID}`);
    } catch (error) {
      console.error("Error fetching business details:", error);
      alert("Failed to fetch business details. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        "https://nokta-appservice.azurewebsites.net/api/Business/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      alert("Login successful!");
      // Fetch user details and navigate to the correct template
      await handleLoginSuccess(email);
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit}>
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Login to access your website</p>
        
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <div className="input-container">
            <span className="input-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </span>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        
        <div className="form-group">
          <div className="label-container">
            <label htmlFor="password">Password</label>
            <a href="#" className="forgot-password">Forgot Password?</a>
          </div>
          <div className="input-container">
            <span className="input-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </span>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
        
        <button type="submit" disabled={loading} className="auth-button">
          {loading ? (
            <span className="loading-spinner">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="spin">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
              </svg>
            </span>
          ) : (
            "Login"
          )}
        </button>
        
        <Link to="/signup">
          <button type="button" className="auth-button register-button" style={{ marginTop: '15px', backgroundColor: '#4CAF50' }}>
            Register
          </button>
        </Link>
      </form>
    </div>
  );
};

export default Login;
