import { auth, firestore } from "react-native-firebase";
import Collections from "../models/firebase/collections";
import PhotographerModel from "../models/firebase/photographer-model";
import { syncRemotePhotographerData } from "../store/actions/home";

let profileChangeListener = null;
let authListener = null;

const AuthenticationMiddleware = store => next => action => {
  try {
    if (authListener) {
      return;
    }

    authListener = auth().onAuthStateChanged((user) => {
      if (profileChangeListener) {
        profileChangeListener();
      }

      if (user && user.uid) {
        profileChangeListener = firestore().collection(Collections.PHOTOGRAPHERS)
        .doc(user.uid).onSnapshot((documentSnapshot) => {
          if (!documentSnapshot.exists) {
            auth().signOut();
            return;
          }

          const data = documentSnapshot.data() as PhotographerModel;
          store.dispatch(syncRemotePhotographerData(data));
        });
      }
    });
  } catch (exception) {
    console.error(exception);
  } finally {
    return next(action);
  }
}

export default AuthenticationMiddleware;