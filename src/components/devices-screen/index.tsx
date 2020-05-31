import ScreenBase from "../common/screen-base";
import React from "react";
import { Header } from 'react-native-elements';
import { NavigationScreenOptions } from "react-navigation";
import { Root, Body, Icon, Picker } from "native-base";
import Swipeout from 'react-native-swipeout';
import { View, Text, FlatList, TouchableOpacity, Alert, Button } from 'react-native';
import firebase from "react-native-firebase";
import FirebaseUserService from "../../services/firebase-user-service";

import DeviceModel from "../../models/firebase/device-model";

interface Props {
}

interface State {
    deviceList: DeviceModel[]
}

class DevicesScreen extends ScreenBase<Props> {

    static navigationOptions: NavigationScreenOptions = {
        title: 'Equipamentos',
        header: null
    };

    state: State = {
        deviceList: []
    };

    loadListOnOpen = async () => {
        const user = await FirebaseUserService.getUser(firebase.auth().currentUser.uid);
    
        this.setState({ deviceList: user.devices});
    }

    confirmDelete = (device, index) => {
        var cont = 0
        this.state.deviceList.map(device => {
            if(device.active)
                cont++
        })
        if(cont===1) {
            Alert.alert('Aviso', 'Você precisa manter pelo menos um equipamento cadastrado em sua conta')
        } else {
            Alert.alert('Excluir', `Tem certeza que deseja excluir o equipamento ${device.brand} ${device.model}?`,
            [
              {text: 'Cancelar', onPress: () => {} },
              {text: 'Excluir', onPress: () => this.deleteDevice(index)},
            ], { cancelable: false });
        }
        
    }

    deleteDevice(index: string | number) {
        //copy the array first
        const updatedArrayInactive = [...this.state.deviceList];
        updatedArrayInactive[index].active = false;
        this.setState({
             deviceList: updatedArrayInactive,
        });
  
        FirebaseUserService.updateDevices(firebase.auth().currentUser.uid, this.state.deviceList);
        //@ts-ignore
        this.props.navigation.navigate("Splash");
    }

    listItem = (item, index) => {
        let swipeBtns = [
            {
              text: 'Excluir',
              backgroundColor: 'red',
              underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
              onPress: () => { this.confirmDelete(item, index) }
           },
            {
              text: 'Editar',
              backgroundColor: '#3B5FCD',
              underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
              onPress: () => { this.goEditDeviceScreen(item) }
           }
        ];

        return(
            <Swipeout
            key={index}
            right={swipeBtns}
            autoClose={true}
            backgroundColor= 'transparent'
            >
                <View key={index} style={{ flexDirection: 'column', paddingLeft: 14, paddingTop: 20, paddingBottom: 20, borderBottomWidth: 1, borderColor: '#9FACBD' }}>
                    <View>
                        <View style={{ flexDirection: 'row'}}>
                            <View style={{ width: '50%' }}>
                                <Text style={{ color: 'black', fontWeight: 'bold' }}>{item.type}</Text>

                                <Text style={{ color: 'black', marginTop: 2 }}>
                                    {item.brand} {item.model}
                                </Text>
                            </View>

                            <View style={{ position: 'absolute', right: 20 }}>
                                <Text style={{ color: 'black' }}>
                                    <Text style={{ fontWeight: 'bold' }}>Quantidade mínima: </Text>
                                    {item.qtdMin}
                                </Text>
                                <Text style={{color: 'black', marginTop: 3 }}>
                                    <Text style={{ fontWeight: 'bold' }}>Preço mínimo: </Text>
                                    R$ {parseFloat(item.priceMin).toFixed(2)}
                                </Text>
                            </View>
                        </View>
                    </View>                        
                </View>
            </Swipeout>
        )
    }

    goAddDeviceScreen = () => {
        const { deviceList } = this.state
        //@ts-ignore
        this.props.navigation.navigate(("NewDevice"), {
            deviceList
        });
    }

    goEditDeviceScreen = (device) => {
        const { deviceList } = this.state
        //@ts-ignore
        this.props.navigation.navigate(("UpdateDevice"), {
            device,
            deviceList
        });
    }

    render() {
        this.loadListOnOpen();

        if(this.state.deviceList === []) {
            return(
                <View style={{ width: '100%', height: '100%' }}>
                    <Header
                    leftComponent={{ icon: 'menu', size: 28, color: '#fff', onPress: () => this.drawer() }}
                    centerComponent={{ text: 'EQUIPAMENTOS', style: { color: '#fff', fontSize: 16 } }}
                    containerStyle={{ paddingTop: 5, height: 60, backgroundColor: '#224CB4' }}
                    />

                    <View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                        <Text>Nenhum equipamento cadastrado</Text>
                    </View>
                    

                    <TouchableOpacity onPress={ () => this.goAddDeviceScreen() } style={{ position: 'absolute', right: 20, bottom: 30, elevation: 5, width: 60, height: 60, backgroundColor: '#F79F46', borderRadius: 60/2, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: 'white', fontSize: 40, top: -2 }}>+</Text>
                    </TouchableOpacity>
                </View>
            )
        }
        return(
            <View style={{ width: '100%', height: '100%' }}>
                <Header
                leftComponent={{ icon: 'menu', size: 28, color: '#fff', onPress: () => this.drawer() }}
                centerComponent={{ text: 'EQUIPAMENTOS', style: { color: '#fff', fontSize: 16 } }}
                containerStyle={{ paddingTop: 5, height: 60, backgroundColor: '#224CB4' }}
                />

                <FlatList
                data={this.state.deviceList}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => item.deviceId}
                renderItem={({item, index}) =>
                    item.active ? this.listItem(item, index) : null                                      
                }
                />

                <TouchableOpacity onPress={ () => this.goAddDeviceScreen() } style={{ position: 'absolute', right: 20, bottom: 30, elevation: 5, width: 60, height: 60, backgroundColor: '#F79F46', borderRadius: 60/2, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: 'white', fontSize: 40, top: -2 }}>+</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

export default DevicesScreen;