import React from "react";

const Messages = () => {
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
        Messages
      </h1>
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
      }}>
        {Array(5).fill().map((_, i) => (
          <div key={i} style={{
            backgroundColor: 'rgba(40, 44, 68, 0.7)',
            padding: '15px',
            borderRadius: '6px',
            borderLeft: '4px solid #3f51b5',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <div>
              <h3 style={{ 
                color: 'white', 
                marginBottom: '5px', 
                fontSize: '16px' 
              }}>
                Customer #{i + 101}
              </h3>
              <p style={{ 
                color: 'rgba(255, 255, 255, 0.7)', 
                fontSize: '14px' 
              }}>
                This is a message preview. Click to view full conversation.
              </p>
            </div>
            <div style={{
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.5)'
            }}>
              {new Date().toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

      <div style={{ 
        marginTop: '20px', 
        textAlign: 'center',
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: '14px'
      }}>
        This is a placeholder for the Messages page.
      </div>
    </div>
  );
};

export default Messages;
