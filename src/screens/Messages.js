import React, { useState } from "react";

const Messages = () => {
  const [selectedMessage, setSelectedMessage] = useState(null);
  
  const messages = [
    {
      id: 1,
      customer: "Ahmet Yılmaz",
      preview: "Merhaba, siparişim hakkında bilgi alabilir miyim?",
      time: "10:30",
      date: "Bugün",
      unread: true,
      avatar: "AY"
    },
    {
      id: 2,
      customer: "Ayşe Demir",
      preview: "Teşekkürler, çok memnun kaldım hizmetinizden.",
      time: "09:15",
      date: "Bugün",
      unread: false,
      avatar: "AD"
    },
    {
      id: 3,
      customer: "Mehmet Kaya",
      preview: "İade işlemi nasıl yapabilirim?",
      time: "16:45",
      date: "Dün",
      unread: true,
      avatar: "MK"
    },
    {
      id: 4,
      customer: "Fatma Öztürk",
      preview: "Çok güzel ürünler, tekrar sipariş vereceğim.",
      time: "14:20",
      date: "Dün",
      unread: false,
      avatar: "FÖ"
    },
    {
      id: 5,
      customer: "Ali Şahin",
      preview: "Kargo ne zaman gelir acaba?",
      time: "11:30",
      date: "2 gün önce",
      unread: true,
      avatar: "AŞ"
    }
  ];

  const styles = {
    container: {
      backgroundColor: 'rgba(28, 32, 55, 0.95)',
      borderRadius: '12px',
      padding: '0',
      margin: '20px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
      overflow: 'hidden',
      minHeight: '600px'
    },
    header: {
      background: 'linear-gradient(135deg, #3f51b5 0%, #2196f3 100%)',
      color: 'white',
      padding: '24px 30px',
      borderBottom: 'none',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    title: {
      fontSize: '28px',
      fontWeight: '600',
      margin: '0',
      letterSpacing: '-0.5px'
    },
    badge: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      color: 'white',
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '14px',
      fontWeight: '500'
    },
    messagesList: {
      padding: '0',
      maxHeight: '500px',
      overflowY: 'auto'
    },
    messageItem: {
      backgroundColor: selectedMessage ? 'rgba(63, 81, 181, 0.1)' : 'transparent',
      padding: '20px 30px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },
    messageItemHover: {
      backgroundColor: 'rgba(63, 81, 181, 0.08)'
    },
    avatar: {
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      backgroundColor: '#3f51b5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: '600',
      fontSize: '16px',
      flexShrink: 0
    },
    messageContent: {
      flex: 1,
      minWidth: 0
    },
    customerName: {
      color: 'white',
      fontSize: '16px',
      fontWeight: '600',
      marginBottom: '4px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    preview: {
      color: 'rgba(255, 255, 255, 0.7)',
      fontSize: '14px',
      lineHeight: '1.4',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    },
    messageTime: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: '4px',
      flexShrink: 0
    },
    time: {
      fontSize: '12px',
      color: 'rgba(255, 255, 255, 0.5)'
    },
    date: {
      fontSize: '11px',
      color: 'rgba(255, 255, 255, 0.4)'
    },
    unreadBadge: {
      width: '8px',
      height: '8px',
      backgroundColor: '#4caf50',
      borderRadius: '50%',
      marginLeft: '8px'
    },
    searchContainer: {
      padding: '20px 30px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
    },
    searchInput: {
      width: '100%',
      padding: '12px 16px',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '8px',
      color: 'white',
      fontSize: '14px',
      outline: 'none',
      transition: 'all 0.3s ease'
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px 30px',
      color: 'rgba(255, 255, 255, 0.5)'
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Mesajlar</h1>
        <div style={styles.badge}>
          {messages.filter(m => m.unread).length} Okunmamış
        </div>
      </div>

      {/* Search */}
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Mesajlarda ara..."
          style={styles.searchInput}
          onFocus={(e) => {
            e.target.style.borderColor = '#3f51b5';
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
          }}
        />
      </div>

      {/* Messages List */}
      <div style={styles.messagesList}>
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              ...styles.messageItem,
              backgroundColor: selectedMessage === message.id 
                ? 'rgba(63, 81, 181, 0.1)' 
                : 'transparent'
            }}
            onClick={() => setSelectedMessage(message.id)}
            onMouseEnter={(e) => {
              if (selectedMessage !== message.id) {
                e.target.style.backgroundColor = 'rgba(63, 81, 181, 0.05)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedMessage !== message.id) {
                e.target.style.backgroundColor = 'transparent';
              }
            }}
          >
            <div style={styles.avatar}>
              {message.avatar}
            </div>
            
            <div style={styles.messageContent}>
              <div style={styles.customerName}>
                {message.customer}
                {message.unread && <div style={styles.unreadBadge}></div>}
              </div>
              <div style={styles.preview}>
                {message.preview}
              </div>
            </div>
            
            <div style={styles.messageTime}>
              <div style={styles.time}>{message.time}</div>
              <div style={styles.date}>{message.date}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State (if no messages) */}
      {messages.length === 0 && (
        <div style={styles.emptyState}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
          <div style={{ fontSize: '18px', marginBottom: '8px' }}>Henüz mesaj yok</div>
          <div style={{ fontSize: '14px' }}>Müşterilerden gelen mesajlar burada görünecek</div>
        </div>
      )}
    </div>
  );
};

export default Messages;
