import React from 'react';
import { DrawerItemsProps, DrawerItems } from 'react-navigation';
import { connect } from 'react-redux';
import { IHomeState } from '../store/reducers/home';
import { remoteSignOut } from '../store/thunk/home';
import { Alert, View, Image, Text, TouchableOpacity } from 'react-native';
import { Container, Body, Content, Icon, Header } from 'native-base';

interface Props extends DrawerItemsProps {
  home: IHomeState,
  signOut: () => void
}

class NavigatorLayout extends React.Component<Props> {
  private pictureSize = 120;
  
  render() {
    const { photographer } = this.props.home;

    if (!photographer) {
      return (
        <Container />
      );
    }

    const money = (photographer.currentMoney) ? photographer.currentMoney.toFixed(2) : '0,00';

    return(
      <Container>
        <Header style={{ height: 250 }}>
            <Body style={{ alignItems: 'center' }}>
                {this.photographerPicture()}
                <Text style={{ color: 'white', fontSize: 18, marginTop: 10 }}>
                  {photographer.firstName} {photographer.lastName}
                </Text>
                <Text style={{ color: 'white', marginTop: 5 }}>Ganhos: R$ {money}</Text>
            </Body>
        </Header>
        <Content>
            <DrawerItems {...this.props}></DrawerItems>
            <TouchableOpacity style={{ borderTopWidth: 1, borderColor: '#CED4DA', paddingLeft: 16, paddingTop: 12, flexDirection: 'row', alignItems: 'center'}} onPress={this.onSignOutPressed}>
                <Text style={{ color: '#CC0000', fontSize: 16 }}>Sair</Text>
            </TouchableOpacity>
        </Content>
    </Container>
    );
  }

  private photographerPicture = () => {
    const { photographer } = this.props.home;

    return (
      <View style={{ width: this.pictureSize, height: this.pictureSize, 
      borderRadius: this.pictureSize/2, backgroundColor: '#fff',
      alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: 'red', fontSize: 60 }}>
          {photographer.firstName.charAt(0)}{photographer.lastName.charAt(0)}
        </Text>
      </View>
    );
  }

  private onSignOutPressed = () => {
    Alert.alert('Sair', 'Tem certeza que deseja sair?',
      [
        {text: 'Cancelar', onPress: () => {} },
        {text: 'Sair', onPress: this.onSignOutConfirm},
      ], { cancelable: false });
  };

  private onSignOutConfirm = () => {
    this.props.signOut();
  };
}

const mapStateToProps = (state) => ({
  home: state.home
});
const mapDispatchToProps = (dispatch) => ({
  signOut: () => dispatch(remoteSignOut())
});

export default connect(mapStateToProps, mapDispatchToProps)(NavigatorLayout);