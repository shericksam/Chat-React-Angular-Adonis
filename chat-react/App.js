import {
  createStackNavigator,createSwitchNavigator
} from 'react-navigation';
import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

import LoginScreen from "./Views/login"
import PanelScreen from "./Views/panel"
//import AuthLoadingScreen from "./Views/loadingcheck"

class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('userToken');

    this.props.navigation.navigate(userToken ? 'App' : 'Auth');
  };

  // Render any loading content that you like here
  render() {
    return (
      <View >
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const AppStack = createStackNavigator({
  Home: { screen: PanelScreen },
  Panel: { screen: PanelScreen }
});

const AuthStack = createStackNavigator({ 
  Login: LoginScreen 
});

export default createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
);

/*const App = createStackNavigator({
  Home: { screen: LoginScreen },
  Panel: { screen: PanelScreen },
});*/

//export default App;