import AsyncStorage from '@react-native-async-storage/async-storage';

export const getUserProfile = async (userId) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    console.log('Fetching profile for user ID:', userId);
    
    const response = await fetch(`https://nokta-appservice.azurewebsites.net/api/Users/${userId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`Failed to fetch user profile: ${response.status} - ${errorText}`);
    }

    const userData = await response.json();
    console.log('Received user data:', userData);
    return userData;
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const storedUserData = await AsyncStorage.getItem('userData');
    if (!storedUserData) {
      return null;
    }

    const parsedUserData = JSON.parse(storedUserData);
    return parsedUserData;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}; 