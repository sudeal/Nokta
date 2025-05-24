import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getTemplateFeatures, getEnabledFeatures } from './TemplateManager';

const getFeatureIcon = (feature) => {
  switch (feature) {
    case 'Messaging':
      return 'chatbubble-outline';
    case 'Statistics':
      return 'stats-chart-outline';
    case 'Menu Prices':
      return 'restaurant-outline';
    case 'Directions':
      return 'navigate-outline';
    default:
      return 'information-circle-outline';
  }
};

const TemplateFeaturesBadge = ({ templateId, colorScheme }) => {
  const features = getTemplateFeatures(templateId);
  const enabledFeatures = getEnabledFeatures(features);
  
  if (!enabledFeatures || enabledFeatures.length === 0) {
    return (
      <View style={styles.container}>
        <View style={[styles.badge, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
          <Ionicons name="alert-circle-outline" size={16} color="#fff" />
          <Text style={styles.badgeText}>No active features</Text>
        </View>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Website Features</Text>
      <View style={styles.badgeContainer}>
        {enabledFeatures.map((feature, index) => (
          <View 
            key={index} 
            style={[
              styles.badge, 
              { 
                backgroundColor: colorScheme?.accent ? `${colorScheme.accent}33` : 'rgba(255, 255, 255, 0.2)',
                borderColor: colorScheme?.accent ? `${colorScheme.accent}66` : 'rgba(255, 255, 255, 0.3)' 
              }
            ]}
          >
            <Ionicons name={getFeatureIcon(feature)} size={16} color="#fff" />
            <Text style={styles.badgeText}>{feature}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    marginLeft: 4,
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  badgeText: {
    color: '#fff',
    marginLeft: 6,
    fontWeight: '600',
    fontSize: 14,
  }
});

export default TemplateFeaturesBadge; 