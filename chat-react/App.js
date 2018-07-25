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
import ChatScreen from "./Views/Chat"
import ContactScreen from './Views/Contacts';
import CustomHeader from './Views/CustomHeader';

//import AuthLoadingScreen from "./Views/loadingcheck"

class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
    console.ignoredYellowBox = ['Remote debugger'];
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

const navigationOptions = {
  headerStyle: { 
    display: 'none' 
  }
};
const navigationOptionsCH = {
  header: props => <CustomHeader {...props} />,
  headerStyle: { 
    backgroundColor: "transparent"
  },
  animationEnabled: true
};


const AppStack = createStackNavigator({
  Home: { 
    screen: PanelScreen, 
    navigationOptions: navigationOptions
  },
  Chat: { 
    screen: ChatScreen,
    navigationOptions: navigationOptionsCH
  },
  Panel: { 
    screen: PanelScreen, 
    navigationOptions: navigationOptions
  },
  Contacts: {
    screen: ContactScreen, 
    navigationOptions: navigationOptions
  }
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