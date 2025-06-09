import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, ScrollView, Linking, FlatList, ActivityIndicator, KeyboardAvoidingView, Platform, Keyboard, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getTemplateFeatures, getEnabledFeatures, getTemplateDescription } from './TemplateManager';
import { LinearGradient } from 'expo-linear-gradient';
import { Dimensions } from 'react-native';
import { getBusinessReviews, calculateAverageRating, addBusinessReview } from '../services/BusinessReviewService';
import { sendMessage } from '../services/MessageService';
import { getCurrentUser } from '../services/UserService';

const { width } = Dimensions.get('window');

const getFeatureIcon = (feature) => {
  switch (feature) {
    case 'Messaging':
      return 'chatbubble-outline';
    case 'Menu Prices':
      return 'restaurant-outline';
    case 'Directions':
      return 'navigate-outline';
    case 'Reviews':
      return 'star-outline';
    default:
      return 'information-circle-outline';
  }
};

const getFeatureDescription = (feature) => {
  switch (feature) {
    case 'Messaging':
      return 'Allow customers to send messages directly';
    case 'Menu Prices':
      return 'Show menu items with prices and descriptions';
    case 'Directions':
      return 'Provide location map and directions';
    case 'Reviews':
      return 'View and write reviews for this business';
    default:
      return '';
  }
};

const TemplateFeaturesBadge = ({ templateId, colorScheme, business }) => {
  const features = getTemplateFeatures(templateId);
  const enabledFeatures = getEnabledFeatures(features);
  
  // State for feature modals
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  
  // Reviews states
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  
  // Fetch reviews when Reviews feature is selected
  useEffect(() => {
    if (showReviewsModal && business?.businessID) {
      fetchReviews();
    }
  }, [showReviewsModal]);
  
  const fetchReviews = async () => {
    if (!business?.businessID) return;
    
    setReviewsLoading(true);
    try {
      // Use the actual API service to fetch reviews
      const fetchedReviews = await getBusinessReviews(business.businessID);
      setReviews(fetchedReviews);
      
      // Calculate average rating
      const avgRating = calculateAverageRating(fetchedReviews);
      setAverageRating(avgRating);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      // Fallback to empty reviews if there's an error
      setReviews([]);
      setAverageRating(0);
    } finally {
      setReviewsLoading(false);
    }
  };
  
  const handleSubmitReview = async () => {
    if (userRating === 0) {
      alert('Please select a rating');
      return;
    }
    
    if (userComment.trim() === '') {
      alert('Please enter a comment');
      return;
    }

    setSubmittingReview(true);
    try {
      // Use the actual API service to submit the review
      const userId = 5; // Fixed userID for demo
      const businessId = business.businessID;
      const result = await addBusinessReview(userId, businessId, userRating, userComment);
      
      // Add the new review to the list
      const newReview = {
        ...result,
        userID: userId,
        businessID: businessId,
        rating: userRating,
        comment: userComment
      };
      
      // Add the new review to the list
      setReviews([...reviews, newReview]);
      
      // Recalculate average rating
      const avgRating = calculateAverageRating([...reviews, newReview]);
      setAverageRating(avgRating);
      
      // Reset form and close modal
      setUserRating(0);
      setUserComment('');
      setShowAddReviewModal(false);
      
      alert('Your review has been submitted!');
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };
  
  const renderStars = (rating, size = 16, interactive = false) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      let iconName = 'star-outline';
      if (i <= fullStars) {
        iconName = 'star';
      } else if (i === fullStars + 1 && hasHalfStar) {
        iconName = 'star-half';
      }
      
      if (interactive) {
        stars.push(
          <TouchableOpacity 
            key={i} 
            onPress={() => setUserRating(i)}
            style={{ padding: 4 }}
          >
            <Ionicons name={iconName} size={size} color={i <= userRating ? "#FFD700" : "#ccc"} />
          </TouchableOpacity>
        );
      } else {
        stars.push(
          <Ionicons key={i} name={iconName} size={size} color="#FFD700" />
        );
      }
    }
    
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {stars}
      </View>
    );
  };
  
  const formatReviewDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Sample menu data (in a real app, this would come from an API)
  const menuItems = [
    { id: 1, name: 'Item 1', price: '15.99 TL', description: 'Description for item 1' },
    { id: 2, name: 'Item 2', price: '24.99 TL', description: 'Description for item 2' },
    { id: 3, name: 'Item 3', price: '19.99 TL', description: 'Description for item 3' },
    { id: 4, name: 'Item 4', price: '12.99 TL', description: 'Description for item 4' },
    { id: 5, name: 'Item 5', price: '29.99 TL', description: 'Description for item 5' },
  ];

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
  
  const handleGetDirections = () => {
    if (business?.address) {
      const address = encodeURIComponent(business.address);
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${address}`);
    }
  };
  
  const handleFeaturePress = (feature) => {
    switch (feature) {
      case 'Messaging':
        setShowMessageModal(true);
        break;
      case 'Menu Prices':
        setShowMenuModal(true);
        break;
      case 'Directions':
        handleGetDirections();
        break;
      case 'Reviews':
        setShowReviewsModal(true);
        break;
    }
  };
  
  if (!enabledFeatures || enabledFeatures.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No website features available</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.featuresDetailContainer}>
        {enabledFeatures.map((feature, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.featureDetail}
            onPress={() => handleFeaturePress(feature)}
          >
            <Ionicons name={getFeatureIcon(feature)} size={20} color="#fff" />
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>{feature}</Text>
              <Text style={styles.featureDescription}>{getFeatureDescription(feature)}</Text>
            </View>
            <View style={styles.featureActionButton}>
              <Ionicons name="chevron-forward" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
        ))}
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
          <TouchableOpacity 
            style={styles.modalBackdrop}
            activeOpacity={1} 
            onPress={() => Keyboard.dismiss()}
          >
            <ScrollView 
              contentContainerStyle={styles.modalScrollContainer}
              keyboardShouldPersistTaps="handled"
            >
              <TouchableOpacity 
                activeOpacity={1} 
                onPress={() => {}}
                style={styles.modalContent}
              >
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
                  style={[styles.sendButton, { backgroundColor: colorScheme?.primary || '#4B63DB' }, sending && { opacity: 0.6 }]}
                  onPress={handleSendMessage}
                  disabled={sending}
                >
                  {sending ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={styles.sendButtonText}>Send Message</Text>
                  )}
                </TouchableOpacity>
              </TouchableOpacity>
            </ScrollView>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>
      
      {/* Menu Modal */}
      <Modal
        visible={showMenuModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowMenuModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <TouchableOpacity 
            style={styles.modalBackdrop}
            activeOpacity={1} 
            onPress={() => Keyboard.dismiss()}
          >
            <ScrollView 
              contentContainerStyle={styles.modalScrollContainer}
              keyboardShouldPersistTaps="handled"
            >
              <TouchableOpacity 
                activeOpacity={1} 
                onPress={() => {}}
                style={styles.modalContent}
              >
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{business?.name} Menu</Text>
                  <TouchableOpacity onPress={() => setShowMenuModal(false)}>
                    <Ionicons name="close" size={24} color="#333" />
                  </TouchableOpacity>
                </View>
                
                <ScrollView style={styles.menuContainer}>
                  {menuItems.map(item => (
                    <View key={item.id} style={styles.menuItem}>
                      <View style={styles.menuItemHeader}>
                        <Text style={styles.menuItemName}>{item.name}</Text>
                        <Text style={[styles.menuItemPrice, { color: colorScheme?.primary || '#4B63DB' }]}>{item.price}</Text>
                      </View>
                      <Text style={styles.menuItemDescription}>{item.description}</Text>
                    </View>
                  ))}
                </ScrollView>
              </TouchableOpacity>
            </ScrollView>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>
      
      {/* Reviews Modal */}
      <Modal
        visible={showReviewsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowReviewsModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <TouchableOpacity 
            style={styles.modalBackdrop}
            activeOpacity={1} 
            onPress={() => Keyboard.dismiss()}
          >
            <ScrollView 
              contentContainerStyle={styles.modalScrollContainer}
              keyboardShouldPersistTaps="handled"
            >
              <TouchableOpacity 
                activeOpacity={1} 
                onPress={() => {}}
                style={styles.modalContent}
              >
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{business?.name} Reviews</Text>
                  <TouchableOpacity onPress={() => setShowReviewsModal(false)}>
                    <Ionicons name="close" size={24} color="#333" />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.reviewSummary}>
                  <Text style={styles.averageRating}>
                    {averageRating > 0 ? averageRating.toFixed(1) : '0.0'}
                  </Text>
                  {renderStars(averageRating, 24)}
                  <Text style={styles.reviewCount}>
                    Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                  </Text>
                </View>
                
                <TouchableOpacity 
                  style={[styles.addReviewButton, { backgroundColor: colorScheme?.primary || '#4B63DB' }]}
                  onPress={() => setShowAddReviewModal(true)}
                >
                  <Ionicons name="create-outline" size={18} color="#fff" />
                  <Text style={styles.addReviewText}>Write a Review</Text>
                </TouchableOpacity>
                
                {reviewsLoading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colorScheme?.primary || '#4B63DB'} />
                  </View>
                ) : reviews.length > 0 ? (
                  <FlatList
                    data={reviews}
                    keyExtractor={(item, index) => `review-${index}`}
                    renderItem={({ item, index }) => (
                      <View style={styles.reviewItem}>
                        <View style={styles.reviewItemHeader}>
                          <View style={styles.userInfo}>
                            <View style={[styles.userAvatar, { backgroundColor: colorScheme?.primary || '#4B63DB' }]}>
                              <Text style={styles.userInitial}>
                                {String.fromCharCode(65 + index % 26)}
                              </Text>
                            </View>
                            <Text style={styles.userName}>User {item.userID}</Text>
                          </View>
                          <Text style={styles.reviewDate}>
                            {formatReviewDate(item.createdAt)}
                          </Text>
                        </View>
                        {renderStars(item.rating)}
                        <Text style={styles.reviewComment}>{item.comment}</Text>
                      </View>
                    )}
                    style={styles.reviewsList}
                  />
                ) : (
                  <Text style={styles.noReviewsText}>
                    No reviews yet. Be the first to review!
                  </Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>
      
      {/* Add Review Modal */}
      <Modal
        visible={showAddReviewModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddReviewModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <TouchableOpacity 
            style={styles.modalBackdrop}
            activeOpacity={1} 
            onPress={() => Keyboard.dismiss()}
          >
            <ScrollView 
              contentContainerStyle={styles.modalScrollContainer}
              keyboardShouldPersistTaps="handled"
            >
              <TouchableOpacity 
                activeOpacity={1} 
                onPress={() => {}}
                style={styles.modalContent}
              >
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Write a Review</Text>
                  <TouchableOpacity onPress={() => setShowAddReviewModal(false)}>
                    <Ionicons name="close" size={24} color="#333" />
                  </TouchableOpacity>
                </View>
                
                <Text style={styles.ratingLabel}>Your Rating</Text>
                <View style={styles.ratingStars}>
                  {renderStars(5, 32, true)}
                </View>
                
                <Text style={styles.commentLabel}>Your Review</Text>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Share your experience..."
                  value={userComment}
                  onChangeText={setUserComment}
                  multiline
                  numberOfLines={4}
                />
                
                <TouchableOpacity 
                  style={[
                    styles.submitButton, 
                    { backgroundColor: colorScheme?.primary || '#4B63DB' },
                    submittingReview && { opacity: 0.7 }
                  ]}
                  onPress={handleSubmitReview}
                  disabled={submittingReview}
                >
                  {submittingReview ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.submitButtonText}>Submit Review</Text>
                  )}
                </TouchableOpacity>
              </TouchableOpacity>
            </ScrollView>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 15,
  },
  featuresDetailContainer: {
    width: '100%',
  },
  featureDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  featureTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  featureTitle: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 2,
  },
  featureDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  featureActionButton: {
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  modalScrollContainer: {
    padding: 20,
    width: '100%',
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
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
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
  menuContainer: {
    maxHeight: 500,
  },
  menuItem: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f7fafc',
    borderRadius: 10,
  },
  menuItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
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
  },
  // Review styles
  reviewSummary: {
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  averageRating: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 5,
  },
  reviewCount: {
    color: '#718096',
    fontSize: 14,
    marginTop: 5,
  },
  addReviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  addReviewText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '600',
    fontSize: 16,
  },
  reviewsList: {
    maxHeight: 350,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  reviewItem: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#f7fafc',
    borderRadius: 10,
  },
  reviewItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  userInitial: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userName: {
    color: '#2d3748',
    fontSize: 16,
    fontWeight: '600',
  },
  reviewDate: {
    color: '#718096',
    fontSize: 12,
  },
  reviewComment: {
    color: '#4a5568',
    fontSize: 16,
    marginTop: 8,
    lineHeight: 22,
  },
  noReviewsText: {
    textAlign: 'center',
    color: '#718096',
    fontSize: 16,
    padding: 20,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 10,
  },
  ratingStars: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  commentLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 10,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  submitButton: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default TemplateFeaturesBadge; 