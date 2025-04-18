import { useState, useEffect } from "react";
import * as Location from "expo-location";

const useLocation = () => {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Location permission denied");
          setLoading(false);
          return;
        }

        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        setLocation(location);

        // Reverse geocoding using expo-location
        const address = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        if (address.length > 0) {
          const firstAddress = address[0];
          setAddress({
            formattedAddress: `${firstAddress.street || ''} ${firstAddress.name || ''}, ${firstAddress.district || ''}, ${firstAddress.city || ''}, ${firstAddress.region || ''}, ${firstAddress.country || ''}`.trim(),
            street: firstAddress.street,
            name: firstAddress.name,
            district: firstAddress.district,
            city: firstAddress.city,
            region: firstAddress.region,
            country: firstAddress.country,
            postalCode: firstAddress.postalCode,
          });
        }
      } catch (error) {
        setErrorMsg("Could not get location: " + error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { location, address, errorMsg, loading };
};

export default useLocation;
