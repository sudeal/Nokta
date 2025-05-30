import React, { useState, useEffect } from "react";

const Statistics = () => {
  const [businessData, setBusinessData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
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
        
        // Fetch business data
        const businessResponse = await fetch(`https://nokta-appservice.azurewebsites.net/api/Business/${businessId}`);
        if (!businessResponse.ok) {
          throw new Error(`Failed to fetch business data: ${businessResponse.status}`);
        }
        const businessData = await businessResponse.json();
        setBusinessData(businessData);

        // Fetch appointments data
        const appointmentsResponse = await fetch(`https://nokta-appservice.azurewebsites.net/api/Appointments/business/${businessId}`);
        if (!appointmentsResponse.ok) {
          throw new Error(`Failed to fetch appointments data: ${appointmentsResponse.status}`);
        }
        const appointmentsData = await appointmentsResponse.json();
        setAppointments(appointmentsData);

      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate statistics from appointments data
  const calculateStats = () => {
    if (!appointments || !Array.isArray(appointments)) return [];
    
    const totalAppointments = appointments.length;
    const completedAppointments = appointments.filter(app => app.status === "Completed").length;
    const cancelledAppointments = appointments.filter(app => app.status === "Cancelled").length;
    const pendingAppointments = appointments.filter(app => app.status === "Pending").length;

    return [
      { 
        label: 'Total Appointments', 
        value: totalAppointments,
        color: '#3f51b5' 
      },
      { 
        label: 'Completed', 
        value: completedAppointments,
        color: '#4caf50' 
      },
      { 
        label: 'Pending', 
        value: pendingAppointments,
        color: '#ff9800' 
      },
      { 
        label: 'Cancelled', 
        value: cancelledAppointments,
        color: '#f44336' 
      }
    ];
  };

  // Calculate appointments by day of week
  const calculateDailyStats = () => {
    if (!appointments || !Array.isArray(appointments)) return new Array(7).fill(0);

    const dayCount = new Array(7).fill(0);
    appointments.forEach(app => {
      const date = new Date(app.appointmentDateTime);
      const dayIndex = date.getDay();
      dayCount[dayIndex]++;
    });
    
    return dayCount;
  };

  // Calculate monthly statistics
  const calculateMonthlyStats = () => {
    if (!appointments || !Array.isArray(appointments)) return new Array(12).fill(0);

    const monthlyData = new Array(12).fill(0);
    appointments.forEach(app => {
      const date = new Date(app.appointmentDateTime);
      const month = date.getMonth();
      monthlyData[month]++;
    });
    
    return monthlyData;
  };

  // Calculate calendar heatmap data (last 12 weeks)
  const calculateCalendarData = () => {
    if (!appointments || !Array.isArray(appointments)) return [];

    // Get start and end dates
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 83); // 12 weeks * 7 days - 1 (to include today)
    
    // Create a map of appointment counts by date
    const appointmentsByDate = new Map();
    appointments.forEach(app => {
      const date = new Date(app.appointmentDateTime);
      if (date >= startDate && date <= endDate) {
        const dateStr = date.toISOString().split('T')[0];
        appointmentsByDate.set(dateStr, (appointmentsByDate.get(dateStr) || 0) + 1);
      }
    });

    // Generate calendar grid data
    const calendarData = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const currentDate = new Date(startDate);

    // Add empty cells for days before the start date
    const startDayOfWeek = startDate.getDay();
    for (let i = 0; i < startDayOfWeek; i++) {
      calendarData.push({ isEmpty: true });
    }

    // Fill in the actual dates
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      calendarData.push({
        date: new Date(currentDate),
        count: appointmentsByDate.get(dateStr) || 0,
        dayName: days[currentDate.getDay()],
        isEmpty: false
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Add empty cells to complete the grid
    const remainingCells = 7 - (calendarData.length % 7);
    if (remainingCells < 7) {
      for (let i = 0; i < remainingCells; i++) {
        calendarData.push({ isEmpty: true });
      }
    }

    return calendarData;
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
          Loading statistics...
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
          <span>⚠️</span> Error
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
          Try Again
        </button>
      </div>
    );
  }

  if (!businessData || !appointments) return null;

  const stats = calculateStats();
  const dailyStats = calculateDailyStats();
  const monthlyStats = calculateMonthlyStats();
  const calendarData = calculateCalendarData();
  const maxDailyAppointments = Math.max(...dailyStats, 1);
  const maxMonthlyAppointments = Math.max(...monthlyStats, 1);
  const maxCalendarValue = Math.max(...calendarData.map(d => d.count), 1);

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
          <span style={{ fontSize: '24px' }}>📊</span>
          Statistics Dashboard
        </h1>
        <p style={{
          margin: '8px 0 0 0',
          opacity: '0.9',
          fontSize: '16px'
        }}>
          {businessData.name}
        </p>
      </div>
      
      <div style={{
        padding: '30px'
      }}>
        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          {stats.map((stat, i) => (
            <div key={i} style={{
              backgroundColor: 'rgba(40, 44, 68, 0.8)',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
              border: `1px solid ${stat.color}15`,
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                backgroundColor: stat.color
              }}></div>
              <h3 style={{ 
                color: 'rgba(255, 255, 255, 0.8)', 
                marginBottom: '12px',
                fontSize: '14px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {stat.label}
              </h3>
              <div style={{ 
                fontSize: '32px', 
                fontWeight: 'bold',
                color: 'white'
              }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
          gap: '25px',
          marginTop: '25px'
        }}>
          {/* Daily Distribution Chart */}
          <div style={{
            backgroundColor: 'rgba(40, 44, 68, 0.8)',
            padding: '25px',
            borderRadius: '12px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
            height: 'fit-content'
          }}>
            <h3 style={{ 
              color: 'white', 
              marginBottom: '20px',
              fontSize: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ fontSize: '20px' }}>📅</span>
              Daily Distribution
            </h3>
            <div style={{
              height: '250px',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              padding: '0 20px'
            }}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                <div key={i} style={{ 
                  textAlign: 'center',
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <div style={{
                    width: '30px',
                    height: `${(dailyStats[i] / maxDailyAppointments) * 200}px`,
                    backgroundColor: i === new Date().getDay() ? '#3f51b5' : 'rgba(63, 81, 181, 0.4)',
                    borderRadius: '4px',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    minHeight: '20px'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '-25px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {dailyStats[i]}
                    </div>
                  </div>
                  <div style={{ 
                    color: i === new Date().getDay() ? 'white' : 'rgba(255, 255, 255, 0.6)',
                    fontSize: '13px',
                    fontWeight: i === new Date().getDay() ? '500' : '400'
                  }}>
                    {day}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Distribution Chart */}
          <div style={{
            backgroundColor: 'rgba(40, 44, 68, 0.8)',
            padding: '25px',
            borderRadius: '12px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
            height: 'fit-content'
          }}>
            <h3 style={{ 
              color: 'white', 
              marginBottom: '20px',
              fontSize: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ fontSize: '20px' }}>📊</span>
              Monthly Distribution
            </h3>
            <div style={{
              height: '250px',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              padding: '0 20px'
            }}>
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, i) => (
                <div key={i} style={{ 
                  textAlign: 'center',
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <div style={{
                    width: '30px',
                    height: `${(monthlyStats[i] / maxMonthlyAppointments) * 200}px`,
                    backgroundColor: i === new Date().getMonth() ? '#2196f3' : 'rgba(33, 150, 243, 0.4)',
                    borderRadius: '4px',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    minHeight: '20px'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '-25px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {monthlyStats[i]}
                    </div>
                  </div>
                  <div style={{ 
                    color: i === new Date().getMonth() ? 'white' : 'rgba(255, 255, 255, 0.6)',
                    fontSize: '13px',
                    fontWeight: i === new Date().getMonth() ? '500' : '400'
                  }}>
                    {month}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Calendar Heatmap */}
          <div style={{
            backgroundColor: 'rgba(40, 44, 68, 0.8)',
            padding: '25px',
            borderRadius: '12px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
            gridColumn: '1 / -1'
          }}>
            <h3 style={{ 
              color: 'white', 
              marginBottom: '20px',
              fontSize: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ fontSize: '20px' }}>📆</span>
              Appointment Activity (Last 12 Weeks)
            </h3>

            {/* Calendar header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '4px',
              marginBottom: '8px'
            }}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} style={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '12px',
                  textAlign: 'center',
                  padding: '4px'
                }}>
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '4px',
              padding: '4px 0 20px 0'
            }}>
              {calendarData.map((day, i) => (
                <div
                  key={i}
                  style={{
                    width: '100%',
                    paddingBottom: '100%',
                    backgroundColor: day.isEmpty 
                      ? 'transparent'
                      : day.count === 0 
                        ? 'rgba(255, 255, 255, 0.1)'
                        : `rgba(33, 150, 243, ${Math.min(0.2 + (day.count / maxCalendarValue * 0.8), 1)})`,
                    borderRadius: '4px',
                    position: 'relative',
                    cursor: day.isEmpty ? 'default' : 'pointer',
                    border: day.isEmpty ? 'none' : '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                  title={day.isEmpty ? '' : `${day.date.toLocaleDateString()}: ${day.count} appointments`}
                >
                  {!day.isEmpty && day.count > 0 && (
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      color: 'white',
                      fontSize: '11px',
                      fontWeight: '500'
                    }}>
                      {day.count}
                    </div>
                  )}
                  {!day.isEmpty && (
                    <div style={{
                      position: 'absolute',
                      top: '2px',
                      left: '2px',
                      color: 'rgba(255, 255, 255, 0.4)',
                      fontSize: '8px'
                    }}>
                      {day.date.getDate()}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '20px',
              marginTop: '10px',
              padding: '15px',
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ 
                  width: '12px', 
                  height: '12px', 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '2px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}></div>
                <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px' }}>No appointments</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ 
                  width: '12px', 
                  height: '12px', 
                  backgroundColor: 'rgba(33, 150, 243, 0.4)',
                  borderRadius: '2px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}></div>
                <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px' }}>1-2 appointments</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ 
                  width: '12px', 
                  height: '12px', 
                  backgroundColor: 'rgba(33, 150, 243, 1)',
                  borderRadius: '2px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}></div>
                <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px' }}>3+ appointments</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
