import React, { Component } from "react";
import { View } from "react-native";
import { NavigationScreenProp, NavigationRoute } from "react-navigation";
import ScreenBase from "../common/screen-base";
import firebase, { auth } from "react-native-firebase";
import FirebaseUserService from "../../services/firebase-user-service";
import LocationModel from "../../models/firebase/location-model";
import { updateRemoteLocation, getRemotePhotographerData } from "../../store/thunk/home";
import { connect } from 'react-redux';
import { IHomeState } from "../../store/reducers/home";
import { changeUserId } from "../../store/actions/home";

interface Props {
  navigation: NavigationScreenProp<NavigationRoute<any>, any>,
  home: IHomeState,
  updateUserId: Function,
  getRemotePhotographerData: Function
}
class SplashScreen extends ScreenBase<Props> {
  componentDidMount() {
    FirebaseUserService.validateUserAccess().then(() => {
      this.props.updateUserId(auth().currentUser.uid);
      this.props.getRemotePhotographerData();

      this.navigateNoHistory('Home');
    }).catch(() => {
      this.navigateNoHistory('Welcome');
    });
  }

  render() {
    return(
      <View />
    );
  }
}

const mapStateToProps = (state) => ({
  home: state.home
});
const mapDispatchToProps = (dispatch) => ({
  updateUserId: (userId: String) => dispatch(changeUserId(userId)),
  getRemotePhotographerData: () => dispatch(getRemotePhotographerData())
});

export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);