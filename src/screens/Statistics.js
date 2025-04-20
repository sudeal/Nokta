import React from "react";

const Statistics = () => {
  // Mock data for the statistics
  const stats = [
    { label: 'Total Appointments', value: 87, change: '+12%', color: '#3f51b5' },
    { label: 'Completed', value: 62, change: '+8%', color: '#4caf50' },
    { label: 'Cancelled', value: 14, change: '-5%', color: '#f44336' },
    { label: 'New Customers', value: 35, change: '+15%', color: '#ff9800' },
  ];

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
        Statistics Dashboard
      </h1>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {stats.map((stat, i) => (
          <div key={i} style={{
            backgroundColor: 'rgba(40, 44, 68, 0.7)',
            padding: '15px',
            borderRadius: '6px',
            borderBottom: `3px solid ${stat.color}`
          }}>
            <h3 style={{ 
              color: 'rgba(255, 255, 255, 0.8)', 
              marginBottom: '10px',
              fontSize: '14px'
            }}>
              {stat.label}
            </h3>
            <div style={{ 
              fontSize: '28px', 
              fontWeight: 'bold',
              color: 'white'
            }}>
              {stat.value}
            </div>
            <div style={{ 
              fontSize: '14px',
              color: stat.change.startsWith('+') ? '#4caf50' : '#f44336',
              marginTop: '5px'
            }}>
              {stat.change} from last month
            </div>
          </div>
        ))}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
        gap: '20px'
      }}>
        <div style={{
          backgroundColor: 'rgba(40, 44, 68, 0.7)',
          padding: '20px',
          borderRadius: '6px',
          height: '300px'
        }}>
          <h3 style={{ 
            color: 'white', 
            marginBottom: '15px'
          }}>
            Appointments by Day
          </h3>
          <div style={{
            height: '230px',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            padding: '0 20px'
          }}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  width: '30px',
                  height: `${Math.floor(Math.random() * 150) + 30}px`,
                  backgroundColor: '#3f51b5',
                  borderRadius: '3px'
                }}></div>
                <div style={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  marginTop: '8px',
                  fontSize: '12px'
                }}>
                  {day}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          backgroundColor: 'rgba(40, 44, 68, 0.7)',
          padding: '20px',
          borderRadius: '6px',
          height: '300px'
        }}>
          <h3 style={{ 
            color: 'white', 
            marginBottom: '15px'
          }}>
            Revenue Trend
          </h3>
          <div style={{
            height: '230px',
            position: 'relative',
            padding: '10px 0'
          }}>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '0',
              right: '0',
              height: '1px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }}></div>
            <svg width="100%" height="100%" viewBox="0 0 400 200" preserveAspectRatio="none">
              <path
                d={`M 0,${200 - Math.random() * 100} 
                   ${Array(10).fill().map((_, i) => 
                     `L ${i * 40},${200 - Math.random() * 150}`).join(' ')} 
                   L 400,${200 - Math.random() * 100}`}
                fill="none"
                stroke="#ff9800"
                strokeWidth="3"
              />
            </svg>
          </div>
        </div>
      </div>

      <div style={{ 
        marginTop: '20px', 
        textAlign: 'center',
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: '14px'
      }}>
        This is a placeholder for the Statistics page.
      </div>
    </div>
  );
};

export default Statistics;
