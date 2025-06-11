import React, { useState, useEffect } from "react";
import { useLanguage } from '../contexts/LanguageContext';
import './Profile.css';

const Profile = () => {
  const { translations, isEnglish } = useLanguage();
  const t = translations?.profile;

  // Helper function to get the correct translation
  const getTranslation = (key) => {
    if (!t) return key;
    
    const keys = key.split('.');
    let current = t;
    
    for (const k of keys) {
      if (!current || !current[k]) return key;
      current = current[k];
    }
    
    // Return the correct language version
    if (current && typeof current === 'object' && (current.en || current.tr)) {
      return isEnglish ? current.en : current.tr;
    }
    
    return current || key;
  };

  // Simple translation helper for direct access
  const getText = (path) => {
    const keys = path.split('.');
    let current = t;
    
    for (const key of keys) {
      if (!current || !current[key]) return path;
      current = current[key];
    }
    
    return isEnglish ? current.en : current.tr;
  };

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        setLoading(true);
        
        const storedUserData = localStorage.getItem("userData");
        if (!storedUserData) {
          throw new Error(getTranslation('notLoggedIn.message'));
        }
        
        const parsedUserData = JSON.parse(storedUserData);
        const businessId = parsedUserData.businessID || parsedUserData.id;
        
        if (!businessId) {
          throw new Error(getTranslation('error.businessIdNotFound'));
        }
        
        const response = await fetch(`https://nokta-appservice.azurewebsites.net/api/Business/${businessId}`);
        
        if (!response.ok) {
          throw new Error(getTranslation('error.fetchFailed'));
        }
        
        const data = await response.json();
        setUserData(data);
        setEditData(data);
      } catch (err) {
        console.error("Error fetching business data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessData();
  }, []);

  const formatTime = (hour) => {
    const hours = Math.floor(hour);
    const minutes = Math.round((hour - hours) * 60);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setEditData(userData);
    }
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`https://nokta-appservice.azurewebsites.net/api/Business/${userData.businessID || userData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData)
      });

      if (response.ok) {
        setUserData(editData);
        setIsEditing(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        throw new Error('Failed to update profile');
      }
          } catch (err) {
        console.error('Error updating profile:', err);
        alert('Failed to update profile. Please try again.');
      } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData(userData);
    setIsEditing(false);
  };

  if (error) {
    return (
      <div className="profile-container">
        <div className="error-card">
          <div className="error-icon">⚠️</div>
          <h2>Error</h2>
          <p>{error}</p>
          <button className="btn-primary" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-card">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!userData) return null;

  const features = [
    { 
      name: "messaging", 
      isActive: userData.hasMessaging,
      icon: "💬",
      label: isEnglish ? "Messaging" : "Mesajlaşma"
    },
    { 
      name: "statistics", 
      isActive: userData.hasStatistics,
      icon: "📊",
      label: isEnglish ? "Statistics" : "İstatistikler"
    },
    { 
      name: "menu", 
      isActive: userData.hasMenuPrices,
      icon: "🍽️",
      label: isEnglish ? "Menu & Prices" : "Menü ve Fiyatlar"
    },
    { 
      name: "directions", 
      isActive: userData.hasDirections,
      icon: "🗺️",
      label: isEnglish ? "Directions" : "Yol Tarifi"
    }
  ];

  return (
    <div className="profile-container">
      {/* Success Message */}
      {showSuccess && (
        <div className="success-toast">
          <span className="success-icon">✅</span>
          {isEnglish ? 'Profile updated successfully!' : 'Profil başarıyla güncellendi!'}
        </div>
      )}

      {/* Header Section */}
      <div className="profile-header">
        <div className="profile-header-content">
          <div className="profile-avatar">
            <div className="avatar-circle">
              {userData?.name ? userData.name.charAt(0).toUpperCase() : 'B'}
            </div>
            <div className="status-indicator online"></div>
          </div>
          
          <div className="profile-header-info">
            <div className="profile-title">
              <h1>{userData?.name || 'Business Name'}</h1>
              <span className="business-id">ID: {userData?.businessID || userData?.id || 'N/A'}</span>
            </div>
            
            <div className="profile-meta">
              <span className="category-badge">
                <span className="category-icon">🏢</span>
                {userData?.category || 'Business'}
              </span>
              
              <span className="hours-badge">
                <span className="hours-icon">🕒</span>
                {userData?.openingHour && userData?.closingHour 
                  ? `${formatTime(userData.openingHour)} - ${formatTime(userData.closingHour)}`
                  : 'Hours not set'
                }
              </span>
            </div>
          </div>

          <div className="profile-actions">
            {!isEditing ? (
              <button className="btn-primary" onClick={handleEditToggle}>
                <span className="btn-icon">✏️</span>
                {isEnglish ? 'Edit Profile' : 'Profili Düzenle'}
              </button>
            ) : (
              <div className="edit-actions">
                <button 
                  className="btn-success" 
                  onClick={handleSave} 
                  disabled={saving}
                >
                  <span className="btn-icon">
                    {saving ? "⏳" : "💾"}
                  </span>
                  {saving ? (isEnglish ? 'Saving...' : 'Kaydediliyor...') : (isEnglish ? 'Save Changes' : 'Değişiklikleri Kaydet')}
                </button>
                <button className="btn-secondary" onClick={handleCancel}>
                  <span className="btn-icon">❌</span>
                  {isEnglish ? 'Cancel' : 'İptal'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="profile-content">
        {/* Business Information Card */}
        <div className="info-card">
          <div className="card-header">
            <h2>
              <span className="card-icon">📋</span>
              {isEnglish ? 'Business Information' : 'İşletme Bilgileri'}
            </h2>
          </div>
          
          <div className="card-content">
            <div className="info-grid">
              <div className="info-item">
                <label>{isEnglish ? 'Owner' : 'İşletme Sahibi'}</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData?.ownerName || ''}
                    onChange={(e) => handleInputChange('ownerName', e.target.value)}
                    className="form-input"
                  />
                ) : (
                  <span>{userData?.ownerName || 'N/A'}</span>
                )}
              </div>

              <div className="info-item">
                <label>{isEnglish ? 'Email' : 'E-posta'}</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editData?.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="form-input"
                  />
                ) : (
                  <span>{userData?.email || 'N/A'}</span>
                )}
              </div>

              <div className="info-item">
                <label>{isEnglish ? 'Phone' : 'Telefon'}</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editData?.contactNumber || ''}
                    onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                    className="form-input"
                  />
                ) : (
                  <span>{userData?.contactNumber || 'N/A'}</span>
                )}
              </div>

              <div className="info-item">
                <label>{isEnglish ? 'Business Name' : 'İşletme Adı'}</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData?.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="form-input"
                  />
                ) : (
                  <span>{userData?.name || 'N/A'}</span>
                )}
              </div>

              <div className="info-item">
                <label>{isEnglish ? 'Category' : 'Kategori'}</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData?.category || ''}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="form-input"
                  />
                ) : (
                  <span>{userData?.category || 'N/A'}</span>
                )}
              </div>

              <div className="info-item">
                <label>{isEnglish ? 'Member Since' : 'Üyelik Tarihi'}</label>
                <span>{formatDate(userData?.memberSince)}</span>
              </div>
            </div>

            <div className="info-item full-width">
              <label>{isEnglish ? 'Address' : 'Adres'}</label>
              {isEditing ? (
                <textarea
                  value={editData?.address || ''}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="form-textarea"
                  rows="2"
                />
              ) : (
                <span>{userData?.address || 'N/A'}</span>
              )}
            </div>

            <div className="info-item full-width">
              <label>{isEnglish ? 'Description' : 'Açıklama'}</label>
              {isEditing ? (
                <textarea
                  value={editData?.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="form-textarea"
                  rows="3"
                />
              ) : (
                <span>{userData?.description || (isEnglish ? 'No description provided' : 'Açıklama girilmemiş')}</span>
              )}
            </div>
          </div>
        </div>

        {/* Working Hours Card */}
        <div className="info-card">
          <div className="card-header">
            <h2>
              <span className="card-icon">⏰</span>
              {isEnglish ? 'Working Hours' : 'Çalışma Saatleri'}
            </h2>
          </div>
          
          <div className="card-content">
            <div className="hours-grid">
              <div className="hours-item">
                <label>{isEnglish ? 'Opening Time' : 'Açılış Saati'}</label>
                {isEditing ? (
                  <input
                    type="number"
                    min="0"
                    max="24"
                    step="0.5"
                    value={editData?.openingHour || ''}
                    onChange={(e) => handleInputChange('openingHour', parseFloat(e.target.value))}
                    className="form-input"
                  />
                ) : (
                  <span className="hours-value">
                    {userData?.openingHour ? formatTime(userData.openingHour) : (isEnglish ? 'Not set' : 'Belirlenmemiş')}
                  </span>
                )}
              </div>

              <div className="hours-item">
                <label>{isEnglish ? 'Closing Time' : 'Kapanış Saati'}</label>
                {isEditing ? (
                  <input
                    type="number"
                    min="0"
                    max="24"
                    step="0.5"
                    value={editData?.closingHour || ''}
                    onChange={(e) => handleInputChange('closingHour', parseFloat(e.target.value))}
                    className="form-input"
                  />
                ) : (
                  <span className="hours-value">
                    {userData?.closingHour ? formatTime(userData.closingHour) : (isEnglish ? 'Not set' : 'Belirlenmemiş')}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Features & Services Card */}
        <div className="info-card">
          <div className="card-header">
            <h2>
              <span className="card-icon">⚡</span>
              {isEnglish ? 'Services & Features' : 'Hizmetler ve Özellikler'}
            </h2>
          </div>
          
          <div className="card-content">
            <div className="features-grid">
              {features.map((feature, index) => (
                <div key={index} className={`feature-item ${feature.isActive ? 'active' : 'inactive'}`}>
                  <div className="feature-icon">
                    {feature.icon}
                  </div>
                  
                  <div className="feature-info">
                    <span className="feature-name">{feature.label}</span>
                    <span className={`feature-status ${feature.isActive ? 'enabled' : 'disabled'}`}>
                      {feature.isActive ? (isEnglish ? 'Enabled' : 'Aktif') : (isEnglish ? 'Disabled' : 'Pasif')}
                    </span>
                  </div>
                  
                  <div className={`feature-indicator ${feature.isActive ? 'on' : 'off'}`}>
                    {feature.isActive ? '●' : '○'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats Card */}
        <div className="info-card">
          <div className="card-header">
            <h2>
              <span className="card-icon">📈</span>
              {isEnglish ? 'Quick Stats' : 'Hızlı İstatistikler'}
            </h2>
          </div>
          
          <div className="card-content">
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-number">{userData?.templateID || 'N/A'}</span>
                <span className="stat-label">{isEnglish ? 'Template ID' : 'Şablon ID'}</span>
              </div>
              
              <div className="stat-item">
                <span className="stat-number">{features.filter(f => f.isActive).length}</span>
                <span className="stat-label">{isEnglish ? 'Active Features' : 'Aktif Özellikler'}</span>
              </div>
              
              <div className="stat-item">
                <span className="stat-number">
                  {userData?.openingHour && userData?.closingHour 
                    ? Math.round(userData.closingHour - userData.openingHour) 
                    : 0}h
                </span>
                <span className="stat-label">{isEnglish ? 'Daily Hours' : 'Günlük Saatler'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
