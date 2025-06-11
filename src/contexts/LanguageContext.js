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
    },

    // Home page translations
    home: {
      hero: {
        title: isEnglish ? 'NOKTA' : 'NOKTA',
        subtitle: isEnglish ? 'Customer Management & Appointment System' : 'Müşteri Yönetimi & Randevu Sistemi'
      },
      features: {
        title: isEnglish ? 'Why Nokta?' : 'Neden Nokta?',
        subtitle: isEnglish ? 'All appointment management tools you need for your business' : 'İşletmeniz için ihtiyacınız olan tüm randevu yönetim araçları',
        timeSaving: {
          title: isEnglish ? 'Time Saving' : 'Zaman Tasarrufu',
          description: isEnglish ? 'Provide instant and easy appointments to your customers, eliminating phone reservation processes' : 'Telefon ile randevu alma süreçlerini ortadan kaldırarak müşterilerinize anında ve kolay randevu imkanı sunun'
        },
        visibility: {
          title: isEnglish ? 'Visibility' : 'Görünürlük',
          description: isEnglish ? 'Reach more customers and let them discover your services' : 'Daha fazla müşteriye ulaşın ve hizmetlerinizi keşfetmelerini sağlayın'
        },
        integration: {
          title: isEnglish ? 'Easy Integration' : 'Kolay Entegrasyon',
          description: isEnglish ? 'Quickly integrate with your existing system to improve customer experience' : 'Müşteri deneyimini iyileştirmek için mevcut sisteminizle hızlıca entegre olun'
        },
        reminders: {
          title: isEnglish ? 'Reminders' : 'Hatırlatmalar',
          description: isEnglish ? 'Reduce cancellation and delay rates with automatic reminders' : 'Otomatik hatırlatmalarla iptal ve gecikme oranlarını azaltın'
        },
        analytics: {
          title: isEnglish ? 'Analytics' : 'Analitik',
          description: isEnglish ? 'Track your business performance with comprehensive reporting tools' : 'Kapsamlı raporlama araçlarıyla işletme performansınızı takip edin'
        },
        security: {
          title: isEnglish ? 'Secure' : 'Güvenli',
          description: isEnglish ? 'Your data is protected with enterprise-level security' : 'Verileriniz kurumsal düzeyde güvenlik ile korunur'
        }
      },
      howItWorks: {
        title: isEnglish ? 'How It Works?' : 'Nasıl Çalışır?',
        subtitle: isEnglish ? 'Transition to an online appointment system in three simple steps for your business' : 'İşletmeniz için üç basit adımda online randevu sistemine geçiş yapın',
        steps: {
          step1: {
            title: isEnglish ? 'Create an Account' : 'Hesap Oluşturun',
            description: isEnglish ? 'Add your business to the system in just a few minutes' : 'İşletmenizi birkaç dakika içinde sisteme ekleyin'
          },
          step2: {
            title: isEnglish ? 'Define Services' : 'Hizmetleri Tanımlayın',
            description: isEnglish ? 'Specify the services you offer and your available time slots' : 'Sunduğunuz hizmetleri ve müsait zaman dilimlerinizi belirleyin'
          },
          step3: {
            title: isEnglish ? 'Accept Customers' : 'Müşterileri Kabul Edin',
            description: isEnglish ? 'Customers can book appointments online while you focus on your business' : 'Siz işinize odaklanırken müşteriler online randevu alabilir'
          }
        }
      },
      founders: {
        title: isEnglish ? 'Our Founders' : 'Kurucularımız',
        subtitle: isEnglish ? 'The innovative team behind Nokta' : 'Nokta\'nın arkasındaki yenilikçi ekip',
        egemen: {
          quote: isEnglish ? 'We founded Nokta to solve the problems in the appointment scheduling process for businesses. Our vision is to make appointment booking simple and efficient for everyone.' : 'Nokta\'yı işletmeler için randevu alma sürecindeki sorunları çözmek üzere kurduk. Vizyonumuz, randevu almayı herkes için basit ve verimli hale getirmek.',
          name: isEnglish ? 'Egemen Özyürek' : 'Egemen Özyürek',
          role: isEnglish ? 'Co-Founder' : 'Kurucu Ortak'
        },
        melike: {
          quote: isEnglish ? 'Our platform serves as a bridge between businesses and customers. We develop technologies that save time and eliminate appointment scheduling problems.' : 'Platformumuz işletmeler ve müşteriler arasında bir köprü görevi görüyor. Zaman kazandıran ve randevu alma sorunlarını ortadan kaldıran teknolojiler geliştiriyoruz.',
          name: isEnglish ? 'Melike Telef' : 'Melike Telef',
          role: isEnglish ? 'Co-Founder' : 'Kurucu Ortak'
        },
        sude: {
          quote: isEnglish ? 'At Nokta, we believe in creating seamless experiences. Our focus is on developing intuitive solutions that make appointment management effortless for businesses.' : 'Nokta\'da sorunsuz deneyimler yaratmaya inanıyoruz. Odak noktamız, işletmeler için randevu yönetimini zahmetsiz hale getiren sezgisel çözümler geliştirmek.',
          name: isEnglish ? 'Sude Alkan' : 'Sude Alkan',
          role: isEnglish ? 'Co-Founder' : 'Kurucu Ortak'
        }
      }
    },

    // Appointments page translations
    appointments: {
      title: isEnglish ? 'Appointments' : 'Randevular',
      loading: isEnglish ? 'Loading appointments...' : 'Randevular yükleniyor...',
      loadingDate: isEnglish ? 'Loading appointments for selected date...' : 'Seçili tarih için randevular yükleniyor...',
      noAppointments: isEnglish ? 'No appointments found' : 'Randevu bulunamadı',
      noAppointmentsToday: isEnglish ? 'No appointments found for today' : 'Bugün için randevu bulunamadı',
      noPendingAppointments: isEnglish ? 'No new appointments requiring approval' : 'Onay bekleyen yeni randevu yok',
      noExpiredAppointments: isEnglish ? 'No expired appointments found' : 'Süresi geçmiş randevu bulunamadı',
      noCompletedAppointments: isEnglish ? 'No completed or accepted appointments found' : 'Tamamlanmış veya kabul edilmiş randevu bulunamadı',
      expiredNote: isEnglish ? 'Note: Expired appointments are shown in the "Expired Appointments" tab' : 'Not: Süresi geçmiş randevular "Süresi Geçmiş Randevular" sekmesinde gösterilir',
      pendingExpiredNote: isEnglish ? 'Note: Expired pending appointments are shown in the Expired tab' : 'Not: Süresi geçmiş bekleyen randevular Süresi Geçmiş sekmesinde gösterilir',
      tabs: {
        today: isEnglish ? 'Today' : 'Bugün',
        pending: isEnglish ? 'Pending' : 'Bekleyen',
        expired: isEnglish ? 'Expired' : 'Süresi Geçmiş',
        all: isEnglish ? 'All' : 'Tümü'
      },
      calendar: {
        monthYear: isEnglish ? '{month} {year}' : '{month} {year}',
        days: {
          sun: isEnglish ? 'Sun' : 'Paz',
          mon: isEnglish ? 'Mon' : 'Pzt',
          tue: isEnglish ? 'Tue' : 'Sal',
          wed: isEnglish ? 'Wed' : 'Çar',
          thu: isEnglish ? 'Thu' : 'Per',
          fri: isEnglish ? 'Fri' : 'Cum',
          sat: isEnglish ? 'Sat' : 'Cmt'
        },
        appointmentsFor: isEnglish ? 'Appointments for {date}' : '{date} için Randevular',
        noAppointmentsFor: isEnglish ? 'No appointment found for {date}' : '{date} için randevu bulunamadı'
      },
      appointment: {
        id: isEnglish ? 'ID' : 'ID',
        customer: isEnglish ? 'Customer' : 'Müşteri',
        note: isEnglish ? 'Note' : 'Not',
        created: isEnglish ? 'Created' : 'Oluşturulma',
        status: {
          accepted: isEnglish ? 'Accepted' : 'Kabul Edildi',
          pending: isEnglish ? 'Pending' : 'Bekliyor',
          rejected: isEnglish ? 'Rejected' : 'Reddedildi',
          completed: isEnglish ? 'Completed' : 'Tamamlandı',
          awaiting: isEnglish ? 'Awaiting' : 'Bekliyor'
        },
        actions: {
          accept: isEnglish ? 'Accept' : 'Kabul Et',
          complete: isEnglish ? 'Complete' : 'Tamamla',
          completeAndRemove: isEnglish ? 'Complete & Remove' : 'Tamamla ve Kaldır',
          cancel: isEnglish ? 'Cancel' : 'İptal Et',
          reject: isEnglish ? 'Reject' : 'Reddet',
          remove: isEnglish ? 'Remove' : 'Kaldır',
          keep: isEnglish ? 'Keep' : 'Sakla',
          delete: isEnglish ? 'Delete' : 'Sil'
        }
      },
      confirmations: {
        completeAndRemove: {
          title: isEnglish ? 'Complete & Remove Appointment' : 'Randevuyu Tamamla ve Kaldır',
          message: isEnglish ? 'Are you sure you want to mark appointment #{id} as completed and remove it?\nThis will delete the appointment from your list.' : '#{id} numaralı randevuyu tamamlandı olarak işaretleyip kaldırmak istediğinize emin misiniz?\nBu işlem randevuyu listenizden silecektir.'
        },
        cancel: {
          title: isEnglish ? 'Cancel Appointment' : 'Randevuyu İptal Et',
          message: isEnglish ? 'Are you sure you want to cancel appointment #{id}?\nThis will delete the appointment and cannot be undone.' : '#{id} numaralı randevuyu iptal etmek istediğinize emin misiniz?\nBu işlem randevuyu silecek ve geri alınamaz.'
        }
      }
    },

    // Statistics page translations
    statistics: {
      title: isEnglish ? 'Statistics Dashboard' : 'İstatistik Paneli',
      loading: isEnglish ? 'Loading statistics...' : 'İstatistikler yükleniyor...',
      error: isEnglish ? 'Error' : 'Hata',
      tryAgain: isEnglish ? 'Try Again' : 'Tekrar Dene',
      stats: {
        totalAppointments: isEnglish ? 'Total Appointments' : 'Toplam Randevu',
        completed: isEnglish ? 'Completed' : 'Tamamlanan',
        pending: isEnglish ? 'Pending' : 'Bekleyen',
        cancelled: isEnglish ? 'Cancelled' : 'İptal Edilen'
      },
      charts: {
        dailyDistribution: isEnglish ? 'Daily Distribution' : 'Günlük Dağılım',
        monthlyDistribution: isEnglish ? 'Monthly Distribution' : 'Aylık Dağılım',
        appointmentActivity: isEnglish ? 'Appointment Activity (Last 12 Weeks)' : 'Randevu Aktivitesi (Son 12 Hafta)',
        days: {
          sun: isEnglish ? 'Sun' : 'Paz',
          mon: isEnglish ? 'Mon' : 'Pzt',
          tue: isEnglish ? 'Tue' : 'Sal',
          wed: isEnglish ? 'Wed' : 'Çar',
          thu: isEnglish ? 'Thu' : 'Per',
          fri: isEnglish ? 'Fri' : 'Cum',
          sat: isEnglish ? 'Sat' : 'Cmt'
        },
        months: {
          jan: isEnglish ? 'Jan' : 'Oca',
          feb: isEnglish ? 'Feb' : 'Şub',
          mar: isEnglish ? 'Mar' : 'Mar',
          apr: isEnglish ? 'Apr' : 'Nis',
          may: isEnglish ? 'May' : 'May',
          jun: isEnglish ? 'Jun' : 'Haz',
          jul: isEnglish ? 'Jul' : 'Tem',
          aug: isEnglish ? 'Aug' : 'Ağu',
          sep: isEnglish ? 'Sep' : 'Eyl',
          oct: isEnglish ? 'Oct' : 'Eki',
          nov: isEnglish ? 'Nov' : 'Kas',
          dec: isEnglish ? 'Dec' : 'Ara'
        },
        legend: {
          noAppointments: isEnglish ? 'No appointments' : 'Randevu yok',
          oneToTwoAppointments: isEnglish ? '1-2 appointments' : '1-2 randevu',
          threePlusAppointments: isEnglish ? '3+ appointments' : '3+ randevu'
        }
      }
    },

    // Menu page translations
    menu: {
      title: {
        en: "Restaurant Menu",
        tr: "Restoran Menüsü"
      },
      loading: {
        en: "Loading menu...",
        tr: "Menü yükleniyor..."
      },
      error: {
        en: "Error Loading Menu",
        tr: "Menü Yüklenirken Hata"
      },
      tryAgain: {
        en: "Try Again",
        tr: "Tekrar Dene"
      },
      addItem: {
        en: "Add New Item",
        tr: "Yeni Ürün Ekle"
      },
      editItem: {
        en: "Edit",
        tr: "Düzenle"
      },
      deleteItem: {
        en: "Delete",
        tr: "Sil"
      },
      noMenu: {
        en: "No menu items available",
        tr: "Menüde ürün bulunmuyor"
      },
      cancel: {
        en: "Cancel",
        tr: "İptal"
      },
      save: {
        en: "Save",
        tr: "Kaydet"
      },
      form: {
        name: {
          en: "Item Name",
          tr: "Ürün Adı"
        },
        namePlaceholder: {
          en: "Enter item name",
          tr: "Ürün adını girin"
        },
        description: {
          en: "Description",
          tr: "Açıklama"
        },
        descriptionPlaceholder: {
          en: "Enter item description",
          tr: "Ürün açıklamasını girin"
        },
        price: {
          en: "Price",
          tr: "Fiyat"
        },
        pricePlaceholder: {
          en: "Enter price",
          tr: "Fiyatı girin"
        },
        category: {
          en: "Category",
          tr: "Kategori"
        },
        categoryPlaceholder: {
          en: "Select category",
          tr: "Kategori seçin"
        },
        image: {
          en: "Image",
          tr: "Resim"
        }
      },
      categories: {
        appetizers: {
          en: "Appetizers",
          tr: "Başlangıçlar"
        },
        mainCourses: {
          en: "Main Courses",
          tr: "Ana Yemekler"
        },
        desserts: {
          en: "Desserts",
          tr: "Tatlılar"
        },
        beverages: {
          en: "Beverages",
          tr: "İçecekler"
        }
      },
      confirmations: {
        deleteTitle: {
          en: "Delete Item",
          tr: "Ürünü Sil"
        },
        deleteMessage: {
          en: "Are you sure you want to delete this item?",
          tr: "Bu ürünü silmek istediğinizden emin misiniz?"
        },
        deleteCancel: {
          en: "Cancel",
          tr: "İptal"
        },
        deleteConfirm: {
          en: "Delete",
          tr: "Sil"
        }
      },

      // Directions page translations
      directions: {
        title: {
          en: 'Directions & Hours',
          tr: 'Yön Tarifi ve Çalışma Saatleri'
        },
        loading: {
          en: 'Loading business information...',
          tr: 'İşletme bilgileri yükleniyor...'
        },
        error: {
          en: 'Error',
          tr: 'Hata'
        },
        tryAgain: {
          en: 'Try Again',
          tr: 'Tekrar Dene'
        },
        address: {
          en: 'Address',
          tr: 'Adres'
        },
        phone: {
          en: 'Phone',
          tr: 'Telefon'
        },
        email: {
          en: 'Email',
          tr: 'E-posta'
        },
        website: {
          en: 'Website',
          tr: 'Web Sitesi'
        },
        getDirections: {
          en: 'Get Directions',
          tr: 'Yol Tarifi Al'
        },
        callUs: {
          en: 'Call Us',
          tr: 'Bizi Arayın'
        },
        businessHours: {
          en: 'Business Hours',
          tr: 'Çalışma Saatleri'
        },
        businessInformation: {
          en: 'Business Information',
          tr: 'İşletme Bilgileri'
        },
        category: {
          en: 'Category',
          tr: 'Kategori'
        },
        owner: {
          en: 'Owner',
          tr: 'İşletme Sahibi'
        },
        specialNotice: {
          en: 'Our hours may vary on special occasions and holidays. Please call us for the most up-to-date information.',
          tr: 'Özel günler ve tatillerde çalışma saatlerimiz değişiklik gösterebilir. Güncel bilgi için lütfen bizi arayın.'
        },
        transportation: {
          en: 'Transportation',
          tr: 'Ulaşım'
        },
        parking: {
          en: 'Parking',
          tr: 'Otopark'
        },
        publicTransport: {
          en: 'Public Transport',
          tr: 'Toplu Taşıma'
        },
        parkingDescription: {
          en: 'Free parking available.',
          tr: 'Ücretsiz otopark mevcuttur.'
        },
        publicTransportDescription: {
          en: '5 minutes walking distance from Kadıköy Metro Station.',
          tr: 'Kadıköy Metro İstasyonu\'na 5 dakika yürüme mesafesindedir.'
        },
        days: {
          monday: {
            en: 'Monday',
            tr: 'Pazartesi'
          },
          tuesday: {
            en: 'Tuesday',
            tr: 'Salı'
          },
          wednesday: {
            en: 'Wednesday',
            tr: 'Çarşamba'
          },
          thursday: {
            en: 'Thursday',
            tr: 'Perşembe'
          },
          friday: {
            en: 'Friday',
            tr: 'Cuma'
          },
          saturday: {
            en: 'Saturday',
            tr: 'Cumartesi'
          },
          sunday: {
            en: 'Sunday',
            tr: 'Pazar'
          }
        },
        today: {
          en: 'Today',
          tr: 'Bugün'
        },
        locationNotice: {
          en: 'Your business location information is being shared on your page',
          tr: 'İşletme konum bilgileriniz sayfanızda paylaşılmaktadır'
        }
      },
      profile: {
        title: {
          en: 'Profile',
          tr: 'Profil'
        },
        loading: {
          en: 'Loading profile...',
          tr: 'Profil yükleniyor...'
        },
        error: {
          general: {
            en: 'Error',
            tr: 'Hata'
          },
          businessIdNotFound: {
            en: 'Business ID not found in user data.',
            tr: 'Kullanıcı verilerinde işletme ID\'si bulunamadı.'
          },
          fetchFailed: {
            en: 'Failed to fetch business data.',
            tr: 'İşletme verileri alınamadı.'
          },
          profileDataIssue: {
            en: 'Profile Data Issue',
            tr: 'Profil Veri Sorunu'
          },
          contactSupport: {
            en: 'Your account doesn\'t seem to be properly set up as a business account. Please contact support for assistance.',
            tr: 'Hesabınız bir işletme hesabı olarak düzgün yapılandırılmamış görünüyor. Lütfen yardım için destek ekibiyle iletişime geçin.'
          },
          loadingProfile: {
            en: 'Error Loading Profile',
            tr: 'Profil Yüklenirken Hata'
          }
        },
        tryAgain: {
          en: 'Try Again',
          tr: 'Tekrar Dene'
        },
        notLoggedIn: {
          title: {
            en: 'Please Log In to View Your Profile',
            tr: 'Profilinizi Görüntülemek İçin Giriş Yapın'
          },
          message: {
            en: 'You need to be logged in to access your business profile information.',
            tr: 'İşletme profil bilgilerinize erişmek için giriş yapmanız gerekmektedir.'
          },
          loginButton: {
            en: 'Go to Login',
            tr: 'Giriş Yap'
          }
        },
        businessInfo: {
          title: {
            en: 'Business Information',
            tr: 'İşletme Bilgileri'
          },
          name: {
            en: 'Business Name',
            tr: 'İşletme Adı'
          },
          owner: {
            en: 'Owner Name',
            tr: 'İşletme Sahibi'
          },
          category: {
            en: 'Category',
            tr: 'Kategori'
          },
          address: {
            en: 'Address',
            tr: 'Adres'
          },
          phone: {
            en: 'Phone',
            tr: 'Telefon'
          },
          email: {
            en: 'Email',
            tr: 'E-posta'
          },
          description: {
            en: 'Description',
            tr: 'Açıklama'
          }
        },
        workingHours: {
          title: {
            en: 'Working Hours',
            tr: 'Çalışma Saatleri'
          },
          opening: {
            en: 'Opening Time',
            tr: 'Açılış Saati'
          },
          closing: {
            en: 'Closing Time',
            tr: 'Kapanış Saati'
          }
        },
        services: {
          title: {
            en: 'Services',
            tr: 'Hizmetler'
          },
          messaging: {
            en: 'Messaging Service',
            tr: 'Mesajlaşma Servisi'
          },
          statistics: {
            en: 'Statistics',
            tr: 'İstatistikler'
          },
          menu: {
            en: 'Menu and Prices',
            tr: 'Menü ve Fiyatlar'
          },
          directions: {
            en: 'Directions',
            tr: 'Yol Tarifi'
          }
        },
        actions: {
          edit: {
            en: 'Edit Profile',
            tr: 'Profili Düzenle'
          },
          save: {
            en: 'Save Changes',
            tr: 'Değişiklikleri Kaydet'
          },
          cancel: {
            en: 'Cancel',
            tr: 'İptal'
          }
        },
        messages: {
          saveSuccess: {
            en: 'Profile updated successfully!',
            tr: 'Profil başarıyla güncellendi!'
          },
          saveError: {
            en: 'Failed to update profile. Please try again.',
            tr: 'Profil güncellenemedi. Lütfen tekrar deneyin.'
          }
        }
      }
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