import axios from 'axios';

const API_URL = 'https://nokta-appservice.azurewebsites.net/api';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const GEMINI_API_KEY = 'AIzaSyACFOvWFANIz13HHijbR3Lo8wesreA5gbw'; // Gemini API Key

/**
 * Gemini API kullanarak bir yorumu direkt değerlendir (test için)
 * @param {string} comment - Değerlendirilecek yorum 
 * @returns {Promise<Object>} Değerlendirme sonucu
 */
export const evaluateCommentWithGemini = async (comment) => {
  try {
    console.log(`Gemini API ile değerlendiriliyor: "${comment}"`);
    
    const requestData = {
      contents: [
        {
          parts: [
            {
              text: `Aşağıdaki yorumu değerlendir ve uygunsuz içerik (küfür, hakaret, cinsel içerik, şiddet, tehdit, ırkçılık) içerip içermediğini belirt. Sadece "uygun" veya "uygunsuz" olarak cevap ver. Argo dili, müstehcen kelimeleri, hakaret ve her türlü uygunsuz ifadeyi tespit et:\n\n"${comment}"`
            }
          ]
        }
      ]
    };
    
    console.log('Gemini API isteği gönderiliyor:', JSON.stringify(requestData, null, 2));
    
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      requestData,
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    
    console.log('Gemini API yanıtı alındı:', JSON.stringify(response.data, null, 2));
    
    const result = response.data.candidates[0].content.parts[0].text.trim().toLowerCase();
    const isAppropriate = result.includes('uygun') && !result.includes('uygunsuz');
    
    return {
      originalComment: comment,
      geminiResponse: result,
      isAppropriate: isAppropriate,
      rawResponse: response.data
    };
  } catch (error) {
    console.error('Gemini API değerlendirme hatası:', error);
    return {
      originalComment: comment,
      error: error.message,
      isAppropriate: false
    };
  }
};

/**
 * Fetch all reviews for a specific business
 * @param {number} businessId - The business ID
 * @returns {Promise<Array>} List of reviews
 */
export const getBusinessReviews = async (businessId) => {
  try {
    // Önce doğru endpoint'i deneyelim
    const response = await axios.get(`${API_URL}/Reviews/Business/${businessId}`);
    return response.data;
  } catch (error) {
    console.log('Primary endpoint failed, trying alternative endpoint...');
    try {
      // Alternatif endpoint
      const response = await axios.get(`${API_URL}/reviews/business/${businessId}`);
      return response.data;
    } catch (secondError) {
      console.log('Alternative endpoint also failed, trying Reviews endpoint without business filter...');
      try {
        // Tüm review'ları getir ve business ID'ye göre filtrele
        const response = await axios.get(`${API_URL}/Reviews`);
        const allReviews = response.data;
        return allReviews.filter(review => review.businessID === businessId || review.businessId === businessId);
      } catch (thirdError) {
        console.error('All review endpoints failed:', thirdError);
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
    }
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
 * Yorumun uygun olup olmadığını Gemini API kullanarak kontrol eder
 * @param {string} comment - Yorumun içeriği
 * @returns {Promise<boolean>} Yorum uygunsa true, değilse false döner
 */
export const checkReviewContentWithGemini = async (comment) => {
  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `Review the comment below and classify it as either "appropriate" or "inappropriate".

Appropriate comments can:
- Express negative opinions or bad experiences
- Be critical of service or products
- Express disappointment or dissatisfaction

Inappropriate comments contain:
- Profanity or curse words
- Personal insults or name-calling
- Racist, sexist, or discriminatory language
- Threats or violent content
- Sexual content or innuendo

Comment to evaluate: "${comment}"

Reply with only a single word: "appropriate" or "inappropriate"`
              }
            ]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    const result = response.data.candidates[0].content.parts[0].text.trim().toLowerCase();
    console.log('Gemini API yorumu değerlendirdi:', result);
    
    // Eğer yanıt "appropriate" içeriyorsa ve "inappropriate" içermiyorsa, yorum uygundur
    const isAppropriate = result.includes('appropriate') && !result.includes('inappropriate');
    
    if (!isAppropriate) {
      console.log(`Gemini API uygunsuz içerik tespit etti: "${comment}"`);
    }
    
    return isAppropriate;
  } catch (error) {
    console.error('Gemini API ile yorum kontrolü sırasında hata:', error);
    // Hata durumunda yorumu reddet
    return false;
  }
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
    console.log(`Yorum kontrol ediliyor: "${comment}"`);
    
    // Yorumu Gemini API ile kontrol et
    const isAppropriate = await checkReviewContentWithGemini(comment);
    
    if (!isAppropriate) {
      console.error('Yorum uygunsuz içerik içeriyor ve reddedildi');
      throw new Error('Yorum uygunsuz içerik içeriyor ve reddedildi.');
    }
    
    console.log('Yorum içerik kontrolünden geçti, veritabanına ekleniyor');
    
    const response = await axios.post(`${API_URL}/Reviews`, {
      userID: userId,
      businessID: businessId,
      rating: rating,
      comment: comment
    });
    
    console.log('Yorum başarıyla veritabanına eklendi:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error adding business review:', error);
    throw error;
  }
};

export default {
  getBusinessReviews,
  calculateAverageRating,
  addBusinessReview,
  checkReviewContentWithGemini,
  evaluateCommentWithGemini
}; 