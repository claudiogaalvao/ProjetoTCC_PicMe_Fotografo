import { createStackNavigator, createAppContainer, NavigationScreenProp, NavigationRoute, NavigationActions, StackActions } from 'react-navigation';
import SplashScreen from '../components/splash-screen';
import WelcomeScreen from '../components/login-screen/index';
import SignInScreen from '../components/login-screen/sign-in';
import RegisterScreen from '../components/register-screen/index';
import HomeScreen from '../components/home-screen';
import SessionScreen from '../components/session-screen/index';
import NewDeviceScreen from '../components/devices-screen/new-device';
import UpdateDeviceScreen from '../components/devices-screen/update-device'
import CameraScreen from '../components/register-screen/camera-screen'

const MainNavigator = createStackNavigator({
  Splash: SplashScreen,
  Welcome: WelcomeScreen,
  SignIn: SignInScreen,
  Register: RegisterScreen,
  Home: HomeScreen,
  Session: SessionScreen,
  NewDevice: NewDeviceScreen,
  UpdateDevice: UpdateDeviceScreen,
  Camera: CameraScreen
}, {
  initialRouteName: 'Splash',
  defaultNavigationOptions: {
    headerStyle: {
      backgroundColor: '#009975',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'normal',
    }
  }
});

const Container = createAppContainer(MainNavigator);

export default Container;