import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const categoryData = {
  'Health Services': {
    color: 'rgba(0, 122, 255, 0.9)',
    icon: 'medical',
    subcategories: [
      { name: 'Doctor', icon: 'medical-outline' },
      { name: 'Dentist', icon: 'tooth-outline' },
      { name: 'Vet', icon: 'paw-outline' },
    ],
  },
  'Food & Beverages': {
    color: 'rgba(255, 149, 0, 0.9)',
    icon: 'restaurant',
    subcategories: [
      { name: 'Restaurants', icon: 'restaurant-outline' },
      { name: 'Desserts', icon: 'ice-cream-outline' },
      { name: 'Fine Dining', icon: 'wine-outline' },
      { name: 'Pub & Bars', icon: 'beer-outline' },
    ],
  },
  'Selfcare': {
    color: 'rgba(175, 82, 222, 0.9)',
    icon: 'cut',
    subcategories: [
      { name: 'Male Coiffure', icon: 'man-outline' },
      { name: 'Female Coiffure', icon: 'woman-outline' },
      { name: 'Nail Studios', icon: 'hand-left-outline' },
      { name: 'Tattoo & Piercing', icon: 'brush-outline' },
    ],
  },
};

export default function BusinessListScreen({ route, navigation }) {
  const { category } = route.params;
  const categoryInfo = categoryData[category];
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

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
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>İşletme bulunamadı</Text>
          </View>
        );
      }

      return (
        <ScrollView style={styles.businessList}>
          {businesses.map((business) => (
            <TouchableOpacity
              key={business.businessID}
              style={styles.businessCard}
              onPress={() => handleBusinessPress(business)}
            >
              <View style={styles.businessInfo}>
                <Text style={styles.businessName}>{business.name}</Text>
                <Text style={styles.businessAddress}>{business.address}</Text>
                <Text style={styles.businessHours}>
                  Çalışma Saatleri: {business.openingHour}:00 - {business.closingHour}:00
                </Text>
              </View>
              <View style={styles.arrowContainer}>
                <Ionicons name="arrow-forward" size={20} color="#666" />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      );
    }

    return (
      <View style={styles.subcategoriesContainer}>
        {categoryInfo.subcategories.map((subcategory, index) => (
          <TouchableOpacity
            key={index}
            style={styles.subcategoryCard}
            onPress={() => handleSubcategoryPress(subcategory)}
          >
            <LinearGradient
              colors={[categoryInfo.color, categoryInfo.color.replace('0.9', '0.7')]}
              style={styles.subcategoryGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
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
      </View>
    );
  };

  return (
    <LinearGradient
      colors={['#0A1128', '#1C2541']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
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
        </View>

        <ScrollView style={styles.content}>
          {renderContent()}
        </ScrollView>
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
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  businessInfo: {
    flex: 1,
  },
  businessName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  businessAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  businessHours: {
    fontSize: 14,
    color: '#666',
  },
}); 