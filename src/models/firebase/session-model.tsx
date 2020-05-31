import { Region } from "react-native-maps";
import DeviceModel from "./device-model";

export default interface Session {
  photographerId: string;
  photographerName: string;
  requesterId: string;
  requesterName: string;
  location: Region;
  picturesQtd: number;
  pricePerPicture: number;
  pictures: string[];
  date: Date;
  equipment: DeviceModel;
}