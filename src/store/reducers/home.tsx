import { StatusEnum } from "../../models/enum/status-enum";
import LocationModel from "../../models/firebase/location-model";
import firebase from "react-native-firebase";
import { HOME_CHANGE_STATUS, HOME_UPDATE_LOCATION, HOME_CHANGE_USER_ID, HOME_CHANGE_LOCATION, HOME_IS_UPDATING_REMOTE, HOME_SYNC_PHOTOGRAPHER_DATA, HOME_SIGN_OUT, HOME_SET_CURRENT_REQUEST } from "../actions/home";
import PhotographerModel from "../../models/firebase/photographer-model";
import RequestModel from "../../models/firebase/request-model";

export interface IHomeState {
  currentLocation?: LocationModel,
  isUpdatingRemote: boolean,
  photographer?: PhotographerModel,
  activeRequest?: RequestModel
}

const initialState: IHomeState = {
  currentLocation: {
    coordinates: { latitude: 0, longitude: 0 },
    equipments: [],
    isPhotographer: true,
    lastUpdate: new Date(),
    status: StatusEnum.OFFLINE,
    userId: null,
  } as LocationModel,
  isUpdatingRemote: false,
  photographer: null
}

export default (state: IHomeState = initialState, action): IHomeState => {
  switch (action.type) {

  case HOME_CHANGE_STATUS: {
    return { ...state, currentLocation: { ...initialState.currentLocation, status: action.payload } };
  }

  case HOME_UPDATE_LOCATION: {
    return { ...state, currentLocation: action.payload };
  }

  case HOME_CHANGE_USER_ID: {
    return { ...state, currentLocation: { ...initialState.currentLocation, userId: action.payload } };
  }

  case HOME_IS_UPDATING_REMOTE: {
    return { ...state, isUpdatingRemote: action.payload };
  }

  case HOME_CHANGE_LOCATION: {
    const cloneLocation = { ...state.currentLocation };

    if (action.payload.latitude && action.payload.longitude) {
      cloneLocation.coordinates = { latitude: action.payload.latitude, longitude: action.payload.longitude };
    }

    if (action.payload.userId) {
      cloneLocation.userId = action.payload.userId;
    }

    if (action.payload.summary) {
      cloneLocation.summaryData = action.payload.summary;
    }

    cloneLocation.lastUpdate = new Date();

    return { ...state, currentLocation: cloneLocation };
  }

  case HOME_SYNC_PHOTOGRAPHER_DATA: {
    return { ...state, photographer: action.payload };
  }

  case HOME_SIGN_OUT:
    return { ...state, photographer: null };

  case HOME_SET_CURRENT_REQUEST:
    return { ...state, activeRequest: action.payload };

  default:
    return state
  }
};

