import DeviceModel from "../models/firebase/device-model";
import firebase, { RNFirebase } from "react-native-firebase";
import Collections from "../models/firebase/collections";

export default class FirebaseDevicesService {
  private database: RNFirebase.firestore.Firestore;
  private ref: RNFirebase.firestore.CollectionReference;

  constructor() {
    this.database = firebase.firestore();
    this.ref = this.database.collection(Collections.DEVICES);
  }

  getDeviceList = async (): Promise<DeviceModel[]> => {
    const response: DeviceModel[] = [];

    const query = await this.ref.orderBy('brand', 'asc').orderBy('model', 'asc').get();
    
    for (let i = 0; i < query.size; i++) {
      const doc = query.docs[i];
      if (!doc.exists) continue;

      const device  = doc.data() as DeviceModel;

      if (!device.brand || !device.model || !device.type) continue;

      device.deviceId = doc.id;
      response.push(device);
    }

    return response;
  }
}