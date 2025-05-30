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
                translateY: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              },
              {
                scale: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.9, 1],
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
    paddingTop: 30,
    paddingBottom: 30,
    justifyContent: 'space-between',
    minHeight: '100%',
  },
  cardsContainer: {
    flex: 1,
    gap: 25,
    justifyContent: 'space-evenly',
    marginTop: 20,
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
    height: 110,
    justifyContent: 'space-between',
  },
  leftContent: {
    marginRight: 15,
  },
  rightContent: {
    flex: 1,
  },
  iconContainer: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 10,
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
    paddingBottom: 10,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 10,
    paddingHorizontal: 30,
  },
  disabledDateItem: {
    backgroundColor: '#e0e0e0',
    opacity: 0.5,
  },
  disabledDateText: {
    color: '#999',
  },
});
