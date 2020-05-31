import { updateLocation, isUpdatingRemote, syncRemotePhotographerData, signOut } from "../actions/home";
import PhotographerService from "../../services/photographer-service";
import LocationModel from "../../models/firebase/location-model";
import FirebaseProfileService from "../../services/firebase-profile-service";
import { auth } from "react-native-firebase";

export function updateRemoteLocation(location: LocationModel) {
  return async (dispatch: Function) => {
    try {
      dispatch(isUpdatingRemote(true));
      
      await PhotographerService.updateLocation(location);
      dispatch(updateLocation(location));
      dispatch(isUpdatingRemote(false));
    } catch (error) {
      console.log(error);
    }
  }
}

export function getRemotePhotographerData() {
  return async (dispatch: Function) => {
    try {
      if (!auth().currentUser) {
        return;
      }

      const photographer = await PhotographerService.getPhotographerProfile(auth().currentUser.uid);
      dispatch(syncRemotePhotographerData(photographer));
    } catch (error) {
      console.log(error);
    }
  }
}

export function remoteSignOut() {
  return async (dispatch: (args: any) => void) => {
    try {
      await auth().signOut();

      dispatch(signOut());
    } catch (error) {
      console.log(error);
    }
  }
}