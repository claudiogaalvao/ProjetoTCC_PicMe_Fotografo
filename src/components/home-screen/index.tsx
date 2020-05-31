import ScreenBase from "../common/screen-base";
import React from "react";
import MapView, { Marker, Circle, Region } from 'react-native-maps';
import { Root, Text, Button, Toast, View, Icon, Row, Col, H3, Spinner } from "native-base";
import { GeolocationReturnType, GeolocationError, PermissionsAndroid, GeoOptions, Alert, Platform, UIManager, Dimensions, StyleSheet, ScrollView, TouchableHighlight, TouchableOpacity, LayoutAnimation } from "react-native";
import firebase, { auth, RNFirebase, firestore } from "react-native-firebase";
import Collections from "../../models/firebase/collections";
import LocationModel from "../../models/firebase/location-model";
import RequestModel from "../../models/firebase/request-model";
import Modal from 'react-native-modal';
import { CheckBox, Header } from 'react-native-elements';
import DeviceModel from "../../models/firebase/device-model";
import PhotographerModel from "../../models/firebase/photographer-model";
import { IHomeState } from "../../store/reducers/home";
import { connect } from 'react-redux';
import { StatusEnum } from "../../models/enum/status-enum";
import { updateRemoteLocation } from "../../store/thunk/home";
import PhotographerService from "../../services/photographer-service";
import { changeLocation, changeStatus, setCurrentRequest } from "../../store/actions/home";
import PhotographerSummaryModel from "../../models/firebase/photographer-summary-model";
import PermissionValidator from "../../container/permission-validator";
import { AirbnbRating } from 'react-native-ratings';
import { NavigationScreenOptions } from "react-navigation";

import ProgressBar from "../../components/home-screen/progressBar";
import {RNSlidingButton, SlideDirection} from 'rn-sliding-button';
import { RequestStatusEnum } from "../../models/enum/request-status-enum";
import { GeoUtils } from "../../utils/geo.utils";

interface Props {
  home: IHomeState,
  updateRemoteLocation: (location: LocationModel) => void,
  changeLocation: (latitude: number, longitude: number, userId: String, summary: PhotographerSummaryModel) => void,
  changeStatus: (status: StatusEnum) => void,
  setCurrentRequest: (requestModel: RequestModel) => void,
}
interface DeviceCheckModel extends DeviceModel {
  checked?: boolean;
}
interface State {
  geolocationPermission: boolean;
  region: Region;
  isSelectEquipments: boolean;
  equipments: DeviceCheckModel[];
  error: string;
  timeToAccept: number;
  expandedFind: boolean;
  expandedSession: boolean;
  expandedMenu: boolean;
  stepSession: string;
  showRatingModal: boolean;
  rating: number;
}
class HomeScreen extends ScreenBase<Props> {
  private listenerRef;
  private navigatorWatchId: number;
  private arrayDevicesChecked: DeviceModel[];
  private lastRemoteUpdate: Date;

  static navigationOptions: NavigationScreenOptions = {
    title: 'Principal',
    header: null
};

  geoOptions: GeoOptions = {
    enableHighAccuracy: true
  }

  state: State = {
    geolocationPermission: false,
    region: {
      latitude: -23.09565431,
      longitude: -47.19725737,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01
    },
    isSelectEquipments: false,
    equipments: [],
    error: null,
    timeToAccept: 100,
    expandedFind: false,
    expandedSession: false,
    expandedMenu: false,
    stepSession: 'inicial',
    showRatingModal: false,
    rating: 5
  }

  constructor(props: any) {
    super(props);
    this.arrayDevicesChecked = []

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    firebase.firestore().collection(Collections.PHOTOGRAPHERS)
                  .doc(firebase.auth().currentUser.uid)
                  .get()
                  .then(retorno => {
                    var equips = [];

                    const photographerDataModel = retorno.data() as PhotographerModel
                    
                    photographerDataModel.devices.map((element, index) => {
                      var model = element as DeviceCheckModel;
                      model.checked = false;

                      equips.push(model);
                    })

                    this.setState({
                      equipments: equips
                    })
                  });
    
  }

  componentDidMount() {
    // @ts-ignore
    var rating = this.props.navigation.getParam('rating', false);
    
    if(rating) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      this.setState({ showRatingModal: true })
    }
      

    if (!firebase.auth().currentUser) {
      this.navigateNoHistory('Welcome');
    }

    this.requestPermission();
  }

  requestPermission = async () => {
    const granted = await PermissionsAndroid.request("android.permission.ACCESS_FINE_LOCATION", {
      title: 'Localização',
      message: 'Precisamos da sua permissão para acessar a sua localização.',
      buttonPositive: 'Permitir',
      buttonNegative: 'Cancelar'
    });

    if (granted == PermissionsAndroid.RESULTS.GRANTED) {
      this.setState({ geolocationPermission: true } as State);
      this.geolocationInit();
    } else {
      this.setState({ geolocationPermission: false } as State);
    }
  }

  geolocationInit = () => {
    Toast.show({ text: 'Getting current location...', type: 'success', position: 'top' });

    navigator.geolocation.getCurrentPosition(this.onPositionUpdated, this.onPositionError, this.geoOptions);
    setInterval(() => {
      navigator.geolocation.getCurrentPosition(this.onPositionUpdated, this.onPositionError, this.geoOptions);
    }, 1000 * 20);
    
    this.navigatorWatchId = navigator.geolocation.watchPosition(this.onPositionUpdated, this.onPositionError, this.geoOptions);
  }

  onPositionError = () => {

  }

  listenToRequests = async () => {
    const user = firebase.auth().currentUser;
    
    await firebase.firestore().collection(Collections.PHOTOGRAPHERS).doc(user.uid)
    .collection('requests').get().then((result) => result.docs.forEach((doc) => 
      firebase.firestore().collection(Collections.PHOTOGRAPHERS).doc(user.uid)
      .collection('requests').doc(doc.id).delete()
    ));

    this.listenerRef = firebase.firestore().collection(Collections.PHOTOGRAPHERS).doc(user.uid)
    .collection('requests').onSnapshot(this.onRequestSnapshot)
  }

  onRequestSnapshot = (query: RNFirebase.firestore.QuerySnapshot) => {
    const { currentLocation } = this.props.home;
    
    if (query.empty) return;
    if (query.docs.length === 0) return;

    const request = query.docs[0].data() as RequestModel;

    if (!request) return;
    request.requestId = query.docs[0].id;

    if (currentLocation.status !== StatusEnum.ONLINE) {
      this.deleteRequest(request);
      return;
    }

    this.onRequestReceived(request);
  }

  onRequestReceived = async (request: RequestModel) => {
    try {
      this.props.setCurrentRequest(request);
    } catch (error) {
      console.log(error);
      this.showError(error);
    }
  }

  onRequestAccept = async () => {
    try {
      this.changeRequestStatus(RequestStatusEnum.ACCEPTED);
    } catch (error) {
      this.showError(error);
    }
  }

  onRequestReject = async () => {
    try {
      this.changeRequestStatus(RequestStatusEnum.REJECTED);
    } catch (error) {
      this.showError(error);
    }
  }

  onSessionInit = async () => {
    try {
      this.changeRequestStatus(RequestStatusEnum.MEETING);

      // @ts-ignore
      this.navigate('Session');
    } catch (error) {
      this.showError(error);
    }
  }

  changeRequestStatus = async (newStatus: RequestStatusEnum) => {
    const { activeRequest } = this.props.home;

      const newRequest = {...activeRequest};
      newRequest.status = newStatus;

      await PhotographerService.updateRequest(newRequest);
      this.props.setCurrentRequest(newRequest);
  }

  deleteRequest = async (request: RequestModel) => {
    try {
      await PhotographerService.deleteRequest(request);
      this.setState({ isRequestActive: false });
    } catch (error) {
      this.showError(error);
    }
  }

  changeStatus = (newStatus: StatusEnum) => {
    const { currentLocation } = this.props.home;

    if (newStatus !== StatusEnum.ONLINE) {
      if(this.listenerRef)
        this.listenerRef();
    }

    const newLocation = currentLocation;
    newLocation.status = newStatus;

    this.props.updateRemoteLocation(newLocation);
  }

  onDrawer = async () => {
    try{
    this.drawer();
    } catch (error) {
      this.showError(error);
    }
  }
  
  onOnlineButtonPressed = () => {
    const { currentLocation } = this.props.home;
    if (currentLocation.status === StatusEnum.OFFLINE) {
      this.setState({isSelectEquipments: true});
    } else {
      this.changeStatus(StatusEnum.OFFLINE);
    }
  }

  getDevicesNames = (devices: DeviceModel[]) => {
    const names: string[] = [];

    devices.forEach(device => names.push(`${device.brand} ${device.model}`));
    return names;
  }

  getSummary = (): PhotographerSummaryModel => {
    const { photographer, currentLocation } = this.props.home;

    const devicesOrdered = photographer.devices.sort((a, b) => {
      if (a.priceMin < b.priceMin) {
        return 1;
      }
      if (a.priceMin > b.priceMin) {
        return -1;
      }

      return 0;
    });

    if (devicesOrdered.length === 0) {
      return {
        devicesName: [''],
        minPhotos: 0,
        name: '',
        pricePerPhoto: 0,
        profilePicture: '',
        ratingAverage: '0'
      };
    }

    const cheapestDevice = devicesOrdered[0];

    let rating = "0"
    if(photographer.ratingCount !== 0)
      rating = (photographer.ratingSum / photographer.ratingCount).toFixed(1)

    return {
      minPhotos: cheapestDevice.qtdMin,
      pricePerPhoto: cheapestDevice.priceMin,
      name: `${photographer.firstName}`,
      devicesName: this.getDevicesNames(photographer.devices),
      profilePicture: photographer.photo,
      ratingAverage: rating
    };
  }

  onPositionUpdated = async (position: GeolocationReturnType) => {
    const { photographer } = this.props.home;
    if (!photographer) {
      return;
    }

    this.props.changeLocation(
      position.coords.latitude,
      position.coords.longitude,
      photographer.photographerId,
      this.getSummary()
    );

    const updateLimit = new Date(new Date().getTime() - 20 * 1000);
    if (this.lastRemoteUpdate && this.lastRemoteUpdate > updateLimit) return;

    this.lastRemoteUpdate = new Date();
    setTimeout(() => this.props.updateRemoteLocation(this.props.home.currentLocation), 500);
  }

  onConfirmRequestActive = () => {
    this.arrayDevicesChecked = [];

    this.state.equipments.map((element, index) => {
      if(element.checked) {
        this.arrayDevicesChecked.push(element)
        element.checked = false;
      } 
    });

    if(this.arrayDevicesChecked.length === 0) {
      this.setState({
        error: "Você precisa ter disponível pelo menos um equipamento para ficar online"
      });
    } else {
      this.setState({ isSelectEquipments: false });

      const location = this.props.home.currentLocation;
      location.equipments = this.arrayDevicesChecked;
      location.status = StatusEnum.ONLINE;

      this.props.updateRemoteLocation(location);
      this.listenToRequests();
      navigator.geolocation.getCurrentPosition(this.onPositionUpdated, this.onPositionError, this.geoOptions);
    }
  }

  onCancelRequestActive = () => {
    this.state.equipments.map((element, index) => {
      if(element.checked) {
        this.arrayDevicesChecked.push(element);
        element.checked = false;
      }        
    })
    this.setState({ isSelectEquipments: false });
  }

  getMessageError = () => {
    return (
      <View style={{ backgroundColor: '#FF000050', borderColor: '#A94442', borderWidth: 0.5, borderRadius: 5, padding: 8, marginBottom: 8 }}>
        <Text style={{ color: '#A94442', fontSize: 12, textAlign: "center" }}>
          {this.state.error}
        </Text>
      </View>
    )
  }

  onPositionFailed = async (error: GeolocationError) => {
    this.showError(error);
  }

  showError = (error: any) => Toast.show({ text: error.message, type: 'danger' });

  onLogoutPressed = async () => {
    try {
      await PhotographerService.deleteLocation();
      await firebase.auth().signOut();
      this.navigateNoHistory('Welcome');
    } catch (error) {
      this.showError(error);
    }
  }

  async componentWillUnmount() {
    navigator.geolocation.clearWatch(this.navigatorWatchId);
  }

  changeLayoutFind = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({ expandedFind: !this.state.expandedFind });
  }

  changeLayoutMenu = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({ expandedMenu: !this.state.expandedMenu });
  }

  renderSwitch(param) {
    switch(param) {
      case 5:
        return 'Excelente';
      case 4:
        return 'Ótimo';
      case 3:
        return 'Regular';
      case 2:
        return 'Ruim';
      case 1:
        return 'Péssimo';
      default:
        return 'Excelente';
    }
  }

  componentDidUpdate() {
    const { activeRequest } = this.props.home;

    if (activeRequest && (activeRequest.status === RequestStatusEnum.RATING
      || activeRequest.status === RequestStatusEnum.REJECTED)) {
      console.log(activeRequest);
      firestore().collection(Collections.PHOTOGRAPHERS).doc(activeRequest.targetPhotographerId)
      .collection(Collections.REQUESTS).doc(activeRequest.requestId).delete().then(() => {
        this.props.setCurrentRequest(null);
      });
    }
  }

  render() {
    const { height, width } = Dimensions.get('window');
    const { currentLocation, isUpdatingRemote, photographer, activeRequest } = this.props.home; 
    const { latitude, longitude } = currentLocation.coordinates;
    const authenticated = auth().currentUser;

    if (!authenticated) {
      this.navigateNoHistory('Splash');
      return <Root />
    }

    if (!photographer) {
      return (
        <Root>
          <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Spinner size='large' />
          </View>
        </Root>
      );
    }

    return(
      <Root>
        <Header
          leftComponent={{ icon: 'menu', size: 28, color: '#fff', onPress: () => this.onDrawer() }}
          centerComponent={{ text: 'PRINCIPAL', style: { color: '#fff', fontSize: 16 } }}
          containerStyle={{ paddingTop: 5, height: 60, backgroundColor: '#224CB4' }}
        />

        <MapView
          initialRegion={ { latitude, longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 } as Region }
          region={ { latitude, longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 } as Region }
          style={{width: '100%', height: height }}>
          <Marker
            coordinate={{latitude: currentLocation.coordinates.latitude, longitude: currentLocation.coordinates.longitude}} />
          <Circle
            center={{ latitude: currentLocation.coordinates.latitude, longitude: currentLocation.coordinates.longitude }}
            radius={500}
            fillColor='rgba(0, 90, 100, 0.20)'
            strokeColor='rgba(0, 90, 100, 50)'
            strokeWidth={1}
            />
        </MapView>
        
        { this.state.stepSession === 'inicial' &&
        <View style={{ position: 'absolute', bottom: 0, width: '100%', height: 70, backgroundColor: 'white', borderTopStartRadius: 10, borderTopEndRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
          { currentLocation.status !== StatusEnum.OFFLINE ?  
            <TouchableOpacity onPress={ this.onOnlineButtonPressed } style={{ position: 'absolute', bottom: 55, width: 70, height: 70, backgroundColor: '#EA4335', borderRadius: 70/2, alignItems: 'center', justifyContent: 'center', elevation: 5 }}>
              <Icon type="FontAwesome5" name="hand-paper" style={{ color: 'white', fontSize: 32 }}></Icon>
            </TouchableOpacity>
            :
            <TouchableOpacity onPress={ this.onOnlineButtonPressed } style={{ position: 'absolute', bottom: 55, width: 70, height: 70, backgroundColor: '#224CB4', borderRadius: 70/2, alignItems: 'center', justifyContent: 'center', elevation: 5 }}>
              <Text style={{ color: 'white', fontSize: 24, textAlign: 'center' }}>GO</Text>
            </TouchableOpacity>        
          }

          { isUpdatingRemote ?
            <Text style={{ color: '#000', fontSize: 20, textAlign: 'center' }}>
              Conectando
            </Text>
            :
            <Text style={{ color: '#000', fontSize: 20, textAlign: 'center' }}>             
              Você está { currentLocation.status !== StatusEnum.OFFLINE ? 'online' : 'offline' }
            </Text>
          }
          
        </View>
        }
        
        
        { (activeRequest && activeRequest.status === RequestStatusEnum.WAITING) && 
        <TouchableOpacity onPress={this.onRequestAccept} style={{ position: 'absolute', width: undefined, height: 150, left: 10, right: 10, bottom: 12, backgroundColor: '#202935', borderRadius: 6, borderWidth: 2, borderColor: '#CBCBCB', alignItems: 'center' }}>
          
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 15 }}>
            <Text style={{ position: 'absolute', left: -140, color: 'white' }}>{`${activeRequest.equipment.brand} ${
              activeRequest.equipment.model
            }`}</Text>
            <View style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
              <ProgressBar onRequestTimeout={this.onRequestReject} percent={100} />
            </View>
            {/*<Text style={{ position: 'absolute', right: -100, color: 'white' }}>4,87 ★</Text>*/}
          </View>

          <View style={{ marginBottom: 15 }}>
            <Text style={{ textAlign: 'center', fontSize: 14, color: 'white' }}>{activeRequest.quantity} fotos</Text>
            <Text style={{ textAlign: 'center', fontSize: 20, color: 'white' }}>{
              GeoUtils.calculateDistance(
                currentLocation.coordinates,
                activeRequest.location
              )
              } metros de distância</Text>
          </View>
          
        </TouchableOpacity>
        }

        { (activeRequest && activeRequest.status === RequestStatusEnum.ACCEPTED) &&
        <View style={{ width: '100%', height: undefined, position: 'absolute', bottom: 0 }}>
          <View style={{ width: '100%', height: 70, backgroundColor: 'white', borderTopStartRadius: 10, borderTopEndRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
            
            <TouchableOpacity onPress={this.changeLayoutFind} style={{ position: 'absolute', width: 30, height: 30, left: 25, alignItems: 'center', justifyContent: 'center' }}>
              { this.state.expandedFind ? <Icon type='FontAwesome5' name='angle-down' /> : <Icon type='FontAwesome5' name='angle-up' /> }              
            </TouchableOpacity>
            

            <Text style={{ color: '#000', fontSize: 20, textAlign: 'center' }}>
              Encontrando { activeRequest.requester.firstName }
            </Text>
            
          </View>

          <View style={{ width: '100%', height: this.state.expandedFind ? 150 : 0, overflow: 'hidden', backgroundColor: 'white', borderTopWidth: 1, borderColor: '#DEDEDE', alignItems: 'center' }}>

              <TouchableOpacity onPress={this.changeLayoutMenu} style={{ width: '100%', height: 90, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                <Text style={{ fontSize: 24 }}>{activeRequest.requester.firstName}</Text>
                <View style={{ position: 'absolute', width: 50, height: 50, right: 30, backgroundColor: '#F1EFF1', borderRadius: 50/2, alignItems: 'center', justifyContent: 'center'}}>
                  <Icon type='FontAwesome5' name='ellipsis-v' style={{ fontSize: 20 }}></Icon>
                </View>
              </TouchableOpacity>

              <RNSlidingButton
                style={{
                  position: 'absolute', height: 50, bottom: 10, left: 8, right: 8, borderRadius: 4
                }}
                height={50}
                onSlidingSuccess={this.onSessionInit}
                slideDirection={SlideDirection.RIGHT}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                  <Icon type="FontAwesome5" name="angle-double-right" style={{ position: 'absolute', color: 'white', left: 20 }} />
                  <Text style={{ fontSize: 16, color: 'white' }}>INICIAR SESSÃO</Text>
                </View>
              </RNSlidingButton>
          </View>

          <View style={{ position: 'absolute', bottom: 0, width: '100%', height: this.state.expandedMenu ? 300 : 0, overflow: 'hidden', backgroundColor: 'white', borderTopStartRadius: 10, borderTopEndRadius: 10 }}>
            
            <TouchableOpacity onPress={this.changeLayoutMenu} style={{ position: 'absolute', marginLeft: 20, marginTop: 20 }}>
              <Icon type='FontAwesome5' name='times' style={{ fontSize: 20 }} />
            </TouchableOpacity>

            <View style={{ width: '100%', height: 70, marginTop: 60, alignItems: 'center', justifyContent: 'center'}}>
              <Text style={{ fontSize: 25, fontWeight: 'bold', marginBottom: 8 }}>{activeRequest.requester.firstName}</Text>
              <Text>★4,87 • {`${activeRequest.equipment.brand} ${activeRequest.equipment.model}`} • {
                activeRequest.quantity
              } fotos</Text>
            </View>

            <View style={{ width: '100%', height: 120, marginTop: 10, alignItems: 'center', justifyContent: 'center'}}>
              <View style={{ position: 'absolute', right: 80, alignItems: 'center' }}>
                <View style={{ width: 60, height: 60, marginBottom: 8, backgroundColor: '#F1EFF1', borderRadius: 60/2, alignItems: 'center', justifyContent: 'center'}}>
                  <Icon type='FontAwesome5' name='ban' style={{ fontSize: 32, color: 'red' }}></Icon>
                </View>
                <Text style={{ color: '#92969A'}}>Cancelar</Text>
              </View>

              <View style={{ position: 'absolute', left: 80, alignItems: 'center' }}>
                <View style={{ width: 60, height: 60, marginBottom: 8, backgroundColor: '#F1EFF1', borderRadius: 60/2, alignItems: 'center', justifyContent: 'center'}}>
                  <Icon type='FontAwesome5' name='comment-dots' style={{ fontSize: 32 }}></Icon>
                </View>
                <Text style={{ color: '#92969A'}}>Contatar</Text>
              </View>
            </View>
                
          </View>
        </View>
        }

        <Modal isVisible={this.state.showRatingModal} style={{ position: 'absolute', width: '100%', height: '45%', marginLeft: 0, bottom: -20, backgroundColor: 'white', borderTopStartRadius: 10, borderTopEndRadius: 10 }}>
          <TouchableOpacity onPress={ () => this.setState({ showRatingModal: false }) } style={{ position: 'absolute', marginLeft: 20, top: 20 }}>
              <Icon type='FontAwesome5' name='times' style={{ fontSize: 20 }} />
          </TouchableOpacity>
          
          <View style={{ marginHorizontal: 15, padding: 10, alignItems: 'center', marginTop: 15 }}>

            <Text style={{ marginBottom: 15 }}>Por favor, avalie Lorance</Text>
            <AirbnbRating
              count={5}
              reviews={['Péssimo', 'Ruim', 'Regular', 'Bom', 'Excelente']}
              defaultRating={5}
              size={30}
              onFinishRating={(rating) => { }}
              showRating={true}
            />
            <Text>
              {
                this.renderSwitch(this.state.rating)
              }
            </Text>

            <Button onPress={ () => this.setState({ showRatingModal: false }) } style={{ marginTop: 20, width: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1EA896', borderRadius: 20 }}>
              <Text style={{ color: 'white', fontSize: 16}}>PRONTO</Text>
            </Button>         

          </View>
        </Modal>

        <Modal isVisible={this.state.isSelectEquipments} style={{ position: 'absolute', width: '100%', height: '70%', marginLeft: 0, bottom: -20, backgroundColor: 'white', borderTopStartRadius: 10, borderTopEndRadius: 10 }}>
          
          <TouchableOpacity onPress={ () => this.setState({ isSelectEquipments: false }) } style={{ position: 'absolute', marginLeft: 20, top: 20 }}>
              <Icon type='FontAwesome5' name='times' style={{ fontSize: 20 }} />
          </TouchableOpacity>
          
          <View style={this.styles.alertBox}>

            <H3 style={{ marginTop: 16, marginBottom: 16, textAlign: 'center' }}>Oopa, antes...</H3>
            
            { this.state.error !== null ? this.getMessageError() : null }

            <Text style={{ fontFamily: 'Montserrat-Light', textAlign: 'center', marginBottom: 20 }}>
              Quais são os equipamentos disponíveis com você agora?
            </Text>

            <ScrollView showsVerticalScrollIndicator={false}>

              <View>
                {
                  this.state.equipments.map((element, index) => {
                    
                    return(
                      element.active ?
                      <View key={"View"+index} style={{ flexDirection: 'row' }}>
                        <CheckBox
                        
                          title={`${element.brand} ${element.model}`}
                          checked={element.checked}
                          onPress={
                            () => {
                              let equipmentsCopy = this.state.equipments;
                              equipmentsCopy[index].checked = !equipmentsCopy[index].checked;
                              
                              this.setState({ equipments: equipmentsCopy });
                            }
                          }
                        />
                      </View>
                      :
                      <></>
                    )                  
                  })
                }
              </View>             

              <Button onPress={ this.onConfirmRequestActive } style={{ marginTop: 20, marginBottom: 40, alignItems: 'center', justifyContent: 'center', backgroundColor: '#1EA896', borderRadius: 20, width: '100%' }}><Text style={{ color: 'white', fontSize: 16}}>CONFIRMAR</Text></Button>
            </ScrollView>
            
          </View>
        </Modal>
        
        <PermissionValidator hasPermission={this.state.geolocationPermission} onActionPressed={this.requestPermission} />
      </Root>
    );
  }

  styles = StyleSheet.create({
    alertBox: {
      flex: 1,
      marginHorizontal: 15,
      padding: 10,
      paddingBottom: 0,
      alignItems: 'center',
      marginTop: 30,
      top: 15
    }
  });
}

const mapStateToProps = (state) => ({
  home: state.home
});
const mapDispatchToProps = (dispatch) => ({
  setCurrentRequest: (requestModel: RequestModel) => dispatch(setCurrentRequest(requestModel)),
  updateRemoteLocation: async (location: LocationModel) => dispatch(updateRemoteLocation(location)),
  changeStatus: (status: StatusEnum) => dispatch(changeStatus(status)),
  changeLocation: (latitude: number, longitude: number, userId: String, summary: PhotographerSummaryModel) => dispatch(changeLocation(latitude, longitude, userId, summary)),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);