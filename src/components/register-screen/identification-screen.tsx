import React, { Component } from "react";
import { NavigationScreenOptions } from "react-navigation";
import { View, Text, TextInput, Alert, TouchableOpacity } from "react-native";
import { Button, Icon, Spinner } from 'native-base';
import firebase, { RNFirebase } from "react-native-firebase";
import { Image } from "react-native-elements";
import PhotographerModel from "../../models/firebase/photographer-model";

interface Props {
  newPhotographer: PhotographerModel,
  handleChange: Function,
  navigation: Function
}

interface State {
  dataURI: string,
  sendingPhoto: boolean,
  photoURL: string,
  photoSent: boolean
}

class IdentificationScreen extends Component<Props> {

  state: State = {
    dataURI: '',
    sendingPhoto: false,
    photoURL: '',
    photoSent: false,    
  };

  openCamera = () => {
    const sendPicture = this.sendPicture
    //@ts-ignore
    this.props.navigation.navigate(("Camera"), {
      sendPicture
    });
  }

  sendPicture = async (dataURI: string) => {
    this.setState({
      dataURI,
      sendingPhoto: true
    })
    
    const result = await firebase.storage().ref('/pictures/docs')
    .child(`${this.props.newPhotographer.firstName}_${this.props.newPhotographer.lastName}_${new Date().getTime()}`).putFile(dataURI, {contentType: 'image/jpg'});

    this.setState({ 
      photoURL: result.downloadURL,
      sendingPhoto: false,
      photoSent: true
    });

    this.props.handleChange('document', result.downloadURL)
    this.props.handleChange('documentOk', true)
  }

  loadingButton = () => {
    return(
      <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
        <Spinner size='large' />
        <Text>Carregando...</Text>
      </View>     
    )
  }

  render() {

    return(
        <View style={{ height: '100%', width: '100%' }}>
          <Text style={{ textAlign: 'center', width: undefined, marginLeft: 28, marginRight: 28, marginTop: 20 }}>
            Para garantir a segurança nos serviços prestados, precisamos que envie uma selfie ao lado do seu documento com foto
          </Text>

          <View style={{ width: '100%', alignItems: 'center', justifyContent:'center' }}>
            <Image
            source={
              this.state.dataURI !== '' ?
              {uri: this.state.dataURI} :
              require('./../../../assets/images/security_selfie.png')
            }
            style={{ width: 180, height: 180, marginTop: 15, borderRadius: 180/2, zIndex: -1 }}
            ></Image>
            
            {
              this.state.photoSent ?
              <View 
              style={{ width: 180, height: 40, borderRadius: 40/2, backgroundColor: '#67D471', 
              alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginTop: -10,
              elevation: 2 }}>
                  <Icon type="FontAwesome5" name="check" style={{ color: 'white', fontSize: 14 }} />
                  <Text style={{ color: 'white', textAlign: 'center', marginLeft: 5 }}>FOTO CARREGADA</Text>
              </View>
              :
              <TouchableOpacity onPress={ () => this.openCamera() } 
              style={{ width: 180, height: 40, borderRadius: 40/2, borderWidth: 1, borderColor: '#76A7F8', 
              backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', 
              marginTop: -10 }}>
                {
                  this.state.sendingPhoto ?
                  this.loadingButton()
                  :
                  <View 
                  style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                    <Icon type="FontAwesome5" name="cloud-upload-alt" style={{ color: '#76A7F8', fontSize: 14 }} />
                    <Text style={{ color: '#76A7F8', textAlign: 'center', marginLeft: 5 }}>TIRAR FOTO</Text>
                  </View>
                }
              </TouchableOpacity>
            }
            

            
          </View>
          
        </View>
    );
  }
}

export default IdentificationScreen;