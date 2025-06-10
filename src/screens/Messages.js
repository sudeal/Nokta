import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "../contexts/LanguageContext";

// Türkiye saatine göre formatla
const formatTurkishTime = (dateString) => {
  const date = new Date(dateString);
  const offset = date.getTimezoneOffset() * 60000; // Offset in milliseconds
  const turkishTime = new Date(date.getTime() + offset + 3 * 3600000); // Add 3 hours for Turkey
  return turkishTime.toLocaleTimeString('tr-TR', { 
    hour: '2-digit', 
    minute: '2-digit',
    timeZone: 'Europe/Istanbul'
  });
};

const formatTurkishDateTime = (dateString) => {
  const date = new Date(dateString);
  const offset = date.getTimezoneOffset() * 60000; // Offset in milliseconds
  const turkishTime = new Date(date.getTime() + offset + 3 * 3600000); // Add 3 hours for Turkey
  return turkishTime.toLocaleString('tr-TR', {
    timeZone: 'Europe/Istanbul',
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const Messages = () => {
  const { translations } = useLanguage();
  const [allMessages, setAllMessages] = useState([]); // Tüm mesajlar (business endpointinden)
  const [conversations, setConversations] = useState([]); // Her user için son mesaj
  const [selectedUser, setSelectedUser] = useState(null); // Seçili userID
  const [messages, setMessages] = useState([]); // Seçili user ile tüm mesajlar
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [replyToMessageID, setReplyToMessageID] = useState(null);
  const [replyInput, setReplyInput] = useState("");

  // Aktif businessID'yi localStorage'dan al
  const userData = JSON.parse(localStorage.getItem("userData"));
  const businessID = userData?.businessID || userData?.id;

  // 1. Tüm mesajları çek (her userdan gelenler dahil)
  useEffect(() => {
    if (!businessID) return;
    setLoading(true);
    fetch(`https://nokta-appservice.azurewebsites.net/api/Messages/business/${businessID}`)
      .then(res => res.json())
      .then(data => {
        setAllMessages(data);
        // Her user için en güncel mesajı bul
        const latestByUser = {};
        data.forEach(msg => {
          if (!latestByUser[msg.userID] || new Date(msg.date) > new Date(latestByUser[msg.userID].date)) {
            latestByUser[msg.userID] = msg;
          }
        });
        // Tarihe göre azalan sırala
        const convArr = Object.values(latestByUser).sort((a, b) => new Date(b.date) - new Date(a.date));
        setConversations(convArr);
        setLoading(false);
      })
      .catch(err => {
        setError("Gelen mesajlar yüklenemedi.");
        setLoading(false);
      });
  }, [businessID]);

  // 2. Bir user seçilince, o user ile olan tüm mesajları çek
  useEffect(() => {
    if (!selectedUser || !businessID) return;
    setLoading(true);
    fetch(`https://nokta-appservice.azurewebsites.net/api/Messages/conversation/${selectedUser}/${businessID}`)
      .then(res => res.json())
      .then(data => {
        // Mesajları tarihe göre artan şekilde sırala (eski mesajlar üstte, yeni mesajlar altta)
        const sortedMessages = (data.messages || []).sort((a, b) => new Date(a.date) - new Date(b.date));
        setMessages(sortedMessages);
        setLoading(false);
      })
      .catch(err => {
        setError(translations.messages.messagesLoadFailed);
        setLoading(false);
      });
  }, [selectedUser, businessID]);

  // 3. Mesaj gönder
  const handleSend = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedUser) return;
    setSending(true);
    try {
      const res = await fetch("https://nokta-appservice.azurewebsites.net/api/Messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userID: selectedUser,
          businessID,
          content: messageInput.trim(),
        })
      });
      const result = await res.json();
      if (!res.ok) {
        alert(translations.messages.messageSendFailed + ' ' + (result?.message || res.status));
        throw new Error(translations.messages.messageSendFailed);
      }
      setMessageInput("");
      // Mesajı tekrar çek
      fetch(`https://nokta-appservice.azurewebsites.net/api/Messages/conversation/${selectedUser}/${businessID}`)
        .then(res => res.json())
        .then(data => {
          // Mesajları tarihe göre artan şekilde sırala (eski mesajlar üstte, yeni mesajlar altta)
          const sortedMessages = (data.messages || []).sort((a, b) => new Date(a.date) - new Date(b.date));
          setMessages(sortedMessages);
        });
    } catch (err) {
      alert(translations.messages.messageSendFailed + ' ' + err.message);
      setError(translations.messages.messageSendFailed);
    } finally {
      setSending(false);
    }
  };

  // 4. Mesaj sil (sadece business'ın kendi mesajları için)
  const handleDelete = async (messageID) => {
    if (!window.confirm(translations.messages.messageDeleteConfirm)) return;
    try {
      const res = await fetch(`https://nokta-appservice.azurewebsites.net/api/Messages/${messageID}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error(translations.messages.messageDeleteFailed);
      setMessages(prev => prev.filter(m => m.messageID !== messageID));
    } catch (err) {
      setError(translations.messages.messageDeleteFailed);
    }
  };

  // Otomatik scroll-to-bottom (yeni mesajlar altta olduğu için)
  const messagesEndRef = useRef(null);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  // UI
  return (
    <div style={{ 
      display: 'flex', 
      height: '85vh', 
      background: '#23284a', 
      borderRadius: 16, 
      overflow: 'hidden',
      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
      border: '1px solid rgba(255,255,255,0.05)'
    }}>
      {/* Sol: Userlardan gelen son mesajlar */}
      <div style={{ 
        width: 320, 
        background: 'linear-gradient(180deg, #1c2037 0%, #181b33 100%)', 
        borderRight: '1px solid #2d3257', 
        overflowY: 'auto',
        scrollbarWidth: 'thin',
        scrollbarColor: '#3a4063 transparent'
      }}>
        <div style={{ 
          padding: 24, 
          borderBottom: '2px solid #2d3257', 
          color: 'white', 
          fontWeight: 700, 
          fontSize: 20,
          background: 'rgba(45, 50, 87, 0.3)',
          backdropFilter: 'blur(10px)'
        }}>{translations.messages.title}</div>
        {loading && <div style={{ color: 'white', padding: 24 }}>{translations.messages.loading}</div>}
        {conversations.length === 0 && !loading && <div style={{ color: '#aaa', padding: 24 }}>{translations.messages.noMessages}</div>}
        {conversations.map(conv => (
          <div key={conv.userID} onClick={() => setSelectedUser(conv.userID)}
            style={{
              padding: 18,
              cursor: 'pointer',
              background: selectedUser === conv.userID ? 
                'linear-gradient(90deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)' : 
                'transparent',
              borderBottom: '1px solid rgba(35, 40, 74, 0.5)',
              color: 'white',
              fontWeight: 500,
              transition: 'all 0.2s ease',
              borderLeft: selectedUser === conv.userID ? '4px solid #667eea' : '4px solid transparent'
            }}
            onMouseEnter={(e) => {
              if (selectedUser !== conv.userID) {
                e.target.style.background = 'rgba(45, 50, 87, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedUser !== conv.userID) {
                e.target.style.background = 'transparent';
              }
            }}>
            <div style={{ fontSize: 16 }}>{conv.userName}</div>
            <div style={{ fontSize: 13, color: '#aaa', marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{conv.content}</div>
            <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{conv.date && formatTurkishDateTime(conv.date)}</div>
          </div>
        ))}
      </div>
      {/* Sağ: Seçili user ile mesaj geçmişi ve cevap yazma alanı */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#23284a' }}>
        {selectedUser ? (
          <>
            <div style={{ 
              padding: '20px 24px', 
              borderBottom: '2px solid #2d3257', 
              color: 'white', 
              fontWeight: 700, 
              fontSize: 18,
              background: 'rgba(45, 50, 87, 0.3)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              gap: 12
            }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: 16,
                fontWeight: 700,
                flexShrink: 0
              }}>
                {(conversations.find(c => c.userID === selectedUser)?.userName || 'M').charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>
                  {conversations.find(c => c.userID === selectedUser)?.userName || translations.messages.user}
                </div>
                <div style={{ fontSize: 12, color: '#aaa', fontWeight: 400 }}>
                  {translations.messages.conversationWith}
                </div>
              </div>
            </div>
            {/* Mesaj geçmişi - geliştirilmiş tasarım */}
            <div ref={messagesEndRef} style={{
              overflowY: 'auto',
              flex: 1,
              padding: '16px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              background: 'linear-gradient(180deg, #23284a 0%, #1e2142 100%)',
              scrollBehavior: 'smooth'
            }}>
              {loading ? (
                <div style={{ 
                  color: 'white', 
                  textAlign: 'center', 
                  padding: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10
                }}>
                  <div style={{
                    width: 20,
                    height: 20,
                    border: '2px solid #ffffff30',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  {translations.messages.loading}
                </div>
              ) : messages.length === 0 ? (
                <div style={{ 
                  color: '#aaa', 
                  textAlign: 'center', 
                  padding: 40,
                  fontSize: 16
                }}>{translations.messages.noMessages}</div>
              ) : 
                messages.map((msg, index) => {
                  const isFromBusiness = msg.businessID === businessID;
                  const isFromUser = msg.userID === selectedUser;
                  
                  // Tarih değişikliği kontrolü
                  const showDate = index === 0 || 
                    new Date(msg.date).toDateString() !== new Date(messages[index - 1].date).toDateString();
                  
                  return (
                    <React.Fragment key={msg.messageID}>
                      {/* Tarih ayırıcısı */}
                      {showDate && (
                        <div style={{
                          textAlign: 'center',
                          margin: '20px 0 10px 0',
                          color: '#888',
                          fontSize: 12,
                          fontWeight: 500
                        }}>
                          {new Date(msg.date).toLocaleDateString('tr-TR', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            timeZone: 'Europe/Istanbul'
                          })}
                        </div>
                      )}
                      
                      {/* Mesaj balonu */}
                      <div style={{
                        display: 'flex',
                        flexDirection: msg.businessID === businessID ? 'row-reverse' : 'row',
                        alignItems: 'flex-end',
                        marginBottom: 8,
                        gap: 8
                      }}>
                        {/* Avatar */}
                        <div style={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          background: msg.businessID === businessID ? 
                            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 
                            'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: 12,
                          fontWeight: 600,
                          flexShrink: 0
                        }}>
                          {msg.businessID === businessID ? 'İ' : 'M'}
                        </div>
                        
                        {/* Mesaj içeriği */}
                        <div style={{
                          maxWidth: '65%',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 4
                        }}>
                          <div style={{
                            background: msg.businessID === businessID ? 
                              'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 
                              '#2a2f54',
                            color: 'white',
                            padding: '12px 16px',
                            borderRadius: msg.businessID === businessID ? 
                              '20px 20px 6px 20px' : 
                              '20px 20px 20px 6px',
                            fontSize: 14,
                            lineHeight: 1.4,
                            wordBreak: 'break-word',
                            boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
                            position: 'relative'
                          }}>
                            {msg.content}
                          </div>
                          
                          {/* Saat bilgisi */}
                          <div style={{ 
                            fontSize: 11, 
                            color: '#888', 
                            textAlign: msg.businessID === businessID ? 'right' : 'left',
                            paddingLeft: msg.businessID === businessID ? 0 : 8,
                            paddingRight: msg.businessID === businessID ? 8 : 0
                          }}>
                            {formatTurkishTime(msg.date)}
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
            </div>
            {/* Mesaj yazma alanı - daha iyi hizalanmış */}
            <div style={{ 
              borderTop: '1px solid #2d3257', 
              background: '#1e2142', 
              padding: '10px 16px',
              boxShadow: '0 -2px 8px rgba(0,0,0,0.08)',
              display: 'flex',
              justifyContent: 'center'
            }}>
              <form onSubmit={handleSend} style={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: 8, 
                width: '100%',
                maxWidth: 600
              }}>
                <div style={{ 
                  flex: 1,
                  position: 'relative'
                }}>
                  <input
                    type="text"
                    value={messageInput}
                    onChange={e => setMessageInput(e.target.value)}
                    placeholder={translations.messages.messagePlaceholder}
                    style={{
                      width: '100%',
                      borderRadius: 20,
                      border: '1px solid #3a4063',
                      padding: '10px 16px',
                      fontSize: 14,
                      background: '#ffffff',
                      color: '#2d3257',
                      height: 40,
                      boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                      outline: 'none',
                      fontFamily: 'inherit',
                      transition: 'all 0.2s ease'
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSend(e);
                      }
                    }}
                    disabled={sending}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending || !messageInput.trim()}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: messageInput.trim() ? 
                      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 
                      '#5a6085',
                    color: 'white',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: messageInput.trim() ? 'pointer' : 'not-allowed',
                    boxShadow: messageInput.trim() ? 
                      '0 2px 8px rgba(102, 126, 234, 0.25)' : 
                      'none',
                    fontSize: 14,
                    transition: 'all 0.2s ease',
                    flexShrink: 0
                  }}
                >
                  {sending ? '⏳' : '➤'}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div style={{ color: '#aaa', padding: 48, textAlign: 'center', fontSize: 18 }}>
            {translations.messages.selectUser}
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
