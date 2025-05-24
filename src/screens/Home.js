import React from "react";
import image from '../assets/takvim.jpg';

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section with Animated Background */}
      <section className="home-hero">
        <div className="hero-bg-shape"></div>
        <div className="content-container hero-container">
          <div className="hero-content">
            <h1 className="hero-title">NOKTA</h1>
            <p className="hero-subtitle">Customer Management & Appointment System</p>
          </div>
          <div className="hero-image-container">
            <div className="hero-image">
              <img src={image} alt="Appointment System" />
              <div className="image-overlay"></div>
            </div>
            <div className="floating-card card-1">
              <span className="card-icon">🔔</span>
              <span className="card-text">Quick Customer Search</span>
            </div>
            <div className="floating-card card-2">
              <span className="card-icon">📅</span>
              <span className="card-text">Easy Appointment Management</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with Icons */}
      <section className="features-section">
        <div className="section-bg-shape"></div>
        <div className="content-container">
          <div className="section-header">
            <h2>Why Nokta?</h2>
            <p>All appointment management tools you need for your business</p>
          </div>
          
          <div className="features-rows">
            <div className="features-row">
              <div className="feature-card">
                <div className="feature-icon">⏰</div>
                <div className="feature-content">
                  <h3>Time Saving</h3>
                  <p>Provide instant and easy appointments to your customers, eliminating phone reservation processes</p>
                </div>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">🔍</div>
                <div className="feature-content">
                  <h3>Visibility</h3>
                  <p>Reach more customers and let them discover your services</p>
                </div>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">🚀</div>
                <div className="feature-content">
                  <h3>Easy Integration</h3>
                  <p>Quickly integrate with your existing system to improve customer experience</p>
                </div>
              </div>
            </div>
            
            <div className="features-row">
              <div className="feature-card">
                <div className="feature-icon">🔔</div>
                <div className="feature-content">
                  <h3>Reminders</h3>
                  <p>Reduce cancellation and delay rates with automatic reminders</p>
                </div>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">📊</div>
                <div className="feature-content">
                  <h3>Analytics</h3>
                  <p>Track your business performance with comprehensive reporting tools</p>
                </div>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">🔒</div>
                <div className="feature-content">
                  <h3>Secure</h3>
                  <p>Your data is protected with enterprise-level security</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="content-container">
          <div className="section-header">
            <h2>How It Works?</h2>
            <p>Transition to an online appointment system in three simple steps for your business</p>
          </div>
          
          <div className="steps-container">
            <div className="step-card">
              <div className="step-number-container">
                <div className="step-number">1</div>
              </div>
              <div className="step-content">
                <h3>Create an Account</h3>
                <p>Add your business to the system in just a few minutes</p>
              </div>
            </div>
            
            <div className="step-connector"></div>
            
            <div className="step-card">
              <div className="step-number-container">
                <div className="step-number">2</div>
              </div>
              <div className="step-content">
                <h3>Define Services</h3>
                <p>Specify the services you offer and your available time slots</p>
              </div>
            </div>
            
            <div className="step-connector"></div>
            
            <div className="step-card">
              <div className="step-number-container">
                <div className="step-number">3</div>
              </div>
              <div className="step-content">
                <h3>Accept Customers</h3>
                <p>Customers can book appointments online while you focus on your business</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section className="founders-section">
        <div className="section-bg-shape founders-bg"></div>
        <div className="content-container">
          <div className="section-header">
            <h2>Our Founders</h2>
            <p>The innovative team behind Nokta</p>
          </div>
          
          <div className="founders-grid">
            <div className="founder-card">
              <div className="founder-content">
                <p>"We founded Nokta to solve the problems in the appointment scheduling process for businesses. Our vision is to make appointment booking simple and efficient for everyone."</p>
              </div>
              <div className="founder-info">
                <div className="founder-avatar">EÖ</div>
                <div className="founder-details">
                  <h4>Egemen Özyürek</h4>
                  <p>Co-Founder</p>
                </div>
              </div>
            </div>
            
            <div className="founder-card">
              <div className="founder-content">
                <p>"Our platform serves as a bridge between businesses and customers. We develop technologies that save time and eliminate appointment scheduling problems."</p>
              </div>
              <div className="founder-info">
                <div className="founder-avatar">MT</div>
                <div className="founder-details">
                  <h4>Melike Telef</h4>
                  <p>Co-Founder</p>
                </div>
              </div>
            </div>
            
            <div className="founder-card">
              <div className="founder-content">
                <p>"At Nokta, we believe in creating seamless experiences. Our focus is on developing intuitive solutions that make appointment management effortless for businesses."</p>
              </div>
              <div className="founder-info">
                <div className="founder-avatar">SA</div>
                <div className="founder-details">
                  <h4>Sude Alkan</h4>
                  <p>Co-Founder</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
