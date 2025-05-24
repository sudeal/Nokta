import React from 'react';

// Template features based on the provided table
const TEMPLATE_FEATURES = {
  1: { hasMessaging: false, hasStatistics: false, hasMenuPrices: false, hasDirections: false, description: "Hiçbir özellik açık değil" },
  2: { hasMessaging: false, hasStatistics: false, hasMenuPrices: false, hasDirections: true, description: "Sadece 'directions' açık" },
  3: { hasMessaging: false, hasStatistics: false, hasMenuPrices: true, hasDirections: false, description: "Sadece 'menu prices' açık" },
  4: { hasMessaging: false, hasStatistics: true, hasMenuPrices: false, hasDirections: false, description: "Sadece 'statistics' açık" },
  5: { hasMessaging: true, hasStatistics: false, hasMenuPrices: false, hasDirections: false, description: "Sadece 'messaging' açık" },
  6: { hasMessaging: false, hasStatistics: false, hasMenuPrices: true, hasDirections: true, description: "'menu prices' ve 'directions' açık" },
  7: { hasMessaging: false, hasStatistics: true, hasMenuPrices: false, hasDirections: true, description: "'statistics' ve 'directions' açık" },
  8: { hasMessaging: false, hasStatistics: true, hasMenuPrices: true, hasDirections: false, description: "'statistics' ve 'menu prices' açık" },
  9: { hasMessaging: true, hasStatistics: false, hasMenuPrices: false, hasDirections: true, description: "'messaging' ve 'directions' açık" },
  10: { hasMessaging: true, hasStatistics: false, hasMenuPrices: true, hasDirections: false, description: "'messaging' ve 'menu prices' açık" },
  11: { hasMessaging: true, hasStatistics: true, hasMenuPrices: false, hasDirections: false, description: "'messaging' ve 'statistics' açık" },
  12: { hasMessaging: false, hasStatistics: true, hasMenuPrices: true, hasDirections: true, description: "'statistics', 'menu prices' ve 'directions' açık" },
  13: { hasMessaging: true, hasStatistics: false, hasMenuPrices: true, hasDirections: true, description: "'messaging', 'menu prices' ve 'directions' açık" },
  14: { hasMessaging: true, hasStatistics: true, hasMenuPrices: false, hasDirections: true, description: "'messaging', 'statistics' ve 'directions' açık" },
  15: { hasMessaging: true, hasStatistics: true, hasMenuPrices: true, hasDirections: false, description: "'messaging', 'statistics' ve 'menu prices' açık" },
  16: { hasMessaging: true, hasStatistics: true, hasMenuPrices: true, hasDirections: true, description: "Tüm özellikler açık" }
};

/**
 * Get template features based on template ID
 * @param {number} templateId - The template ID (1-16)
 * @returns {Object} Template features
 */
export const getTemplateFeatures = (templateId) => {
  // Ensure templateId is a number between 1-16
  const id = Number(templateId);
  if (isNaN(id) || id < 1 || id > 16) {
    console.warn(`Invalid template ID: ${templateId}. Defaulting to template 1.`);
    return TEMPLATE_FEATURES[1];
  }
  
  return TEMPLATE_FEATURES[id];
};

/**
 * Render template feature badges
 * @param {Object} features - Template features object
 * @returns {Array} Array of feature names that are enabled
 */
export const getEnabledFeatures = (features) => {
  if (!features) return [];
  
  const enabledFeatures = [];
  if (features.hasMessaging) enabledFeatures.push('Messaging');
  if (features.hasStatistics) enabledFeatures.push('Statistics');
  if (features.hasMenuPrices) enabledFeatures.push('Menu Prices');
  if (features.hasDirections) enabledFeatures.push('Directions');
  
  return enabledFeatures;
};

/**
 * Get template description
 * @param {number} templateId - The template ID (1-16)
 * @returns {string} Template description
 */
export const getTemplateDescription = (templateId) => {
  const features = getTemplateFeatures(templateId);
  return features?.description || "Unknown template";
};

export default {
  getTemplateFeatures,
  getEnabledFeatures,
  getTemplateDescription
}; 