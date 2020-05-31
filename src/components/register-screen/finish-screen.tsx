import React, { Component } from "react";
import { NavigationScreenOptions } from "react-navigation";
import { View, Image, Text, Alert, Animated, Easing, TouchableOpacity } from "react-native";
import { Button } from 'native-base';

interface Props {
  onFinishBackPressed: Function
}

interface State {
  
}

class FinishScreen extends Component<Props> {
  
  state: State = {
    
  };
 
  render() {

    return(
        <View 
        style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center',
        padding: 20 }}>
          <Text
          style={{ color: 'black', fontSize: 20 }}>
            Cadastro enviado para análise
          </Text>

          <Text
          style={{ textAlign: 'center' }}>
            Nossa equipe irá analisar todos os dados enviados em um prazo de 5 dias úteis.
          </Text>
          
          <Text
          style={{ textAlign: 'center' }}>
            Você receberá um e-mail quando o processo for concluído.
          </Text>

          <Image 
          source={require('../../../assets/images/correct.png')}
          style={{ width: '60%', height: '60%' }}
          />

          <Button 
          onPress={ () => this.props.onFinishBackPressed() } 
          style={{ width: '100%', alignItems: 'center', justifyContent: 'center', 
          backgroundColor: '#3B5FCD', borderRadius: 20 }}>
            <Text style={{ color: 'white', fontSize: 16}}>VOLTAR</Text>
          </Button> 

        </View>
    );
  }
}

export default FinishScreen;