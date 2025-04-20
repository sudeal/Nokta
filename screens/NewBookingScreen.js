import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function NewBookingScreen({ navigation }) {
  // Animasyon değerleri
  const healthAnim = new Animated.Value(0);
  const foodAnim = new Animated.Value(0);
  const personalCareAnim = new Animated.Value(0);

  useEffect(() => {
    // Kartların sırayla görünme animasyonu
    Animated.stagger(150, [
      Animated.spring(healthAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(foodAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(personalCareAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const renderCategoryCard = (title, icon, color, tags, animation) => {
    return (
      <Animated.View
        style={[
          styles.cardContainer,
          {
            opacity: animation,
            transform: [
              {
                translateX: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-50, 0],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.card, { backgroundColor: color }]}
          onPress={() => {
            navigation.navigate('BusinessList', { 
              category: title,
            });
          }}
        >
          <LinearGradient
            colors={[color, color.replace('0.9', '0.7')]}
            style={styles.cardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.cardContent}>
              <View style={styles.leftContent}>
                <View style={styles.iconContainer}>
                  {icon}
                </View>
              </View>
              <View style={styles.rightContent}>
                <Text style={styles.cardTitle}>{title}</Text>
                <View style={styles.tagsContainer}>
                  {tags.map((tag, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <LinearGradient
      colors={['#0A1128', '#1C2541']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Service Categories</Text>
          <Text style={styles.headerSubtitle}>
            Choose your perfect service and book your appointment now!
          </Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="business-outline" size={24} color="#4CC9F0" />
              <Text style={styles.statNumber}>50+</Text>
              <Text style={styles.statLabel}>Businesses</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="star-outline" size={24} color="#4CC9F0" />
              <Text style={styles.statNumber}>4.8</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="people-outline" size={24} color="#4CC9F0" />
              <Text style={styles.statNumber}>1000+</Text>
              <Text style={styles.statLabel}>Happy Clients</Text>
            </View>
          </View>
        </View>
        <View style={styles.cardsContainer}>
          {renderCategoryCard(
            'Health Services',
            <Ionicons name="medical" size={32} color="#fff" />,
            'rgba(0, 122, 255, 0.9)',
            ['Doctor', 'Dentist', 'Vet'],
            healthAnim
          )}
          {renderCategoryCard(
            'Food & Beverages',
            <Ionicons name="restaurant" size={32} color="#fff" />,
            'rgba(255, 149, 0, 0.9)',
            ['Restaurants', 'Desserts', 'Fine Dining', 'Pub & Bars'],
            foodAnim
          )}
          {renderCategoryCard(
            'Personal Care',
            <Ionicons name="cut" size={32} color="#fff" />,
            'rgba(175, 82, 222, 0.9)',
            ['Male Coiffure', 'Female Coiffure', 'Nail Studios', 'Tattoo & Piercing'],
            personalCareAnim
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    justifyContent: 'center',
  },
  cardsContainer: {
    flex: 1,
    gap: 12,
    justifyContent: 'center',
  },
  cardContainer: {
    width: '100%',
  },
  card: {
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
  cardGradient: {
    padding: 20,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 120,
  },
  leftContent: {
    marginRight: 20,
  },
  rightContent: {
    flex: 1,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  tagText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
  headerContainer: {
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    borderRadius: 12,
    minWidth: 100,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CC9F0',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  disabledDateItem: {
    backgroundColor: '#e0e0e0',
    opacity: 0.5,
  },
  disabledDateText: {
    color: '#999',
  },
});
