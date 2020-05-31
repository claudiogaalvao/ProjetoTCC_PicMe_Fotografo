import { StatusEnum } from "../models/enum/status-enum";
import LocationService from "./location-service";
import { auth, firestore } from "react-native-firebase";
import LocationModel from "../models/firebase/location-model";
import PhotographerModel from "../models/firebase/photographer-model";
import Collections from "../models/firebase/collections";
import RequestModel from "../models/firebase/request-model";
import { RequestStatusEnum } from "../models/enum/request-status-enum";

export default class PhotographerService {
  private static get userDoc() {
    const locationCollection = LocationService.getCollection();
    return locationCollection.doc(auth().currentUser.uid)
  };

  static async updateLocation(location: LocationModel) {
    await this.userDoc.set(location);
  }

  static async deleteLocation() {
    await this.userDoc.delete();
  }

  static async getPhotographerProfile(photographerId: string) {
    const collection = firestore().collection(Collections.PHOTOGRAPHERS);

    const result = await collection.doc(photographerId).get();
    
    if (result.exists) {
      return result.data() as PhotographerModel;
    }

    return null;
  }

  static async getPhotographerSessions() {
    const collection = firestore().collection(Collections.SESSIONS);

    const result = await collection.get();

    return result.docs.map(doc => doc.data());
    
    //if (result.exists) {
    //  return result.data() as PhotographerModel;
    //}

    //return null;
  }

  public static sendRequest = async (request: RequestModel) => {
    const doc = await firestore()
    .collection(Collections.PHOTOGRAPHERS).doc(request.targetPhotographerId)
    .collection(Collections.REQUESTS).add(request);

    return doc.id;
  }

  public static updateRequest = async (request: RequestModel) => {
    if (!request) return;
    if (!request.requestId) return;

    await firestore()
    .collection(Collections.PHOTOGRAPHERS).doc(request.targetPhotographerId)
    .collection(Collections.REQUESTS).doc(request.requestId)
    .update(request);
  }

  public static deleteRequest = async (request: RequestModel) => {
    await firestore()
    .collection(Collections.PHOTOGRAPHERS).doc(request.targetPhotographerId)
    .collection(Collections.REQUESTS).doc(request.requestId).update({ status: RequestStatusEnum.RATING });
  }

  public static async addBalance(photographerId: string, balance: number) {
    return await firestore().collection(Collections.PHOTOGRAPHERS).doc(photographerId).update({ 
      currentMoney: firestore.FieldValue.increment(balance)
     } as PhotographerModel);
  }
}