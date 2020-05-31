import ScreenBase from "../common/screen-base";
import React from "react";
import { NavigationScreenOptions } from "react-navigation";
import { Header } from 'react-native-elements';
import { Icon } from 'native-base'
import { View, Text, FlatList, TouchableOpacity, Alert, Button, RefreshControl } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import firebase, { RNFirebase } from "react-native-firebase";
import { auth, firestore } from "react-native-firebase";
import Collections from "../../models/firebase/collections";
import PhotographerService from "../../services/photographer-service";
import SessionService from "../../services/session-service";
import { FullScreenLoader } from "../../container/fullscreen-loader";

interface Props {
    
}

interface State {
    pictures: any;
    dataSource: any[],
    isLoading: boolean;
    loading: boolean;
}

class PendingSubmission extends ScreenBase<Props> {

    static navigationOptions: NavigationScreenOptions = {
        title: 'Envios Pendentes',
        header: null
    };
    constructor(props: Props) {
        super(props);  
           
    }

    componentDidMount (){
        this.getPhotographerData();   
    }

    state: State = {
        dataSource: [
        ],
        pictures: [],
        isLoading: false,
        loading: false
    };
 
   
    openLibrary = (item, index) => {
        ImagePicker.openPicker({
            multiple: true 
          }).then(async (images: any[]) => { 
            this.setState({ isLoading: true });
            var i = 0;
            const getSessionId = await SessionService.getSessionInfo(item.photographerId, item.requesterId, item.date.seconds, item.date.nanoseconds);

            for(i =0; i < images.length; i++) {
                const currentUser = firebase.auth().currentUser;
                const result = await firebase.storage().ref('/pictures/gallery/sentUserPhotos').child(`${currentUser.email}_${currentUser.uid}_${new Date().getTime()}`).putFile(images[i].path, {contentType: 'image/jpg'});
            
                firebase.firestore().collection(Collections.SESSIONS).doc(getSessionId[0]._ref._documentPath._parts[1])
                .update({pictures: firebase.firestore.FieldValue.arrayUnion(result.downloadURL)});
                
            }

            const sessionData = await firebase.firestore().collection(Collections.SESSIONS).doc(getSessionId[0]._ref._documentPath._parts[1]).get();          
            const stateData = [...this.state.dataSource]; //copy the array
            stateData[index] = sessionData.data(); //execute the manipulations
            const updatedState = stateData.filter((e) => (e.pictures.length === 0));

            this.setState({
                dataSource: updatedState,
                isLoading: false
            })
          });
    }

    getPhotographerData = async () => {       
        this.setState({ isLoading: true });
        const currentUser = auth().currentUser;
        const dataUser = await PhotographerService.getPhotographerSessions();     
        const someArray = dataUser.filter((e: any) => (e.photographerId === currentUser.uid && e.pictures.length === 0));

        this.setState({
            dataSource: someArray,
            isLoading: false
        });
    }


    listHistoric = () => {
        return (
            <FlatList
                data={this.state.dataSource}
                showsVerticalScrollIndicator={false}
                style={{ marginBottom: 50 }}
                refreshControl={
                    <RefreshControl refreshing={this.state.loading} onRefresh={this.getPhotographerData} />
                }
                keyExtractor={(item, index) => item.toString()}
                renderItem={({item, index}) => 
                    <View key={'history-$' + {index}} style={{ flexDirection: 'column', paddingLeft: 14, paddingTop: 20, paddingBottom: 20, borderBottomWidth: 1, borderColor: '#9FACBD', justifyContent: 'center' }}>
                        <View style={{ flexDirection: 'row', width: '100%' }}>
                        <View style={{  width: 50, height: 50, borderRadius: 50/2, backgroundColor: '#B7C3EC', marginRight: 10, alignItems: 'center', justifyContent: 'center' }} >
                            <Text style={{ fontSize: 25, color: 'red' }}>
                                    {item.requesterName.charAt(0)}
                            </Text>
                            </View>
                            <View >
                                <Text style={{ color: 'black', fontWeight: 'bold' }}>{item.requesterName}</Text> 
                                {/*<Text>{ item.date }</Text> ### TO DO*/}
                                <Text>{ item.equipment.brand } { item.equipment.model }</Text>
                                
                            </View>
                        </View>

                        <TouchableOpacity 
                        onPress={ () => this.openLibrary(item, index)} 
                        style={{ position: 'absolute', backgroundColor: '#F39A40', width: 110, height: 30, borderWidth: 1, borderColor: '#FDCA5A', borderRadius: 4, right: 15, justifyContent: 'center' }}>
                            
                            <Text style={{ color: 'white', fontSize: 14, textAlign: 'center' }}>Enviar fotos</Text>
                        </TouchableOpacity>
                        
                        
                    </View>
                }
                
            />
        )
    }

    noHistoricYet = () => {
        return(
            <View style={{ width: '100%', height: '90%', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 20 }}>Nenhum envio pendente</Text>
                <TouchableOpacity onPress={ () => this.getPhotographerData() } >
                    <Text style={{ color: '#76A7F8', textAlign: 'center', marginLeft: 5 }}>Atualizar</Text>
                </TouchableOpacity>
            </View>
        )
    }

    goDetails(session) {
        //@ts-ignore
        this.props.navigation.navigate(("SessionDetails"), {
            session
        });
    }

    render() {
        if (this.state.isLoading) {
            return (<FullScreenLoader />);
        }

        return(
            <View>

                <Header
                leftComponent={{ icon: 'menu', size: 28, color: '#fff', onPress: () => this.drawer() }}
                centerComponent={{ text: 'ENVIOS PENDENTES', style: { color: '#fff', fontSize: 16 } }}
                containerStyle={{ paddingTop: 5, height: 60, backgroundColor: '#224CB4' }}
                />

                {
                    this.state.dataSource.length > 0 ?
                    this.listHistoric()
                    :
                    this.noHistoricYet()
                }

            </View>
        );
    }
}

export default PendingSubmission;