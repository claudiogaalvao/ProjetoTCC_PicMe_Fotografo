import React, { Component } from 'react';
import StepIndicator from 'react-native-step-indicator';

interface Props {
  currentPosition: number;
}
export default class RegistrationStepIndicator extends React.Component<Props> {
  public static readonly Position = {
    BasicData: 0,
    Identification: 3,
    Finish: 4,
  };

  public static readonly Labels = ["Dados básicos", "Identificação", "Confirmação"];
  public static readonly Styles = {
    stepIndicatorSize: 25,
    currentStepIndicatorSize: 30,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: '#7eaec4',
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: '#7eaec4',
    stepStrokeUnFinishedColor: '#dedede',
    separatorFinishedColor: '#7eaec4',
    separatorUnFinishedColor: '#dedede',
    stepIndicatorFinishedColor: '#7eaec4',
    stepIndicatorUnFinishedColor: '#ffffff',
    stepIndicatorCurrentColor: '#ffffff',
    stepIndicatorLabelFontSize: 0,
    currentStepIndicatorLabelFontSize: 0,
    stepIndicatorLabelCurrentColor: 'transparent',
    stepIndicatorLabelFinishedColor: 'transparent',
    stepIndicatorLabelUnFinishedColor: 'transparent',
    labelColor: '#999999',
    labelSize: 13,
    labelFontFamily: 'OpenSans-Italic',
    currentStepLabelColor: '#7eaec4'
  }

  constructor(props: Props) {
    super(props);
  }

  render(){
    return(
      <StepIndicator 
          stepCount={RegistrationStepIndicator.Labels.length}
          customStyles={RegistrationStepIndicator.Styles}
          currentPosition={this.props.currentPosition}
          labels={RegistrationStepIndicator.Labels} />
    );
  }
}