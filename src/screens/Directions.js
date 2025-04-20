import React from "react";

const Directions = () => {
  // Mock directions data
  const businessLocation = {
    address: "123 Restaurant Ave, New York, NY 10001",
    coordinates: { lat: 40.7128, lng: -74.0060 },
    phone: "+1 (555) 123-4567",
    hours: [
      { day: "Monday", hours: "9:00 AM - 9:00 PM" },
      { day: "Tuesday", hours: "9:00 AM - 9:00 PM" },
      { day: "Wednesday", hours: "9:00 AM - 9:00 PM" },
      { day: "Thursday", hours: "9:00 AM - 10:00 PM" },
      { day: "Friday", hours: "9:00 AM - 11:00 PM" },
      { day: "Saturday", hours: "10:00 AM - 11:00 PM" },
      { day: "Sunday", hours: "10:00 AM - 8:00 PM" },
    ]
  };

  return (
    <div style={{ 
      backgroundColor: 'rgba(28, 32, 55, 0.7)', 
      borderRadius: '8px', 
      padding: '20px',
      margin: '20px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
    }}>
      <h1 style={{ 
        color: '#3f51b5', 
        fontSize: '24px', 
        marginBottom: '20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        paddingBottom: '10px'
      }}>
        Directions & Hours
      </h1>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {/* Left Column - Map */}
        <div style={{
          backgroundColor: 'rgba(40, 44, 68, 0.7)',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <div style={{
            height: '300px',
            backgroundColor: '#1e2235',
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            {/* Placeholder for map - would be replaced with actual map component */}
            <div style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backgroundImage: 'radial-gradient(circle, rgba(40, 44, 68, 0.4) 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}></div>
            <div style={{
              color: 'white',
              padding: '10px 20px',
              textAlign: 'center'
            }}>
              <p>Map View Placeholder</p>
              <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
                Actual map would appear here in production
              </p>
            </div>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: '#3f51b5',
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              border: '3px solid white',
              boxShadow: '0 0 0 2px #3f51b5'
            }}></div>
          </div>
          
          <div style={{ padding: '20px' }}>
            <h3 style={{ 
              color: 'white', 
              marginBottom: '10px', 
              fontSize: '18px' 
            }}>
              Our Location
            </h3>
            <p style={{ 
              color: 'rgba(255, 255, 255, 0.8)', 
              marginBottom: '15px',
              lineHeight: '1.5'
            }}>
              {businessLocation.address}
            </p>
            <div style={{
              display: 'flex',
              gap: '10px',
              marginBottom: '15px'
            }}>
              <button style={{
                backgroundColor: '#3f51b5',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                flex: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px'
              }}>
                <span>🧭</span> Get Directions
              </button>
              <button style={{
                backgroundColor: 'transparent',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                flex: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px'
              }}>
                <span>📱</span> Call Us
              </button>
            </div>
            <div style={{
              backgroundColor: 'rgba(63, 81, 181, 0.1)',
              padding: '10px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span style={{ fontSize: '20px' }}>📞</span>
              <div>
                <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px' }}>Phone</div>
                <div style={{ color: 'white' }}>{businessLocation.phone}</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column - Hours */}
        <div style={{
          backgroundColor: 'rgba(40, 44, 68, 0.7)',
          borderRadius: '8px',
          padding: '20px'
        }}>
          <h3 style={{ 
            color: 'white', 
            marginBottom: '20px', 
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: '20px' }}>🕒</span> Business Hours
          </h3>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            {businessLocation.hours.map((item, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: index === new Date().getDay() - 1 ? 'rgba(63, 81, 181, 0.2)' : 'transparent',
                borderRadius: '4px'
              }}>
                <div style={{ 
                  color: 'white',
                  fontWeight: index === new Date().getDay() - 1 ? 'bold' : 'normal'
                }}>
                  {item.day}
                  {index === new Date().getDay() - 1 && (
                    <span style={{
                      marginLeft: '10px',
                      backgroundColor: '#4caf50',
                      color: 'white',
                      fontSize: '10px',
                      padding: '2px 6px',
                      borderRadius: '10px'
                    }}>
                      Today
                    </span>
                  )}
                </div>
                <div style={{ 
                  color: 'rgba(255, 255, 255, 0.8)'
                }}>
                  {item.hours}
                </div>
              </div>
            ))}
          </div>
          
          <div style={{
            marginTop: '20px',
            backgroundColor: 'rgba(244, 67, 54, 0.1)',
            padding: '15px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px'
          }}>
            <span style={{ fontSize: '20px' }}>ℹ️</span>
            <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', lineHeight: '1.5' }}>
              We are closed on major holidays. Please check our social media for special hours and events.
            </div>
          </div>
        </div>
      </div>

      <div style={{ 
        marginTop: '20px', 
        textAlign: 'center',
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: '14px'
      }}>
        This is a placeholder for the Directions page.
      </div>
    </div>
  );
};

export default Directions;
