import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking, TextInput, Modal, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { sendMessage } from '../../services/MessageService';
import { getCurrentUser } from '../../services/UserService';

const { width } = Dimensions.get('window');

const Template16 = ({ business, colorScheme }) => {
  // Template 16: All features enabled (messaging, statistics, menu prices, directions)
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [sending, setSending] = useState(false);
  
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

  const handleSendMessage = async () => {
    if (message.trim() === '') {
      Alert.alert('Error', 'Please enter a message');
      return;
    }

    setSending(true);
    try {
      // Get current user
      const currentUser = await getCurrentUser();
      if (!currentUser || !currentUser.userID) {
        Alert.alert('Error', 'Please login to send messages');
        setSending(false);
        return;
      }

      // Debug business object
      console.log('Business object:', business);
      console.log('Business ID options:', {
        businessID: business?.businessID,
        id: business?.id,
        business_id: business?.business_id,
        businessId: business?.businessId
      });

      // Try different businessID field names
      const businessId = business?.businessID || business?.id || business?.business_id || business?.businessId;
      
      if (!businessId) {
        Alert.alert('Error', 'Business ID not found. Cannot send message.');
        setSending(false);
        return;
      }

      console.log('Sending message with:', {
        userID: currentUser.userID,
        businessID: businessId,
        content: message.trim()
      });

      // Send message
      await sendMessage(currentUser.userID, businessId, message.trim());
      
      Alert.alert('Success', 'Message sent successfully!');
      
      // Reset and close modal
      setMessage('');
      setShowMessageModal(false);
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setSending(false);
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
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalContent}>
              {/* Modal Header with Gradient */}
              <LinearGradient
                colors={[colorScheme.primary || '#4B63DB', colorScheme.secondary || '#8B5CF6']}
                style={styles.modalHeader}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <View style={styles.modalHeaderContent}>
                  <View style={styles.modalTitleContainer}>
                    <Ionicons name="chatbubble" size={24} color="#fff" />
                    <Text style={styles.modalTitle}>Send Message</Text>
                  </View>
                  <TouchableOpacity 
                    onPress={() => setShowMessageModal(false)}
                    style={styles.closeButton}
                  >
                    <Ionicons name="close" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.businessNameInModal}>to {business?.name}</Text>
              </LinearGradient>

              {/* Modal Body */}
              <View style={styles.modalBody}>
                <Text style={styles.inputLabel}>Your Message</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.messageInput}
                    placeholder="Type your message here..."
                    placeholderTextColor="#a0aec0"
                    value={message}
                    onChangeText={setMessage}
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                  />
                </View>

                {/* Send Button */}
                <TouchableOpacity 
                  style={[styles.sendButton, sending && styles.sendButtonDisabled]}
                  onPress={handleSendMessage}
                  disabled={sending}
                >
                  <LinearGradient
                    colors={sending ? ['#cbd5e0', '#a0aec0'] : [colorScheme.primary || '#4B63DB', colorScheme.secondary || '#8B5CF6']}
                    style={styles.sendButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    {sending ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <View style={styles.sendButtonContent}>
                        <Ionicons name="send" size={20} color="#fff" />
                        <Text style={styles.sendButtonText}>Send Message</Text>
                      </View>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 20,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '100%',
    maxWidth: 500,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
    overflow: 'hidden',
  },
  modalHeader: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
  closeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 8,
  },
  businessNameInModal: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 8,
    fontStyle: 'italic',
  },
  modalBody: {
    padding: 25,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 12,
  },
  inputContainer: {
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 15,
    padding: 0,
    marginBottom: 20,
    backgroundColor: '#f8f9fa',
  },
  messageInput: {
    fontSize: 16,
    color: '#4a5568',
    padding: 15,
    minHeight: 120,
    textAlignVertical: 'top',
    lineHeight: 22,
  },
  sendButton: {
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  sendButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default Template16;
