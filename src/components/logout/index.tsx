import PhotographerService from "../../services/photographer-service";
import firebase, { auth } from "react-native-firebase";
import ScreenBase from '../common/screen-base';
import { Toast, View } from "native-base";
import React from "react";

interface Props {
}

class Logout extends ScreenBase<Props> {
    constructor(props: any) {
        super(props);
        this.onLogoutPressed();
    }
    
    onLogoutPressed = async () => {
    try {
        await PhotographerService.deleteLocation();
        await firebase.auth().signOut();
        this.navigateNoHistory('Welcome');
    } catch (error) {
        this.showError(error);
    }
    }

    showError = (error: any) => Toast.show({ text: error.message, type: 'danger' });

    render() {
        return(
          <View />
        );
      }
}

export default Logout;