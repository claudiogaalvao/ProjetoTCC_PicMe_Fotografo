import React, { Component } from "react";
import ScreenBase from "../../common/screen-base";
import { NavigationScreenOptions } from "react-navigation";
import { View, Text, TextInput, Alert, Picker } from "react-native";
import { Icon } from 'native-base';
import { TextInputMask } from 'react-native-masked-text';
import searchCEP from 'cep-promise';
import PhotographerModel from "../../../models/firebase/photographer-model";

interface Props {
    newPhotographer: PhotographerModel
    handleChange: Function
}

interface State {
    password: string,
    confirmPassword: string,
    hasSixChar: boolean,
    hasNum: boolean,
    hasUpperWord: boolean,
    hasSpecialChar: boolean,
    isMatch: boolean,
    inputSelected: string
}

class PasswordStep extends Component<Props> {
    static navigationOptions: NavigationScreenOptions = {
        title: '',
        headerStyle: { backgroundColor: 'transparent' },
        headerTintColor: 'white'
    }
    
    state: State = {
        password: '',
        confirmPassword: '',
        hasSixChar: false,
        hasNum: false,
        hasUpperWord: false,
        hasSpecialChar: false,
        isMatch: false,
        inputSelected: '',
    };

    handlePassword(text) {
        this.setState({ password: text })
        var hasNumber = /\d/;
        var hasUpperWord = /[A-Z]/;
        var hasSpecialChar = /\W+/g;

        if(text.length > 5) {
            this.setState({  hasSixChar: true })
        } else {
            this.setState({  hasSixChar: false })
        }

        if(hasNumber.test(text)) {
            this.setState({  hasNum: true })
        } else {
            this.setState({  hasNum: false })
        }

        if(hasUpperWord.test(text)) {
            this.setState({  hasUpperWord: true })
        } else {
            this.setState({  hasUpperWord: false })
        }

        if(hasSpecialChar.test(text)) {
            this.setState({  hasSpecialChar: true })
        } else {
            this.setState({  hasSpecialChar: false })
        }
    }

    handleConfirmPassword(text){
        this.setState({ confirmPassword: text })

        if(text === this.state.password) {
            this.setState({ 
                isMatch: true 
            })
            this.props.handleChange('passwordOk', true)
            this.props.handleChange('password', this.state.password)
        } else {
            this.setState({ isMatch: false })
        }
        
        
    }

    render() {

        return(
            <View>
            
                <View style={{ alignItems: 'center', paddingTop: '15%' }}>
                    {
                        this.state.password !== '' ?
                        <Text style={{ position: 'absolute', alignSelf: 'flex-start', marginLeft: 30, paddingLeft: 5, paddingRight: 5, backgroundColor: 'white', top: this.state.password !== '' ? '60%' : 15, fontSize: this.state.password !== '' ? 12 : 16, color: this.state.inputSelected === 'password' ? '#4563CD' : '#A7A7A7', }}>
                            Senha
                        </Text>
                        :
                        null
                    }
                    <TextInput
                    placeholder='Escolha uma senha'
                    secureTextEntry={true}
                    onChangeText={ (text) => this.handlePassword(text) }
                    value={ this.state.password }
                    onFocus={() => this.setState({ inputSelected: 'password' })}
                    onBlur={() => this.setState({ inputSelected: '' }) }
                    style={{ width: '90%', height: 50, paddingLeft: 20, marginBottom: 15, borderWidth: 1, borderColor: this.state.inputSelected === 'password' ? '#4563CD' : '#C1C1C1', borderRadius: 30, fontSize: 16, zIndex: -1 }}
                    />
                </View>

                <View style={{ alignItems: 'center' }}>
                    {
                        this.state.confirmPassword !== '' ?
                        <Text style={{ position: 'absolute', alignSelf: 'flex-start', marginLeft: 30, paddingLeft: 5, paddingRight: 5, backgroundColor: 'white', top: this.state.confirmPassword !== '' ? -8 : 15, fontSize: this.state.confirmPassword !== '' ? 12 : 16, color: this.state.inputSelected === 'confirmPassword' ? '#4563CD' : '#A7A7A7', }}>
                            Confirmação de senha
                        </Text>
                        :
                        null
                    }
                    <TextInput
                    placeholder='Repita a senha'
                    secureTextEntry={true}
                    onChangeText={ (text) => this.handleConfirmPassword(text) }
                    value={ this.state.confirmPassword }
                    onFocus={() => this.setState({ inputSelected: 'confirmPassword' })}
                    onBlur={() => this.setState({ inputSelected: '' }) }
                    style={{ width: '90%', height: 50, paddingLeft: 20, marginBottom: 15, borderWidth: 1, borderColor: this.state.inputSelected === 'confirmPassword' ? '#4563CD' : '#C1C1C1', borderRadius: 30, fontSize: 16, zIndex: -1 }}
                    />
                </View>

                <View style={{ height: 130, paddingLeft: '6%' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                        <Icon 
                        type="FontAwesome5" name={ this.state.hasSixChar ? "check" : "times" } 
                        style={{ fontSize: 18, color: this.state.hasSixChar ? "#67D471" : "#A7A7A7", 
                        marginRight: this.state.hasSixChar ? 5 : 10 }} />
                        <Text>Mínimo 6 caracteres</Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                        <Icon 
                        type="FontAwesome5" name={ this.state.hasNum ? "check" : "times" } 
                        style={{ fontSize: 18, color: this.state.hasNum ? "#67D471" : "#A7A7A7", 
                        marginRight: this.state.hasNum ? 5 : 10 }} />
                        <Text>Mínimo 1 número</Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                        <Icon 
                        type="FontAwesome5" name={ this.state.hasUpperWord ? "check" : "times" } 
                        style={{ fontSize: 18, color: this.state.hasUpperWord ? "#67D471" : "#A7A7A7", 
                        marginRight: this.state.hasUpperWord ? 5 : 10 }} />
                        <Text>Mínimo 1 letra maíuscula</Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                        <Icon type="FontAwesome5" name={ this.state.hasSpecialChar ? "check" : "times" }
                        style={{ fontSize: 18, color: this.state.hasSpecialChar ? "#67D471" : "#A7A7A7",
                        marginRight: this.state.hasSpecialChar ? 5 : 10 }} />
                        <Text>Mínimo 1 caractere especial</Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                        <Icon type="FontAwesome5" name={ this.state.isMatch ? "check" : "times" }
                        style={{ fontSize: 18, color: this.state.isMatch ? "#67D471" : "#A7A7A7", 
                        marginRight: this.state.isMatch ? 5 : 10 }} />
                        <Text>Senhas equivalentes</Text>
                    </View>                
                    
                </View>
            
            </View>
        );
    }
}

export default PasswordStep;