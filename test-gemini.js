const axios = require('axios');

const GEMINI_API_KEY = 'AIzaSyACFOvWFANIz13HHijbR3Lo8wesreA5gbw';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Test yorumları - biri uygun, biri uygunsuz
const comments = [
  "Bu servis çok kötü, berbat bir deneyimdi", // Olumsuz ama uygun yorum
  "Bok gibi hizmet, aptal çalışanlar"         // Uygunsuz yorum
];

async function evaluateComment(comment) {
  try {
    console.log(`\n---------------------------------------------`);
    console.log(`Değerlendirilen yorum: "${comment}"`);
    
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
    const isAppropriate = result.includes('appropriate') && !result.includes('inappropriate');
    
    console.log(`Gemini yanıtı: "${result}"`);
    console.log(`Değerlendirme sonucu: ${isAppropriate ? 'UYGUN ✓' : 'UYGUNSUZ ✗'}`);
    console.log(`Bu yorum ${isAppropriate ? 'gösterilecek' : 'filtrelenecek'}`);
    
    return { comment, result, isAppropriate };
  } catch (error) {
    console.error('Hata:', error.message);
    if (error.response) {
      console.error('API Hata detayları:', error.response.data);
    }
    return { comment, error: error.message, isAppropriate: false };
  }
}

async function testAll() {
  console.log('Gemini API ile yorum değerlendirme testi başlatılıyor...');
  
  for (const comment of comments) {
    await evaluateComment(comment);
  }
  
  console.log('\nTest tamamlandı.');
}

testAll(); 