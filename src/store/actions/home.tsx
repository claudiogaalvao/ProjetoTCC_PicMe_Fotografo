import { StatusEnum } from "../../models/enum/status-enum";
import LocationModel from "../../models/firebase/location-model";
import PhotographerSummaryModel from "../../models/firebase/photographer-summary-model";
import PhotographerModel from "../../models/firebase/photographer-model";
import RequestModel from "../../models/firebase/request-model";

export const HOME_UPDATE_LOCATION = 'HOME_UPDATE_LOCATION';
export const HOME_CHANGE_STATUS = 'HOME_CHANGE_STATUS';
export const HOME_CHANGE_USER_ID = 'HOME_CHANGE_USER_ID';
export const HOME_CHANGE_LOCATION = 'HOME_CHANGE_LOCATION';
export const HOME_IS_UPDATING_REMOTE = 'HOME_IS_UPDATING_REMOTE';
export const HOME_SYNC_PHOTOGRAPHER_DATA = 'HOME_SYNC_PHOTOGRAPHER_DATA';
export const HOME_SIGN_OUT = 'HOME_SIGN_OUT';
export const HOME_SET_CURRENT_REQUEST = 'HOME_SET_CURRENT_REQUEST';

export const changeStatus = (status: StatusEnum) => ({
  type: HOME_CHANGE_STATUS,
  payload: status
});

export const updateLocation = (location: LocationModel) => ({
  type: HOME_UPDATE_LOCATION,
  payload: location
});

export const changeUserId = (userId: String) => ({
  type: HOME_CHANGE_USER_ID,
  payload: userId
});

export const changeLocation = (latitude: number, longitude: number, userId: String, summary: PhotographerSummaryModel) => ({
  type: HOME_CHANGE_LOCATION,
  payload: { latitude, longitude, userId, summary }
});

export const isUpdatingRemote = (isUpdating: boolean) => ({
  type: HOME_IS_UPDATING_REMOTE,
  payload: isUpdating
});

export const syncRemotePhotographerData = (photographer: PhotographerModel) => ({
  type: HOME_SYNC_PHOTOGRAPHER_DATA,
  payload: photographer
});

export const signOut = () => ({
  type: HOME_SIGN_OUT
});

export const setCurrentRequest = (request: RequestModel) => ({
  type: HOME_SET_CURRENT_REQUEST,
  payload: request
});