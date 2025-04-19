import React, { useState, useEffect, useRef } from 'react';
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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

const categoryData = {
  'Health Services': {
    color: ['#4158D0', '#C850C0'],
    icon: 'medical',
    subcategories: [
      { name: 'Doctor', icon: 'medical-outline' },
      { name: 'Dentist', icon: 'tooth-outline' },
      { name: 'Vet', icon: 'paw-outline' },
    ],
  },
  'Food & Beverages': {
    color: ['#FF9966', '#FF5E62'],
    icon: 'restaurant',
    subcategories: [
      { name: 'Restaurants', icon: 'restaurant-outline' },
      { name: 'Desserts', icon: 'ice-cream-outline' },
      { name: 'Fine Dining', icon: 'wine-outline' },
      { name: 'Pub & Bars', icon: 'beer-outline' },
    ],
  },
  'Selfcare': {
    color: ['#8E2DE2', '#4A00E0'],
    icon: 'cut',
    subcategories: [
      { name: 'Male Coiffure', icon: 'man-outline' },
      { name: 'Female Coiffure', icon: 'woman-outline' },
      { name: 'Nail Studios', icon: 'hand-left-outline' },
      { name: 'Tattoo & Piercing', icon: 'brush-outline' },
    ],
  },
};

const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Dünya'nın yarıçapı (km)
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const getWelcomeMessage = () => {
  return "Quality services you're looking for are at your fingertips 🌟";
};

export default function BusinessListScreen({ route, navigation }) {
  const { category } = route.params;
  const categoryInfo = categoryData[category];
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [selectedSubcategory]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError('Konum izni reddedildi');
        return;
      }

      try {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation(location.coords);
      } catch (error) {
        setLocationError('Konum alınamadı');
      }
    })();
  }, []);

  const fetchBusinesses = async (subcategory) => {
    setLoading(true);
    try {
      const response = await fetch('https://nokta-appservice.azurewebsites.net/api/Business');
      const data = await response.json();
      
      let filteredBusinesses = [];
      
      // Food & Beverages kategorisi için filtreler
      if (category === 'Food & Beverages') {
        switch (subcategory.name) {
          case 'Restaurants':
            filteredBusinesses = data.filter(business => 
              business.name.startsWith('Restaurant -')
            );
            break;
          case 'Desserts':
            filteredBusinesses = data.filter(business => 
              business.name.startsWith('Dessert -') || 
              business.name.startsWith('Pastry -')
            );
            break;
          case 'Fine Dining':
            filteredBusinesses = data.filter(business => 
              business.name.startsWith('Fine Dining -')
            );
            break;
          case 'Pub & Bars':
            filteredBusinesses = data.filter(business => 
              business.name.startsWith('Pub -') || 
              business.name.startsWith('Bar -')
            );
            break;
        }
      }
      // Health Services kategorisi için filtreler
      else if (category === 'Health Services') {
        switch (subcategory.name) {
          case 'Doctor':
            filteredBusinesses = data.filter(business => 
              business.name.startsWith('Doctor -')
            );
            break;
          case 'Dentist':
            filteredBusinesses = data.filter(business => 
              business.name.startsWith('Dentist -')
            );
            break;
          case 'Vet':
            filteredBusinesses = data.filter(business => 
              business.name.startsWith('Vet -') ||
              business.name.startsWith('Veterinary -')
            );
            break;
        }
      }
      // Selfcare kategorisi için filtreler
      else if (category === 'Selfcare') {
        switch (subcategory.name) {
          case 'Male Coiffure':
            filteredBusinesses = data.filter(business => 
              business.name.startsWith('Barber -') ||
              business.name.startsWith('Male Hair Salon -')
            );
            break;
          case 'Female Coiffure':
            filteredBusinesses = data.filter(business => 
              business.name.startsWith('Hair Salon -') ||
              business.name.startsWith('Female Hair Salon -')
            );
            break;
          case 'Nail Studios':
            filteredBusinesses = data.filter(business => 
              business.name.startsWith('Nail Salon -') ||
              business.name.startsWith('Nail Studio -')
            );
            break;
          case 'Tattoo & Piercing':
            filteredBusinesses = data.filter(business => 
              business.name.startsWith('Tattoo -') ||
              business.name.startsWith('Piercing -')
            );
            break;
        }
      }

      // Add distance to each business and sort by distance
      if (userLocation) {
        filteredBusinesses = filteredBusinesses.map(business => ({
          ...business,
          distance: getDistance(
            userLocation.latitude,
            userLocation.longitude,
            business.latitude,
            business.longitude
          )
        })).sort((a, b) => a.distance - b.distance);
      }

      console.log('Selected category:', category);
      console.log('Selected subcategory:', subcategory.name);
      console.log('Filtered businesses:', filteredBusinesses);

      setBusinesses(filteredBusinesses);
    } catch (error) {
      console.error('Error fetching businesses:', error);
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubcategoryPress = (subcategory) => {
    setSelectedSubcategory(subcategory);
    fetchBusinesses(subcategory);
  };

  const handleBusinessPress = (business) => {
    navigation.navigate('BusinessDetail', { business });
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

      if (businesses.length === 0) {
        return (
          <Animated.View 
            style={[
              styles.noResultsContainer,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim },
                  { scale: scaleAnim }
                ],
              }
            ]}
          >
            <Text style={styles.noResultsText}>İşletme bulunamadı</Text>
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
            }
          ]}
        >
          <Animated.View
            style={[
              styles.welcomeContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            <Text style={styles.welcomeText}>{getWelcomeMessage()}</Text>
          </Animated.View>

          {businesses.map((business, index) => (
            <Animated.View
              key={business.businessID}
              style={{
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim },
                  { scale: scaleAnim }
                ],
              }}
            >
              <TouchableOpacity
                style={[styles.businessCard, { marginTop: index === 0 ? 0 : 16 }]}
                onPress={() => handleBusinessPress(business)}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={categoryInfo.color}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.businessGradient}
                >
                  <View style={styles.businessInfo}>
                    <Text style={styles.businessName}>{business.name}</Text>
                    <Text style={styles.businessAddress}>{business.address}</Text>
                    <View style={styles.businessDetailsRow}>
                      <Text style={styles.businessHours}>
                        {business.openingHour}:00 - {business.closingHour}:00
                      </Text>
                      {business.distance && (
                        <Text style={styles.distanceText}>
                          {business.distance < 1 
                            ? `${Math.round(business.distance * 1000)} m`
                            : `${business.distance.toFixed(1)} km`}
                        </Text>
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

    return (
      <Animated.View 
        style={[
          styles.subcategoriesContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }
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
                <Ionicons name={subcategory.icon} size={32} color="#fff" />
              </View>
              <Text style={styles.subcategoryTitle}>{subcategory.name}</Text>
              <View style={styles.arrowContainer}>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </Animated.View>
    );
  };

  return (
    <LinearGradient
      colors={['#1A1A1A', '#2D2D2D']}
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
            }
          ]}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              if (selectedSubcategory) {
                setSelectedSubcategory(null);
                setBusinesses([]);
              } else {
                navigation.goBack();
              }
            }}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {selectedSubcategory ? selectedSubcategory.name : category}
          </Text>
        </Animated.View>

        <View style={styles.content}>
          {renderContent()}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 20,
  },
  backButton: {
    marginRight: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  subcategoriesContainer: {
    padding: 16,
  },
  subcategoryCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  subcategoryGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  subcategoryTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  arrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noResultsText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  businessList: {
    padding: 16,
  },
  businessCard: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  businessGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  businessInfo: {
    flex: 1,
  },
  businessName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  businessAddress: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  businessDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  distanceText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  businessHours: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  welcomeContainer: {
    marginBottom: 20,
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  welcomeText: {
    color: '#fff',
    fontSize: 17,
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
}); 