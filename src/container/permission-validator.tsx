import React from 'react';
import Modal from 'react-native-modal';
import { Container, H1, Text, Button, View, H3 } from 'native-base';
import { StyleSheet } from 'react-native';

interface Props {
  hasPermission: boolean;
  onActionPressed: Function;
}

export default class PermissionValidator extends React.Component<Props> {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  render() {
    return (
      <Modal isVisible={!this.props.hasPermission}>
        <View style={this.styles.alertBox}>
          <H3 style={{ textAlign: 'center' }}>Permissão necessária</H3>
          <Text>Precisamos da sua permissão para acessar a sua localização.</Text>
          <Button style={{ borderRadius: 24, marginVertical: 16 }} full success onPress={ () =>this.props.onActionPressed() }>
            <Text>Aceito</Text>
          </Button>
        </View>
      </Modal>
    );
  }

  styles = StyleSheet.create({
    alertBox: {
      marginHorizontal: 24,
      backgroundColor: '#ffffff',
      borderRadius: 16,
      padding: 24,
      alignItems: 'center',
      justifyContent: 'center'
    }
  });
}