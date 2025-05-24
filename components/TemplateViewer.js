import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Import the templates
import Template1 from '../screens/Business Templates/Template1';
import Template2 from '../screens/Business Templates/Template2';
import Template3 from '../screens/Business Templates/Template3';
import Template4 from '../screens/Business Templates/Template4';
import Template5 from '../screens/Business Templates/Template5';
import Template6 from '../screens/Business Templates/Template6';
import Template7 from '../screens/Business Templates/Template7';
import Template8 from '../screens/Business Templates/Template8';
import Template9 from '../screens/Business Templates/Template9';
import Template10 from '../screens/Business Templates/Template10';
import Template11 from '../screens/Business Templates/Template11';
import Template12 from '../screens/Business Templates/Template12';
import Template13 from '../screens/Business Templates/Template13';
import Template14 from '../screens/Business Templates/Template14';
import Template15 from '../screens/Business Templates/Template15';
import Template16 from '../screens/Business Templates/Template16';

// Create a map of template IDs to template components
const TEMPLATES = {
  1: Template1,
  2: Template2,
  3: Template3,
  4: Template4,
  5: Template5,
  6: Template6,
  7: Template7,
  8: Template8,
  9: Template9,
  10: Template10,
  11: Template11,
  12: Template12,
  13: Template13,
  14: Template14,
  15: Template15,
  16: Template16
};

const TemplateViewer = ({ templateId, business, colorScheme }) => {
  // Ensure templateId is a number between 1-16
  const id = Number(templateId);
  if (isNaN(id) || id < 1 || id > 16) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Invalid template ID: {templateId}</Text>
      </View>
    );
  }

  // Get the appropriate template component
  const TemplateComponent = TEMPLATES[id];
  
  // Handle missing template component (should not happen if all templates are implemented)
  if (!TemplateComponent) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Template {id} not found</Text>
      </View>
    );
  }

  // Render the template with the business data and color scheme
  return <TemplateComponent business={business} colorScheme={colorScheme} />;
};

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  }
});

export default TemplateViewer; 