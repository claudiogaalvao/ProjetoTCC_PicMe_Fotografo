import { StatusEnum } from "../enum/status-enum";
import { Timestamp, GeoPoint } from "react-native-firebase/firestore";
import PhotographerSummaryModel from "./photographer-summary-model";
import DeviceModel from "./device-model";

export default interface LocationModel {
  lastUpdate?: Date | Timestamp;
  isPhotographer?: boolean;
  userId?: string;
  coordinates?: GeoPoint;
  status?: StatusEnum;
  equipments?: DeviceModel[];
  summaryData?: PhotographerSummaryModel;
}