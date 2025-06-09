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