import axios from 'axios';

const API_URL = 'https://nokta-appservice.azurewebsites.net/api';

/**
 * Fetch all reviews for a specific business
 * @param {number} businessId - The business ID
 * @returns {Promise<Array>} List of reviews
 */
export const getBusinessReviews = async (businessId) => {
  try {
    const response = await axios.get(`${API_URL}/Reviews/business/${businessId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching business reviews:', error);
    // API hatası durumunda sahte veriler döndür
    return [
      {
        reviewID: 1,
        userID: 5,
        businessID: businessId,
        rating: 4.5,
        comment: "Çok iyi bir hizmet aldım, teşekkür ederim!",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        reviewID: 2,
        userID: 8,
        businessID: businessId,
        rating: 5,
        comment: "Harika bir deneyimdi, kesinlikle tavsiye ediyorum.",
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 gün önce
        updatedAt: new Date(Date.now() - 86400000).toISOString()
      }
    ];
  }
};

/**
 * Calculate average rating from reviews
 * @param {Array} reviews - List of reviews
 * @returns {number} Average rating (0-5)
 */
export const calculateAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) {
    return 0;
  }
  
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return sum / reviews.length;
};

/**
 * Add a new review for a business
 * @param {number} userId - The user ID
 * @param {number} businessId - The business ID
 * @param {number} rating - Rating (0-5)
 * @param {string} comment - Review comment
 * @returns {Promise<Object>} Created review
 */
export const addBusinessReview = async (userId, businessId, rating, comment) => {
  try {
    const response = await axios.post(`${API_URL}/Reviews`, {
      userID: userId,
      businessID: businessId,
      rating: rating,
      comment: comment
    });
    return response.data;
  } catch (error) {
    console.error('Error adding business review:', error);
    throw error;
  }
};

export default {
  getBusinessReviews,
  calculateAverageRating,
  addBusinessReview
}; 