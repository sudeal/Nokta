import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LanguageContext = createContext();

// Çeviri metinleri
const translations = {
  en: {
    // Login & Register
    login: 'Login',
    register: 'Register',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    fullName: 'Full Name',
    forgotPassword: 'Forgot Password?',
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: 'Already have an account?',
    loginSuccess: 'Login successful!',
    registerSuccess: 'Registration successful!',
    emailRequired: 'Email is required',
    passwordRequired: 'Password is required',
    invalidEmail: 'Please enter a valid email address',
    fillAllFields: 'Please fill in all fields',
    loginFailed: 'Login failed. Please check your credentials and try again.',
    
    // Navigation & General
    home: 'Home',
    search: 'Search',
    calendar: 'Calendar',
    profile: 'Profile',
    settings: 'Settings',
    logout: 'Logout',
    cancel: 'Cancel',
    confirm: 'Confirm',
    ok: 'OK',
    yes: 'Yes',
    no: 'No',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    
    // Business Detail
    bookAppointment: 'Book 1-Hour Appointment',
    about: 'About',
    location: 'Location',
    contact: 'Contact',
    reviews: 'Reviews',
    writeReview: 'Write a Review',
    appointmentConfirmation: 'Appointment Confirmation',
    
    // Calendar
    appointments: 'Appointments',
    noAppointments: 'No appointments found',
    appointmentsFor: 'Appointments for',
    allAppointments: 'All Appointments',
    cancelAppointment: 'Cancel Appointment',
    
    // Status
    pending: 'Pending',
    confirmed: 'Confirmed',
    accepted: 'Accepted',
    cancelled: 'Cancelled',
    rejected: 'Rejected',
    
    // Time & Date
    selectDateTime: 'Select Date and Time',
    appointmentDuration: 'Appointment duration: 1 hour',
    hour: 'Hour',
    minute: 'Minute',
    
    // Messages
    success: 'Success',
    error: 'Error',
    invalidTime: 'Invalid Time',
    timeSlotNotAvailable: 'Time Slot Not Available',
    appointmentBooked: 'Your 1-hour appointment has been booked successfully!',
    appointmentCancelled: 'Your appointment has been cancelled successfully.',
    
    // Language
    language: 'Language',
    english: 'English',
    turkish: 'Turkish',
    
    // Additional fields
    phone: 'Phone',
    age: 'Age',
    location: 'Location',
    areYouSure: 'Are you sure you want to cancel your appointment at',
    
    // HomeScreen
    welcome: 'Welcome',
    newBooking: 'New Booking',
    notifications: 'Notifications',
    messages: 'Messages',
    locationNotAvailable: 'Location not available',
    
    // Additional
    noReviews: 'No reviews yet. Be the first to write a review!',

    // Calendar Screen
    calendarMyAppointments: 'My Appointments',
    calendarCancel: 'Cancel',
    calendarConfirmCancel: 'Are you sure you want to cancel this appointment?',
    calendarYes: 'Yes',
    calendarNo: 'No',
    calendarCancelSuccess: 'Appointment cancelled successfully',
    calendarCancelError: 'Failed to cancel appointment',
    calendarErrorLoadingAppointments: 'Error loading appointments',
    calendarFetchError: 'Failed to fetch appointments',
    calendarNoAppointments: 'No appointments found',
    calendarLoadingAppointments: 'Loading appointments...',

    // Profile Screen
    profileTitle: 'Profile',
    profilePleaseLogin: 'Please login to view your profile',
    profileInvalidUserData: 'Invalid user data. Redirecting to login...',
    profileFailedToLoadUserData: 'Failed to load user data. Redirecting to login...',
    profileFailedToLoadProfile: 'Failed to load profile data. Please try again.',
    profileError: 'Error',
    profileFAQ: 'Frequently Asked Questions',
    profileContactUs: 'Contact Us',
    profileCustomerService: 'Customer Service',
    profileTermsOfUse: 'Terms of Use',
    profileMyAppointments: 'My Appointments',
    profileNotifications: 'Notifications',
    profileHelp: 'Help',
    profileCouldNotLogout: 'Could not log out. Please try again.',
    profileHowToUseNokta: 'How to Use Nokta App?',
    profileWelcomeText: 'Welcome to Nokta app! We would like to show you how to make appointments and use our application.',
    profileBrowse: 'Browse',
    profileBrowseHelp: 'You can see all businesses in the Browse tab on the home page. Businesses are categorized (hairdresser, beauty center, spa, etc.). You can list the businesses in that area by selecting the category you want.',
    profileMakingAppointment: 'Making an Appointment',
    profileMakingAppointmentHelp: 'In the New Booking tab, you will see businesses categorized by type. After selecting the business you want:\n\n• Select service\n• Choose date and time\n• Confirm and payment\n\nFollow these steps to easily create your appointment.',
    profileMyAppointmentsHelp: 'In the "My Appointments" section of your profile page or in the Calendar tab, you can view:\n\n• Your active appointments\n• Your past appointments\n• Your upcoming appointments',
    profileMessaging: 'Messaging',
    profileMessagingHelp: 'You can directly message with businesses you have appointments with in the Messages tab. You can discuss appointment details and ask your questions.',
    profileCalendar: 'Calendar',
    profileCalendarHelp: 'In the Calendar tab, you can view all your appointments in calendar format and better plan your appointments.',
    profileNotificationsHelp: 'Don\'t forget to keep your notifications on for appointment reminders, business messages, and special offers!',
    profileRetry: 'Retry',
    profileName: 'Name',
    profileEmail: 'Email',
    profilePhone: 'Phone',
    profileLocation: 'Location',
    profileAge: 'Age',
    profileNotSet: 'Not set',
    profileForgotPassword: 'Forgot Password?',
    profileLogOut: 'Log Out',

    // NewBooking Screen
    newBookingServiceCategories: 'Service Categories',
    newBookingChooseService: 'Choose your perfect service and book your appointment now!',
    newBookingHealthServices: 'Health Services',
    newBookingDoctor: 'Doctor',
    newBookingDentist: 'Dentist',
    newBookingVet: 'Vet',
    newBookingFoodBeverages: 'Food & Beverages',
    newBookingRestaurants: 'Restaurants',
    newBookingDesserts: 'Desserts',
    newBookingFineDining: 'Fine Dining',
    newBookingPubBars: 'Pub & Bars',
    newBookingPersonalCare: 'Personal Care',
    newBookingMaleCoiffure: 'Male Coiffure',
    newBookingFemaleCoiffure: 'Female Coiffure',
    newBookingNailStudios: 'Nail Studios',
    newBookingTattooPiercing: 'Tattoo & Piercing',

    // Notification Screen
    notificationAppointmentConfirmed: 'Your appointment has been confirmed!',
    notificationAppointmentToday: 'Your appointment is today!',
    notificationOneDayUntil: '1 day until your appointment!',
    notificationStatus: 'Status',
    notificationNoNotifications: 'No notifications available',

    // Messages Screen
    messagesTitle: 'Messages',
    messagesError: 'Error',
    messagesLoginRequired: 'Please login to view messages',
    messagesInfo: 'Info',
    messagesSampleData: 'Using sample data. Please check your internet connection.',
    messagesSearchPlaceholder: 'Search businesses...',
    messagesLoading: 'Loading messages...',
    messagesNoMessages: 'No messages found',

    // BusinessList Screen
    businessListHoursNotAvailable: 'Hours not available',
    businessListLoadingLocation: 'Loading location...',
    businessListNoRatings: 'No ratings yet',
    businessListNoBusinessFound: 'No businesses found',

    // BusinessDetail Screen Alerts
    businessDetailErrorTitle: 'Error',
    businessDetailLoginRequired: 'Please login to book an appointment',
    businessDetailOk: 'OK',
    businessDetailInvalidTime: 'Invalid Time',
    businessDetailOutsideHours: 'Please select a time within business hours',
    businessDetailTimeSlotNotAvailable: 'Time Slot Not Available',
    businessDetailSuccess: 'Success',
    businessDetailAppointmentBooked: 'Your 1-hour appointment has been successfully booked!',
    businessDetailBookingError: 'Booking Error',
    businessDetailBookingFailed: 'Could not book appointment. Please try again.',
    businessDetailSelectRating: 'Please select a rating',
    businessDetailWriteComment: 'Please write a comment',
    businessDetailReviewSuccess: 'Successful',
    businessDetailReviewSubmitted: 'Your comment has been sent successfully!',
    businessDetailReviewError: 'An error occurred while submitting the comment. Please try again.',
  },
  tr: {
    // Login & Register
    login: 'Giriş Yap',
    register: 'Kayıt Ol',
    email: 'E-posta',
    password: 'Şifre',
    confirmPassword: 'Şifre Onayı',
    fullName: 'Ad Soyad',
    forgotPassword: 'Şifremi Unuttum?',
    dontHaveAccount: 'Hesabınız yok mu?',
    alreadyHaveAccount: 'Zaten hesabınız var mı?',
    loginSuccess: 'Giriş başarılı!',
    registerSuccess: 'Kayıt başarılı!',
    emailRequired: 'E-posta alanı zorunludur',
    passwordRequired: 'Şifre alanı zorunludur',
    invalidEmail: 'Geçerli bir e-posta adresi giriniz',
    fillAllFields: 'Lütfen tüm alanları doldurun',
    loginFailed: 'Giriş başarısız. Bilgilerinizi kontrol edip tekrar deneyin.',
    
    // Navigation & General
    home: 'Ana Sayfa',
    search: 'Ara',
    calendar: 'Takvim',
    profile: 'Profil',
    settings: 'Ayarlar',
    logout: 'Çıkış Yap',
    cancel: 'İptal',
    confirm: 'Onayla',
    ok: 'Tamam',
    yes: 'Evet',
    no: 'Hayır',
    save: 'Kaydet',
    edit: 'Düzenle',
    delete: 'Sil',
    
    // Business Detail
    bookAppointment: '1 Saatlik Randevu Al',
    about: 'Hakkında',
    location: 'Konum',
    contact: 'İletişim',
    reviews: 'Yorumlar',
    writeReview: 'Yorum Yaz',
    appointmentConfirmation: 'Randevu Onayı',
    
    // Calendar
    appointments: 'Randevular',
    noAppointments: 'Randevu bulunamadı',
    appointmentsFor: 'Randevular için',
    allAppointments: 'Tüm Randevular',
    cancelAppointment: 'Randevuyu İptal Et',
    
    // Status
    pending: 'Beklemede',
    confirmed: 'Onaylandı',
    accepted: 'Kabul Edildi',
    cancelled: 'İptal Edildi',
    rejected: 'Reddedildi',
    
    // Time & Date
    selectDateTime: 'Tarih ve Saat Seç',
    appointmentDuration: 'Randevu süresi: 1 saat',
    hour: 'Saat',
    minute: 'Dakika',
    
    // Messages
    success: 'Başarılı',
    error: 'Hata',
    invalidTime: 'Geçersiz Saat',
    timeSlotNotAvailable: 'Saat Dilimi Müsait Değil',
    appointmentBooked: '1 saatlik randevunuz başarıyla oluşturuldu!',
    appointmentCancelled: 'Randevunuz başarıyla iptal edildi.',
    
    // Language
    language: 'Dil',
    english: 'İngilizce',
    turkish: 'Türkçe',
    
    // Additional fields
    phone: 'Telefon',
    age: 'Yaş',
    location: 'Konum',
    areYouSure: 'Randevunuz iptal etmek istediğinizden emin misiniz:',
    
    // HomeScreen
    welcome: 'Hoş Geldiniz',
    newBooking: 'Yeni Rezervasyon',
    notifications: 'Bildirimler',
    messages: 'Mesajlar',
    locationNotAvailable: 'Konum alınamadı',
    
    // Additional
    noReviews: 'Henüz yorum yok. İlk yorumu siz yazın!',

    // Calendar Screen
    calendarMyAppointments: 'Randevularım',
    calendarCancel: 'İptal Et',
    calendarConfirmCancel: 'Bu randevuyu iptal etmek istediğinizden emin misiniz?',
    calendarYes: 'Evet',
    calendarNo: 'Hayır',
    calendarCancelSuccess: 'Randevu başarıyla iptal edildi',
    calendarCancelError: 'Randevu iptal edilemedi',
    calendarErrorLoadingAppointments: 'Randevular yüklenirken hata oluştu',
    calendarFetchError: 'Randevular getirilemedi',
    calendarNoAppointments: 'Randevu bulunamadı',
    calendarLoadingAppointments: 'Randevular yükleniyor...',

    // Profile Screen
    profileTitle: 'Profil',
    profilePleaseLogin: 'Profilinizi görüntülemek için lütfen giriş yapın',
    profileInvalidUserData: 'Geçersiz kullanıcı verisi. Giriş sayfasına yönlendiriliyor...',
    profileFailedToLoadUserData: 'Kullanıcı verileri yüklenemedi. Giriş sayfasına yönlendiriliyor...',
    profileFailedToLoadProfile: 'Profil verileri yüklenemedi. Lütfen tekrar deneyin.',
    profileError: 'Hata',
    profileFAQ: 'Sık Sorulan Sorular',
    profileContactUs: 'İletişim',
    profileCustomerService: 'Müşteri Hizmetleri',
    profileTermsOfUse: 'Kullanım Şartları',
    profileMyAppointments: 'Randevularım',
    profileNotifications: 'Bildirimler',
    profileHelp: 'Yardım',
    profileCouldNotLogout: 'Çıkış yapılamadı. Lütfen tekrar deneyin.',
    profileHowToUseNokta: 'Nokta Uygulaması Nasıl Kullanılır?',
    profileWelcomeText: 'Nokta uygulamasına hoş geldiniz! Size randevu almanın ve uygulamamızı kullanmanın yollarını göstermek istiyoruz.',
    profileBrowse: 'Keşfet',
    profileBrowseHelp: 'Ana sayfadaki Keşfet sekmesinde tüm işletmeleri görebilirsiniz. İşletmeler kategorize edilmiştir (kuaför, güzellik merkezi, spa vb.). İstediğiniz kategoriyi seçerek o alandaki işletmeleri listeleyebilirsiniz.',
    profileMakingAppointment: 'Randevu Alma',
    profileMakingAppointmentHelp: 'Yeni Rezervasyon sekmesinde işletmeleri türlerine göre kategorize edilmiş şekilde göreceksiniz. İstediğiniz işletmeyi seçtikten sonra:\n\n• Hizmet seçin\n• Tarih ve saat seçin\n• Onaylayın ve ödeme yapın\n\nBu adımları takip ederek kolayca randevunuzu oluşturun.',
    profileMyAppointmentsHelp: 'Profil sayfanızdaki "Randevularım" bölümünde veya Takvim sekmesinde şunları görüntüleyebilirsiniz:\n\n• Aktif randevularınız\n• Geçmiş randevularınız\n• Gelecek randevularınız',
    profileMessaging: 'Mesajlaşma',
    profileMessagingHelp: 'Mesajlar sekmesinde randevunuz olan işletmelerle doğrudan mesajlaşabilirsiniz. Randevu detaylarını konuşabilir ve sorularınızı sorabilirsiniz.',
    profileCalendar: 'Takvim',
    profileCalendarHelp: 'Takvim sekmesinde tüm randevularınızı takvim formatında görüntüleyebilir ve randevularınızı daha iyi planlayabilirsiniz.',
    profileNotificationsHelp: 'Randevu hatırlatmaları, işletme mesajları ve özel teklifler için bildirimlerinizi açık tutmayı unutmayın!',
    profileRetry: 'Tekrar Dene',
    profileName: 'İsim',
    profileEmail: 'E-posta',
    profilePhone: 'Telefon',
    profileLocation: 'Konum',
    profileAge: 'Yaş',
    profileNotSet: 'Ayarlanmamış',
    profileForgotPassword: 'Şifremi Unuttum?',
    profileLogOut: 'Çıkış Yap',

    // NewBooking Screen
    newBookingServiceCategories: 'Hizmet Kategorileri',
    newBookingChooseService: 'Mükemmel hizmetinizi seçin ve hemen randevunuzu alın!',
    newBookingHealthServices: 'Sağlık Hizmetleri',
    newBookingDoctor: 'Doktor',
    newBookingDentist: 'Diş Hekimi',
    newBookingVet: 'Veteriner',
    newBookingFoodBeverages: 'Yiyecek ve İçecek',
    newBookingRestaurants: 'Restoranlar',
    newBookingDesserts: 'Tatlılar',
    newBookingFineDining: 'Fine Dining',
    newBookingPubBars: 'Pub & Barlar',
    newBookingPersonalCare: 'Kişisel Bakım',
    newBookingMaleCoiffure: 'Erkek Kuaförü',
    newBookingFemaleCoiffure: 'Kadın Kuaförü',
    newBookingNailStudios: 'Nail Stüdyoları',
    newBookingTattooPiercing: 'Dövme & Piercing',

    // Notification Screen
    notificationAppointmentConfirmed: 'Randevunuz onaylandı!',
    notificationAppointmentToday: 'Randevunuz bugün!',
    notificationOneDayUntil: 'Randevunuz 1 gün içinde!',
    notificationStatus: 'Durum',
    notificationNoNotifications: 'Bildirim bulunamadı',

    // Messages Screen
    messagesTitle: 'Mesajlar',
    messagesError: 'Hata',
    messagesLoginRequired: 'Mesajları görüntülemek için lütfen giriş yapın',
    messagesInfo: 'Bilgi',
    messagesSampleData: 'Örnek veri kullanıyorsunuz. Lütfen internet bağlantınızı kontrol edin.',
    messagesSearchPlaceholder: 'İşletmeleri arayın...',
    messagesLoading: 'Mesajlar yükleniyor...',
    messagesNoMessages: 'Mesaj bulunamadı',

    // BusinessList Screen
    businessListHoursNotAvailable: 'Çalışma saatleri mevcut değil',
    businessListLoadingLocation: 'Konum yükleniyor...',
    businessListNoRatings: 'Henüz değerlendirme yok',
    businessListNoBusinessFound: 'İşletme bulunamadı',

    // BusinessDetail Screen Alerts
    businessDetailErrorTitle: 'Hata',
    businessDetailLoginRequired: 'Randevu almak için lütfen giriş yapın',
    businessDetailOk: 'Tamam',
    businessDetailInvalidTime: 'Geçersiz Saat',
    businessDetailOutsideHours: 'Lütfen işletme saatleri içinde bir zaman seçin',
    businessDetailTimeSlotNotAvailable: 'Saat Dilimi Müsait Değil',
    businessDetailSuccess: 'Başarılı',
    businessDetailAppointmentBooked: '1 saatlik randevunuz başarıyla oluşturuldu!',
    businessDetailBookingError: 'Randevu Hatası',
    businessDetailBookingFailed: 'Randevu oluşturulamadı. Lütfen tekrar deneyin.',
    businessDetailSelectRating: 'Lütfen bir değerlendirme seçin',
    businessDetailWriteComment: 'Lütfen bir yorum yazın',
    businessDetailReviewSuccess: 'Başarılı',
    businessDetailReviewSubmitted: 'Yorumunuz başarıyla gönderildi!',
    businessDetailReviewError: 'Yorum gönderilirken bir hata oluştu. Lütfen tekrar deneyin.',
  }
};

// Kategori mapping sistemi - UI'da gösterilen isimler ile veritabanındaki isimler arası eşleştirme
const categoryMapping = {
  en: {
    // Ana kategoriler
    "Health Services": "Health Services",
    "Food & Beverages": "Food & Beverage", 
    "Personal Care": "Personal Care",
    
    // Alt kategoriler - Health Services
    "Doctor": "Doctor",
    "Dentist": "Dentist",
    "Vet": "Vet",
    
    // Alt kategoriler - Food & Beverages
    "Restaurants": "Restaurant",
    "Desserts": "Dessert",
    "Fine Dining": "Fine Dining",
    "Pub & Bars": "Pub & Bar",
    
    // Alt kategoriler - Personal Care
    "Male Coiffure": "Male Coiffure",
    "Female Coiffure": "Female Coiffure",
    "Nail Studios": "Nail Studios",
    "Tattoo & Piercing": "Tattoo & Piercing",
  },
  tr: {
    // Ana kategoriler
    "Sağlık Hizmetleri": "Health Services",
    "Yemek ve İçecek": "Food & Beverage",
    "Kişisel Bakım": "Personal Care",
    
    // Alt kategoriler - Sağlık Hizmetleri
    "Doktor": "Doctor",
    "Diş Hekimi": "Dentist", 
    "Veteriner": "Vet",
    
    // Alt kategoriler - Yemek ve İçecek
    "Restoranlar": "Restaurant",
    "Tatlılar": "Dessert", 
    "Gurme Yemek": "Fine Dining",
    "Pub ve Barlar": "Pub & Bar",
    
    // Alt kategoriler - Kişisel Bakım
    "Erkek Kuaförü": "Male Coiffure",
    "Kadın Kuaförü": "Female Coiffure", 
    "Nail Studio": "Nail Studios",
    "Dövme ve Piercing": "Tattoo & Piercing",
  }
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(true);

  // Uygulama başlarken kayıtlı dili yükle
  useEffect(() => {
    loadSavedLanguage();
  }, []);

  const loadSavedLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('app_language');
      if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'tr')) {
        setCurrentLanguage(savedLanguage);
      }
    } catch (error) {
      console.error('Error loading saved language:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const changeLanguage = async (language) => {
    try {
      await AsyncStorage.setItem('app_language', language);
      setCurrentLanguage(language);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const t = (key) => {
    return translations[currentLanguage]?.[key] || key;
  };

  // Kategori mapping fonksiyonu - UI kategorisini veritabanı kategorisine çevirir
  const getCategoryMapping = (uiCategory) => {
    return categoryMapping[currentLanguage]?.[uiCategory] || uiCategory;
  };

  // Ters mapping fonksiyonu - veritabanı kategorisini UI kategorisine çevirir
  const getUICategoryName = (dbCategory) => {
    const mapping = categoryMapping[currentLanguage];
    for (const [uiName, dbName] of Object.entries(mapping || {})) {
      if (dbName === dbCategory) {
        return uiName;
      }
    }
    return dbCategory; // Eğer mapping bulunamaz ise orijinal ismi döndür
  };

  const value = {
    currentLanguage,
    changeLanguage,
    t,
    isLoading,
    language: translations[currentLanguage] || translations.en,
    getCategoryMapping,
    getUICategoryName
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 