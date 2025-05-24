import React from 'react';

// Template features based on the provided table
const TEMPLATE_FEATURES = {
  1: { hasMessaging: false, hasStatistics: false, hasMenuPrices: false, hasDirections: false, hasReviews: true, description: "Sadece 'reviews' açık" },
  2: { hasMessaging: false, hasStatistics: false, hasMenuPrices: false, hasDirections: true, hasReviews: true, description: "'directions' ve 'reviews' açık" },
  3: { hasMessaging: false, hasStatistics: false, hasMenuPrices: true, hasDirections: false, hasReviews: true, description: "'menu prices' ve 'reviews' açık" },
  4: { hasMessaging: false, hasStatistics: false, hasMenuPrices: false, hasDirections: false, hasReviews: true, description: "Sadece 'reviews' açık" },
  5: { hasMessaging: true, hasStatistics: false, hasMenuPrices: false, hasDirections: false, hasReviews: true, description: "'messaging' ve 'reviews' açık" },
  6: { hasMessaging: false, hasStatistics: false, hasMenuPrices: true, hasDirections: true, hasReviews: true, description: "'menu prices', 'directions' ve 'reviews' açık" },
  7: { hasMessaging: false, hasStatistics: false, hasMenuPrices: false, hasDirections: true, hasReviews: true, description: "'directions' ve 'reviews' açık" },
  8: { hasMessaging: false, hasStatistics: false, hasMenuPrices: true, hasDirections: false, hasReviews: true, description: "'menu prices' ve 'reviews' açık" },
  9: { hasMessaging: true, hasStatistics: false, hasMenuPrices: false, hasDirections: true, hasReviews: true, description: "'messaging', 'directions' ve 'reviews' açık" },
  10: { hasMessaging: true, hasStatistics: false, hasMenuPrices: true, hasDirections: false, hasReviews: true, description: "'messaging', 'menu prices' ve 'reviews' açık" },
  11: { hasMessaging: true, hasStatistics: false, hasMenuPrices: false, hasDirections: false, hasReviews: true, description: "'messaging' ve 'reviews' açık" },
  12: { hasMessaging: false, hasStatistics: false, hasMenuPrices: true, hasDirections: true, hasReviews: true, description: "'menu prices', 'directions' ve 'reviews' açık" },
  13: { hasMessaging: true, hasStatistics: false, hasMenuPrices: true, hasDirections: true, hasReviews: true, description: "'messaging', 'menu prices', 'directions' ve 'reviews' açık" },
  14: { hasMessaging: true, hasStatistics: false, hasMenuPrices: false, hasDirections: true, hasReviews: true, description: "'messaging', 'directions' ve 'reviews' açık" },
  15: { hasMessaging: true, hasStatistics: false, hasMenuPrices: true, hasDirections: false, hasReviews: true, description: "'messaging', 'menu prices' ve 'reviews' açık" },
  16: { hasMessaging: true, hasStatistics: false, hasMenuPrices: true, hasDirections: true, hasReviews: true, description: "'messaging', 'menu prices', 'directions' ve 'reviews' açık" }
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
  if (features.hasMenuPrices) enabledFeatures.push('Menu Prices');
  if (features.hasDirections) enabledFeatures.push('Directions');
  if (features.hasReviews) enabledFeatures.push('Reviews');
  
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