import React, {Component} from 'react';
import { createDrawerNavigator, createAppContainer, DrawerItems } from 'react-navigation';
import NavigatorControl from '../core/Navigator'
import ProfileScreen from '../components/profile-screen/index'
import DevicesScreen from '../components/devices-screen/index';
import PendingSubmissionScreen from '../components/pending-submission-screen';
import HistoricSessionsScreen from '../components/sessions-historic-screen';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Container, Header, Body, Content, Icon } from 'native-base'
import { Toast } from "native-base";
import PhotographerService from "../services/photographer-service";
import firebase, { auth } from "react-native-firebase";
import navigatorLayout from './navigator-layout';

const MyDrawerNavigator = createDrawerNavigator({
    Home: NavigatorControl,
    Profile: ProfileScreen,
    PendingSubmission: PendingSubmissionScreen,
    HistoricSessions: HistoricSessionsScreen,
    Devices: DevicesScreen,
},
{
    initialRouteName: 'Home',
    contentComponent: navigatorLayout,
    drawerWidth: 300,
    drawerPosition: 'left',
});

const AppContainer = createAppContainer(MyDrawerNavigator);

export default class DrawerNavigator extends Component {
    render (){
        return <AppContainer />;
    }
}