import { firestore } from "react-native-firebase";
import { GeoFirestore } from 'geofirestore';
import Collections from "../models/firebase/collections";

export default class LocationService {
  static getCollection() {
    // @ts-ignore
    const geoFirestore = new GeoFirestore(firestore());
    
    return geoFirestore.collection(Collections.LOCATIONS);
  }
}