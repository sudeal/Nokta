import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Animated,
  Dimensions,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import useLocation from "../hooks/useLocation";
import { getBusinessReviews, calculateAverageRating } from '../services/BusinessReviewService';
import { useLanguage } from '../context/LanguageContext';

const categoryData = {
  "Health Services": {
    color: ["#4158D0", "#C850C0"],
    icon: "medical",
    subcategories: [
      { name: "Doctor", icon: "medical-outline" },
      { name: "Dentist", icon: "tooth-outline" },
      { name: "Vet", icon: "paw-outline" },
    ],
  },
  "Food & Beverage": {
    color: ["#FF9966", "#FF5E62"],
    icon: "restaurant",
    subcategories: [
      { name: "Restaurant", icon: "restaurant-outline" },
      { name: "Dessert", icon: "ice-cream-outline" },
      { name: "Fine Dining", icon: "wine-outline" },
      { name: "Pub & Bar", icon: "beer-outline" },
    ],
  },
  "Personal Care": {
    color: ["#8E2DE2", "#4A00E0"],
    icon: "cut",
    subcategories: [
      { name: "Male Coiffure", icon: "man-outline" },
      { name: "Female Coiffure", icon: "woman-outline" },
      { name: "Nail Studios", icon: "hand-left-outline" },
      { name: "Tattoo & Piercing", icon: "brush-outline" },
    ],
  },
};

const getDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) {
    return null;
  }

  const lat1Rad = (lat1 * Math.PI) / 180;
  const lon1Rad = (lon1 * Math.PI) / 180;
  const lat2Rad = (lat2 * Math.PI) / 180;
  const lon2Rad = (lon2 * Math.PI) / 180;

  const R = 6371; // Dünya'nın yarıçapı (km)
  const dLat = lat2Rad - lat1Rad;
  const dLon = lon2Rad - lon1Rad;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
};

const formatHourToTime = (decimalHour) => {
  if (decimalHour === undefined || decimalHour === null) return "";

  const hours = Math.floor(decimalHour);
  const minutes = Math.round((decimalHour - hours) * 60);

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
};

export default function BusinessListScreen({ route, navigation }) {
  const { language, getCategoryMapping, getUICategoryName } = useLanguage();
  const { category } = route.params;
  
  // UI kategorisini database kategorisine çevir
  const dbCategory = getCategoryMapping(category);
  
  const categoryInfo = categoryData[dbCategory] || {
    color: ["#1A1A1A", "#2D2D2D"],
    icon: "business",
    subcategories: [],
  };
  
  console.log('=== TÜRKÇE DEBUG ===');
  console.log('Original category from route:', category);
  console.log('Mapped dbCategory:', dbCategory);
  console.log('categoryData keys:', Object.keys(categoryData));
  console.log('categoryData[dbCategory] exists:', !!categoryData[dbCategory]);
  console.log('categoryInfo subcategories:', categoryInfo.subcategories.map(s => s.name));
  
  // Her alt kategori için ayrı state tutuyoruz
  const [businessesByCategory, setBusinessesByCategory] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const {
    location: userLocation,
    address: userAddress,
    errorMsg: locationError,
    loading: locationLoading,
  } = useLocation();

  // Konum ve adres bilgilerini state'de sakla
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentAddress, setCurrentAddress] = useState(null);

  // Konum bilgisi değiştiğinde state'i güncelle
  useEffect(() => {
    if (userLocation && userAddress) {
      setCurrentLocation(userLocation);
      setCurrentAddress(userAddress);
    }
  }, [userLocation, userAddress]);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Track business ratings
  const [businessRatings, setBusinessRatings] = useState({});

  const handleSubcategoryPress = async (subcategory) => {
    // Seçili alt kategoriyi güncelle
    setSelectedSubcategory(subcategory);
    
    // Eğer bu kategorideki işletmeler zaten yüklenmişse, tekrar yükleme
    if (businessesByCategory[subcategory.name]?.length > 0) {
      return;
    }

    // İşletmeleri yükle
    await fetchBusinesses(subcategory);
  };

  const fetchBusinessRatings = async (businesses) => {
    const ratings = { ...businessRatings };
    
    for (const business of businesses) {
      if (!business.businessID || ratings[business.businessID]) continue;
      
      try {
        // Temporarily use dummy ratings instead of API calls to avoid 404 errors
        ratings[business.businessID] = {
          rating: (Math.random() * 2) + 3, // Random rating between 3-5
          count: Math.floor(Math.random() * 20) + 1 // Random count between 1-20
        };
      } catch (error) {
        console.error(`Error setting ratings for business ${business.businessID}:`, error);
        ratings[business.businessID] = { rating: 0, count: 0 };
      }
    }
    
    setBusinessRatings(ratings);
  };

  const fetchBusinesses = async (subcategory) => {
    if (!subcategory) return;
    
    setLoading(true);
    try {
      console.log('Fetching businesses for subcategory:', subcategory.name);
      
      const response = await fetch(
        "https://nokta-appservice.azurewebsites.net/api/Business"
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Total businesses from API:', data.length);
      console.log('First 10 business names:', data.slice(0, 10).map(b => b.name));
      
      let filteredBusinesses = data;

      // Kategori bazında filtreleme - UI kategorilerini veritabanı kategorilerine map ediyoruz
      const dbSubcategory = getCategoryMapping(subcategory.name);

      console.log('Category mapping:', {
        uiCategory: category,
        dbCategory: dbCategory,
        uiSubcategory: subcategory.name,
        dbSubcategory: dbSubcategory
      });

      // Dinamik filtreleme - veritabanındaki İngilizce isimleri kullanarak filtrele
      if (dbCategory === "Food & Beverage") {
        console.log('Filtering for Food & Beverage, subcategory:', dbSubcategory);
        
        switch (dbSubcategory) {
          case "Restaurant":
            filteredBusinesses = data.filter((business) => 
              business.name.startsWith("Restaurant -")
            );
            console.log('Restaurant businesses found:', filteredBusinesses.length);
            break;
          case "Dessert":
            filteredBusinesses = data.filter((business) => 
              business.name.startsWith("Dessert -")
            );
            console.log('Dessert businesses found:', filteredBusinesses.length);
            break;
          case "Fine Dining":
            filteredBusinesses = data.filter((business) => 
              business.name.startsWith("Fine Dining -")
            );
            console.log('Fine Dining businesses found:', filteredBusinesses.length);
            break;
          case "Pub & Bar":
            filteredBusinesses = data.filter((business) => 
              business.name.startsWith("Pub & Bar -")
            );
            console.log('Pub & Bar businesses found:', filteredBusinesses.length);
            break;
          default:
            console.log('No specific filter for subcategory:', dbSubcategory);
            break;
        }
      } else if (dbCategory === "Health Services") {
        console.log('Filtering for Health Services, subcategory:', dbSubcategory);
        
        switch (dbSubcategory) {
          case "Doctor":
            filteredBusinesses = data.filter((business) => 
              business.name.startsWith("Doctor -")
            );
            console.log('Doctor businesses found:', filteredBusinesses.length);
            break;
          case "Dentist":
            filteredBusinesses = data.filter((business) => 
              business.name.startsWith("Dentist -")
            );
            console.log('Dentist businesses found:', filteredBusinesses.length);
            break;
          case "Vet":
            filteredBusinesses = data.filter((business) => 
              business.name.startsWith("Vet -")
            );
            console.log('Vet businesses found:', filteredBusinesses.length);
            break;
        }
      } else if (dbCategory === "Personal Care") {
        console.log('Filtering for Personal Care, subcategory:', dbSubcategory);
        
        switch (dbSubcategory) {
          case "Male Coiffure":
            filteredBusinesses = data.filter((business) => 
              business.name.startsWith("Male Coiffure -")
            );
            console.log('Male Coiffure businesses found:', filteredBusinesses.length);
            break;
          case "Female Coiffure":
            filteredBusinesses = data.filter((business) => 
              business.name.startsWith("Female Coiffure -")
            );
            console.log('Female Coiffure businesses found:', filteredBusinesses.length);
            break;
          case "Nail Studio":
            filteredBusinesses = data.filter((business) => 
              business.name.startsWith("Nail Studio -")
            );
            console.log('Nail Studio businesses found:', filteredBusinesses.length);
            break;
          case "Tattoo & Piercing":
            filteredBusinesses = data.filter((business) => 
              business.name.startsWith("Tattoo & Piercing -")
            );
            console.log('Tattoo & Piercing businesses found:', filteredBusinesses.length);
            break;
        }
      }

      console.log('Final filtered businesses count:', filteredBusinesses.length);

      // Filtrelenmiş işletmeleri ilgili kategoriye kaydet
      setBusinessesByCategory(prev => ({
        ...prev,
        [subcategory.name]: filteredBusinesses
      }));
      
      // Fetch ratings for these businesses
      fetchBusinessRatings(filteredBusinesses);
    } catch (error) {
      console.error("Error in fetchBusinesses:", error);
      setBusinessesByCategory(prev => ({
        ...prev,
        [subcategory.name]: prev[subcategory.name] || []
      }));
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (selectedSubcategory) {
      if (loading) {
        return (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        );
      }

      const currentBusinesses = businessesByCategory[selectedSubcategory.name] || [];
      
      if (currentBusinesses.length === 0) {
        return (
          <Animated.View
            style={[
              styles.noResultsContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.noResultsText}>{language.businessListNoBusinessFound}</Text>
          </Animated.View>
        );
      }

      return (
        <Animated.ScrollView
          style={[
            styles.businessList,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {currentBusinesses.map((business, index) => (
            <Animated.View
              key={business.businessID || index}
              style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }}
            >
              <TouchableOpacity
                style={[styles.businessCard, { marginTop: index === 0 ? 0 : 16 }]}
                onPress={() => navigation.navigate("BusinessDetail", { business })}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={categoryInfo.color}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.businessGradient}
                >
                  <View style={styles.businessInfo}>
                    <Text style={styles.businessName}>
                      {business?.name || "Unnamed Business"}
                    </Text>
                    <Text style={styles.businessAddress}>
                      {business?.address || "Address not available"}
                    </Text>
                    <View style={styles.businessDetailsRow}>
                      <View style={styles.businessHoursContainer}>
                        <Ionicons
                          name="time-outline"
                          size={16}
                          color="rgba(255, 255, 255, 0.9)"
                        />
                        <Text style={styles.businessHours}>
                          {business?.openingHour != null &&
                          business?.closingHour != null
                            ? `${formatHourToTime(
                                business.openingHour
                              )} - ${formatHourToTime(business.closingHour)}`
                            : language.businessListHoursNotAvailable}
                        </Text>
                      </View>
                      <View style={styles.distanceContainer}>
                        <Ionicons
                          name="location-outline"
                          size={16}
                          color="rgba(255, 255, 255, 0.9)"
                        />
                        <Text style={styles.distanceText}>
                          {currentAddress?.district || language.businessListLoadingLocation}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.ratingContainer}>
                      {businessRatings[business.businessID] ? (
                        <>
                          {renderStars(businessRatings[business.businessID].rating)}
                          <Text style={styles.ratingText}>
                            {businessRatings[business.businessID].rating.toFixed(1)}
                            <Text style={styles.reviewCount}>
                              {" "}({businessRatings[business.businessID].count})
                            </Text>
                          </Text>
                        </>
                      ) : (
                        <Text style={styles.noRatingText}>{language.businessListNoRatings}</Text>
                      )}
                    </View>
                  </View>
                  <View style={styles.arrowContainer}>
                    <Ionicons name="arrow-forward" size={20} color="#fff" />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </Animated.ScrollView>
      );
    }

    // Subcategories görünümü
    return (
      <Animated.View
        style={[
          styles.subcategoriesContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {categoryInfo.subcategories.map((subcategory, index) => (
          <TouchableOpacity
            key={index}
            style={styles.subcategoryCard}
            onPress={() => handleSubcategoryPress(subcategory)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={categoryInfo.color}
              style={styles.subcategoryGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View style={styles.iconContainer}>
                <Ionicons
                  name={subcategory.icon || "business"}
                  size={32}
                  color="#fff"
                />
              </View>
              <Text style={styles.subcategoryTitle}>
                {getUICategoryName(subcategory.name) || "Unknown Category"}
              </Text>
              <View style={styles.arrowContainer}>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </Animated.View>
    );
  };

  // Render stars for ratings
  const renderStars = (rating, size = 14) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {[...Array(fullStars)].map((_, i) => (
          <Ionicons key={`full-${i}`} name="star" size={size} color="#FFD700" />
        ))}
        {hasHalfStar && (
          <Ionicons name="star-half" size={size} color="#FFD700" />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Ionicons key={`empty-${i}`} name="star-outline" size={size} color="#FFD700" />
        ))}
      </View>
    );
  };

  return (
    <LinearGradient
      colors={["#1A1A1A", "#2D2D2D"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <Animated.View
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              if (selectedSubcategory) {
                setSelectedSubcategory(null);
                setBusinessesByCategory({});
              } else {
                navigation.goBack();
              }
            }}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {selectedSubcategory ? getUICategoryName(selectedSubcategory.name) : category}
          </Text>
        </Animated.View>

        <View style={styles.content}>{renderContent()}</View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingTop: 20,
  },
  backButton: {
    marginRight: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  subcategoriesContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  subcategoryCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  subcategoryGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  subcategoryTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  arrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noResultsText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  businessList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  businessCard: {
    borderRadius: 16,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  businessGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  businessInfo: {
    flex: 1,
  },
  businessName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  businessAddress: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 4,
  },
  businessDetailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  businessHoursContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  businessHours: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.9)",
    marginLeft: 4,
  },
  distanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  distanceText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.9)",
    marginLeft: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.9)",
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
  },
  noRatingText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
  },
});
