import React, { useState, useEffect } from "react";
import { useLanguage } from '../contexts/LanguageContext';

const Directions = () => {
  const { translations, isEnglish } = useLanguage();
  const t = translations.menu.directions;

  // Helper function to get the correct translation
  const getTranslation = (key) => {
    return isEnglish ? t[key].en : t[key].tr;
  };

  const [businessData, setBusinessData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapUrl, setMapUrl] = useState('');

  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        setLoading(true);
        
        // Get user data from localStorage
        const storedUserData = localStorage.getItem("userData");
        if (!storedUserData) {
          throw new Error("No user data found. Please log in again.");
        }
        
        // Parse the stored data
        const parsedUserData = JSON.parse(storedUserData);
        const businessId = parsedUserData.businessID || parsedUserData.id;
        
        if (!businessId) {
          throw new Error("Business ID not found in user data.");
        }
        
        // Fetch the business data using the ID from localStorage
        const response = await fetch(`https://nokta-appservice.azurewebsites.net/api/Business/${businessId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch business data: ${response.status}`);
        }
        
        const data = await response.json();
        setBusinessData(data);
      } catch (err) {
        console.error("Error fetching business data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessData();
  }, []);

  useEffect(() => {
    // Simulate loading map
    setTimeout(() => {
      setMapUrl('https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3008.443928665799!2d28.9776!3d41.0370!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDAyJzEzLjIiTiAyOMKwNTgnMzkuNCJF!5e0!3m2!1str!2str!4v1620000000000!5m2!1str!2str');
      setLoading(false);
    }, 1000);
  }, []);

  // Format opening/closing hours to readable time
  const formatTime = (hour) => {
    const hours = Math.floor(hour);
    const minutes = Math.round((hour - hours) * 60);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  // Generate business hours for each day of the week
  const generateBusinessHours = () => {
    const days = [
      { key: 'monday', en: 'Monday', tr: 'Pazartesi' },
      { key: 'tuesday', en: 'Tuesday', tr: 'Salı' },
      { key: 'wednesday', en: 'Wednesday', tr: 'Çarşamba' },
      { key: 'thursday', en: 'Thursday', tr: 'Perşembe' },
      { key: 'friday', en: 'Friday', tr: 'Cuma' },
      { key: 'saturday', en: 'Saturday', tr: 'Cumartesi' },
      { key: 'sunday', en: 'Sunday', tr: 'Pazar' }
    ];
    
    return days.map((day, index) => ({
      day: isEnglish ? day.en : day.tr,
      hours: `${formatTime(businessData.openingHour)} - ${formatTime(businessData.closingHour)}`,
      isToday: index === (new Date().getDay() === 0 ? 6 : new Date().getDay() - 1) // Adjust for week start
    }));
  };

  // Loading state
  if (loading) {
    return (
      <div style={{ 
        backgroundColor: 'rgba(28, 32, 55, 0.7)', 
        borderRadius: '8px', 
        padding: '40px',
        margin: '20px',
        textAlign: 'center',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ 
          color: 'white', 
          fontSize: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px'
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            border: '2px solid rgba(255,255,255,0.3)',
            borderTop: '2px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          {getTranslation('loading')}
        </div>
        <style>
          {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
        </style>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{ 
        backgroundColor: 'rgba(28, 32, 55, 0.7)', 
        borderRadius: '8px', 
        padding: '20px',
        margin: '20px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{ 
          color: '#f44336', 
          fontSize: '24px', 
          marginBottom: '15px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span>⚠️</span> {getTranslation('error')}
        </h1>
        <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
          {error}
        </p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            backgroundColor: '#3f51b5',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '15px'
          }}
        >
          {getTranslation('tryAgain')}
        </button>
      </div>
    );
  }

  if (!businessData) return null;

  const businessHours = generateBusinessHours();

  return (
    <div style={{ 
      backgroundColor: 'rgba(28, 32, 55, 0.95)', 
      borderRadius: '12px', 
      padding: '0',
      margin: '20px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #3f51b5 0%, #2196f3 100%)',
        color: 'white',
        padding: '24px 30px',
        borderBottom: 'none'
      }}>
        <h1 style={{ 
          fontSize: '28px',
          fontWeight: '600',
          margin: '0',
          letterSpacing: '-0.5px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span style={{ fontSize: '24px' }}>📍</span>
          {getTranslation('title')}
        </h1>
        <p style={{
          margin: '8px 0 0 0',
          opacity: '0.9',
          fontSize: '16px'
        }}>
          {businessData.name}
        </p>
      </div>

      {/* Information Notice */}
      <div style={{
        backgroundColor: 'rgba(33, 150, 243, 0.15)',
        padding: '16px 30px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <span style={{ fontSize: '20px' }}>📋</span>
        <div style={{
          color: 'rgba(255, 255, 255, 0.9)',
          fontSize: '14px',
          lineHeight: '1.4'
        }}>
          {getTranslation('locationNotice')}
        </div>
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '25px',
        padding: '30px'
      }}>
        {/* Left Column - Location Info */}
        <div style={{
          backgroundColor: 'rgba(40, 44, 68, 0.8)',
          borderRadius: '12px',
          padding: '25px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ 
            color: 'white', 
            marginBottom: '20px', 
            fontSize: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span>📍</span> {getTranslation('address')}
          </h3>
          
          <div style={{
            backgroundColor: 'rgba(63, 81, 181, 0.1)',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '25px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              marginBottom: '20px',
              padding: '15px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px'
            }}>
              <span style={{ fontSize: '20px', marginTop: '2px' }}>📍</span>
              <div>
                <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px', marginBottom: '4px' }}>{getTranslation('address')}</div>
                <div style={{ color: 'white', fontSize: '15px', lineHeight: '1.5' }}>
                  {businessData.address}
                </div>
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              marginBottom: '20px',
              padding: '15px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px'
            }}>
              <span style={{ fontSize: '20px', marginTop: '2px' }}>📞</span>
              <div>
                <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px', marginBottom: '4px' }}>{getTranslation('phone')}</div>
                <div style={{ color: 'white', fontSize: '15px', lineHeight: '1.5' }}>
                  {businessData.contactNumber}
                </div>
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '15px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px'
            }}>
              <span style={{ fontSize: '20px', marginTop: '2px' }}>✉️</span>
              <div>
                <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px', marginBottom: '4px' }}>{getTranslation('email')}</div>
                <div style={{ color: 'white', fontSize: '15px', lineHeight: '1.5' }}>
                  {businessData.email}
                </div>
              </div>
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            gap: '12px'
          }}>
            <button style={{
              backgroundColor: '#3f51b5',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              flex: '1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontWeight: '500',
              fontSize: '14px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#303f9f'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#3f51b5'}
            onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(businessData.address)}`, '_blank')}
            >
              <span>🧭</span> {getTranslation('getDirections')}
            </button>
            <button style={{
              backgroundColor: 'transparent',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              padding: '12px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              flex: '1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontWeight: '500',
              fontSize: '14px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            }}
            onClick={() => window.open(`tel:${businessData.contactNumber}`, '_self')}
            >
              <span>📱</span> {getTranslation('callUs')}
            </button>
          </div>
        </div>
        
        {/* Right Column - Business Hours */}
        <div style={{
          backgroundColor: 'rgba(40, 44, 68, 0.8)',
          borderRadius: '12px',
          padding: '25px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ 
            color: 'white', 
            marginBottom: '25px', 
            fontSize: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{ fontSize: '20px' }}>🕒</span> {getTranslation('businessHours')}
          </h3>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            marginBottom: '25px'
          }}>
            {businessHours.map((item, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '15px',
                backgroundColor: item.isToday ? 'rgba(63, 81, 181, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                border: item.isToday ? '1px solid rgba(63, 81, 181, 0.4)' : '1px solid transparent'
              }}>
                <div style={{ 
                  color: 'white',
                  fontWeight: item.isToday ? '600' : '400',
                  fontSize: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  {item.day}
                  {item.isToday && (
                    <span style={{
                      backgroundColor: '#4caf50',
                      color: 'white',
                      fontSize: '10px',
                      padding: '3px 8px',
                      borderRadius: '12px',
                      fontWeight: '500'
                    }}>
                      {getTranslation('today')}
                    </span>
                  )}
                </div>
                <div style={{ 
                  color: item.isToday ? 'white' : 'rgba(255, 255, 255, 0.8)',
                  fontWeight: item.isToday ? '500' : '400',
                  fontSize: '14px'
                }}>
                  {item.hours}
                </div>
              </div>
            ))}
          </div>
          
          {/* Business Info */}
          <div style={{
            backgroundColor: 'rgba(33, 150, 243, 0.1)',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '12px'
            }}>
              <span style={{ fontSize: '20px' }}>ℹ️</span>
              <h4 style={{ color: 'white', margin: 0, fontSize: '16px' }}>{getTranslation('businessInformation')}</h4>
            </div>
            <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', lineHeight: '1.6' }}>
              <p style={{ margin: '0 0 8px 0' }}>
                <strong>{getTranslation('category')}:</strong> {businessData.category}
              </p>
              <p style={{ margin: '0 0 8px 0' }}>
                <strong>{getTranslation('owner')}:</strong> {businessData.ownerName}
              </p>
              {businessData.description && (
                <p style={{ margin: '8px 0 0 0' }}>
                  {businessData.description}
                </p>
              )}
            </div>
          </div>
          
          {/* Special Notice */}
          <div style={{
            backgroundColor: 'rgba(255, 193, 7, 0.1)',
            padding: '15px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            <span style={{ fontSize: '18px' }}>💡</span>
            <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', lineHeight: '1.5' }}>
              {getTranslation('specialNotice')}
            </div>
          </div>
        </div>
      </div>

      <div style={{
        padding: '30px'
      }}>
        {/* Map */}
        <div style={{
          marginBottom: '30px',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
        }}>
          <iframe
            src={mapUrl}
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        {/* Transportation Information */}
        <div style={{
          marginTop: '30px',
          backgroundColor: 'rgba(40, 44, 68, 0.8)',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{
            color: 'white',
            fontSize: '20px',
            margin: '0 0 15px 0'
          }}>
            {getTranslation('transportation')}
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px'
          }}>
            <div>
              <h3 style={{
                color: 'white',
                fontSize: '16px',
                margin: '0 0 10px 0'
              }}>
                {getTranslation('parking')}
              </h3>
              <p style={{
                color: 'rgba(255, 255, 255, 0.8)',
                margin: '0'
              }}>
                {getTranslation('parkingDescription')}
              </p>
            </div>
            <div>
              <h3 style={{
                color: 'white',
                fontSize: '16px',
                margin: '0 0 10px 0'
              }}>
                {getTranslation('publicTransport')}
              </h3>
              <p style={{
                color: 'rgba(255, 255, 255, 0.8)',
                margin: '0'
              }}>
                {getTranslation('publicTransportDescription')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Directions;
