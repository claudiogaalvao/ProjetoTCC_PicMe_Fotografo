import ScreenBase from "../common/screen-base";
import React from "react";
import { NavigationScreenOptions } from "react-navigation";
import { Root, Body, Icon, Input, Button } from "native-base";
import Swipeout from 'react-native-swipeout';
import { View, TextInput, Text, Picker, Alert } from 'react-native';
import firebase from "react-native-firebase";
import FirebaseUserService from "../../services/firebase-user-service";

import DeviceModel from "../../models/firebase/device-model";

interface Props {
}

interface State {
    type: string,
    brand: string,
    model: string,
    priceMin: string,
    qtdMin: string,
    deviceList: DeviceModel[],
    isUpdate: boolean,
    inputSelected: string
}

class NewDevice extends ScreenBase<Props> {

    static navigationOptions: NavigationScreenOptions = {
        title: 'Novo equipamento',
        headerStyle: { backgroundColor: 'transparent' },
        headerTintColor: '#000'
    };

    state: State = {
        type: '',
        brand: '',
        model: '',
        priceMin: '',
        qtdMin: '',
        deviceList: [],
        isUpdate: false,
        inputSelected: ''
    };

    onAddItemDevice = async () => {
        const { deviceList } = this.state
        const newDevice = {
            brand: this.state.brand,
            type: this.state.type,
            model: this.state.model,
            priceMin: parseFloat(this.state.priceMin),
            qtdMin: parseInt(this.state.qtdMin),
            active: true,
            createdAt: new Date()
        };

        deviceList.push(newDevice)
        this.setState({ deviceList });

        FirebaseUserService.updateDevices(firebase.auth().currentUser.uid, this.state.deviceList);
        //@ts-ignore
        this.props.navigation.navigate("Splash");
    };

    componentDidMount() {
        var deviceList = []
        // @ts-ignore
        deviceList = this.props.navigation.getParam('deviceList', null);

        this.setState({
            deviceList,
        })
    }

    render() {
        

        return(
            <View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>

                <View style={{ width: '90%', height: 50, marginBottom: 15, borderWidth: 1, borderColor: '#C1C1C1', borderRadius: 30, alignItems: 'center' }}>
                    <Picker 
                    selectedValue={this.state.type} 
                    style={{ height: 50, width: '92%' }}
                    onValueChange={(value) => this.setState({ type: value }) }>
                    <Picker.Item label = "Celular" value = "Celular" />
                    <Picker.Item label = "Aventura" value = "Aventura" />
                    <Picker.Item label = "Câmera Semi-Profissional" value = "Câmera Semi-Profissional" />
                    <Picker.Item label = "Câmera Profissional" value = "Câmera Profissional" />
                    <Picker.Item label = "Drone" value = "Drone" />
                    <Picker.Item label = "Polaroid" value = "Polaroid" />
                    </Picker>
                </View>
                
                <View style={{ width: '90%' }}>
                    {
                    this.state.brand !== '' ?
                    <Text style={{ position: 'absolute', marginLeft: 15, paddingLeft: 5, paddingRight: 5, backgroundColor: 'white', top: this.state.brand !== '' ? -7 : 15, fontSize: this.state.brand !== '' ? 12 : 16, color: this.state.inputSelected === 'brand' ? '#4563CD' : '#A7A7A7', }}>
                        Marca
                    </Text>
                    : null }                      
                    <TextInput
                    style={{ width: '100%', height: 50, paddingLeft: 20, marginBottom: 15, borderWidth: 1, borderColor: this.state.inputSelected === 'brand' ? '#4563CD' : '#C1C1C1', borderRadius: 30, fontSize: 16, zIndex: -1 }}
                    placeholder={this.state.type !== '' ? "Digite a marca" : ""}
                    onChangeText={(brand) => this.setState({brand})}
                    value={this.state.brand}
                    onFocus={() => this.setState({ inputSelected: 'brand' })}
                    onBlur={() => this.setState({ inputSelected: '' }) }
                    />
                </View>
                
                <View style={{ width: '90%' }}>
                    {
                        this.state.model !== '' ?
                        <Text style={{ position: 'absolute', marginLeft: 15, paddingLeft: 5, paddingRight: 5, backgroundColor: 'white', top: this.state.model !== '' ? -7 : 15, fontSize: this.state.model !== '' ? 12 : 16, color: this.state.inputSelected === 'model' ? '#4563CD' : '#A7A7A7', }}>
                            Modelo
                        </Text>
                        :
                        null
                    }
                    <TextInput
                    style={{ width: '100%', height: 50, paddingLeft: 20, marginBottom: 15, borderWidth: 1, borderColor: this.state.inputSelected === 'model' ? '#4563CD' : '#C1C1C1', borderRadius: 30, fontSize: 16, zIndex: -1 }}
                    placeholder="Digite o modelo"
                    onChangeText={(model) => this.setState({model})}
                    value={this.state.model}
                    onFocus={() => this.setState({ inputSelected: 'model' })}
                    onBlur={() => this.setState({ inputSelected: '' }) }
                    />
                </View>

                <View style={{ width: '90%', flexDirection: 'row' }}>
                    <View style={{ width: '48%' }}>
                        {
                            this.state.qtdMin !== '' ?
                            <Text style={{ position: 'absolute', marginLeft: 15, paddingLeft: 5, paddingRight: 5, backgroundColor: 'white', top: this.state.qtdMin !== '' ? -7 : 15, fontSize: this.state.qtdMin !== '' ? 12 : 16, color: this.state.inputSelected === 'qtdMin' ? '#4563CD' : '#A7A7A7', }}>
                                Quantidade mínima
                            </Text>
                            :
                            null
                        }
                        <TextInput
                        style={{ width: '100%', height: 50, paddingLeft: 20, marginBottom: 15, borderWidth: 1, borderColor: this.state.inputSelected === 'qtdMin' ? '#4563CD' : '#C1C1C1', borderRadius: 30, fontSize: 16, zIndex: -1 }}
                        placeholder="Qtd mínima"
                        onChangeText={(qtdMin) => this.setState({qtdMin})}
                        value={ this.state.qtdMin !== undefined ? this.state.qtdMin.toString() : '' }
                        keyboardType='number-pad'
                        onFocus={() => this.setState({ inputSelected: 'qtdMin' })}
                        onBlur={() => this.setState({ inputSelected: '' }) }
                        />
                    </View>

                    <View style={{ width: '48%' }}>
                        {
                            this.state.priceMin !== '' ?
                            <Text style={{ position: 'absolute', marginLeft: 15, paddingLeft: 5, paddingRight: 5, backgroundColor: 'white', top: this.state.priceMin !== '' ? -7 : 15, fontSize: this.state.priceMin !== '' ? 12 : 16, color: this.state.inputSelected === 'priceMin' ? '#4563CD' : '#A7A7A7', }}>
                                Preço mínimo
                            </Text>
                            :
                            null
                        }
                        <TextInput
                        style={{ width: '100%', height: 50, paddingLeft: 20, marginLeft: '3%', marginBottom: 15, borderWidth: 1, borderColor: this.state.inputSelected === 'priceMin' ? '#4563CD' : '#C1C1C1', borderRadius: 30, fontSize: 16, zIndex: -1 }}
                        placeholder="Preço mínimo"
                        onChangeText={(priceMin) => this.setState({priceMin})}
                        value={ this.state.priceMin !== undefined ? this.state.priceMin.toString() : '' }
                        keyboardType='number-pad'
                        onFocus={() => this.setState({ inputSelected: 'priceMin' })}
                        onBlur={() => this.setState({ inputSelected: '' }) }
                        />
                    </View>
                </View>

                <View style={{ width: '90%', marginTop: 40 }}>
                    <Button
                    onPress={() => this.onAddItemDevice() }
                    style={{ width: '100%', borderRadius: 20, alignItems: 'center', justifyContent: 'center' }}
                    >
                        <Text style={{ color: 'white', textAlign: 'center' }}>CADASTRAR</Text>
                    </Button>
                </View>

                
            </View>
        );
    }
}

export default NewDevice;