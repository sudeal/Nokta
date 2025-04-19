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
            <p className="hero-subtitle">Müşteri Yönetimi & Randevu Sistemi</p>
          </div>
          <div className="hero-image-container">
            <div className="hero-image">
              <img src={image} alt="Appointment System" />
              <div className="image-overlay"></div>
            </div>
            <div className="floating-card card-1">
              <span className="card-icon">🔔</span>
              <span className="card-text">Hızlı Müşteri Bul</span>
            </div>
            <div className="floating-card card-2">
              <span className="card-icon">📅</span>
              <span className="card-text">Kolay Randevu Yönetimi</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with Icons */}
      <section className="features-section">
        <div className="section-bg-shape"></div>
        <div className="content-container">
          <div className="section-header">
            <h2>Neden Nokta?</h2>
            <p>İşletmeniz için ihtiyaç duyduğunuz tüm randevu yönetim araçları</p>
          </div>
          
          <div className="features-rows">
            <div className="features-row">
              <div className="feature-card">
                <div className="feature-icon">⏰</div>
                <div className="feature-content">
                  <h3>Zaman Tasarrufu</h3>
                  <p>Müşterilerinize anında ve kolay randevu imkanı sunarak telefonla rezervasyon süreçlerini ortadan kaldırın</p>
                </div>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">🔍</div>
                <div className="feature-content">
                  <h3>Görünürlük</h3>
                  <p>İşletmenizi daha fazla müşteriye ulaştırın ve hizmetlerinizi keşfetmelerini sağlayın</p>
                </div>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">🚀</div>
                <div className="feature-content">
                  <h3>Kolay Entegrasyon</h3>
                  <p>Mevcut sisteminize hızlıca entegre ederek müşteri deneyimini iyileştirin</p>
                </div>
              </div>
            </div>
            
            <div className="features-row">
              <div className="feature-card">
                <div className="feature-icon">🔔</div>
                <div className="feature-content">
                  <h3>Hatırlatmalar</h3>
                  <p>Otomatik hatırlatmalarla iptal ve gecikme oranlarını azaltın</p>
                </div>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">📊</div>
                <div className="feature-content">
                  <h3>Analiz</h3>
                  <p>Kapsamlı raporlama araçları ile işletmenizin performansını takip edin</p>
                </div>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">🔒</div>
                <div className="feature-content">
                  <h3>Güvenli</h3>
                  <p>Verileriniz kurumsal düzeyde güvenlikle korunur</p>
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
            <h2>Nasıl Çalışır?</h2>
            <p>İşletmeniz için üç basit adımda online randevu sistemine geçin</p>
          </div>
          
          <div className="steps-container">
            <div className="step-card">
              <div className="step-number-container">
                <div className="step-number">1</div>
              </div>
              <div className="step-content">
                <h3>Hesap Oluşturun</h3>
                <p>Birkaç dakika içinde işletmenizi sisteme ekleyin</p>
              </div>
            </div>
            
            <div className="step-connector"></div>
            
            <div className="step-card">
              <div className="step-number-container">
                <div className="step-number">2</div>
              </div>
              <div className="step-content">
                <h3>Hizmetleri Tanımlayın</h3>
                <p>Sunduğunuz hizmetleri ve boş zaman dilimlerinizi belirleyin</p>
              </div>
            </div>
            
            <div className="step-connector"></div>
            
            <div className="step-card">
              <div className="step-number-container">
                <div className="step-number">3</div>
              </div>
              <div className="step-content">
                <h3>Müşterileri Kabul Edin</h3>
                <p>Müşteriler online randevu alabilir, siz de işinize odaklanabilirsiniz</p>
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
            <h2>Kurucularımız</h2>
            <p>Nokta'nın arkasındaki yenilikçi ekip</p>
          </div>
          
          <div className="founders-grid">
            <div className="founder-card">
              <div className="founder-content">
                <p>"İşletmeler için randevu planlama sürecindeki sorunları çözmek için Nokta'yı kurduk. Vizyonumuz, randevu alma işlemini herkes için basit ve verimli hale getirmektir."</p>
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
                <p>"Platformumuz, işletmeler ve müşteriler arasında köprü görevi görüyor. Zaman tasarrufu sağlayan ve randevu planlama sorunlarını ortadan kaldıran teknolojiler geliştiriyoruz."</p>
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
                <p>"Nokta'da, sorunsuz deneyimler yaratmaya inanıyoruz. Odak noktamız, randevu yönetimini işletmeler için zahmetsiz hale getiren sezgisel çözümler geliştirmektir."</p>
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
