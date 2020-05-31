import firebase from 'react-native-firebase';
import UserCreationRequest from '../models/request/user-creation.request';
import FirebaseUserModel from '../models/firebase/photographer-model';
import Collections from '../models/firebase/collections';

export default class FirebaseUserService {
  static readonly loggedIn: boolean = firebase.auth().currentUser !== null;

  static registerUser = async (request: UserCreationRequest) => {
    
  }

  static exists = async (uid: string): Promise<boolean> => {
    const collection = firebase.firestore().collection(Collections.PHOTOGRAPHERS);
    const document = collection.doc(uid);

    const user = await document.get();
    return user.exists;
  }

  static validateUserAccess = async (): Promise<void> => {
    if (firebase.auth().currentUser == null)
      throw { message: '' };
    
    const user = await FirebaseUserService.getUser(firebase.auth().currentUser.uid);

    if (!user) {
      FirebaseUserService.signOut();
      throw { message: 'This account is not allowed to login as photographer.' };
    }
    
    if (!user.active) {
      FirebaseUserService.signOut();
      throw { message: 'Photographer is not activated.' };
    }
    
    if (!user.permission) {
      FirebaseUserService.signOut();
      throw { message: 'Your register is pending approval by an admin.' }
    }
  }

  static currentUser = async (): Promise<FirebaseUserModel> => {
    const authUser = firebase.auth().currentUser;

    return await FirebaseUserService.getUser(authUser.uid);
  }

  static getUser = async (uid: string): Promise<FirebaseUserModel> => {
    const collection = firebase.firestore().collection(Collections.PHOTOGRAPHERS);
    const document = collection.doc(uid);

    const user = await document.get();
    return user.data() as FirebaseUserModel;
  }

  static updateDevices = async (uid: string, devicesObj: object) => {
    firebase.firestore().collection(Collections.PHOTOGRAPHERS).doc(uid).update({devices: devicesObj});
  }

  static signOut = () => {
    firebase.auth().signOut();
  }
}