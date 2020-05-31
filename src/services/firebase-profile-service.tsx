import firebase from "react-native-firebase";
import LocationModel from "../models/firebase/location-model";
import Collections from "../models/firebase/collections";

export default class FirebaseProfileService {
  static updatePosition = async (userPosition: LocationModel) => {
    const user = firebase.auth().currentUser;

    if (!user) {
      throw 'User not logged in.';
    }

    await firebase.firestore().collection(Collections.LOCATIONS).doc(user.uid).set(userPosition);
  }

  static isEmailAvailable = async (email: string) => {
    const user = await firebase.firestore().collection(Collections.USERS).where('email', '==', email).get();
    const photographer = await firebase.firestore().collection(Collections.PHOTOGRAPHERS).where('email', '==', email).get();

    return (user.empty && photographer.empty);
  }
}