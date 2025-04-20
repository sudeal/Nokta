import React, { useState, useEffect } from "react";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setUserData(data);
      } catch (err) {
        console.error("Error fetching business data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessData();
  }, []);

  // Format opening/closing hours to readable time
  const formatTime = (hour) => {
    const hours = Math.floor(hour);
    const minutes = Math.round((hour - hours) * 60);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  // Format date to a readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Add a component for when user is not logged in
  const NotLoggedInMessage = () => (
    <div style={{ 
      backgroundColor: 'rgba(28, 32, 55, 0.7)', 
      borderRadius: '8px', 
      padding: '30px',
      margin: '20px auto',
      maxWidth: '600px',
      textAlign: 'center',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{
        fontSize: '50px',
        marginBottom: '20px'
      }}>
        👤
      </div>
      <h2 style={{ 
        color: 'white', 
        fontSize: '24px', 
        marginBottom: '15px' 
      }}>
        Please Log In to View Your Profile
      </h2>
      <p style={{ 
        color: 'rgba(255, 255, 255, 0.7)',
        marginBottom: '25px',
        lineHeight: '1.5'
      }}>
        You need to be logged in to access your business profile information.
      </p>
      <button style={{
        backgroundColor: '#3f51b5',
        color: 'white',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '16px'
      }} onClick={() => window.location.href = '/login'}>
        Go to Login
      </button>
    </div>
  );

  // Error types with corresponding UI
  const getErrorContent = (errorMessage) => {
    if (errorMessage.includes("No user data found") || errorMessage.includes("Please log in")) {
      return <NotLoggedInMessage />;
    }
    
    if (errorMessage.includes("Business ID not found")) {
      return (
        <div style={{ 
          backgroundColor: 'rgba(28, 32, 55, 0.7)', 
          borderRadius: '8px', 
          padding: '20px',
          margin: '20px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}>
          <h1 style={{ 
            color: 'white', 
            fontSize: '28px', 
            fontWeight: 'bold',
            marginBottom: '20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
            paddingBottom: '16px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <span style={{ 
              fontSize: '24px', 
              marginRight: '10px',
              backgroundColor: 'rgba(244, 67, 54, 0.25)',
              padding: '6px',
              borderRadius: '8px',
              display: 'inline-flex'
            }}>
              ⚠️
            </span>
            Profile Data Issue
          </h1>
          <div style={{
            backgroundColor: 'rgba(244, 67, 54, 0.1)', 
            padding: '15px',
            borderRadius: '8px',
            color: 'white'
          }}>
            <p>Your account doesn't seem to be properly set up as a business account. Please contact support for assistance.</p>
          </div>
          <button style={{
            backgroundColor: '#3f51b5',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            marginTop: '20px'
          }} onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      );
    }
    
    // Default error UI
    return (
      <div style={{ 
        backgroundColor: 'rgba(28, 32, 55, 0.7)', 
        borderRadius: '8px', 
        padding: '20px',
        margin: '20px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{ 
          color: 'white', 
          fontSize: '28px', 
          fontWeight: 'bold',
          marginBottom: '20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
          paddingBottom: '16px',
          display: 'flex',
          alignItems: 'center'
        }}>
          <span style={{ 
            fontSize: '24px', 
            marginRight: '10px',
            backgroundColor: 'rgba(244, 67, 54, 0.25)',
            padding: '6px',
            borderRadius: '8px',
            display: 'inline-flex'
          }}>
            ⚠️
          </span>
          Error Loading Profile
        </h1>
        <div style={{
          backgroundColor: 'rgba(244, 67, 54, 0.1)', 
          padding: '15px',
          borderRadius: '8px',
          color: 'white'
        }}>
          {errorMessage}
        </div>
        <button style={{
          backgroundColor: '#3f51b5',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold',
          marginTop: '20px'
        }} onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  };

  if (error) {
    return getErrorContent(error);
  }

  if (loading) {
    return (
      <div style={{ 
        backgroundColor: 'rgba(28, 32, 55, 0.7)', 
        borderRadius: '8px', 
        padding: '20px',
        margin: '20px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '300px'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '15px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '3px solid rgba(255, 255, 255, 0.3)',
            borderTopColor: '#3f51b5',
            animation: 'spin 1s linear infinite'
          }}></div>
          <div style={{ color: 'white' }}>Loading business profile...</div>
        </div>
      </div>
    );
  }

  if (!userData) return null;

  // Determine active features
  const features = [
    { name: "Messaging", isActive: userData.hasMessaging },
    { name: "Statistics", isActive: userData.hasStatistics },
    { name: "Menu Prices", isActive: userData.hasMenuPrices },
    { name: "Directions", isActive: userData.hasDirections }
  ];

  return (
    <div style={{ 
      backgroundColor: 'rgba(28, 32, 55, 0.7)', 
      borderRadius: '8px', 
      padding: '30px',
      margin: '20px auto',
      maxWidth: '1200px',
      width: '95%',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
    }}>
      {/* Login status indicator */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: '15px'
      }}>
        <div style={{
          backgroundColor: 'rgba(76, 175, 80, 0.2)',
          color: '#66bb6a',
          padding: '8px 12px',
          borderRadius: '4px',
          fontSize: '13px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span style={{ fontSize: '10px' }}>●</span>
          Logged in as {userData.name || userData.ownerName}
        </div>
      </div>
      
      <h1 style={{ 
        color: 'white', 
        fontSize: '32px', 
        fontWeight: 'bold',
        marginBottom: '25px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
        paddingBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        letterSpacing: '0.5px'
      }}>
        <span style={{ 
          fontSize: '28px', 
          marginRight: '15px',
          backgroundColor: 'rgba(63, 81, 181, 0.25)',
          padding: '8px',
          borderRadius: '8px',
          display: 'inline-flex'
        }}>
          👤
        </span>
        Business Profile
      </h1>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '25px',
        marginBottom: '30px'
      }}>
        {/* Profile Summary Card */}
        <div style={{
          backgroundColor: 'rgba(40, 44, 68, 0.7)',
          borderRadius: '8px',
          padding: '25px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '60px',
            backgroundColor: '#3f51b5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '36px',
            fontWeight: 'bold',
            marginBottom: '15px',
            border: '4px solid rgba(255, 255, 255, 0.2)',
            position: 'relative'
          }}>
            {userData.name.charAt(0)}
            <div style={{
              position: 'absolute',
              bottom: '-5px',
              right: '-5px',
              backgroundColor: 'rgba(76, 175, 80, 0.9)',
              color: 'white',
              borderRadius: '12px',
              padding: '2px 8px',
              fontSize: '12px',
              fontWeight: 'bold',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              border: '2px solid rgba(255, 255, 255, 0.8)'
            }}>
              ID: {userData.businessID}
            </div>
          </div>
          
          <h2 style={{ 
            color: 'white', 
            fontSize: '20px',
            marginBottom: '5px',
            textAlign: 'center'
          }}>
            {userData.name}
          </h2>
          
          <p style={{ 
            color: 'rgba(255, 255, 255, 0.7)', 
            marginBottom: '15px',
            textAlign: 'center'
          }}>
            {userData.category}
          </p>
          
          <div style={{
            display: 'flex',
            gap: '10px',
            marginBottom: '20px',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <span style={{
              backgroundColor: 'rgba(33, 150, 243, 0.2)',
              color: '#42a5f5',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              {formatTime(userData.openingHour)} - {formatTime(userData.closingHour)}
            </span>
            <span style={{
              backgroundColor: 'rgba(76, 175, 80, 0.2)',
              color: '#66bb6a',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              Template #{userData.webSiteTemplateID}
            </span>
          </div>
          
          <button style={{
            backgroundColor: '#3f51b5',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            marginBottom: '10px',
            width: '100%'
          }}>
            Edit Profile
          </button>
          
          <button style={{
            backgroundColor: 'transparent',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            width: '100%'
          }}>
            Change Password
          </button>
        </div>
        
        {/* Business Details Card */}
        <div style={{
          backgroundColor: 'rgba(40, 44, 68, 0.7)',
          borderRadius: '8px',
          padding: '25px'
        }}>
          <h3 style={{ 
            color: 'white', 
            marginBottom: '20px', 
            fontSize: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span>📋</span> Business Details
          </h3>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
          }}>
            <div>
              <label style={{ 
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '13px',
                display: 'block',
                marginBottom: '8px'
              }}>
                Owner Name
              </label>
              <div style={{ 
                color: 'white',
                fontSize: '15px',
                fontWeight: '500'
              }}>
                {userData.ownerName}
              </div>
            </div>
            
            <div>
              <label style={{ 
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '13px',
                display: 'block',
                marginBottom: '8px'
              }}>
                Email Address
              </label>
              <div style={{ 
                color: 'white',
                fontSize: '15px',
                fontWeight: '500'
              }}>
                {userData.email}
              </div>
            </div>
            
            <div>
              <label style={{ 
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '13px',
                display: 'block',
                marginBottom: '8px'
              }}>
                Phone Number
              </label>
              <div style={{ 
                color: 'white',
                fontSize: '15px',
                fontWeight: '500'
              }}>
                {userData.contactNumber}
              </div>
            </div>
            
            <div>
              <label style={{ 
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '13px',
                display: 'block',
                marginBottom: '8px'
              }}>
                Business Address
              </label>
              <div style={{ 
                color: 'white',
                fontSize: '15px',
                fontWeight: '500'
              }}>
                {userData.address}
              </div>
            </div>
            
            <div>
              <label style={{ 
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '13px',
                display: 'block',
                marginBottom: '8px'
              }}>
                Member Since
              </label>
              <div style={{ 
                color: 'white',
                fontSize: '15px',
                fontWeight: '500'
              }}>
                {formatDate(userData.createdAt)}
              </div>
            </div>
            
            <div>
              <label style={{ 
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '13px',
                display: 'block',
                marginBottom: '8px'
              }}>
                Description
              </label>
              <div style={{ 
                color: 'white',
                fontSize: '15px',
                fontWeight: '500',
                lineHeight: '1.5'
              }}>
                {userData.description}
              </div>
            </div>
          </div>
        </div>
        
        {/* Features Card */}
        <div style={{
          backgroundColor: 'rgba(40, 44, 68, 0.7)',
          borderRadius: '8px',
          padding: '25px'
        }}>
          <h3 style={{ 
            color: 'white', 
            marginBottom: '20px', 
            fontSize: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span>✨</span> Activated Features
          </h3>
          
          <div style={{
            backgroundColor: 'rgba(63, 81, 181, 0.2)',
            borderRadius: '6px',
            padding: '15px',
            marginBottom: '20px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px'
            }}>
              <div>
                <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>
                  Opening Hours
                </div>
                <div style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>
                  {formatTime(userData.openingHour)} - {formatTime(userData.closingHour)}
                </div>
              </div>
              <div style={{
                backgroundColor: 'rgba(76, 175, 80, 0.2)',
                color: '#4caf50',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                Active
              </div>
            </div>
            
            <div style={{ marginBottom: '10px' }}>
              <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>
                Template ID
              </div>
              <div style={{ color: 'white', fontSize: '14px' }}>
                #{userData.webSiteTemplateID}
              </div>
            </div>
            
            <button style={{
              backgroundColor: '#3f51b5',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              width: '100%',
              fontSize: '14px'
            }}>
              Manage Features
            </button>
          </div>
          
          <h4 style={{ 
            color: 'white', 
            fontSize: '14px',
            marginBottom: '10px'
          }}>
            Activated Features:
          </h4>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            {features.map((feature, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: feature.isActive ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.4)',
                fontSize: '15px',
                padding: '8px 0'
              }}>
                <span style={{ 
                  color: feature.isActive ? '#4caf50' : '#f44336'
                }}>
                  {feature.isActive ? '✓' : '✕'}
                </span> 
                {feature.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ 
        marginTop: '20px', 
        textAlign: 'center',
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: '14px'
      }}>
        Last updated: {new Date().toLocaleDateString()}
      </div>
      
      {/* Add animation for loading spinner */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default Profile;
