import UserModel from "./user-model";
import { Region } from "react-native-maps";
import DeviceModel from "./device-model";
import { RequestStatusEnum } from "../enum/request-status-enum";

export default interface RequestModel {
  requestId?: string;
  requester?: UserModel;
  location?: Region;
  creationDate?: Date;
  equipment?: DeviceModel;
  targetPhotographerId?: string;
  status?: RequestStatusEnum;
  quantity?: number;
}