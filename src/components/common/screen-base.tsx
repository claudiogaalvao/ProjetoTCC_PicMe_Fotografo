import React, { Component } from "react";
import { NavigationScreenOptions, StackActions, NavigationActions, DrawerActions } from "react-navigation";

export default abstract class ScreenBase<T> extends Component<T> {
  static navigationOptions: NavigationScreenOptions;

  navigate = (params: any) => {
    // @ts-ignore
    this.props.navigation.navigate(params);
  }

  pop = () => {
    // @ts-ignore
    this.props.navigation.pop();
  }

  drawer = () => {
    // @ts-ignore
    this.props.navigation.dispatch(DrawerActions.openDrawer())
  }
  navigateNoHistory = (routeName: string) => {
    const resetNavigation = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: routeName })]
    });
  
    // @ts-ignore
    this.props.navigation.dispatch(resetNavigation);
  }
}