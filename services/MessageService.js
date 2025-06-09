const BASE_URL = 'https://nokta-appservice.azurewebsites.net/api';

export const sendMessage = async (userID, businessID, content) => {
  try {
    if (!userID || !businessID || !content) {
      throw new Error('UserID, BusinessID, and content are required');
    }

    console.log('Sending message:', { userID, businessID, content });
    
    const response = await fetch(`${BASE_URL}/Messages`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userID: userID,
        businessID: businessID,
        content: content
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Message Send Error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`Failed to send message: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Message sent successfully:', result);
    return result;
  } catch (error) {
    console.error('Error in sendMessage:', error);
    throw error;
  }
};

export const getMessages = async (userID) => {
  try {
    if (!userID) {
      throw new Error('User ID is required');
    }

    console.log('Fetching messages for user ID:', userID);
    
    const response = await fetch(`${BASE_URL}/Messages/user/${userID}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Get Messages Error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`Failed to fetch messages: ${response.status} - ${errorText}`);
    }

    const messages = await response.json();
    console.log('Received messages:', messages);
    return messages;
  } catch (error) {
    console.error('Error in getMessages:', error);
    throw error;
  }
};

export const getConversationList = async (userID) => {
  try {
    if (!userID) {
      throw new Error('User ID is required');
    }

    console.log('Fetching conversation list for user ID:', userID);
    
    const response = await fetch(`${BASE_URL}/Messages/user/${userID}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Get Conversation List Error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`Failed to fetch conversation list: ${response.status} - ${errorText}`);
    }

    const messages = await response.json();
    console.log('Received messages for conversation list:', messages);
    
    // Group messages by business
    const businessMap = new Map();
    
    messages.forEach(message => {
      const businessKey = `${message.businessID}`;
      
      if (!businessMap.has(businessKey)) {
        businessMap.set(businessKey, {
          id: businessKey,
          businessID: message.businessID,
          businessName: message.businessName,
          businessImage: null,
          lastMessage: message.content,
          timestamp: formatMessageDate(message.date),
          unread: false, // API doesn't provide unread status yet
          lastMessageDate: new Date(message.date)
        });
      } else {
        // Update if this message is newer
        const existing = businessMap.get(businessKey);
        const messageDate = new Date(message.date);
        
        if (messageDate > existing.lastMessageDate) {
          existing.lastMessage = message.content;
          existing.timestamp = formatMessageDate(message.date);
          existing.lastMessageDate = messageDate;
        }
      }
    });
    
    // Convert map to array and sort by last message date (newest first)
    const conversations = Array.from(businessMap.values())
      .sort((a, b) => b.lastMessageDate - a.lastMessageDate);
    
    console.log('Grouped conversations:', conversations);
    return conversations;
  } catch (error) {
    console.error('Error in getConversationList:', error);
    throw error;
  }
};

const formatMessageDate = (dateString) => {
  const messageDate = new Date(dateString);
  const now = new Date();
  const diff = now - messageDate;
  
  // Less than 1 day ago - show time
  if (diff < 24 * 60 * 60 * 1000) {
    return messageDate.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  }
  
  // Less than 7 days ago - show day
  if (diff < 7 * 24 * 60 * 60 * 1000) {
    const daysDiff = Math.floor(diff / (24 * 60 * 60 * 1000));
    if (daysDiff === 1) return 'Yesterday';
    return `${daysDiff} days ago`;
  }
  
  // More than 7 days ago - show date
  return messageDate.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
};

export const getConversation = async (userID, businessID) => {
  try {
    if (!userID || !businessID) {
      throw new Error('UserID and BusinessID are required');
    }

    console.log('Fetching conversation:', { userID, businessID });
    
    const response = await fetch(`${BASE_URL}/Messages/conversation/${userID}/${businessID}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Get Conversation Error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`Failed to fetch conversation: ${response.status} - ${errorText}`);
    }

    const conversation = await response.json();
    console.log('Received conversation:', conversation);
    return conversation;
  } catch (error) {
    console.error('Error in getConversation:', error);
    throw error;
  }
}; 