import React, { useState, useEffect } from "react";

const Appointments = () => {
  const [userId, setUserId] = useState(null);
  const [businessName, setBusinessName] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [activeTab, setActiveTab] = useState('today');

  // Renk paleti
  const colors = {
    primary: '#3f51b5', // Ana renk
    primaryLight: '#757de8',
    primaryDark: '#002984',
    accent: '#ff4081', // Vurgu rengi
    background: '#f2f2f7', // Arka plan - daha koyu
    cardBg: '#e6e9f0', // Kart arka planı - beyazdan daha koyu gri-mavi
    text: '#424242', // Ana metin rengi
    textLight: '#757575', // Açık metin
    success: '#4caf50', // Başarı durumu
    warning: '#ff9800', // Uyarı durumu
    error: '#f44336', // Hata durumu
    info: '#2196f3', // Bilgi durumu
    border: '#d0d0d0', // Kenarlık rengi - daha koyu
    divider: '#c8ccd8', // Ayraç rengi - daha koyu
  };

  // CSS styles
  const styles = {
    container: {
      backgroundColor: 'transparent',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
      borderBottom: `1px solid rgba(255, 255, 255, 0.15)`,
      paddingBottom: '16px'
    },
    heading: {
      color: 'white',
      fontSize: '28px',
      fontWeight: 'bold',
      margin: 0,
      textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
      display: 'flex',
      alignItems: 'center',
      letterSpacing: '0.5px'
    },
    businessInfo: {
      color: 'rgba(255, 255, 255, 0.75)',
      fontSize: '14px',
      backgroundColor: 'rgba(45, 52, 84, 0.5)',
      padding: '8px 12px',
      borderRadius: '6px',
      display: 'flex',
      flexDirection: 'column',
      gap: '4px'
    },
    tabsContainer: {
      display: 'flex',
      borderBottom: `2px solid ${colors.divider}`,
      marginBottom: '20px',
      overflowX: 'auto',
      width: '100%'
    },
    tabButton: {
      padding: '12px 20px',
      background: 'none',
      border: 'none',
      borderBottom: '3px solid transparent',
      fontSize: '15px',
      fontWeight: '600',
      color: colors.textLight,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      whiteSpace: 'nowrap',
      marginRight: '10px',
      position: 'relative'
    },
    activeTab: {
      color: colors.primary,
      borderBottom: `3px solid ${colors.primary}`,
    },
    tabCount: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: '24px',
      height: '24px',
      borderRadius: '12px',
      backgroundColor: colors.divider,
      color: colors.textLight,
      fontSize: '12px',
      fontWeight: 'bold',
      marginLeft: '8px',
      padding: '0 8px'
    },
    activeTabCount: {
      backgroundColor: colors.primary,
      color: 'white'
    },
    tabContent: {
      padding: '15px',
      backgroundColor: 'transparent',
      borderRadius: '0 0 8px 8px'
    },
    appointmentCard: {
      display: 'flex',
      margin: '0 0 16px 0',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      backgroundColor: 'rgba(45, 52, 84, 0.85)',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      padding: '16px'
    },
    cardAccepted: {
      borderLeft: `5px solid ${colors.success}`,
    },
    cardPending: {
      borderLeft: `5px solid ${colors.warning}`,
    },
    cardRejected: {
      borderLeft: `5px solid ${colors.error}`,
    },
    cardCompleted: {
      borderLeft: `5px solid ${colors.info}`,
    },
    emptySection: {
      padding: '30px',
      textAlign: 'center',
      backgroundColor: 'rgba(40, 44, 68, 0.7)',
      borderRadius: '8px',
      color: colors.textLight,
      fontStyle: 'italic',
      boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
    },
    cardLeft: {
      padding: '0 16px 0 0',
      display: 'flex',
      flexDirection: 'column',
      borderRight: `1px solid ${colors.divider}`,
      minWidth: '120px'
    },
    cardMid: {
      flex: 1,
      padding: '0 16px'
    },
    cardRight: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      minWidth: '140px'
    },
    appointmentID: {
      fontSize: '14px',
      color: 'rgba(255, 255, 255, 0.75)',
      marginBottom: '8px'
    },
    statusBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '13px',
      fontWeight: 'bold',
      marginBottom: '10px'
    },
    statusAccepted: {
      backgroundColor: 'rgba(76, 175, 80, 0.2)',
      color: colors.success
    },
    statusPending: {
      backgroundColor: 'rgba(255, 152, 0, 0.2)',
      color: colors.warning
    },
    statusRejected: {
      backgroundColor: 'rgba(244, 67, 54, 0.2)',
      color: colors.error
    },
    statusCompleted: {
      backgroundColor: 'rgba(33, 150, 243, 0.2)',
      color: colors.info
    },
    dateTimeSection: {
      display: 'flex',
      marginBottom: '10px',
      alignItems: 'center'
    },
    dateLabel: {
      display: 'flex',
      alignItems: 'center',
      marginRight: '16px',
      fontSize: '14px',
      color: 'rgba(255, 255, 255, 0.9)'
    },
    infoIcon: {
      fontSize: '16px',
      marginRight: '5px',
      color: 'rgba(255, 255, 255, 0.7)'
    },
    detailItem: {
      marginBottom: '8px',
      fontSize: '14px',
      color: 'rgba(255, 255, 255, 0.9)'
    },
    actionButton: {
      padding: '10px 16px',
      borderRadius: '6px',
      border: 'none',
      fontSize: '13px',
      fontWeight: 'bold',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: '8px',
      transition: 'all 0.2s ease',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    acceptButton: {
      backgroundColor: 'rgba(76, 175, 80, 0.15)',
      color: '#66bb6a',
      border: '1px solid rgba(76, 175, 80, 0.3)',
      '&:hover': {
        backgroundColor: 'rgba(76, 175, 80, 0.25)'
      }
    },
    rejectButton: {
      backgroundColor: 'rgba(244, 67, 54, 0.15)',
      color: '#ef5350',
      border: '1px solid rgba(244, 67, 54, 0.3)',
      '&:hover': {
        backgroundColor: 'rgba(244, 67, 54, 0.25)'
      }
    },
    completeButton: {
      backgroundColor: 'rgba(33, 150, 243, 0.15)',
      color: '#42a5f5',
      border: '1px solid rgba(33, 150, 243, 0.3)',
      '&:hover': {
        backgroundColor: 'rgba(33, 150, 243, 0.25)'
      }
    },
    loading: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      color: colors.textLight
    },
    spinner: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      border: `3px solid ${colors.divider}`,
      borderTopColor: colors.primary,
      animation: 'spin 1s linear infinite'
    }
  };

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

  // Get status badge style based on status
  const getStatusStyle = (status) => {
    const baseStyle = {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '6px 10px',
      borderRadius: '20px',
      fontSize: '13px',
      fontWeight: 'bold',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    };
    
    switch(status) {
      case 'Accepted':
        return { 
          ...baseStyle, 
          backgroundColor: 'rgba(76, 175, 80, 0.2)',
          color: '#66bb6a',
          border: '1px solid rgba(76, 175, 80, 0.3)'
        };
      case 'Pending':
        return { 
          ...baseStyle, 
          backgroundColor: 'rgba(255, 152, 0, 0.2)',
          color: '#ffa726',
          border: '1px solid rgba(255, 152, 0, 0.3)'
        };
      case 'Rejected':
        return { 
          ...baseStyle, 
          backgroundColor: 'rgba(244, 67, 54, 0.2)',
          color: '#ef5350',
          border: '1px solid rgba(244, 67, 54, 0.3)'
        };
      case 'Completed':
        return { 
          ...baseStyle, 
          backgroundColor: 'rgba(33, 150, 243, 0.2)',
          color: '#42a5f5',
          border: '1px solid rgba(33, 150, 243, 0.3)'
        };
      default:
        return baseStyle;
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
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {status !== 'Accepted' && (
          <button 
            style={{ ...styles.actionButton, ...styles.acceptButton }}
            onClick={() => updateAppointmentStatus(appointmentID, 'Accepted')}
            disabled={isLoading}
          >
            {isLoading ? <span>⏳</span> : '✓ Kabul Et'}
          </button>
        )}
        
        {status !== 'Rejected' && (
          <button 
            style={{ ...styles.actionButton, ...styles.rejectButton }}
            onClick={() => updateAppointmentStatus(appointmentID, 'Rejected')}
            disabled={isLoading}
          >
            {isLoading ? <span>⏳</span> : '✕ Reddet'}
          </button>
        )}
        
        {status !== 'Completed' && status === 'Accepted' && (
          <button 
            style={{ ...styles.actionButton, ...styles.completeButton }}
            onClick={() => updateAppointmentStatus(appointmentID, 'Completed')}
            disabled={isLoading}
          >
            {isLoading ? <span>⏳</span> : '✓ Tamamla'}
          </button>
        )}
      </div>
    );
  };
  
  // Render a single appointment card
  const renderAppointmentCard = (appointment) => {
    // Get card style based on status
    const cardStatusStyle = (() => {
      switch(appointment.status) {
        case 'Accepted': return styles.cardAccepted;
        case 'Pending': return styles.cardPending;
        case 'Rejected': return styles.cardRejected;
        case 'Completed': return styles.cardCompleted;
        default: return {};
      }
    })();

    return (
      <div 
        key={appointment.appointmentID} 
        style={{
          ...styles.appointmentCard,
          ...cardStatusStyle,
          ':hover': {
            transform: 'translateY(-3px)',
            boxShadow: '0 6px 16px rgba(0,0,0,0.2)'
          }
        }}
      >
        <div style={styles.cardLeft}>
          <div style={styles.appointmentID}># {appointment.appointmentID}</div>
          <div style={getStatusStyle(appointment.status)}>
            <span style={{ marginRight: '5px' }}>{getStatusIcon(appointment.status)}</span>
            {appointment.status}
          </div>
          {appointment.status === 'Pending' && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '12px',
              color: colors.warning,
              marginTop: '8px'
            }}>
              <span style={{ marginRight: '4px' }}>⚠️</span> Awaiting Approval
            </div>
          )}
        </div>
        
        <div style={styles.cardMid}>
          <div style={{ marginBottom: '12px' }}>
            <div style={styles.dateTimeSection}>
              <div style={styles.dateLabel}>
                <span style={styles.infoIcon}>📅</span> {formatDate(appointment.appointmentDateTime)}
              </div>
              <div style={styles.dateLabel}>
                <span style={styles.infoIcon}>⏰</span> {formatTime(appointment.appointmentDateTime)}
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={styles.detailItem}>
              <span style={styles.infoIcon}>👤</span>
              <span style={{ fontWeight: 'bold', marginRight: '5px' }}>Customer ID:</span>#
              {appointment.userID}
            </div>
            
            {appointment.note && (
              <div style={styles.detailItem}>
                <span style={styles.infoIcon}>📝</span>
                <span style={{ fontWeight: 'bold', marginRight: '5px' }}>Note:</span> 
                {appointment.note}
              </div>
            )}
            
            <div style={{ ...styles.detailItem, fontSize: '12px', color: colors.textLight }}>
              <span style={{ fontWeight: 'bold', marginRight: '5px' }}>Created:</span> 
              {formatDateTime(appointment.createdAt)}
            </div>
          </div>
        </div>
        
        <div style={styles.cardRight}>
          {renderActionButtons(appointment)}
        </div>
      </div>
    );
  };

  // Get and filter appointments by different criteria - updated to exclude pending appointments from other tabs
  const todayAppointments = appointments.filter(app => isToday(app.appointmentDateTime) && app.status !== 'Pending');
  const pendingAppointments = appointments.filter(app => app.status === 'Pending');
  const allNonPendingAppointments = appointments.filter(app => app.status !== 'Pending');
  const sortedAppointments = sortAppointmentsByDate(allNonPendingAppointments);
  
  // Tabs data for cleaner rendering
  const tabs = [
    { id: 'today', label: "Today's Appointments", count: todayAppointments.length, icon: '📅' },
    { id: 'pending', label: 'New Appointments (Accept or Decline)', count: pendingAppointments.length, icon: '⌛' },
    { id: 'all', label: 'All Appointments', count: sortedAppointments.length, icon: '📋' }
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.heading}>
          <span style={{ 
            fontSize: '24px', 
            marginRight: '10px',
            backgroundColor: 'rgba(63, 81, 181, 0.25)',
            padding: '6px',
            borderRadius: '8px',
            display: 'inline-flex'
          }}>
            📅
          </span>
          Appointments
        </h2>
      </div>

      {loading ? (
        <div style={styles.loading}>
          <div style={styles.spinner}></div>
          <p style={{ marginTop: '16px' }}>Randevular yükleniyor...</p>
        </div>
      ) : error ? (
        <div style={{ 
          padding: '16px', 
          color: colors.error, 
          backgroundColor: 'rgba(244, 67, 54, 0.2)',
          borderRadius: '4px' 
        }}>
          {error}
        </div>
      ) : (
        <div>
          {/* Tabs Navigation */}
          <div style={styles.tabsContainer}>
            {tabs.map(tab => (
              <button 
                key={tab.id}
                style={{
                  ...styles.tabButton,
                  ...(activeTab === tab.id ? styles.activeTab : {})
                }}
                onClick={() => setActiveTab(tab.id)}
              >
                <span style={{ marginRight: '5px' }}>{tab.icon}</span>
                {tab.label}
                <span style={{
                  ...styles.tabCount,
                  ...(activeTab === tab.id ? styles.activeTabCount : {})
                }}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
          
          {/* Tab Content */}
          <div style={styles.tabContent}>
            {/* Today's Appointments Tab */}
            {activeTab === 'today' && (
              <div>
                {todayAppointments.length === 0 ? (
                  <div style={styles.emptySection}>No appointments found for today</div>
                ) : (
                  todayAppointments.map(app => 
                    <div key={app.appointmentID}>
                      {renderAppointmentCard(app)}
                    </div>
                  )
                )}
              </div>
            )}
            
            {/* Pending Appointments Tab */}
            {activeTab === 'pending' && (
              <div>
                {pendingAppointments.length === 0 ? (
                  <div style={styles.emptySection}>No new appointments requiring approval</div>
                ) : (
                  pendingAppointments.map(app => 
                    <div key={app.appointmentID}>
                      {renderAppointmentCard(app)}
                    </div>
                  )
                )}
              </div>
            )}
            
            {/* All Appointments Tab */}
            {activeTab === 'all' && (
              <div>
                {sortedAppointments.length === 0 ? (
                  <div style={styles.emptySection}>No completed or accepted appointments found</div>
                ) : (
                  sortedAppointments.map(app => 
                    <div key={app.appointmentID}>
                      {renderAppointmentCard(app)}
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
