import React from "react";
import { NavigationScreenOptions } from "react-navigation";
import ScreenBase from "../common/screen-base";
import { Button, Spinner } from "native-base";
import { View, Text, Alert } from 'react-native';

interface Props {
  updateUserId: Function
}
class Welcome extends ScreenBase<Props> {
  static navigationOptions: NavigationScreenOptions = {
      title: 'Welcome',
      header: null
  };

  state = {
    email: '',
    password: '',
    isLoading: false,
    inputSelected: '',
  }

  constructor(props: Props) {
    super(props);
  }

  onRegisterPressed = async () => {
    //@ts-ignore
    this.props.navigation.navigate('Register');
  }

  goToSignInScreen = () => {
    //@ts-ignore
    this.props.navigation.navigate("SignIn");
  }

  render() {
    return(
      <View style={{ backgroundColor: '#DADBDF', height: '100%', width: '100%' }}>
        <View style={{ width: '100%', height: '70%', backgroundColor: '#3B5FCD', borderRadius: 30, top: -50 }} />
        
        <Text style={{ position: 'absolute', top: '12%', left: '20%', right: '20%', color: 'white', fontSize: 30, textAlign: 'center' }}>
          PicMe
        </Text>
        
        <View style={{ position: 'absolute', width: undefined, height: 300, top: '30%', left: 20, right: 20, borderRadius: 20, backgroundColor: 'white' }}>
          
          <View style={{ alignItems: 'center', paddingTop: '10%' }}>
            <Text style={{ color: 'black', fontSize: 16, fontWeight: 'bold' }}>Bem-vindo ao PicMe</Text>
            <Text style={{ color: 'black', fontSize: 14, width: '60%', textAlign: 'center' }}>Estamos ansiosos para que se junte a nós :)</Text>
          </View>
          
          <Button
          onPress={() => this.goToSignInScreen() }
          style={{ position: 'absolute', width: undefined, left: 15, right: 15, bottom: 115, borderRadius: 5, backgroundColor: '#3B5FCD', alignItems: 'center', marginTop: 30, justifyContent: 'center' }}
          >
              <Text style={{ color: 'white', fontSize: 14, textAlign: 'center' }}>JÁ TENHO UMA CONTA</Text>
          </Button>

          <Button
          disabled={ this.state.isLoading }
          onPress={() => this.onRegisterPressed() }
          style={{ position: 'absolute', width: undefined, left: 15, right: 15, bottom: 60, borderRadius: 5, backgroundColor: 'transparent', borderWidth: 1, borderColor: '#3B5FCD', alignItems: 'center', marginTop: 30, justifyContent: 'center' }}
          >
              <Spinner color='white' style={{ display: (this.state.isLoading) ? 'flex' : 'none' }} />
              <Text style={{ color: '#3B5FCD', textAlign: 'center' }}>QUERO ME CADASTRAR</Text>
          </Button>

        </View>
      </View>
    );
  }
}

export default Welcome;