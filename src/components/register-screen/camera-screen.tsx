import React, { Component } from "react";
import ScreenBase from "../common/screen-base";
import { NavigationScreenOptions } from "react-navigation";
import { View, Alert, TextInput, Text, TouchableOpacity } from "react-native";
import { RNCamera } from 'react-native-camera';
import { Button, Icon } from "native-base";


interface Props {

}

interface State {
}

class CameraScreen extends ScreenBase<Props> {
    static navigationOptions: NavigationScreenOptions = {
        title: 'Câmera',
        headerStyle: { backgroundColor: 'white' },
        headerTintColor: 'black'
    }

    camera: any

    takePicturePressed = async () => {
        // @ts-ignore
        const sendPicture = this.props.navigation.getParam('sendPicture', null);

        // @ts-ignore
        this.props.navigation.goBack()

        const options = { quality: 0.99 };
        const data = await this.camera.takePictureAsync(options);
        sendPicture(data.uri)
    }

    render() {

        return(
            <View>
                <RNCamera
                ref={camera => { this.camera = camera }}
                style={{ width: '100%', height: '100%' }}
                type={RNCamera.Constants.Type.front}
                captureAudio={false}
                autoFocus={RNCamera.Constants.AutoFocus.on}
                flashMode={RNCamera.Constants.FlashMode.off}
                androidCameraPermissionOptions={{
                    title: 'Câmera',
                    message: 'Precisamos da sua permissão para utilizarmos a câmera'
                }}
                />
                <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity 
                    onPress={ this.takePicturePressed } 
                    style={{ position: 'absolute', bottom: 55, width: 70, height: 70, backgroundColor: '#224CB4', 
                    borderRadius: 70/2, alignItems: 'center', justifyContent: 'center', elevation: 5 }}>
                        <Icon type="FontAwesome5" name="camera" style={{ color: 'white' }} />
                    </TouchableOpacity>  
                </View>
                
            </View>
        );
    }
}


export default CameraScreen;