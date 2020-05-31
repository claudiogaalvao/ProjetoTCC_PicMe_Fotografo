import React, { Component } from "react";
import ScreenBase from "../common/screen-base";
import { NavigationScreenOptions } from "react-navigation";
import { View, Alert, TextInput, Text, LayoutAnimation } from "react-native";
import { Toast, Root } from 'native-base';
import StepIndicator from 'react-native-step-indicator';
import BasicScreen from './basic-screen';
import IdentificationScreen from './identification-screen';
import firebase, { RNFirebase } from "react-native-firebase";
import Collections from "../../models/firebase/collections";
import FinishScreen from './finish-screen';
import ButtonsStep from './buttons-step';
import PhotographerModel from "../../models/firebase/photographer-model";

interface Props {

}

interface State {
    newPhotographer: PhotographerModel;
    generalStep: number;
    basicStep: number;
    password: string;
    passwordOk: boolean;
    disableNextButton: boolean;
}

class RegisterScreen extends ScreenBase<Props> {
    static navigationOptions: NavigationScreenOptions = {
        title: '',
        headerStyle: { backgroundColor: 'transparent' },
        headerTintColor: 'white'
    }

    private user: RNFirebase.User;
    
    state: State = {
        newPhotographer: new PhotographerModel(),
        generalStep: 0,
        basicStep: 0,
        password: '',
        passwordOk: false,
        disableNextButton: true
    };

    handleChange = (input: string, text: any) => {
        if(input === 'passwordOk') {
            if(text)
                this.changeDisableNextButton(false)                         
            return;
        } else if(input === 'documentOk') {
            if(text)
                this.changeDisableNextButton(false)
            return
        } else if(input === 'password') {
            this.setState({
                password: text
            })
            return
        } else {
            this.setState({
                newPhotographer: {
                    ...this.state.newPhotographer,
                    [input]: text
                }            
            })
        }

        if(this.state.generalStep === 0) {

            switch(this.state.basicStep) {
                case 0:                    
                    if(
                    (this.state.newPhotographer.firstName   !== undefined   && this.state.newPhotographer.firstName !== '') &&
                    (this.state.newPhotographer.lastName    !== undefined   && this.state.newPhotographer.lastName  !== '') &&
                    (this.state.newPhotographer.email       !== undefined   && this.state.newPhotographer.email     !== '') &&
                    (this.state.newPhotographer.phone       !== undefined   && this.state.newPhotographer.phone     !== '') &&
                    this.state.newPhotographer.birthDate    !== undefined ) {
                        this.changeDisableNextButton(false)
                    } else {
                        this.changeDisableNextButton(true)
                    }
                    break;
                case 1:
                    if(
                    this.state.newPhotographer.street           !== undefined  &&
                    this.state.newPhotographer.number           >   0   &&
                    this.state.newPhotographer.neighborhood     !== undefined  &&
                    this.state.newPhotographer.city             !== undefined  &&
                    this.state.newPhotographer.state            !== undefined) {
                        this.changeDisableNextButton(false)
                    }
                    break;
                case 2:
                    if(this.state.passwordOk)
                        this.changeDisableNextButton(false)
                    break;
                default:
                    return;
            }
        }

        if(this.state.generalStep === 1) {
            this.setState({

            })
        }
    }

    changeDisableNextButton = async (value: boolean) => {
        this.setState({
            disableNextButton: value
        })
    }

    nextGeneralStep = (isGeneral: boolean) => {
        
        if(isGeneral) {
            if(this.state.generalStep === 1)
                this.onSendPressed()
                
            this.setState({
                generalStep: this.state.generalStep + 1,
                nextButtonActive: true
            })
        } else {
            this.setState({
                basicStep: this.state.basicStep + 1,
                nextButtonActive: true
            })
        }

        this.changeDisableNextButton(true)
        
    }

    previousGeneralStep = (isGeneral: boolean) => {
        if(isGeneral) {

            this.setState({
                generalStep: this.state.generalStep - 1
            })            
            
        } else {
            this.setState({
                basicStep: this.state.basicStep - 1
            })
        }
        
    }

    onSendPressed = async () => {
        const credential = await firebase.auth().createUserWithEmailAndPassword(this.state.newPhotographer.email, this.state.password);
        await firebase.auth().signInWithEmailAndPassword(credential.user.email, this.state.password);
        this.user = firebase.auth().currentUser;
        await firebase.firestore().collection(Collections.PHOTOGRAPHERS).doc(this.user.uid).set(this.buildFirebaseUser());
        await this.user.updateEmail(this.state.newPhotographer.email);
        await this.user.updatePassword(this.state.password);
        await this.user.updateProfile({ displayName: `${this.state.newPhotographer.firstName} ${this.state.newPhotographer.lastName}` });
        await this.user.sendEmailVerification();
        this.user = firebase.auth().currentUser;
        await firebase.auth().signOut();
    }

    buildFirebaseUser = (): PhotographerModel => {
        const firebaseUser: PhotographerModel = {
            firstName: this.state.newPhotographer.firstName,
            lastName: this.state.newPhotographer.lastName,
            birthDate: this.state.newPhotographer.birthDate,
            phone: this.state.newPhotographer.phone,
            cpf: this.state.newPhotographer.cpf,
            zipCode: this.state.newPhotographer.zipCode,
            street: this.state.newPhotographer.street,
            number: this.state.newPhotographer.number,
            neighborhood: this.state.newPhotographer.neighborhood,
            complement: this.state.newPhotographer.complement,
            city: this.state.newPhotographer.city,
            state: this.state.newPhotographer.state,
            country: this.state.newPhotographer.country,
            email: this.state.newPhotographer.email,
            photo: '',
            document: this.state.newPhotographer.document,
            active: true,
            permission: false,
            createdAt: new Date(),
            devices: [],
            photographerId: this.user.uid,
            ratingCount: 0,
            ratingSum: 0
        }
    
        return firebaseUser;
    }

    onFinishBackPressed = () => {
        //@ts-ignore
        this.props.navigation.navigate("Splash");
    }

    showError = (message: string) => Toast.show({ text: message, type: 'danger', position: 'top', duration: 5000 });

    render() {

        return(
            <Root>
                <View style={{ backgroundColor: '#DADBDF', height: '120%', width: '100%', top: -50 }}>
                    <View style={{ width: '100%', height: '60%', backgroundColor: '#3B5FCD', borderRadius: 30, top: -50 }} />

                    <View style={{ position: 'absolute', top: 20, left: 30, right: 30, width: undefined, height: 30, paddingTop: 10 }}> 
                    <StepIndicator
                        stepCount={3}
                        customStyles={customStyles}
                        currentPosition={this.state.generalStep}
                        labels={["Dados básicos", "Identificação", "Confirmação"]} />
                    </View>
                
                
                    <View style={{ position: 'absolute', width: undefined, height: 350, top: '20%', left: 20, right: 20, borderRadius: 20, backgroundColor: 'white' }}>
                        
                        {
                            this.state.generalStep === 0 &&
                            <BasicScreen
                            step={this.state.basicStep}
                            newPhotographer={this.state.newPhotographer}
                            handleChange={this.handleChange} />
                        }

                        {
                            this.state.generalStep === 1 &&
                            <IdentificationScreen
                            newPhotographer={this.state.newPhotographer}
                            handleChange={this.handleChange}
                            navigation={
                                //@ts-ignore
                                this.props.navigation
                            } />
                        }

                        {
                            this.state.generalStep === 2 &&
                            <FinishScreen
                            onFinishBackPressed={this.onFinishBackPressed} />
                        }                    
                        
                        {
                            this.state.generalStep === 2 ?
                            null
                            :
                            <ButtonsStep 
                            generalStep={this.state.generalStep}
                            basicStep={this.state.basicStep}
                            disableNextButton={this.state.disableNextButton}
                            nextGeneralStep={ this.nextGeneralStep } 
                            previousGeneralStep={ this.previousGeneralStep } />
                        }
                        
                    
                    </View>
                </View>
            </Root>
        );
    }
}


const customStyles = {
    stepIndicatorSize: 28,
    currentStepIndicatorSize:32,
    separatorStrokeWidth: 1,
    currentStepStrokeWidth: 2,
    stepStrokeCurrentColor: '#FE9000',
    stepStrokeWidth: 2,
    stepStrokeFinishedColor: '#FE9000',
    stepStrokeUnFinishedColor: '#aaaaaa',
    separatorFinishedColor: '#FE9000',
    separatorUnFinishedColor: '#aaaaaa',
    stepIndicatorFinishedColor: '#FE9000',
    stepIndicatorUnFinishedColor: '#aaaaaa',
    stepIndicatorCurrentColor: '#FE9000',
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 16,
    stepIndicatorLabelCurrentColor: 'white',
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: 'white',
    labelColor: '#999999',
    labelSize: 13,
    currentStepLabelColor: '#FE9000'
  }


export default RegisterScreen;