import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [isEnglish, setIsEnglish] = useState(true);

  const toggleLanguage = () => {
    setIsEnglish(!isEnglish);
  };

  const translations = {
    // Login page translations
    login: {
      title: isEnglish ? 'Welcome Back' : 'Hoş Geldiniz',
      subtitle: isEnglish ? 'Login to access your website' : 'Web sitenize erişmek için giriş yapın',
      email: isEnglish ? 'Email Address' : 'E-posta Adresi',
      password: isEnglish ? 'Password' : 'Şifre',
      loginButton: isEnglish ? 'Login' : 'Giriş Yap',
      noAccount: isEnglish ? "Don't have an account?" : 'Hesabınız yok mu?',
      signUp: isEnglish ? 'Sign up' : 'Kayıt ol',
      forgotPassword: isEnglish ? 'Forgot Password?' : 'Şifrenizi mi unuttunuz?',
      // Alert messages
      loginSuccess: isEnglish ? 'Login successful!' : 'Giriş başarılı!',
      loginFailed: isEnglish ? 'Login failed. Please check your credentials.' : 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.',
      fetchBusinessFailed: isEnglish ? 'Failed to fetch business details. Please try again.' : 'İşletme bilgileri alınamadı. Lütfen tekrar deneyin.'
    },
    // Signup page translations
    signup: {
      // Step 1
      step1: {
        email: isEnglish ? 'Email' : 'E-posta',
        emailPlaceholder: isEnglish ? 'Enter your email' : 'E-posta adresinizi girin',
        contactNumber: isEnglish ? 'Contact Number' : 'İletişim Numarası',
        contactPlaceholder: isEnglish ? 'Enter your contact number' : 'İletişim numaranızı girin',
        password: isEnglish ? 'Password' : 'Şifre',
        passwordPlaceholder: isEnglish ? 'Enter your password' : 'Şifrenizi girin',
        confirmPassword: isEnglish ? 'Confirm Password' : 'Şifreyi Onayla',
        confirmPasswordPlaceholder: isEnglish ? 'Confirm your password' : 'Şifrenizi onaylayın',
        passwordError: isEnglish 
          ? 'Password must be at least 6 characters long, include 1 uppercase, 1 lowercase, 1 digit, and 1 special character.'
          : 'Şifre en az 6 karakter olmalı, 1 büyük harf, 1 küçük harf, 1 rakam ve 1 özel karakter içermelidir.',
        passwordMismatch: isEnglish ? 'Passwords do not match!' : 'Şifreler eşleşmiyor!',
        fixPasswordError: isEnglish ? 'Please fix the password error.' : 'Lütfen şifre hatasını düzeltin.',
        next: isEnglish ? 'Next' : 'İleri'
      },
      // Step 2
      step2: {
        name: isEnglish ? 'Name:' : 'İsim:',
        namePlaceholder: isEnglish ? "Enter your business's name" : 'İşletmenizin adını girin',
        ownerName: isEnglish ? 'Owner Name:' : 'Sahip Adı:',
        ownerPlaceholder: isEnglish ? "Enter owner's name" : 'Sahip adını girin',
        category: isEnglish ? 'Category:' : 'Kategori:',
        selectCategory: isEnglish ? 'Select a category' : 'Bir kategori seçin',
        subcategory: isEnglish ? 'Subcategory:' : 'Alt Kategori:',
        selectSubcategory: isEnglish ? 'Select a subcategory' : 'Bir alt kategori seçin',
        address: isEnglish ? 'Address:' : 'Adres:',
        addressPlaceholder: isEnglish ? 'Enter your address' : 'Adresinizi girin',
        getLocation: isEnglish ? 'Get Current Location' : 'Mevcut Konumu Al',
        description: isEnglish ? 'Description:' : 'Açıklama:',
        descriptionPlaceholder: isEnglish ? 'Enter a brief description' : 'Kısa bir açıklama girin',
        next: isEnglish ? 'Next' : 'İleri'
      },
      // Step 3
      step3: {
        openingHour: isEnglish ? 'Opening Hour:' : 'Açılış Saati:',
        closingHour: isEnglish ? 'Closing Hour:' : 'Kapanış Saati:',
        messagingService: isEnglish ? 'Messaging Service' : 'Mesajlaşma Servisi',
        statistics: isEnglish ? 'Statistics' : 'İstatistikler',
        menuPrices: isEnglish ? 'Menu and Prices' : 'Menü ve Fiyatlar',
        directions: isEnglish ? 'Directions' : 'Yol Tarifi',
        submit: isEnglish ? 'Submit' : 'Gönder',
        registrationSuccess: isEnglish ? 'Registration successful!' : 'Kayıt başarılı!',
        registrationFailed: isEnglish ? 'Registration failed:' : 'Kayıt başarısız:',
        unknownError: isEnglish ? 'Unknown error occurred' : 'Bilinmeyen bir hata oluştu',
        errorOccurred: isEnglish ? 'An error occurred while sending the request. Check console for details.' : 'İstek gönderilirken bir hata oluştu. Detaylar için konsolu kontrol edin.'
      },
      // Common
      back: isEnglish ? 'Back' : 'Geri'
    },

    // Messages page translations
    messages: {
      title: isEnglish ? 'Incoming Messages' : 'Gelen Mesajlar',
      loading: isEnglish ? 'Loading...' : 'Yükleniyor...',
      noMessages: isEnglish ? 'No messages yet.' : 'Henüz mesaj yok.',
      conversationWith: isEnglish ? 'Messages with' : 'ile Mesajlar',
      user: isEnglish ? 'User' : 'Kullanıcı',
      selectUser: isEnglish ? 'Select a user to view messages.' : 'Bir kullanıcı seçerek mesajları görüntüleyin.',
      messagePlaceholder: isEnglish ? 'Add message' : 'Mesaj ekle',
      send: isEnglish ? 'Send' : 'Gönder',
      // Alert messages
      messageSendFailed: isEnglish ? 'Message could not be sent:' : 'Mesaj gönderilemedi:',
      messagesLoadFailed: isEnglish ? 'Messages could not be loaded.' : 'Mesajlar yüklenemedi.',
      messageDeleteConfirm: isEnglish ? 'Are you sure you want to delete the message?' : 'Mesajı silmek istediğinize emin misiniz?',
      messageDeleteFailed: isEnglish ? 'Message could not be deleted.' : 'Mesaj silinemedi.'
    }
  };

  return (
    <LanguageContext.Provider value={{
      isEnglish,
      toggleLanguage,
      translations
    }}>
      {children}
    </LanguageContext.Provider>
  );
}; 