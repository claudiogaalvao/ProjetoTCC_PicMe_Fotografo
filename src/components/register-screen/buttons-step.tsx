import React, { Component } from "react";
import ScreenBase from "../common/screen-base";
import { Button, Icon } from "native-base";
import { View, Text, TextInput, Alert } from "react-native";

interface Props {
    previousGeneralStep: Function,
    nextGeneralStep: Function,
    generalStep: number,
    basicStep: number,
    disableNextButton: boolean
}

interface State {
}

class ButtonsStep extends ScreenBase<Props> {
  
  state: State = {
  };

  render() {

    return(
        <View style={{ width: '100%' }}>
            <View style={{ marginTop: -18, flexDirection: 'row' }}>
                <View style={{ width: '50%', paddingLeft: '7%' }}>
                {
                    this.props.basicStep === 0 ?
                    null
                    :
                    <Button
                    onPress={() => {
                        if(this.props.basicStep > 0) {
                            if(this.props.generalStep === 0) {
                                this.props.previousGeneralStep(false)
                            } else {
                                this.props.previousGeneralStep(true)
                            }
                        }
                    } }
                    style={{ width: 90, height: 35, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }}
                    >
                        <Icon type="FontAwesome5" name="chevron-left" style={{ fontSize: 18, marginLeft: 0 }} />
                        <Text style={{ color: 'white', marginLeft: -10 }}>                        
                            Anterior
                        </Text>
                    </Button>
                }
                </View>
                
                <View style={{ width: '50%', paddingRight: '7%', flex: 1, 
                    flexDirection: 'row', justifyContent: 'flex-end' }}>
                    <Button
                    disabled={this.props.disableNextButton}
                    onPress={() => {
                        if(this.props.generalStep === 0 && this.props.basicStep !== 2)
                            this.props.nextGeneralStep(false)
                        else
                            this.props.nextGeneralStep(true)
                    } }
                    style={{ width: 90, height: 35, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }}
                    >
                        <Text style={{ color: 'white', marginRight: -10 }}>                        
                            {
                                this.props.generalStep === 1 ?
                                'Finalizar' :
                                'Próximo'
                            }
                        </Text>
                        <Icon type="FontAwesome5" name="chevron-right" style={{ fontSize: 18, marginRight: 0 }} />
                    </Button>
                </View>
                
            </View>
        </View>
        
    );
  }
}

export default ButtonsStep;