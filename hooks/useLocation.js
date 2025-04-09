import { useEffect, useState } from "react";
import * as Location from "expo-location";

export default function useLocation() {
  const [locationInfo, setLocationInfo] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Konum izni reddedildi");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      let address = await Location.reverseGeocodeAsync(location.coords);

      if (address.length > 0) {
        const { region, city } = address[0]; // 👈 il = region, ilçe = city
        setLocationInfo({ il: region, ilce: city });
      }
    })();
  }, []);

  return locationInfo;
}
