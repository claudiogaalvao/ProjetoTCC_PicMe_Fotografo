import { GeoPoint } from "react-native-firebase/firestore";
import { getDistance } from 'geolib';

export class GeoUtils {
  static calculateDistance = (p1: GeoPoint, p2: GeoPoint) => {
    const distance = getDistance(
      { latitude: p1.latitude, longitude: p1.longitude },
      { latitude: p2.latitude, longitude: p2.longitude }
    );

    return distance;
  }
}