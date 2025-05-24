import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking, TextInput, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const Template16 = ({ business, colorScheme }) => {
  // Template 16: All features enabled (messaging, statistics, menu prices, directions)
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState('');
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

  const handleSendMessage = () => {
    if (message.trim() === '') return;
    
    // In a real app, you would send the message to an API
    console.log('Sending message:', message);
    
    // Reset and close modal
    setMessage('');
    setShowMessageModal(false);
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
              <Ionicons name="chatbubble-outline" size={14} color="#fff" />
              <Text style={styles.badgeText}>Messaging</Text>
            </View>
            <View style={styles.badge}>
              <Ionicons name="stats-chart-outline" size={14} color="#fff" />
              <Text style={styles.badgeText}>Statistics</Text>
            </View>
            <View style={styles.badge}>
              <Ionicons name="restaurant-outline" size={14} color="#fff" />
              <Text style={styles.badgeText}>Menu</Text>
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
        
        {/* Statistics Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="stats-chart-outline" size={24} color={colorScheme.primary} />
            <Text style={[styles.sectionTitle, { color: colorScheme.primary }]}>Weekly Visits</Text>
          </View>
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
        </View>
        
        {/* Contact Section */}
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
          
          <TouchableOpacity 
            style={[styles.messageButton, { backgroundColor: colorScheme.primary }]}
            onPress={() => setShowMessageModal(true)}
          >
            <Ionicons name="chatbubble" size={20} color="#fff" />
            <Text style={styles.messageButtonText}>Send Message</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.templateInfo}>
          <Text style={styles.templateText}>Template 16: Premium Website</Text>
          <Text style={styles.templateFeatures}>All features enabled</Text>
        </View>
      </View>
      
      {/* Message Modal */}
      <Modal
        visible={showMessageModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowMessageModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Send Message to {business?.name}</Text>
              <TouchableOpacity onPress={() => setShowMessageModal(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={styles.messageInput}
              placeholder="Type your message here..."
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={4}
            />
            
            <TouchableOpacity 
              style={[styles.sendButton, { backgroundColor: colorScheme.primary }]}
              onPress={handleSendMessage}
            >
              <Text style={styles.sendButtonText}>Send Message</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  },
  directionsButtonText: {
    color: '#fff',
    fontWeight: 'bold',
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
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  messageButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    width: '100%',
    maxWidth: 500,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3748',
  },
  messageInput: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  sendButton: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Template16;
