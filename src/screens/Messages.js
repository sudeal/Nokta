import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "../contexts/LanguageContext";

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
        setMessages(data.messages || []);
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
        .then(data => setMessages(data.messages || []));
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

  // Otomatik scroll-to-bottom
  const messagesEndRef = useRef(null);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  // UI
  return (
    <div style={{ display: 'flex', height: '80vh', background: '#23284a', borderRadius: 12, overflow: 'hidden' }}>
      {/* Sol: Userlardan gelen son mesajlar */}
      <div style={{ width: 320, background: '#1c2037', borderRight: '1px solid #2d3257', overflowY: 'auto' }}>
        <div style={{ padding: 24, borderBottom: '1px solid #2d3257', color: 'white', fontWeight: 600, fontSize: 22 }}>{translations.messages.title}</div>
        {loading && <div style={{ color: 'white', padding: 24 }}>{translations.messages.loading}</div>}
        {conversations.length === 0 && !loading && <div style={{ color: '#aaa', padding: 24 }}>{translations.messages.noMessages}</div>}
        {conversations.map(conv => (
          <div key={conv.userID} onClick={() => setSelectedUser(conv.userID)}
            style={{
              padding: 18,
              cursor: 'pointer',
              background: selectedUser === conv.userID ? '#2d3257' : 'transparent',
              borderBottom: '1px solid #23284a',
              color: 'white',
              fontWeight: 500
            }}>
            <div style={{ fontSize: 16 }}>{conv.userName}</div>
            <div style={{ fontSize: 13, color: '#aaa', marginTop: 4 }}>{conv.content}</div>
            <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{conv.date && new Date(conv.date).toLocaleString()}</div>
          </div>
        ))}
      </div>
      {/* Sağ: Seçili user ile mesaj geçmişi ve cevap yazma alanı */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#23284a' }}>
        {selectedUser ? (
          <>
            <div style={{ padding: 18, borderBottom: '1px solid #2d3257', color: 'white', fontWeight: 600, fontSize: 18 }}>
              {conversations.find(c => c.userID === selectedUser)?.userName || translations.messages.user} {translations.messages.conversationWith}
            </div>
            {/* Mesaj geçmişi - sadece kaydırılabilir, ekstra buton yok */}
            <div ref={messagesEndRef} style={{
              overflowY: 'auto',
              height: 400,
              minHeight: 200,
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              justifyContent: 'flex-end',
              maxWidth: 600,
              margin: '0 auto',
              background: 'transparent'
            }}>
              {loading ? <div style={{ color: 'white' }}>{translations.messages.loading}</div> :
                messages.length === 0 ? <div style={{ color: '#aaa' }}>{translations.messages.noMessages}</div> :
                  messages.map(msg => {
                    const isUser = msg.userID === selectedUser;
                    const isBusiness = msg.businessID === businessID && !isUser;
                    return (
                      <div key={msg.messageID} style={{
                        display: 'flex',
                        flexDirection: isBusiness ? 'row-reverse' : 'row',
                        alignItems: 'flex-end',
                        marginBottom: 2
                      }}>
                        <div style={{
                          background: isBusiness ? '#3f51b5' : '#2d3257',
                          color: 'white',
                          padding: '12px 18px',
                          borderRadius: isBusiness ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                          maxWidth: '70%',
                          minWidth: 60,
                          fontSize: 15,
                          marginLeft: isBusiness ? 40 : 0,
                          marginRight: isBusiness ? 0 : 40,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                          wordBreak: 'break-word',
                          marginTop: 2
                        }}>
                          {msg.content}
                          <div style={{ fontSize: 11, color: '#bbb', marginTop: 6, textAlign: isBusiness ? 'right' : 'left' }}>{new Date(msg.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                      </div>
                    );
                  })}
            </div>
            {/* Mesaj yazma alanı - ortalanmış ve modern */}
            <div style={{ borderTop: '1px solid #2d3257', background: '#23284a', padding: 24, display: 'flex', justifyContent: 'center' }}>
              <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, width: '100%', maxWidth: 500 }}>
                <textarea
                  value={messageInput}
                  onChange={e => setMessageInput(e.target.value)}
                  placeholder={translations.messages.messagePlaceholder}
                  rows={3}
                  style={{
                    width: '100%',
                    borderRadius: 10,
                    border: '1px solid #bbb',
                    padding: 12,
                    fontSize: 15,
                    resize: 'vertical',
                    background: '#fff',
                    color: '#23284a',
                    minHeight: 60,
                    maxHeight: 120,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                  }}
                  disabled={sending}
                  required
                />
                <button
                  type="submit"
                  disabled={sending || !messageInput.trim()}
                  style={{
                    marginTop: 0,
                    padding: '8px 28px',
                    borderRadius: 18,
                    background: 'linear-gradient(90deg, #4776E6 0%, #8E54E9 100%)',
                    color: 'white',
                    border: 'none',
                    fontWeight: 600,
                    fontSize: 15,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(71, 118, 230, 0.15)',
                    alignSelf: 'center',
                    minWidth: 90
                  }}
                >
                  {translations.messages.send}
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
