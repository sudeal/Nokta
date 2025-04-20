import React, { useState, useEffect } from "react";

const Appointments = () => {
  const [userId, setUserId] = useState(null);
  const [businessName, setBusinessName] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [activeTab, setActiveTab] = useState('today');
  const [showConfirmReject, setShowConfirmReject] = useState(false);
  const [appointmentToReject, setAppointmentToReject] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  
  // Calendar-related state
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateAppointments, setDateAppointments] = useState([]);
  const [dateLoading, setDateLoading] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [monthAppointments, setMonthAppointments] = useState([]);
  const [monthLoading, setMonthLoading] = useState(false);

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
      padding: '12px',
      alignItems: 'center'
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
    column: {
      padding: '0 12px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      position: 'relative',
      height: '100%'
    },
    columnDivider: {
      width: '1px',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      alignSelf: 'stretch',
      margin: '0 4px'
    },
    idColumn: {
      minWidth: '120px',
      padding: '0 12px 0 0',
    },
    dateColumn: {
      minWidth: '170px',
      padding: '0 12px',
    },
    customerColumn: {
      flex: 1,
      padding: '0 12px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    },
    customerDetails: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px'
    },
    customerIdSection: {
      display: 'flex',
      alignItems: 'center',
      minWidth: '180px'
    },
    noteSection: {
      flex: 1
    },
    appointmentID: {
      fontSize: '15px',
      fontWeight: 'bold',
      color: 'white',
      marginBottom: '10px',
      display: 'flex',
      alignItems: 'center'
    },
    idLabel: {
      fontSize: '12px',
      color: 'rgba(255, 255, 255, 0.6)',
      marginRight: '5px',
    },
    idNumber: {
      backgroundColor: 'rgba(63, 81, 181, 0.2)',
      padding: '2px 6px',
      borderRadius: '4px',
    },
    dateTimeItem: {
      display: 'flex',
      alignItems: 'center',
      fontSize: '14px',
      color: 'rgba(255, 255, 255, 0.9)',
      marginBottom: '6px'
    },
    dateIcon: {
      fontSize: '16px',
      marginRight: '8px',
      color: 'rgba(255, 255, 255, 0.7)',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      padding: '4px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '24px',
      height: '24px'
    },
    customerDetail: {
      display: 'flex',
      alignItems: 'center',
      fontSize: '14px',
      color: 'rgba(255, 255, 255, 0.9)',
      marginBottom: '8px'
    },
    noteText: {
      fontSize: '13px',
      color: 'rgba(255, 255, 255, 0.85)',
      backgroundColor: 'rgba(0, 0, 0, 0.15)',
      padding: '6px 8px',
      borderRadius: '4px',
      maxHeight: '60px',
      overflowY: 'auto',
      marginTop: '4px',
      lineHeight: '1.4'
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
    actionColumn: {
      minWidth: '130px',
      padding: '0 0 0 12px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      height: '100%',
      justifyContent: 'space-between'
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
      transition: 'all 0.2s ease',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      flex: 1,
      minHeight: 'calc(50% - 4px)', // 50% height minus half the gap
      margin: 0
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
    },
    // Add a pulsing animation to the tab button for new appointments
    pendingTabFlash: {
      animation: 'pulseNotification 2s infinite',
      position: 'relative',
      overflow: 'visible'
    },
    
    // Add a notification dot to indicate new appointments
    notificationDot: {
      position: 'absolute',
      top: '4px',
      right: '4px',
      width: '12px',
      height: '12px',
      backgroundColor: '#ff4081',
      borderRadius: '50%',
      boxShadow: '0 0 0 rgba(255, 64, 129, 0.4)',
      animation: 'pulse 1.5s infinite'
    },
    
    // Add a glow effect around the tab
    tabGlow: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: '4px',
      pointerEvents: 'none',
      animation: 'glowPulse 2s infinite alternate'
    },
    // Custom confirmation popup styles
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    },
    modalContent: {
      backgroundColor: 'rgba(45, 52, 84, 0.95)',
      padding: '24px',
      borderRadius: '12px',
      boxShadow: '0 5px 20px rgba(0, 0, 0, 0.3)',
      width: '90%',
      maxWidth: '450px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    modalTitle: {
      color: 'white',
      fontSize: '20px',
      fontWeight: 'bold',
      marginBottom: '16px',
      textAlign: 'center'
    },
    modalIcon: {
      fontSize: '48px',
      marginBottom: '16px',
      color: colors.warning
    },
    modalMessage: {
      color: 'rgba(255, 255, 255, 0.9)',
      marginBottom: '24px',
      textAlign: 'center',
      lineHeight: '1.5'
    },
    modalButtons: {
      display: 'flex',
      justifyContent: 'center',
      gap: '16px',
      width: '100%'
    },
    cancelButton: {
      padding: '10px 20px',
      borderRadius: '8px',
      border: 'none',
      backgroundColor: 'rgba(97, 97, 97, 0.2)',
      color: 'white',
      fontWeight: 'bold',
      cursor: 'pointer',
      minWidth: '120px',
      transition: 'all 0.2s ease'
    },
    confirmButton: {
      padding: '10px 20px',
      borderRadius: '8px',
      border: 'none',
      backgroundColor: 'rgba(244, 67, 54, 0.2)',
      color: '#ef5350',
      fontWeight: 'bold',
      cursor: 'pointer',
      minWidth: '120px',
      transition: 'all 0.2s ease',
      border: '1px solid rgba(244, 67, 54, 0.3)'
    },
    // Calendar styles
    calendarContainer: {
      backgroundColor: 'rgba(45, 52, 84, 0.85)',
      borderRadius: '8px',
      padding: '16px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      marginBottom: '24px',
      maxWidth: '100%',
      overflow: 'hidden'
    },
    calendarHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px',
      padding: '0 8px'
    },
    calendarMonthNav: {
      cursor: 'pointer',
      fontSize: '18px',
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      width: '36px',
      height: '36px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50%',
      transition: 'background-color 0.2s ease',
      border: 'none',
      color: 'white',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
    },
    calendarTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: 'white',
      padding: '6px 12px',
      backgroundColor: 'rgba(63, 81, 181, 0.25)',
      borderRadius: '20px'
    },
    calendarWeekDays: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      textAlign: 'center',
      color: 'rgba(255, 255, 255, 0.7)',
      fontWeight: 'bold',
      fontSize: '14px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      paddingBottom: '8px',
      marginBottom: '8px'
    },
    calendarWeekDay: {
      padding: '8px 0'
    },
    calendarGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '4px'
    },
    calendarDay: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '36px',
      cursor: 'pointer',
      borderRadius: '50%',
      color: 'white',
      fontSize: '14px',
      transition: 'background-color 0.2s ease, color 0.2s ease',
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.2)'
      }
    },
    calendarDayOutside: {
      color: 'rgba(255, 255, 255, 0.4)'
    },
    calendarDaySelected: {
      backgroundColor: '#3f51b5',
      color: 'white',
      fontWeight: 'bold',
      boxShadow: '0 0 0 2px rgba(255, 255, 255, 0.3)'
    },
    calendarDayToday: {
      border: '2px solid rgba(255, 255, 255, 0.7)',
      fontWeight: 'bold'
    },
    dateAppointmentsContainer: {
      marginTop: '16px',
      backgroundColor: 'rgba(40, 44, 68, 0.7)',
      borderRadius: '8px',
      padding: '16px'
    },
    dateAppointmentsHeader: {
      color: 'white',
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'center'
    },
    dateIcon: {
      backgroundColor: 'rgba(63, 81, 181, 0.2)',
      width: '32px',
      height: '32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50%',
      marginRight: '12px',
      fontSize: '16px'
    },
  };

  // Style for appointment indicator
  const appointmentIndicator = {
    position: 'absolute',
    bottom: '2px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '6px',
    height: '6px',
    backgroundColor: '#ff4081',
    borderRadius: '50%',
    boxShadow: '0 0 3px #ff4081'
  };

  // Initial load effect - only runs once
  useEffect(() => {
    // Check if there's user data in localStorage
    const userData = localStorage.getItem("userData");
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        const businessId = parsedData.businessID || parsedData.id;
        
        setUserId(businessId || "Kullanıcı ID bulunamadı");
        setBusinessName(parsedData.name || "İşletme adı bulunamadı");
        
        // If we have a business ID, fetch all appointments (just once)
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

  // Accept appointment using the dedicated endpoint
  const acceptAppointment = async (appointmentId) => {
    setActionLoading(appointmentId);
    
    try {
      // Get the business ID from localStorage
      const userData = localStorage.getItem("userData");
      if (!userData) {
        throw new Error("Kullanıcı bilgisi bulunamadı");
      }
      
      const parsedData = JSON.parse(userData);
      const businessId = parsedData.businessID || parsedData.id;
      
      if (!businessId) {
        throw new Error("İşletme ID bulunamadı");
      }
      
      // Call the dedicated endpoint to accept the appointment
      const response = await fetch(
        `https://nokta-appservice.azurewebsites.net/api/Business/${businessId}/appointments/${appointmentId}/accept`,
        {
          method: 'PUT',
          headers: {
            'accept': '*/*',
          }
        }
      );
      
      if (!response.ok) {
        throw new Error("Randevu kabul edilemedi");
      }
      
      // Update local state with the new appointment status
      setAppointments(appointments.map(app => 
        app.appointmentID === appointmentId ? { ...app, status: 'Accepted' } : app
      ));
      
      // Show success message
      alert("Randevu başarıyla kabul edildi");
      
    } catch (error) {
      console.error("Error accepting appointment:", error);
      alert("Randevu kabul edilemedi: " + error.message);
    } finally {
      setActionLoading(null);
    }
  };

  // Delete appointment
  const deleteAppointment = async (appointmentId) => {
    setActionLoading(appointmentId);
    
    try {
      // Call the delete endpoint
      const response = await fetch(
        `https://nokta-appservice.azurewebsites.net/api/Appointments/${appointmentId}`,
        {
          method: 'DELETE',
          headers: {
            'accept': '*/*',
          }
        }
      );
      
      if (!response.ok) {
        throw new Error("Randevu silinemedi");
      }
      
      // Remove the appointment from local state
      setAppointments(appointments.filter(app => app.appointmentID !== appointmentId));
      
      // Show success message
      alert("Randevu başarıyla silindi");
      
    } catch (error) {
      console.error("Error deleting appointment:", error);
      alert("Randevu silinemedi: " + error.message);
    } finally {
      setActionLoading(null);
    }
  };

  // Format date and time for display - changed to English locale
  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format date only - changed to English locale
  const formatDate = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format time only - changed to English locale
  const formatTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleTimeString('en-US', {
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

  // Check if a date is in the past (expired)
  const isExpired = (dateTimeStr) => {
    const appointmentDate = new Date(dateTimeStr);
    const now = new Date();
    return appointmentDate < now;
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
    const isOnPendingTab = activeTab === 'pending';
    const isOnTodayTab = activeTab === 'today';
    const isOnAllTab = activeTab === 'all';
    const isOnExpiredTab = activeTab === 'expired';
    
    // If on expired tab, show only remove button
    if (isOnExpiredTab) {
    return (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          height: '100%'
        }}>
          <button 
            style={{ 
              ...styles.actionButton, 
              backgroundColor: 'rgba(97, 97, 97, 0.15)',
              color: '#9e9e9e',
              border: '1px solid rgba(97, 97, 97, 0.3)',
              height: '100%'
            }}
            onClick={() => deleteAppointment(appointmentID)}
            disabled={isLoading}
          >
            {isLoading ? <span>⏳</span> : '🗑️ Remove'}
          </button>
        </div>
      );
    }
    
    // Don't show action buttons for completed appointments on non-today tabs
    if (status === 'Completed' && !isOnTodayTab) {
      return null;
    }

    // Determine which buttons to show
    const buttonsToShow = [];
    
    // Accept button
    if (status !== 'Accepted' && (!isOnTodayTab || (isOnTodayTab && status !== 'Rejected'))) {
      buttonsToShow.push({
        text: isLoading ? <span>⏳</span> : '✓ Accept',
        style: styles.acceptButton,
        onClick: () => status === 'Pending' ? acceptAppointment(appointmentID) : updateAppointmentStatus(appointmentID, 'Accepted'),
        key: 'accept'
      });
    }
    
    // Complete/Done button - only for Today tab, not for All tab
    if (status !== 'Completed' && status === 'Accepted' && !isOnAllTab) {
      buttonsToShow.push({
        text: isLoading ? <span>⏳</span> : isOnTodayTab ? '✓ Done' : '✓ Complete',
        style: styles.completeButton,
        onClick: () => updateAppointmentStatus(appointmentID, 'Completed'),
        key: 'complete'
      });
    }
    
    // Cancel/Reject button for non-accepted appointments
    if (status !== 'Rejected' && status !== 'Accepted' && (!isOnTodayTab || (isOnTodayTab && status !== 'Accepted'))) {
      buttonsToShow.push({
        text: isLoading ? <span>⏳</span> : (isOnTodayTab || isOnAllTab) ? '✕ Cancel' : '✕ Reject',
        style: styles.rejectButton,
        onClick: () => {
          if (status === 'Pending') {
            setAppointmentToReject({ id: appointmentID, appointment });
            setShowConfirmReject(true);
          } else {
            updateAppointmentStatus(appointmentID, 'Rejected');
          }
        },
        key: 'reject'
      });
    }
    
    // Cancel button for accepted appointments - now deletes the appointment
    if (status === 'Accepted') {
      buttonsToShow.push({
        text: isLoading ? <span>⏳</span> : '✕ Cancel',
        style: styles.rejectButton,
        onClick: () => {
          setAppointmentToDelete({ id: appointmentID, appointment });
          setShowConfirmDelete(true);
        },
        key: 'cancel'
      });
    }
    
    // Delete button for rejected appointments on pending tab
    if (status === 'Rejected' && isOnPendingTab) {
      buttonsToShow.push({
        text: isLoading ? <span>⏳</span> : '🗑️ Delete',
        style: { 
          backgroundColor: 'rgba(97, 97, 97, 0.15)',
          color: '#9e9e9e',
          border: '1px solid rgba(97, 97, 97, 0.3)'
        },
        onClick: () => deleteAppointment(appointmentID),
        key: 'delete-rejected'
      });
    }
    
    // Delete button for completed appointments on today tab
    if (status === 'Completed' && isOnTodayTab) {
      buttonsToShow.push({
        text: isLoading ? <span>⏳</span> : '🗑️ Delete',
        style: { 
          backgroundColor: 'rgba(97, 97, 97, 0.15)',
          color: '#9e9e9e',
          border: '1px solid rgba(97, 97, 97, 0.3)'
        },
        onClick: () => deleteAppointment(appointmentID),
        key: 'delete-completed'
      });
    }
    
    // Create a container with max 2 buttons, each taking 50% height
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        height: '100%',
        gap: '8px'
      }}>
        {buttonsToShow.slice(0, 2).map((button, index) => (
          <button 
            key={button.key}
            style={{ 
              ...styles.actionButton, 
              ...button.style,
              flex: buttonsToShow.length === 1 ? 1 : 0.5,
              height: buttonsToShow.length === 1 ? '100%' : '50%'
            }}
            onClick={button.onClick}
            disabled={isLoading}
          >
            {button.text}
          </button>
        ))}
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
        {/* Column 1: ID and Status */}
        <div style={styles.idColumn}>
          <div style={styles.appointmentID}>
            <span style={styles.idLabel}>ID</span>
            <span style={styles.idNumber}>#{appointment.appointmentID}</span>
          </div>
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
              marginTop: '8px',
              padding: '4px 8px',
              backgroundColor: 'rgba(255, 152, 0, 0.1)',
              borderRadius: '4px'
            }}>
              <span style={{ marginRight: '4px' }}>⚠️</span> Awaiting
            </div>
          )}
        </div>
        
        <div style={styles.columnDivider} />
        
        {/* Column 2: Date and Time */}
        <div style={styles.dateColumn}>
          <div style={styles.dateTimeItem}>
            <span style={styles.dateIcon}>📅</span>
            <span>{formatDate(appointment.appointmentDateTime)}</span>
            </div>
          <div style={styles.dateTimeItem}>
            <span style={styles.dateIcon}>⏰</span>
            <span>{formatTime(appointment.appointmentDateTime)}</span>
          </div>
        </div>
        
        <div style={styles.columnDivider} />
        
        {/* Column 3: Customer Information */}
        <div style={styles.customerColumn}>
          <div style={styles.customerDetails}>
            <div style={styles.customerIdSection}>
              <span style={{
                ...styles.infoIcon, 
                backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                padding: '4px', 
                borderRadius: '50%', 
                marginRight: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '24px',
                height: '24px'
              }}>👤</span>
              <div>
                <span style={{ fontWeight: 'bold', display: 'block', marginBottom: '3px' }}>Customer:</span>
                <span style={{ 
                  backgroundColor: 'rgba(63, 81, 181, 0.15)', 
                  padding: '2px 6px', 
                  borderRadius: '4px', 
                  display: 'inline-block'
                }}>
                  #{appointment.userID}
                </span>
              </div>
            </div>
            
            {appointment.note && (
              <div style={styles.noteSection}>
                <span style={{
                  ...styles.infoIcon, 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                  padding: '4px', 
                  borderRadius: '50%', 
                  marginRight: '8px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '24px',
                  height: '24px',
                  verticalAlign: 'middle'
                }}>📝</span>
                <span style={{ fontWeight: 'bold', display: 'inline-block', marginBottom: '3px', verticalAlign: 'middle' }}>Note:</span>
                <div style={styles.noteText}>
                  {appointment.note}
                </div>
              </div>
            )}
          </div>
          
          <div style={{ 
            fontSize: '11px', 
            color: colors.textLight, 
            marginTop: '8px', 
            textAlign: 'right' 
          }}>
            <span style={{ fontWeight: 'bold' }}>Created:</span> {formatDateTime(appointment.createdAt)}
          </div>
        </div>
        
        <div style={styles.columnDivider} />
        
        {/* Column 4: Action Buttons */}
        <div style={styles.actionColumn}>
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
  const expiredAppointments = appointments.filter(app => isExpired(app.appointmentDateTime) && app.status !== 'Completed');
  
  // Tabs data for cleaner rendering
  const tabs = [
    { id: 'today', label: "Today's Appointments", count: todayAppointments.length, icon: '📅' },
    { id: 'pending', label: 'New Appointments (Accept or Decline)', count: pendingAppointments.length, icon: '⌛' },
    { id: 'expired', label: 'Expired Appointments', count: expiredAppointments.length, icon: '⏱️' },
    { id: 'all', label: 'All Appointments', count: sortedAppointments.length, icon: '📋' }
  ];

  // Create a style tag for keyframe animations
  const renderAnimationStyles = () => {
    return (
      <style>
        {`
          @keyframes pulseNotification {
            0% {
              background-color: transparent;
            }
            50% {
              background-color: rgba(255, 64, 129, 0.25);
            }
            100% {
              background-color: transparent;
            }
          }
          
          @keyframes pulse {
            0% {
              transform: scale(0.95);
              box-shadow: 0 0 0 0 rgba(255, 64, 129, 0.7);
            }
            70% {
              transform: scale(1.1);
              box-shadow: 0 0 0 10px rgba(255, 64, 129, 0);
            }
            100% {
              transform: scale(0.95);
              box-shadow: 0 0 0 0 rgba(255, 64, 129, 0);
            }
          }
          
          @keyframes glowPulse {
            0% {
              box-shadow: 0 0 5px 0px rgba(255, 64, 129, 0.3);
            }
            100% {
              box-shadow: 0 0 15px 5px rgba(255, 64, 129, 0.5);
            }
          }
        `}
      </style>
    );
  };

  // Format date for API call (YYYY-MM-DD)
  const formatDateForApi = (date) => {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  };

  // Format date for display (Month DD, YYYY)
  const formatDateForDisplay = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
  };

  // Fetch appointments for a specific date
  const fetchAppointmentsByDate = async (businessId, dateString) => {
    if (!businessId) return;
    
    setDateLoading(true);
    try {
      const response = await fetch(
        `https://nokta-appservice.azurewebsites.net/api/Appointments/business/${businessId}/date/${dateString}`
      );
      
      if (!response.ok) {
        throw new Error("Appointments could not be loaded for this date");
      }
      
      const data = await response.json();
      setDateAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments by date:", error);
    } finally {
      setDateLoading(false);
    }
  };

  // Handle date change from calendar
  const handleDateChange = (date) => {
    setSelectedDate(date);
    
    const userData = localStorage.getItem("userData");
    if (userData) {
      const parsedData = JSON.parse(userData);
      const businessId = parsedData.businessID || parsedData.id;
      
      if (businessId) {
        // Reset the current appointments and set loading state
        setDateAppointments([]);
        fetchAppointmentsByDate(businessId, formatDateForApi(date));
      }
    }
    
    setCalendarOpen(false);
  };

  // Generate days of the week header
  const renderDaysOfWeek = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div style={styles.calendarWeekDays}>
        {days.map(day => (
          <div key={day} style={styles.calendarWeekDay}>{day}</div>
        ))}
      </div>
    );
  };

  // Fetch all appointments for the current month
  const fetchMonthAppointments = async (businessId, year, month) => {
    if (!businessId) return;
    
    setMonthLoading(true);
    try {
      // For simplicity, let's use the regular appointments endpoint and filter by date
      const response = await fetch(
        `https://nokta-appservice.azurewebsites.net/api/Appointments/business/${businessId}`
      );
      
      if (!response.ok) {
        throw new Error("Could not load month appointments");
      }
      
      const data = await response.json();
      
      // Filter to only include the current month
      const firstDay = new Date(year, month, 1).getTime();
      const lastDay = new Date(year, month + 1, 0, 23, 59, 59).getTime();
      
      const filteredData = data.filter(app => {
        const appDate = new Date(app.appointmentDateTime).getTime();
        return appDate >= firstDay && appDate <= lastDay;
      });
      
      setMonthAppointments(filteredData);
    } catch (error) {
      console.error("Error fetching month appointments:", error);
    } finally {
      setMonthLoading(false);
    }
  };
  
  // Check if a date has appointments
  const hasAppointmentsOnDate = (date) => {
    if (!monthAppointments || monthAppointments.length === 0) return false;
    
    const formattedDate = formatDateForApi(date);
    return monthAppointments.some(app => {
      const appDate = formatDateForApi(new Date(app.appointmentDateTime));
      return appDate === formattedDate;
    });
  };

  // Month navigation with improved appointment loading
  const navigateMonth = (direction) => {
    const date = new Date(selectedDate);
    if (direction === 'prev') {
      date.setMonth(date.getMonth() - 1);
    } else {
      date.setMonth(date.getMonth() + 1);
    }
    
    // Update the selected date - this will trigger the useEffect to reload data
    setSelectedDate(date);
    
    // Clear current date appointments to prevent showing old appointments
    setDateAppointments([]);
  };
  
  // Optimize the useEffect for selectedDate changes
  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        const businessId = parsedData.businessID || parsedData.id;
        
        if (businessId) {
          // Get the current month and year from selected date
          const currentDate = new Date(selectedDate);
          const year = currentDate.getFullYear();
          const month = currentDate.getMonth();
          
          // Fetch appointments for the selected date
          fetchAppointmentsByDate(businessId, formatDateForApi(selectedDate));
          
          // Fetch appointments for the current month
          fetchMonthAppointments(businessId, year, month);
        }
      } catch (error) {
        console.error("Error processing user data for appointment fetch:", error);
      }
    }
  }, [selectedDate]);

  // Update renderCalendarDays to add better appointment indicators
  const renderCalendarDays = () => {
    const date = new Date(selectedDate);
    const month = date.getMonth();
    const year = date.getFullYear();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Get day of the week of the first day (0-6, where 0 is Sunday)
    const firstDayIndex = firstDay.getDay();
    // Total days in month
    const daysInMonth = lastDay.getDate();
    
    // Previous month's last days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    
    // Days array to render
    const days = [];
    
    // Add previous month's days
    for (let i = firstDayIndex; i > 0; i--) {
      const prevDate = new Date(year, month - 1, prevMonthLastDay - i + 1);
      days.push({
        date: prevDate,
        current: false,
        selected: false,
        hasAppointment: hasAppointmentsOnDate(prevDate)
      });
    }
    
    // Add current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i);
      days.push({
        date: currentDate,
        current: true,
        selected: selectedDate && currentDate.getDate() === selectedDate.getDate() && 
                 currentDate.getMonth() === selectedDate.getMonth() && 
                 currentDate.getFullYear() === selectedDate.getFullYear(),
        hasAppointment: hasAppointmentsOnDate(currentDate),
        isToday: isToday(currentDate)
      });
    }
    
    // Add next month's days
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      const nextDate = new Date(year, month + 1, i);
      days.push({
        date: nextDate,
        current: false,
        selected: false,
        hasAppointment: hasAppointmentsOnDate(nextDate)
      });
    }
    
    return (
      <div style={styles.calendarGrid}>
        {days.map((day, index) => {
          // Determine day style based on state
          const isSelected = day.selected;
          const isCurrent = day.current;
          const isOutsideMonth = !day.current;
          const hasAppointment = day.hasAppointment;
          const isDayToday = day.isToday;
          
          return (
            <div 
              key={index} 
              style={{
                ...styles.calendarDay,
                ...(isOutsideMonth ? styles.calendarDayOutside : {}),
                ...(isSelected ? styles.calendarDaySelected : {}),
                ...(isDayToday ? styles.calendarDayToday : {}),
                position: 'relative',
                // Add a subtle background for days with appointments
                ...(hasAppointment && isCurrent && !isSelected ? {
                  backgroundColor: 'rgba(255, 64, 129, 0.15)'
                } : {})
              }}
              onClick={() => handleDateChange(day.date)}
            >
              {day.date.getDate()}
              {hasAppointment && !isSelected && (
                <div style={{
                  ...appointmentIndicator,
                  // Make it more visible when inside current month
                  ...(isCurrent ? {opacity: 1} : {opacity: 0.6})
                }}></div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Get current month and year for display
  const currentMonthYear = () => {
    const date = new Date(selectedDate);
    return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <div style={styles.container}>
      {renderAnimationStyles()}
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

      {/* Calendar Section */}
      <div style={styles.calendarContainer}>
        <div style={styles.calendarHeader}>
          <button 
            style={styles.calendarMonthNav} 
            onClick={() => navigateMonth('prev')}
            aria-label="Previous month"
          >
            &#10094;
          </button>
          <div style={styles.calendarTitle}>
            {currentMonthYear()}
          </div>
          <button 
            style={styles.calendarMonthNav} 
            onClick={() => navigateMonth('next')}
            aria-label="Next month"
          >
            &#10095;
          </button>
        </div>
        
        {renderDaysOfWeek()}
        {renderCalendarDays()}
        
        {dateAppointments.length > 0 && (
          <div style={styles.dateAppointmentsContainer}>
            <div style={styles.dateAppointmentsHeader}>
              <span style={styles.dateIcon}>📅</span>
              <span>Appointments for {formatDateForDisplay(selectedDate)}</span>
            </div>
            
            {dateLoading ? (
              <div style={styles.loading}>
                <div style={styles.spinner}></div>
                <p style={{ marginTop: '16px' }}>Loading appointments for selected date...</p>
              </div>
            ) : (
              <div>
                {dateAppointments.map(app => 
                  <div key={app.appointmentID}>
                    {renderAppointmentCard(app)}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        
        {dateAppointments.length === 0 && !dateLoading && (
          <div style={{ 
            textAlign: 'center', 
            padding: '16px',
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '14px',
            marginTop: '16px',
            backgroundColor: 'rgba(40, 44, 68, 0.5)',
            borderRadius: '8px',
            border: '1px dashed rgba(255, 255, 255, 0.1)'
          }}>
            <span style={{
              display: 'block',
              fontSize: '18px', 
              marginBottom: '4px',
              opacity: '0.8'
            }}>📆</span>
            No appointment found for {isToday(selectedDate) ? "today" : formatDateForDisplay(selectedDate)}
          </div>
        )}
      </div>

      {loading ? (
        <div style={styles.loading}>
          <div style={styles.spinner}></div>
          <p style={{ marginTop: '16px' }}>Loading appointments...</p>
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
                  ...(activeTab === tab.id ? styles.activeTab : {}),
                  ...(tab.id === 'pending' && pendingAppointments.length > 0 ? styles.pendingTabFlash : {})
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
                {tab.id === 'pending' && pendingAppointments.length > 0 && (
                  <>
                    <span style={styles.notificationDot}></span>
                    <span style={styles.tabGlow}></span>
                  </>
                )}
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
            
            {/* Expired Appointments Tab */}
            {activeTab === 'expired' && (
              <div>
                {expiredAppointments.length === 0 ? (
                  <div style={styles.emptySection}>No expired appointments found</div>
                ) : (
                  expiredAppointments.map(app => 
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
      
      {/* Confirmation Popup for Rejecting Appointments */}
      {showConfirmReject && appointmentToReject && (
        <div style={styles.modalOverlay} onClick={() => setShowConfirmReject(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalIcon}>⚠️</div>
            <h3 style={styles.modalTitle}>Reject Appointment</h3>
            <p style={styles.modalMessage}>
              Are you sure you want to reject appointment #{appointmentToReject.id}? 
              <br />
              This action cannot be undone.
            </p>
            <div style={styles.modalButtons}>
              <button 
                style={styles.cancelButton} 
                onClick={() => setShowConfirmReject(false)}
              >
                Cancel
              </button>
              <button 
                style={styles.confirmButton} 
                onClick={() => {
                  updateAppointmentStatus(appointmentToReject.id, 'Rejected');
                  setShowConfirmReject(false);
                  setAppointmentToReject(null);
                }}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Confirmation Popup for Deleting Appointments */}
      {showConfirmDelete && appointmentToDelete && (
        <div style={styles.modalOverlay} onClick={() => setShowConfirmDelete(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalIcon}>⚠️</div>
            <h3 style={styles.modalTitle}>Cancel Appointment</h3>
            <p style={styles.modalMessage}>
              Are you sure you want to cancel appointment #{appointmentToDelete.id}?
              <br />
              This will delete the appointment and cannot be undone.
            </p>
            <div style={styles.modalButtons}>
              <button 
                style={styles.cancelButton} 
                onClick={() => setShowConfirmDelete(false)}
              >
                Keep
              </button>
              <button 
                style={styles.confirmButton} 
                onClick={() => {
                  deleteAppointment(appointmentToDelete.id);
                  setShowConfirmDelete(false);
                  setAppointmentToDelete(null);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
