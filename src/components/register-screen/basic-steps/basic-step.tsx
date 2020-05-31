import React, { Component } from "react";
import { View, Text, TextInput, Alert, Picker } from "react-native";
import { Toast } from 'native-base';
import { TextInputMask } from 'react-native-masked-text';
import PhotographerModel from "../../../models/firebase/photographer-model";
import FirebaseProfileService from "../../../services/firebase-profile-service";

interface Props {
    newPhotographer: PhotographerModel
    handleChange: Function
}

interface State {
    birthDate: string;
    inputSelected: string;
}

class BasicStep extends Component<Props> {
  
    state: State = {
        birthDate: '',
        inputSelected: ''
    };

    isEmailAvailable = async () => {
        try{
            const { email } = this.props.newPhotographer;
            const emailAvailable = await FirebaseProfileService.isEmailAvailable(email);
            
            if (!emailAvailable) {
                throw { message: 'Já existe uma conta cadastrada com esse endereço de e-mail' };
            } else {
                this.props.handleChange('isEmailAvailable', true)
            }                
        } catch(error) {
            this.showError(error.message);
        }
    }

    showError = (message: string) => Toast.show({ text: message, type: 'danger', position: 'top', duration: 5000 });

    render() {

        return(
            <View>

                <View style={{ width: '90%', flexDirection: 'row', marginLeft: '5%', paddingTop: '15%' }}>
                    <View style={{ width: '48%', marginRight: '4%' }}>
                        {
                            this.props.newPhotographer.firstName !== undefined ?
                            <Text style={{ position: 'absolute', alignSelf: 'flex-start', marginLeft: 15, 
                            paddingLeft: 5, paddingRight: 5, backgroundColor: 'white', 
                            top: this.props.newPhotographer.firstName !== undefined ? -8 : 15, 
                            fontSize: this.props.newPhotographer.firstName !== undefined ? 12 : 16, 
                            color: this.state.inputSelected === 'firstName' ? '#4563CD' : '#A7A7A7', }}>
                                Primeiro nome
                            </Text>
                            :
                            null
                        }
                        <TextInput                        
                        placeholder='Primeiro nome'
                        onChangeText={ (text) => this.props.handleChange('firstName', text) }
                        value={ this.props.newPhotographer.firstName }
                        onFocus={() => this.setState({ inputSelected: 'firstName' })}
                        onBlur={() => this.setState({ inputSelected: '' }) }
                        style={{ width: '100%', height: 50, paddingLeft: 20, marginBottom: 15, borderWidth: 1, borderColor: this.state.inputSelected === 'firstName' ? '#4563CD' : '#C1C1C1', borderRadius: 30, fontSize: 16, zIndex: -1 }}
                        />
                    </View>

                    <View style={{ width: '48%' }}>
                        {
                            this.props.newPhotographer.lastName !== undefined ?
                            <Text 
                            style={{ position: 'absolute', alignSelf: 'flex-start', marginLeft: 15, 
                            paddingLeft: 5, paddingRight: 5, backgroundColor: 'white', 
                            top: this.props.newPhotographer.lastName !== undefined ? -8 : 15, 
                            fontSize: this.props.newPhotographer.lastName !== undefined ? 12 : 16, 
                            color: this.state.inputSelected === 'lastName' ? '#4563CD' : '#A7A7A7', }}>
                                Último nome
                            </Text>
                            :
                            null
                        }
                        <TextInput
                        placeholder='Último nome'
                        onChangeText={ (text) => this.props.handleChange('lastName', text) }
                        value={ this.props.newPhotographer.lastName }
                        onFocus={() => this.setState({ inputSelected: 'lastName' })}
                        onBlur={() => this.setState({ inputSelected: '' }) }
                        style={{ width: '100%', height: 50, paddingLeft: 20, marginBottom: 15, 
                        borderWidth: 1, borderColor: this.state.inputSelected === 'lastName' ? '#4563CD' : '#C1C1C1', 
                        borderRadius: 30, fontSize: 16, zIndex: -1 }}
                        />
                    </View>
                </View>

                <View style={{ width: '90%', flexDirection: 'row', marginLeft: '5%' }}>
                    <View style={{ width: '54%', marginRight: '4%' }}>
                        {
                            this.props.newPhotographer.cpf !== undefined ?
                            <Text style={{ position: 'absolute', alignSelf: 'flex-start', 
                            marginLeft: 15, paddingLeft: 5, paddingRight: 5, backgroundColor: 'white', 
                            top: this.props.newPhotographer.cpf !== undefined ? -8 : 15, 
                            fontSize: this.props.newPhotographer.cpf !== undefined ? 12 : 16, 
                            color: this.state.inputSelected === 'cpf' ? '#4563CD' : '#A7A7A7', }}>
                                CPF
                            </Text>
                            :
                            null
                        }
                        <TextInputMask
                        type={'cpf'}
                        maxLength={14}
                        placeholder='Digite seu CPF'
                        onChangeText={ (text) => this.props.handleChange('cpf', text) }
                        value={ this.props.newPhotographer.cpf }
                        onFocus={() => this.setState({ inputSelected: 'cpf' })}
                        onBlur={() => this.setState({ inputSelected: '' }) }
                        style={{ width: '100%', height: 50, paddingLeft: 20, marginBottom: 15, 
                        borderWidth: 1, borderColor: this.state.inputSelected === 'cpf' ? '#4563CD' : '#C1C1C1', 
                        borderRadius: 30, fontSize: 16, zIndex: -1 }}
                        />
                    </View>

                    <View style={{ width: '42%' }}>
                        {
                            this.props.newPhotographer.birthDate !== undefined ?
                            <Text style={{ position: 'absolute', alignSelf: 'flex-start', marginLeft: 15, 
                            paddingLeft: 5, paddingRight: 5, backgroundColor: 'white', 
                            top: this.props.newPhotographer.birthDate !== undefined ? -8 : 15, 
                            fontSize: this.props.newPhotographer.birthDate !== undefined ? 12 : 16, 
                            color: this.state.inputSelected === 'birthDate' ? '#4563CD' : '#A7A7A7', }}>
                                Nascimento
                            </Text>
                            :
                            null
                        }
                        <TextInputMask
                        type={'datetime'}
                        options={{
                        format: 'DD/MM/YYYY'
                        }}
                        maxLength={10}
                        placeholder='Nascimento'
                        onChangeText={ (text) => {
                            this.setState({
                                birthDate: text
                            })
                            const isDate = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/
                            
                            if(isDate.test(text)) {
                                this.props.handleChange('birthDate', text) 
                            }                            
                        }}
                        value={ this.props.newPhotographer.birthDate !== undefined ? this.props.newPhotographer.birthDate.toString() : this.state.birthDate}
                        onFocus={() => {
                            this.props.newPhotographer.birthDate = undefined;
                            this.setState({ inputSelected: 'birthDate' })
                        }}
                        onBlur={() => this.setState({ inputSelected: '' }) }
                        style={{ width: '100%', height: 50, paddingLeft: 20, marginBottom: 15, 
                        borderWidth: 1, borderColor: this.state.inputSelected === 'birthDate' ? '#4563CD' : '#C1C1C1', 
                        borderRadius: 30, fontSize: 16, zIndex: -1 }}
                        />
                    </View>
                </View>

                <View style={{ alignItems: 'center' }}>
                    {
                        this.props.newPhotographer.email !== undefined ?
                        <Text style={{ position: 'absolute', alignSelf: 'flex-start', marginLeft: 30, 
                        paddingLeft: 5, paddingRight: 5, backgroundColor: 'white', 
                        top: this.props.newPhotographer.email !== undefined ? -8 : 15, 
                        fontSize: this.props.newPhotographer.email !== undefined ? 12 : 16, 
                        color: this.state.inputSelected === 'email' ? '#4563CD' : '#A7A7A7', }}>
                            E-mail
                        </Text>
                        :
                        null
                    }
                    <TextInput
                    placeholder='E-mail'
                    onChangeText={ (text) => this.props.handleChange('email', text) }
                    value={ this.props.newPhotographer.email }
                    onFocus={() => this.setState({ inputSelected: 'email' })}
                    onBlur={() => {
                        this.setState({ inputSelected: '' });
                        this.isEmailAvailable();
                    }}
                    style={{ width: '90%', height: 50, paddingLeft: 20, marginBottom: 15, 
                    borderWidth: 1, borderColor: this.state.inputSelected === 'email' ? '#4563CD' : '#C1C1C1', 
                    borderRadius: 30, fontSize: 16, zIndex: -1 }}
                    />
                </View>

                <View style={{ alignItems: 'center' }}>
                    {
                        this.props.newPhotographer.phone !== undefined ?
                        <Text style={{ position: 'absolute', alignSelf: 'flex-start', marginLeft: 30, 
                        paddingLeft: 5, paddingRight: 5, backgroundColor: 'white', 
                        top: this.props.newPhotographer.phone !== undefined ? -8 : 15, 
                        fontSize: this.props.newPhotographer.phone !== undefined ? 12 : 16, 
                        color: this.state.inputSelected === 'phone' ? '#4563CD' : '#A7A7A7', }}>
                            Celular
                        </Text>
                        :
                        null
                    }
                    <TextInputMask
                    type={'cel-phone'}
                    placeholder='Celular'
                    value={ this.props.newPhotographer.phone }
                    onChangeText={ (text) => this.props.handleChange('phone', text) }
                    onFocus={() => this.setState({ inputSelected: 'phone' })}
                    onBlur={() => this.setState({ inputSelected: '' }) }
                    style={{ width: '90%', height: 50, paddingLeft: 20, marginBottom: 15, borderWidth: 1, 
                    borderColor: this.state.inputSelected === 'phone' ? '#4563CD' : '#C1C1C1', 
                    borderRadius: 30, fontSize: 16, zIndex: -1 }}
                    maxLength={15}
                    />
                </View>
            
            </View>
        );
    }
}

export default BasicStep;