import React, { useState, useEffect } from "react";
import { useLanguage } from '../contexts/LanguageContext';

const Profile = () => {
  const { translations, isEnglish } = useLanguage();
  const t = translations?.menu?.profile;

  // Helper function to get the correct translation
  const getTranslation = (key) => {
    if (!t) return key;
    
    // Split the key by dots to handle nested translations
    const keys = key.split('.');
    let current = t;
    
    // Navigate through the nested structure
    for (const k of keys) {
      if (!current[k]) return key;
      current = current[k];
    }
    
    // Return the correct language version
    return isEnglish ? current.en : current.tr;
  };

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
          throw new Error(getTranslation('notLoggedIn.message'));
        }
        
        // Parse the stored data
        const parsedUserData = JSON.parse(storedUserData);
        const businessId = parsedUserData.businessID || parsedUserData.id;
        
        if (!businessId) {
          throw new Error(getTranslation('error.businessIdNotFound'));
        }
        
        // Fetch the business data using the ID from localStorage
        const response = await fetch(`https://nokta-appservice.azurewebsites.net/api/Business/${businessId}`);
        
        if (!response.ok) {
          throw new Error(getTranslation('error.fetchFailed'));
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
    if (!dateString) return 'N/A';
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
        {getTranslation('notLoggedIn.title')}
      </h2>
      <p style={{ 
        color: 'rgba(255, 255, 255, 0.7)',
        marginBottom: '25px',
        lineHeight: '1.5'
      }}>
        {getTranslation('notLoggedIn.message')}
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
        {getTranslation('notLoggedIn.loginButton')}
      </button>
    </div>
  );

  // Error types with corresponding UI
  const getErrorContent = (errorMessage) => {
    if (errorMessage.includes(getTranslation('notLoggedIn.message'))) {
      return <NotLoggedInMessage />;
    }
    
    if (errorMessage.includes(getTranslation('error.businessIdNotFound'))) {
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
            {getTranslation('error.profileDataIssue')}
          </h1>
          <div style={{
            backgroundColor: 'rgba(244, 67, 54, 0.1)', 
            padding: '15px',
            borderRadius: '8px',
            color: 'white'
          }}>
            <p>{getTranslation('error.contactSupport')}</p>
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
            {getTranslation('tryAgain')}
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
          {getTranslation('error.loadingProfile')}
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
          {getTranslation('tryAgain')}
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
      backgroundColor: '#282c44', // Main background color
      minHeight: '100vh', 
      padding: '20px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start', 
      position: 'relative'
    }}>
      {/* "Logged in as" banner */}
      <div style={{
        position: 'absolute',
        top: '30px',
        right: '30px',
        backgroundColor: '#4CAF50',
        color: 'white',
        padding: '8px 15px',
        borderRadius: '5px',
        fontSize: '14px',
        fontWeight: 'bold',
        zIndex: 10
      }}>
        • Logged in as Fine Dining - Cumba
      </div>

      {/* Main Profile Card */}
      <div style={{ 
        backgroundColor: 'rgba(28, 32, 55, 0.95)', 
        borderRadius: '12px', 
        width: '90%', 
        maxWidth: '800px', 
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        overflow: 'hidden',
        marginTop: '50px'
      }}>
        {/* Business Profile Header Section */}
        <div style={{
          backgroundColor: '#383c5a',
          padding: '30px',
          textAlign: 'center',
          position: 'relative'
        }}>
          {/* Business Profile Title */}
          <h2 style={{
            color: 'white',
            fontSize: '28px',
            fontWeight: '600',
            margin: '0 0 20px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
          }}>
            <span style={{ fontSize: '24px' }}>👤</span>
            {getTranslation('title')}
          </h2>

          {/* Profile Picture / Initial */}
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            backgroundColor: '#3f51b5',
            color: 'white',
            fontSize: '48px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 15px auto',
            border: '3px solid rgba(255, 255, 255, 0.3)'
          }}>
            {userData?.name ? userData.name.charAt(0).toUpperCase() : 'F'}
          </div>

          {/* ID Tag */}
          <div style={{
            backgroundColor: '#8BC34A',
            color: 'white',
            padding: '4px 10px',
            borderRadius: '15px',
            fontSize: '12px',
            fontWeight: 'bold',
            display: 'inline-block',
            marginTop: '-40px',
            position: 'relative',
            zIndex: 5
          }}>
            ID: {userData?.businessID || userData?.id || 'N/A'}
          </div>

          <h3 style={{ color: 'white', fontSize: '24px', margin: '20px 0 5px 0' }}>{userData?.name || 'Fine Dining - Cumba'}</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '16px', margin: '0 0 15px 0' }}>{userData?.category || 'Food & Beverage'}</p>

          {/* Opening Hours & Template ID */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '25px' }}>
            <span style={{
              backgroundColor: '#3f51b5',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '14px'
            }}>
              {userData?.openingHour && userData?.closingHour ? `${formatTime(userData.openingHour)} - ${formatTime(userData.closingHour)}` : 'N/A'}
            </span>
            <span style={{
              backgroundColor: '#8BC34A',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '14px'
            }}>
              Template ID #{userData?.templateID || 'N/A'}
            </span>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
            <button
              style={{
                backgroundColor: '#3f51b5',
                color: 'white',
                border: '1px solid #3f51b5',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                minWidth: '180px',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#303f9f'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#3f51b5'}
            >
              {getTranslation('actions.editProfile')}
            </button>
            <button
              style={{
                backgroundColor: 'transparent',
                color: 'white',
                border: '1px solid #3f51b5',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                minWidth: '180px',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(63, 81, 181, 0.2)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              {getTranslation('actions.changePassword')}
            </button>
          </div>
        </div>

        {/* Business Details Section */}
        <div style={{
          backgroundColor: 'rgba(40, 44, 68, 0.8)',
          borderRadius: '0',
          padding: '30px',
          marginBottom: '0',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h2 style={{ 
            color: 'white', 
            marginBottom: '20px', 
            fontSize: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{ fontSize: '24px' }}>📁</span> {getTranslation('businessInfo.title')}
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            <div>
              <label style={{ 
                color: 'rgba(255, 255, 255, 0.6)', 
                fontSize: '14px', 
                marginBottom: '8px',
                display: 'block'
              }}>
                {getTranslation('businessInfo.owner')}
              </label>
              <div style={{ color: 'white', fontSize: '16px' }}>{userData?.ownerName || 'N/A'}</div>
            </div>

            <div>
              <label style={{ 
                color: 'rgba(255, 255, 255, 0.6)', 
                fontSize: '14px', 
                marginBottom: '8px',
                display: 'block'
              }}>
                {getTranslation('businessInfo.email')}
              </label>
              <div style={{ color: 'white', fontSize: '16px' }}>{userData?.email || 'N/A'}</div>
            </div>

            <div>
              <label style={{ 
                color: 'rgba(255, 255, 255, 0.6)', 
                fontSize: '14px', 
                marginBottom: '8px',
                display: 'block'
              }}>
                {getTranslation('businessInfo.phone')}
              </label>
              <div style={{ color: 'white', fontSize: '16px' }}>{userData?.contactNumber || 'N/A'}</div>
            </div>

            <div>
              <label style={{ 
                color: 'rgba(255, 255, 255, 0.6)', 
                fontSize: '14px', 
                marginBottom: '8px',
                display: 'block'
              }}>
                {getTranslation('businessInfo.address')}
              </label>
              <div style={{ color: 'white', fontSize: '16px' }}>{userData?.address || 'N/A'}</div>
            </div>

            <div>
              <label style={{ 
                color: 'rgba(255, 255, 255, 0.6)', 
                fontSize: '14px', 
                marginBottom: '8px',
                display: 'block'
              }}>
                {getTranslation('businessInfo.memberSince')}
              </label>
              <div style={{ color: 'white', fontSize: '16px' }}>{formatDate(userData?.memberSince)}</div>
            </div>
          </div>

          <div style={{ marginTop: '20px' }}>
            <label style={{ 
              color: 'rgba(255, 255, 255, 0.6)', 
              fontSize: '14px', 
              marginBottom: '8px',
              display: 'block'
            }}>
              {getTranslation('businessInfo.description')}
            </label>
            <div style={{ color: 'white', fontSize: '16px' }}>{userData?.description || '-'}</div>
          </div>
        </div>

        {/* Activated Features Section */}
        <div style={{
          backgroundColor: 'rgba(40, 44, 68, 0.8)',
          borderRadius: '0',
          padding: '30px',
          marginBottom: '0',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h2 style={{ 
            color: 'white', 
            marginBottom: '20px', 
            fontSize: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{ fontSize: '24px' }}>✨</span> {getTranslation('activatedFeatures.title')}
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px'
          }}>
            {features.map((feature, index) => (
              <div key={index} style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                padding: '15px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <span style={{ 
                  fontSize: '20px', 
                  color: feature.isActive ? '#8BC34A' : 'gray'
                }}>
                  {feature.isActive ? '✓' : '✗'}
                </span>
                <div style={{ color: 'white' }}>{getTranslation(`services.${feature.name.toLowerCase().replace(/ /g, '')}`)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Last updated text */}
        <div style={{ textAlign: 'right', padding: '15px 30px', color: 'rgba(255, 255, 255, 0.5)', fontSize: '12px' }}>
          {getTranslation('lastUpdated')} {formatDate(new Date())}
        </div>
      </div>
    </div>
  );
};

export default Profile;
