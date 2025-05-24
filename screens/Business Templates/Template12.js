import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const Template12 = ({ business, colorScheme }) => {
  // Template 12: Statistics, menu prices, and directions features enabled
  const [showMenu, setShowMenu] = useState(false);
  
  // Sample menu data (in a real app, this would come from an API)
  const menuItems = [
    { id: 1, name: 'Item 1', price: '15.99 TL', description: 'Description for item 1' },
    { id: 2, name: 'Item 2', price: '24.99 TL', description: 'Description for item 2' },
    { id: 3, name: 'Item 3', price: '19.99 TL', description: 'Description for item 3' },
    { id: 4, name: 'Item 4', price: '12.99 TL', description: 'Description for item 4' },
    { id: 5, name: 'Item 5', price: '29.99 TL', description: 'Description for item 5' },
  ];
  
  // Sample statistics data (in a real app, this would come from an API)
  const statisticsData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43, 50],
      }
    ]
  };

  const visitorsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [350, 420, 380, 590, 510, 450],
      }
    ]
  };

  const handleCall = () => {
    if (business?.contactNumber) {
      Linking.openURL(`tel:${business.contactNumber}`);
    }
  };

  const handleMap = () => {
    if (business?.address) {
      const address = encodeURIComponent(business.address);
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${address}`);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={colorScheme.gradient || ['#4B63DB', '#8B5CF6', '#A682FF']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.businessInfo}>
          <Text style={styles.businessName}>{business?.name || 'Business Name'}</Text>
          <Text style={styles.businessCategory}>{business?.category || 'Category'}</Text>
          
          <View style={styles.featureBadges}>
            <View style={styles.badge}>
              <Ionicons name="stats-chart-outline" size={14} color="#fff" />
              <Text style={styles.badgeText}>Statistics</Text>
            </View>
            <View style={styles.badge}>
              <Ionicons name="restaurant-outline" size={14} color="#fff" />
              <Text style={styles.badgeText}>Menu Prices</Text>
            </View>
            <View style={styles.badge}>
              <Ionicons name="navigate-outline" size={14} color="#fff" />
              <Text style={styles.badgeText}>Directions</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
      
      <View style={styles.content}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle-outline" size={24} color={colorScheme.primary} />
            <Text style={[styles.sectionTitle, { color: colorScheme.primary }]}>About</Text>
          </View>
          <Text style={styles.description}>{business?.description || 'No description available'}</Text>
        </View>
        
        {/* Menu Prices Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="restaurant-outline" size={24} color={colorScheme.primary} />
            <Text style={[styles.sectionTitle, { color: colorScheme.primary }]}>Menu</Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.toggleButton, { backgroundColor: colorScheme.primary }]}
            onPress={() => setShowMenu(!showMenu)}
          >
            <Text style={styles.toggleButtonText}>
              {showMenu ? 'Hide Menu' : 'Show Menu'}
            </Text>
          </TouchableOpacity>
          
          {showMenu && (
            <View style={styles.menuList}>
              {menuItems.map(item => (
                <View key={item.id} style={styles.menuItem}>
                  <View style={styles.menuItemHeader}>
                    <Text style={styles.menuItemName}>{item.name}</Text>
                    <Text style={[styles.menuItemPrice, { color: colorScheme.primary }]}>{item.price}</Text>
                  </View>
                  <Text style={styles.menuItemDescription}>{item.description}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
        
        {/* Statistics Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="stats-chart-outline" size={24} color={colorScheme.primary} />
            <Text style={[styles.sectionTitle, { color: colorScheme.primary }]}>Weekly Activity</Text>
          </View>
          <Text style={styles.statsDescription}>View our weekly activity statistics</Text>
          <BarChart
            data={statisticsData}
            width={width - 60}
            height={220}
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: colorScheme.primary,
              backgroundGradientFrom: colorScheme.primary,
              backgroundGradientTo: colorScheme.secondary,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="people-outline" size={24} color={colorScheme.primary} />
            <Text style={[styles.sectionTitle, { color: colorScheme.primary }]}>Monthly Visitors</Text>
          </View>
          <Text style={styles.statsDescription}>Our monthly visitor count</Text>
          <BarChart
            data={visitorsData}
            width={width - 60}
            height={220}
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: colorScheme.primary,
              backgroundGradientFrom: colorScheme.secondary,
              backgroundGradientTo: colorScheme.primary,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </View>
        
        {/* Directions Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="navigate-outline" size={24} color={colorScheme.primary} />
            <Text style={[styles.sectionTitle, { color: colorScheme.primary }]}>Location</Text>
          </View>
          
          <View style={styles.addressContainer}>
            <Text style={styles.addressText}>{business?.address || 'Address not available'}</Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.directionsButton, { backgroundColor: colorScheme.primary }]}
            onPress={handleMap}
          >
            <Ionicons name="navigate" size={20} color="#fff" />
            <Text style={styles.directionsButtonText}>Get Directions</Text>
          </TouchableOpacity>

          <View style={styles.directionsInfo}>
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={18} color={colorScheme.primary} />
              <Text style={styles.infoText}>
                {business?.openingHour && business?.closingHour 
                  ? `Open ${business.openingHour}:00 - ${business.closingHour}:00`
                  : 'Working hours not available'}
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <Ionicons name="information-circle-outline" size={18} color={colorScheme.primary} />
              <Text style={styles.infoText}>
                Tap "Get Directions" to open in maps app
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="call-outline" size={24} color={colorScheme.primary} />
            <Text style={[styles.sectionTitle, { color: colorScheme.primary }]}>Contact</Text>
          </View>
          
          <TouchableOpacity style={styles.contactItem} onPress={handleCall}>
            <Ionicons name="call" size={20} color={colorScheme.primary} />
            <Text style={styles.contactText}>{business?.contactNumber || 'No phone number available'}</Text>
          </TouchableOpacity>
          
          <View style={styles.contactItem}>
            <Ionicons name="mail" size={20} color={colorScheme.primary} />
            <Text style={styles.contactText}>{business?.email || 'No email available'}</Text>
          </View>
        </View>
        
        <View style={styles.templateInfo}>
          <Text style={styles.templateText}>Template 12: Multi-Feature Website</Text>
          <Text style={styles.templateFeatures}>Statistics, Menu Prices, and Directions features enabled</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 30,
    paddingTop: 50,
    paddingBottom: 50,
    alignItems: 'center',
  },
  businessInfo: {
    alignItems: 'center',
  },
  businessName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  businessCategory: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 8,
    marginBottom: 20,
  },
  featureBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 5,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 25,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  description: {
    fontSize: 16,
    color: '#4a5568',
    lineHeight: 24,
  },
  menuList: {
    marginTop: 15,
  },
  menuItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#edf2f7',
    paddingVertical: 15,
  },
  menuItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d3748',
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  menuItemDescription: {
    fontSize: 14,
    color: '#718096',
    marginTop: 5,
  },
  toggleButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  toggleButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  statsDescription: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 15,
  },
  addressContainer: {
    marginBottom: 15,
  },
  addressText: {
    fontSize: 16,
    color: '#4a5568',
    lineHeight: 24,
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 15,
  },
  directionsButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  directionsInfo: {
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    padding: 15,
    borderRadius: 10,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#4a5568',
    marginLeft: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  contactText: {
    fontSize: 16,
    color: '#4a5568',
    marginLeft: 10,
  },
  templateInfo: {
    marginTop: 10,
    marginBottom: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  templateText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#718096',
  },
  templateFeatures: {
    fontSize: 12,
    color: '#a0aec0',
    marginTop: 5,
  },
});

export default Template12;
