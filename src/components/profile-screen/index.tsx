import ScreenBase from "../common/screen-base";
import React from "react";
import { NavigationScreenOptions } from "react-navigation";
import { Header } from 'react-native-elements';
import { Image, View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity, LayoutAnimation, Alert, ImageBackground } from 'react-native';
import { Icon } from 'native-base';
var ImagePicker = require('react-native-image-picker');
import firebase, { RNFirebase } from "react-native-firebase";
import FirebaseUserService from "../../services/firebase-user-service";
import DevicesList from './devicesList'
import Collections from "../../models/firebase/collections";
import PhotographerService from "../../services/photographer-service";
import { connect } from "react-redux";
import { IHomeState } from "../../store/reducers/home";
import { FullScreenLoader } from "../../container/fullscreen-loader";
import SessionService from "../../services/session-service";

interface Props {
    home: IHomeState
}

interface State {
    photos: string[];
    isLoading: boolean;
    qtdSessions: number;
}

const { width } = Dimensions.get('window')

class Profile extends ScreenBase<Props> {
    static navigationOptions: NavigationScreenOptions = {
        title: 'Meu Perfil',
        headerStyle: { backgroundColor: 'transparent' },
        headerTintColor: '#000'
    };
 
    constructor(props: Props) {
        super(props);
        this.getPhotos();
    }

    state: State = {
        photos: [],
        isLoading: false,
        qtdSessions: 0,
    };

    async componentDidMount() {
        const { photographer } = this.props.home;
        const qtdSessions = await SessionService.getPhotographerSessions(photographer.photographerId);

        this.setState({ qtdSessions } as State);
    }

    onDrawer = async () => {
        this.drawer();
    }

    alertDeletePhoto = (item) => {
        Alert.alert(
            'Apagar foto',
            `Tem certeza que deseja apagar a foto?`,
            [
              {text: 'Não', onPress: () => null, style: 'cancel'},
              {text: 'OK', onPress: () => this.deletePhoto(item.toString())},
            ],
            { cancelable: false }
        );
    }
    
    openLibrary = () => {
        const options ={
            noData: true
        }

        // Open Image Library:
        ImagePicker.launchImageLibrary(options, async (response) => {
            console.log(response);
            this.setState({ isLoading: true } as State);       

        try {
            const currentUser = firebase.auth().currentUser;

            const result = await firebase.storage().ref('/pictures/gallery/photographerProfile/').child(`${currentUser.email}_${currentUser.uid}_${new Date().getTime()}`).putFile(response.path, {contentType: 'image/jpg'});
        
            firebase.firestore().collection(Collections.PHOTOGRAPHERS).doc(currentUser.uid)
            .update({portfolioImages: firebase.firestore.FieldValue.arrayUnion(result.downloadURL)});

            this.setState((prevState: State) => ({
                photos: [
                    ...prevState.photos,
                    result.downloadURL
                ]
            }));
        } catch {

        } finally {
            this.setState({ isLoading: false } as State);
        }

      });
    } 
    
    getPhotos = async () => {
        const currentUser = firebase.auth().currentUser;
        const dataUser = await PhotographerService.getPhotographerProfile(currentUser.uid);

        this.setState({
            photos: dataUser.portfolioImages
        });
    }

    deletePhoto = (photo) => {
        const currentUser = firebase.auth().currentUser;
        firebase.firestore().collection(Collections.PHOTOGRAPHERS).doc(currentUser.uid)
        .update({portfolioImages: firebase.firestore.FieldValue.arrayRemove(photo)});

        this.setState((prevState: State) => ({
          photos: prevState.photos.filter(x => x !== photo)
        }));
    }

    listPhotos() {
        return this.state.photos.map((item, index) => {

            if(index === 0) 
                return(
                    <>
                        <TouchableOpacity onPress={ () => this.openLibrary() } key={`101_${index}`} style={[{width: (width/3)}, {height: (width/3)},
                            { marginBottom: 2 }, index % 3 !== 0 ? { paddingLeft: 2 } : { paddingLeft: 0 },
                            { backgroundColor: '#E7EAED', alignItems: 'center', justifyContent: 'center' }]}>
                            <Icon type="FontAwesome5" name="plus-circle" style={{ color: '#CED4DA', fontSize: 32}} />
                        </TouchableOpacity>
                        <TouchableOpacity onLongPress={ () => this.alertDeletePhoto(item) } key={index} style={[{width: (width/3)}, {height: (width/3)},
                            { marginBottom: 2 }, index % 3 !== 0 ? { paddingLeft: 2 } : { paddingLeft: 0 }]}>
                            <Image onError={(e) => console.log(e.nativeEvent.error) }  
                                style={{flex:1, width: undefined, height: undefined}}
                                source={{uri: item}}
                            />
                        </TouchableOpacity>
                    </>
                )
      
            return(
                <TouchableOpacity onLongPress={ () => this.alertDeletePhoto(item) } key={index} style={[{width: (width/3)}, {height: (width/3)},
                    { marginBottom: 2 }, index % 3 !== 0 ? { paddingLeft: 2 } : { paddingLeft: 0 }]}>
                    <Image onError={(e) => console.log(e.nativeEvent.error) }  
                        style={{flex:1, width: undefined, height: undefined}}
                        source={{uri: item}}
                    />
                </TouchableOpacity>
            )
        })
    }

    render() {
        const { photographer } = this.props.home;

        if (this.state.isLoading) {
            return (<FullScreenLoader />);
        }

        return(
            <View style={{ flex: 1 }}>
                <Header
                leftComponent={{ icon: 'menu', size: 28, color: '#fff', onPress: () => this.onDrawer() }}
                centerComponent={{ text: 'MEU PERFIL', style: { color: '#fff', fontSize: 16 } }}
                containerStyle={{ paddingTop: 5, height: 60, backgroundColor: '#224CB4' }}
                />

                <View style={{width: '100%', height: 200, borderBottomWidth: 1, borderBottomColor: '#CED4DA', marginTop: 14 }}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>

                        <View style={{ width: '15%', height: 55, alignItems: 'center', justifyContent: 'center', top: 10, left: 25}}>
                            <View style={{ width: 80, height: 80, backgroundColor: "#E0E0E0", borderRadius: 80/2, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontSize: 25, color: 'red' }}>
                                    {photographer.firstName.charAt(0)}{photographer.lastName.charAt(0)}
                                </Text>
                            </View>                        
                            <View style={{ width: 40, height: 25, paddingRight: 3, backgroundColor: "#000", borderRadius: 5, position: 'absolute', bottom: -5, right: -16, alignItems: 'center', justifyContent: 'center', flex: 1, flexDirection: 'row' }}>                            
                                
                                <Text style={{ color: '#fff', fontSize: 14}}>★ 0</Text>
                            </View>
                        </View>

                        <View style={{ marginLeft: 60, width: '55%'}}>
                            <Text numberOfLines={1} style={{fontSize: 18, marginBottom: 3, fontWeight: 'bold', color: '#000'}}>
                                { photographer.firstName } { photographer.lastName }
                            </Text>
                            <Text style={{ fontSize: 16, marginTop: 3, color: '#000' }}>{this.state.qtdSessions} sessões realizadas</Text>
                        </View>

                    </View>

                    <View style={{ width: undefined, height: 100, top: -5 }}>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            { this.props.home.photographer.devices.map((item, index) => {
                                if (!item.active) return;
                                return <DevicesList device={item} qtdDevices={this.props.home.photographer.devices.length} index={index} key={index} />
                            })}
                        </ScrollView>

                    </View>                                    

                </View>

                { 
                    this.state.photos &&
                    this.state.photos.length > 0 ? 
                    <ScrollView style={{ height: '100%'}}>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap'}}>
                            {this.listPhotos()}
                        </View>
                    </ScrollView>
                    :
                    <View style={{ alignItems: 'center', justifyContent: 'center', margin: 50}}>
         
                        <Text style={{ fontSize: 16, textAlign: 'center' }}>Você ainda não possui fotos em seu portfólio.</Text>
                        <Text style={{ fontSize: 16, textAlign: 'center' }}>Faça upload de algumas agora :)</Text>

                        <TouchableOpacity onPress={ () => this.openLibrary() } style={{ width: 140, height: 30, borderRadius: 30/2, borderWidth: 1, borderColor: '#76A7F8', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginTop: 20 }}>
                            <Icon type="FontAwesome5" name="cloud-upload-alt" style={{ color: '#76A7F8', fontSize: 14 }} />
                            <Text style={{ color: '#76A7F8', textAlign: 'center', marginLeft: 5 }}>FAZER UPLOAD</Text>
                        </TouchableOpacity>
                    </View>
                }


            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    home: state.home
});
const mapDispatchToProps = (dispatch) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);