import React, { useState } from 'react';

const GoogleMapsAddress = ({ onChange, value }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getMyAddress = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if geolocation is available
      if (!navigator.geolocation) {
        throw new Error("Your browser doesn't support location features.");
      }

      // Get current position
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });

      const { latitude, longitude } = position.coords;

      // First update coordinates right away
      onChange({
        target: {
          name: 'coordinates',
          value: {
            lat: latitude,
            lng: longitude,
          }
        }
      });

      // Get the address from OpenStreetMap Nominatim (no API key required)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&accept-language=en`,
        {
          headers: {
            'Accept-Language': 'en-US,en',
            'User-Agent': 'NoktaBusinessRegistration/1.0'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Address not found: ${response.status}`);
      }

      const data = await response.json();
      
      if (data && data.display_name) {
        // Update address field with the formatted address
        onChange({
          target: {
            name: 'address',
            value: data.display_name,
          }
        });
      } else {
        throw new Error("Address not found, please try again.");
      }
    } catch (error) {
      console.error("Error getting location:", error);
      
      // User-friendly error messages
      let message = "Couldn't get location. Please try again.";
      
      if (error.code === 1) {
        message = "Location permission denied. Please enable location permission in your browser settings.";
      } else if (error.code === 2) {
        message = "Location unavailable. Please try again.";
      } else if (error.code === 3) {
        message = "Location request timed out. Please try again.";
      }
      
      setError(message);
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="address-field-container">
      <input
        type="text"
        name="address"
        placeholder="Click the button to get your location"
        value={value || ''}
        onChange={() => {}} // Prevent editing
        readOnly={true}
        required
        style={{ cursor: 'default' }}
      />
      <button 
        type="button"
        onClick={getMyAddress}
        disabled={loading}
        className="get-location-button"
        style={{ minWidth: '120px' }}
      >
        {loading ? (
          <span className="loading-spinner">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="spin">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
            </svg>
          </span>
        ) : "Get My Location"}
      </button>
      
      {error && (
        <div className="error-message" style={{ position: 'absolute', bottom: '-20px', left: '0', right: '0' }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default GoogleMapsAddress; 