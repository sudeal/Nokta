import React, { useState, useEffect } from "react";

const Appointments = () => {
  const [userId, setUserId] = useState(null);
  const [businessName, setBusinessName] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    // Check if there's user data in localStorage
    const userData = localStorage.getItem("userData");
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        const businessId = parsedData.businessID || parsedData.id;
        
        setUserId(businessId || "Kullanıcı ID bulunamadı");
        setBusinessName(parsedData.name || "İşletme adı bulunamadı");
        
        // If we have a business ID, fetch appointments
        if (businessId) {
          fetchAppointments(businessId);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        setUserId("Kullanıcı ID bulunamadı");
        setBusinessName("İşletme adı bulunamadı");
      }
    } else {
      setUserId("Giriş yapılmamış");
      setBusinessName("Giriş yapılmamış");
    }
  }, []);

  const fetchAppointments = async (businessId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://nokta-appservice.azurewebsites.net/api/Appointments/business/${businessId}`
      );
      
      if (!response.ok) {
        throw new Error("Randevular yüklenemedi");
      }
      
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setError("Randevular yüklenemedi: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    setActionLoading(appointmentId);
    
    try {
      // Find the appointment to update
      const appointmentToUpdate = appointments.find(
        app => app.appointmentID === appointmentId
      );
      
      if (!appointmentToUpdate) {
        throw new Error("Randevu bulunamadı");
      }
      
      // Create updated appointment object
      const updatedAppointment = {
        ...appointmentToUpdate,
        status: newStatus
      };
      
      // Send PUT request to update the appointment
      const response = await fetch(
        `https://nokta-appservice.azurewebsites.net/api/Appointments/${appointmentId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedAppointment),
        }
      );
      
      if (!response.ok) {
        throw new Error("Randevu durumu güncellenemedi");
      }
      
      // Update local state with the new appointment status
      setAppointments(appointments.map(app => 
        app.appointmentID === appointmentId ? { ...app, status: newStatus } : app
      ));
      
      // Show success message
      alert(`Randevu durumu başarıyla "${newStatus}" olarak güncellendi`);
      
    } catch (error) {
      console.error("Error updating appointment status:", error);
      alert("Randevu durumu güncellenemedi: " + error.message);
    } finally {
      setActionLoading(null);
    }
  };

  // Format date and time for display
  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format date only
  const formatDate = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format time only
  const formatTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Check if a date is today
  const isToday = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  // Sort appointments by date (nearest first)
  const sortAppointmentsByDate = (apps) => {
    return [...apps].sort((a, b) => 
      new Date(a.appointmentDateTime) - new Date(b.appointmentDateTime)
    );
  };

  // Get card class based on status
  const getCardClass = (status) => {
    switch(status) {
      case 'Accepted':
        return 'card-accepted';
      case 'Pending':
        return 'card-pending';
      case 'Rejected':
        return 'card-rejected';
      case 'Completed':
        return 'card-completed';
      default:
        return '';
    }
  };

  // Get status class for styling
  const getStatusClass = (status) => {
    switch(status) {
      case 'Accepted':
        return 'status-accepted';
      case 'Pending':
        return 'status-pending';
      case 'Rejected':
        return 'status-rejected';
      case 'Completed':
        return 'status-completed';
      default:
        return '';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch(status) {
      case 'Accepted':
        return '✓';
      case 'Pending':
        return '⌛';
      case 'Rejected':
        return '✕';
      case 'Completed':
        return '🏆';
      default:
        return '⦿';
    }
  };

  // Show action buttons based on status
  const renderActionButtons = (appointment) => {
    const { appointmentID, status } = appointment;
    const isLoading = actionLoading === appointmentID;
    
    // Don't show action buttons for completed appointments
    if (status === 'Completed') {
      return null;
    }
    
    return (
      <div className="appointment-actions">
        {status !== 'Accepted' && (
          <button 
            className="action-button accept-button"
            onClick={() => updateAppointmentStatus(appointmentID, 'Accepted')}
            disabled={isLoading}
          >
            {isLoading ? <span className="button-spinner"></span> : '✓ Kabul Et'}
          </button>
        )}
        
        {status !== 'Rejected' && (
          <button 
            className="action-button cancel-button"
            onClick={() => updateAppointmentStatus(appointmentID, 'Rejected')}
            disabled={isLoading}
          >
            {isLoading ? <span className="button-spinner"></span> : '✕ Reddet'}
          </button>
        )}
        
        {status !== 'Completed' && status === 'Accepted' && (
          <button 
            className="action-button complete-button"
            onClick={() => updateAppointmentStatus(appointmentID, 'Completed')}
            disabled={isLoading}
          >
            {isLoading ? <span className="button-spinner"></span> : '✓ Tamamla'}
          </button>
        )}
      </div>
    );
  };
  
  // Render a single appointment card
  const renderAppointmentCard = (appointment) => {
    return (
      <div 
        key={appointment.appointmentID} 
        className={`appointment-card ${getCardClass(appointment.status)}`}
      >
        <div className="card-left">
          <div className="appointment-id">#{appointment.appointmentID}</div>
          <div className={`appointment-status ${getStatusClass(appointment.status)}`}>
            <span className="status-icon">{getStatusIcon(appointment.status)}</span>
            {appointment.status}
          </div>
          {appointment.status === 'Pending' && (
            <div className="need-attention-badge">
              <span className="attention-icon">⚠️</span> Onay Bekliyor
            </div>
          )}
        </div>
        
        <div className="card-mid">
          <div className="appointment-datetime">
            <div className="appointment-date">
              <span className="info-icon">📅</span> {formatDate(appointment.appointmentDateTime)}
            </div>
            <div className="appointment-time">
              <span className="info-icon">⏰</span> {formatTime(appointment.appointmentDateTime)}
            </div>
          </div>
          
          <div className="card-details">
            <div className="appointment-customer">
              <span className="info-icon">👤</span>
              <span className="info-label">Müşteri:</span> {appointment.userID}
            </div>
            
            {appointment.note && (
              <div className="appointment-note">
                <span className="info-icon">📝</span>
                <span className="info-label">Not:</span> {appointment.note}
              </div>
            )}
            
            <div className="appointment-created">
              <span className="info-label">Oluşturulma:</span> {formatDateTime(appointment.createdAt)}
            </div>
          </div>
        </div>
        
        <div className="card-right">
          {renderActionButtons(appointment)}
        </div>
      </div>
    );
  };

  // Get and filter appointments by different criteria
  const todayAppointments = appointments.filter(app => isToday(app.appointmentDateTime));
  const pendingAppointments = appointments.filter(app => app.status === 'Pending');
  const sortedAppointments = sortAppointmentsByDate(appointments);
  
  const renderSectionTitle = (title, count) => (
    <div className="section-title">
      <h3>{title}</h3>
      <span className="appointment-count">{count}</span>
    </div>
  );

  return (
    <div className="appointments-container">
      <div className="appointments-header">
        <h2>Randevular</h2>
        <div className="business-info">
          <p>İşletme ID: {userId}</p>
          <p>İşletme Adı: {businessName}</p>
        </div>
      </div>

      {loading ? (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>Randevular yükleniyor...</p>
        </div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="appointments-sections">
          {/* Today's Appointments Section */}
          <div className="appointment-section">
            {renderSectionTitle("Bugünkü Randevular", todayAppointments.length)}
            <div className="appointment-list">
              {todayAppointments.length === 0 ? (
                <div className="empty-section">Bugün için randevu bulunmamaktadır</div>
              ) : (
                todayAppointments.map(renderAppointmentCard)
              )}
            </div>
          </div>
          
          {/* Pending Appointments Section */}
          <div className="appointment-section">
            {renderSectionTitle("Onay Bekleyen Randevular", pendingAppointments.length)}
            <div className="appointment-list">
              {pendingAppointments.length === 0 ? (
                <div className="empty-section">Onay bekleyen randevu bulunmamaktadır</div>
              ) : (
                pendingAppointments.map(renderAppointmentCard)
              )}
            </div>
          </div>
          
          {/* All Appointments Section */}
          <div className="appointment-section">
            {renderSectionTitle("Tüm Randevular", sortedAppointments.length)}
            <div className="appointment-list">
              {sortedAppointments.length === 0 ? (
                <div className="empty-section">Randevu bulunmamaktadır</div>
              ) : (
                sortedAppointments.map(renderAppointmentCard)
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
