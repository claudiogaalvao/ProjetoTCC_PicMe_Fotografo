import React, { Component } from "react";
import { NavigationScreenOptions } from "react-navigation";
import { View, Text, TextInput, Alert, Picker } from "react-native";
import BasicStep from './basic-steps/basic-step'
import AddressStep from './basic-steps/address-step'
import PasswordStep from './basic-steps/password-step'
import PhotographerModel from "../../models/firebase/photographer-model";

interface Props {
    step: number,
    newPhotographer: PhotographerModel,
    handleChange: Function
}

interface State {
    inputSelected: string,
}

class BasicData extends Component<Props> {
  static navigationOptions: NavigationScreenOptions = {
    title: '',
    headerStyle: { backgroundColor: 'transparent' },
    headerTintColor: 'white'
  }
  
  state: State = {
    inputSelected: '',
  };

  render() {

    return(
      <View style={{ height: '100%', width: '100%' }}>

        <View style={{ position: 'absolute', top: -10, right: -10, flexDirection: 'row', 
        width: 50, height: 50, borderRadius: 50/2,
        backgroundColor: 'white', borderWidth: 4, borderColor: '#3B5FCD', 
        justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'black', fontSize: 26 }}>
            { this.props.step > 3 ? 3 : this.props.step+1 }
            </Text>
            <Text style={{ color: 'black', fontSize: 16 }}>
            /3
            </Text>
        </View>

        {
            this.props.step === 0 && 
            <BasicStep
            newPhotographer={ this.props.newPhotographer }
            handleChange={ this.props.handleChange } />
        }

        {
          this.props.step === 1 && 
          <AddressStep 
          newPhotographer={ this.props.newPhotographer }
          handleChange={ this.props.handleChange } />
        }

        {
          this.props.step === 2 && 
          <PasswordStep 
          newPhotographer={ this.props.newPhotographer }
          handleChange={ this.props.handleChange } />
        }
          
        
      </View>
    );
  }
}

export default BasicData;