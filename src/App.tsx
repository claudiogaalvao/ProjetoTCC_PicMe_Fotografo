import React, {Component} from 'react';
import AppContainer from './container/drawer-navigator';
import { YellowBox } from 'react-native';
import { Provider } from 'react-redux';
import Store from './store/store';

interface Props {}
export default class App extends Component<Props> {
  constructor(props) {
    super(props);

    YellowBox.ignoreWarnings([
      'Warning',
    ]);
  }

 public render() {
    return (
      <Provider store={Store}>
        <AppContainer />
      </Provider>
    );
  }
}