import React from "react";
import image from '../assets/takvim.jpg';
import { useLanguage } from '../contexts/LanguageContext';

const Home = () => {
  const { translations } = useLanguage();
  const t = translations.home;

  return (
    <div className="home-container">
      {/* Hero Section with Animated Background */}
      <section className="home-hero">
        <div className="hero-bg-shape"></div>
        <div className="content-container hero-container">
          <div className="hero-content">
            <h1 className="hero-title">{t.hero.title}</h1>
            <p className="hero-subtitle">{t.hero.subtitle}</p>
          </div>
          <div className="hero-image-container">
            <div className="hero-image">
              <img src={image} alt="Appointment System" />
              <div className="image-overlay"></div>
            </div>
            <div className="floating-card card-1">
              <span className="card-icon">🔔</span>
              <span className="card-text">{t.features.reminders.title}</span>
            </div>
            <div className="floating-card card-2">
              <span className="card-icon">📅</span>
              <span className="card-text">{t.features.timeSaving.title}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with Icons */}
      <section className="features-section">
        <div className="section-bg-shape"></div>
        <div className="content-container">
          <div className="section-header">
            <h2>{t.features.title}</h2>
            <p>{t.features.subtitle}</p>
          </div>
          
          <div className="features-rows">
            <div className="features-row">
              <div className="feature-card">
                <div className="feature-icon">⏰</div>
                <div className="feature-content">
                  <h3>{t.features.timeSaving.title}</h3>
                  <p>{t.features.timeSaving.description}</p>
                </div>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">🔍</div>
                <div className="feature-content">
                  <h3>{t.features.visibility.title}</h3>
                  <p>{t.features.visibility.description}</p>
                </div>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">🚀</div>
                <div className="feature-content">
                  <h3>{t.features.integration.title}</h3>
                  <p>{t.features.integration.description}</p>
                </div>
              </div>
            </div>
            
            <div className="features-row">
              <div className="feature-card">
                <div className="feature-icon">🔔</div>
                <div className="feature-content">
                  <h3>{t.features.reminders.title}</h3>
                  <p>{t.features.reminders.description}</p>
                </div>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">📊</div>
                <div className="feature-content">
                  <h3>{t.features.analytics.title}</h3>
                  <p>{t.features.analytics.description}</p>
                </div>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">🔒</div>
                <div className="feature-content">
                  <h3>{t.features.security.title}</h3>
                  <p>{t.features.security.description}</p>
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
            <h2>{t.howItWorks.title}</h2>
            <p>{t.howItWorks.subtitle}</p>
          </div>
          
          <div className="steps-container">
            <div className="step-card">
              <div className="step-number-container">
                <div className="step-number">1</div>
              </div>
              <div className="step-content">
                <h3>{t.howItWorks.steps.step1.title}</h3>
                <p>{t.howItWorks.steps.step1.description}</p>
              </div>
            </div>
            
            <div className="step-connector"></div>
            
            <div className="step-card">
              <div className="step-number-container">
                <div className="step-number">2</div>
              </div>
              <div className="step-content">
                <h3>{t.howItWorks.steps.step2.title}</h3>
                <p>{t.howItWorks.steps.step2.description}</p>
              </div>
            </div>
            
            <div className="step-connector"></div>
            
            <div className="step-card">
              <div className="step-number-container">
                <div className="step-number">3</div>
              </div>
              <div className="step-content">
                <h3>{t.howItWorks.steps.step3.title}</h3>
                <p>{t.howItWorks.steps.step3.description}</p>
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
            <h2>{t.founders.title}</h2>
            <p>{t.founders.subtitle}</p>
          </div>
          
          <div className="founders-grid">
            <div className="founder-card">
              <div className="founder-content">
                <p>{t.founders.egemen.quote}</p>
              </div>
              <div className="founder-info">
                <div className="founder-avatar">EÖ</div>
                <div className="founder-details">
                  <h4>{t.founders.egemen.name}</h4>
                  <p>{t.founders.egemen.role}</p>
                </div>
              </div>
            </div>
            
            <div className="founder-card">
              <div className="founder-content">
                <p>{t.founders.melike.quote}</p>
              </div>
              <div className="founder-info">
                <div className="founder-avatar">MT</div>
                <div className="founder-details">
                  <h4>{t.founders.melike.name}</h4>
                  <p>{t.founders.melike.role}</p>
                </div>
              </div>
            </div>
            
            <div className="founder-card">
              <div className="founder-content">
                <p>{t.founders.sude.quote}</p>
              </div>
              <div className="founder-info">
                <div className="founder-avatar">SA</div>
                <div className="founder-details">
                  <h4>{t.founders.sude.name}</h4>
                  <p>{t.founders.sude.role}</p>
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
