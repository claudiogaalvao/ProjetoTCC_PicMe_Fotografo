import React, { Component } from "react";
import ScreenBase from "../../common/screen-base";
import { NavigationScreenOptions } from "react-navigation";
import { View, Text, TextInput, Alert, Picker } from "react-native";
import { TextInputMask } from 'react-native-masked-text';
import searchCEP from 'cep-promise';
import PhotographerModel from "../../../models/firebase/photographer-model";

interface Props {
  newPhotographer: PhotographerModel,
  handleChange: Function
}

interface State {
    inputSelected: string,
    brazilianStates: string[]
}

class AdressStep extends Component<Props> {
  static navigationOptions: NavigationScreenOptions = {
    title: '',
    headerStyle: { backgroundColor: 'transparent' },
    headerTintColor: 'white'
  }
  
  state: State = {
    inputSelected: '',
    brazilianStates: ["SP", "RJ", "MG", "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", 
                      "MT", "MS", "PA", "PB", "PR", "PE", "PI", "RN", "RS", "RO", "RR", "SC", "SE", "TO"]
  };

  onBlurZipCode = async () => {
    var zipCode = parseInt(this.props.newPhotographer.zipCode.match(/\d/g).join(""));
    
    await searchCEP(zipCode)
    .then(address => {
      this.props.handleChange('street', address.street)
      this.props.handleChange('neighborhood', address.neighborhood)
      this.props.handleChange('city', address.city)
      this.props.handleChange('state', address.state)
      this.props.handleChange('country', 'brasil')
    })
    .catch(error => {
      console.log(error)
      return;
    })
  }

  handleChange = (input, text) => {
    this.setState({
        [input]: text
    })
  }

  render() {

    return(
        <View>
          
          <View style={{ alignItems: 'center', paddingTop: '15%' }}>
            {
                this.props.newPhotographer.zipCode !== '' ?
                <Text style={{ position: 'absolute', alignSelf: 'flex-start', marginLeft: 30, paddingLeft: 5, 
                paddingRight: 5, backgroundColor: 'white', top: this.props.newPhotographer.zipCode !== '' ? '35%' : 15, 
                fontSize: this.props.newPhotographer.zipCode !== '' ? 12 : 16, 
                color: this.state.inputSelected === 'zipCode' ? '#4563CD' : '#A7A7A7', }}>
                    CEP
                </Text>
                :
                null
            }
            <TextInputMask
            type={'zip-code'}
            value={this.props.newPhotographer.zipCode}
            placeholder='Digite seu CEP'
            onChangeText={ (text) => this.props.handleChange('zipCode', text) }
            onFocus={() => this.setState({ inputSelected: 'zipCode' })}
            onBlur={() => { 
                this.onBlurZipCode();
                this.setState({ inputSelected: '' });
            }}
            style={{ width: '90%', height: 50, paddingLeft: 20, marginBottom: 15, borderWidth: 1, 
            borderColor: this.state.inputSelected === 'zipCode' ? '#4563CD' : '#C1C1C1', 
            borderRadius: 30, fontSize: 16, zIndex: -1 }}
            />
          </View>

          <View style={{ width: '90%', flexDirection: 'row', marginLeft: '5%' }}>
            <View style={{ width: '71%', marginRight: '4%' }}>
              {
                  this.props.newPhotographer.street !== '' ?
                  <Text style={{ position: 'absolute', alignSelf: 'flex-start', marginLeft: 30, 
                  paddingLeft: 5, paddingRight: 5, backgroundColor: 'white', 
                  top: this.props.newPhotographer.street !== '' ? -8 : 15, 
                  fontSize: this.props.newPhotographer.street !== '' ? 12 : 16, 
                  color: this.state.inputSelected === 'street' ? '#4563CD' : '#A7A7A7', }}>
                      Logradouro
                  </Text>
                  :
                  null
              }
              <TextInput
              placeholder='Digite seu Logradouro'
              onChangeText={ (text) => this.props.handleChange('street', text) }
              value={ this.props.newPhotographer.street }
              onFocus={() => this.setState({ inputSelected: 'street' })}
              onBlur={() => this.setState({ inputSelected: '' }) }
              style={{ width: '100%', height: 50, paddingLeft: 20, marginBottom: 15, borderWidth: 1, borderColor: this.state.inputSelected === 'street' ? '#4563CD' : '#C1C1C1', borderRadius: 30, fontSize: 16, zIndex: -1 }}
              />
            </View>

            <View style={{ width: '25%' }}>
              {
                  this.props.newPhotographer.number !== undefined ?
                  <Text style={{ position: 'absolute', alignSelf: 'flex-start', marginLeft: 15, 
                  paddingLeft: 5, paddingRight: 5, backgroundColor: 'white', 
                  top: this.props.newPhotographer.number !== undefined ? -8 : 15, 
                  fontSize: this.props.newPhotographer.number !== undefined ? 12 : 16, 
                  color: this.state.inputSelected === 'number' ? '#4563CD' : '#A7A7A7', }}>
                      Nº
                  </Text>
                  :
                  null
              }
              <TextInput
              placeholder='Nº'
              onChangeText={ (text) => {
                if(text === '')
                  text = null
                this.props.handleChange('number', text)
              }}
              value={ this.props.newPhotographer.number !== undefined ? this.props.newPhotographer.number.toString() : '' }
              onFocus={() => this.setState({ inputSelected: 'number' })}
              onBlur={() => this.setState({ inputSelected: '' }) }
              style={{ width: '100%', height: 50, paddingLeft: 20, marginBottom: 15, borderWidth: 1, 
              borderColor: this.state.inputSelected === 'number' ? '#4563CD' : '#C1C1C1', 
              borderRadius: 30, fontSize: 16, zIndex: -1 }}
              />
            </View>
          </View>

          <View style={{ alignItems: 'center' }}>
            {
                this.props.newPhotographer.neighborhood !== '' ?
                <Text style={{ position: 'absolute', alignSelf: 'flex-start', marginLeft: 30, 
                paddingLeft: 5, paddingRight: 5, backgroundColor: 'white', 
                top: this.props.newPhotographer.neighborhood !== '' ? -8 : 15, 
                fontSize: this.props.newPhotographer.neighborhood !== '' ? 12 : 16, 
                color: this.state.inputSelected === 'neighborhood' ? '#4563CD' : '#A7A7A7', }}>
                    Bairro
                </Text>
                :
                null
            }
            <TextInput
            placeholder='Digite seu Bairro'
            onChangeText={ (text) => this.props.handleChange('neighborhood', text) }
            value={ this.props.newPhotographer.neighborhood }
            onFocus={() => this.setState({ inputSelected: 'neighborhood' })}
            onBlur={() => this.setState({ inputSelected: '' }) }
            style={{ width: '90%', height: 50, paddingLeft: 20, marginBottom: 15, borderWidth: 1, borderColor: this.state.inputSelected === 'neighborhood' ? '#4563CD' : '#C1C1C1', borderRadius: 30, fontSize: 16, zIndex: -1 }}
            />
          </View>

          <View style={{ width: '90%', flexDirection: 'row', marginLeft: '5%' }}>
            <View style={{ width: '58%', marginRight: '4%' }}>
              {
                  this.props.newPhotographer.city !== '' ?
                  <Text style={{ position: 'absolute', alignSelf: 'flex-start', marginLeft: 30, 
                  paddingLeft: 5, paddingRight: 5, backgroundColor: 'white', 
                  top: this.props.newPhotographer.city !== '' ? -8 : 15, 
                  fontSize: this.props.newPhotographer.city !== '' ? 12 : 16, 
                  color: this.state.inputSelected === 'city' ? '#4563CD' : '#A7A7A7', }}>
                      Cidade
                  </Text>
                  :
                  null
              }
              <TextInput
              placeholder='Digite sua Cidade'
              onChangeText={ (text) => this.props.handleChange('city', text) }
              value={ this.props.newPhotographer.city }
              onFocus={() => this.setState({ inputSelected: 'city' })}
              onBlur={() => this.setState({ inputSelected: '' }) }
              style={{ width: '100%', height: 50, paddingLeft: 20, marginBottom: 15, borderWidth: 1, borderColor: this.state.inputSelected === 'city' ? '#4563CD' : '#C1C1C1', borderRadius: 30, fontSize: 16, zIndex: -1 }}
              />
            </View>

            <View style={{ width: '38%', height: 50, marginBottom: 15, borderWidth: 1, borderColor: '#C1C1C1', borderRadius: 30, alignItems: 'center' }}>
                <Picker 
                selectedValue={this.props.newPhotographer.state}
                style={{ height: 50, width: '92%' }}
                onValueChange={(value) => this.props.handleChange('state', value)}>
                {
                  this.state.brazilianStates.map((element, index) => {
                    return <Picker.Item key={index} label={element} value={element} />
                  })
                }
                </Picker>

            </View> 
          </View>
          
        </View>
    );
  }
}

export default AdressStep;