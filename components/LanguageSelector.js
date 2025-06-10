import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useLanguage } from '../context/LanguageContext';

const LanguageSelector = ({ style }) => {
  const { currentLanguage, changeLanguage, t } = useLanguage();

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={[
          styles.languageButton,
          currentLanguage === 'en' && styles.activeButton
        ]}
        onPress={() => changeLanguage('en')}
      >
        <Text style={[
          styles.languageText,
          currentLanguage === 'en' && styles.activeText
        ]}>
          EN
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.languageButton,
          currentLanguage === 'tr' && styles.activeButton
        ]}
        onPress={() => changeLanguage('tr')}
      >
        <Text style={[
          styles.languageText,
          currentLanguage === 'tr' && styles.activeText
        ]}>
          TR
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 25,
    padding: 4,
    alignSelf: 'center',
  },
  languageButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    minWidth: 50,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  languageText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  activeText: {
    color: '#333',
  },
});

export default LanguageSelector; 