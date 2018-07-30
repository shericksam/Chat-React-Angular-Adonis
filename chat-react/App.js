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
import Ws from '@adonisjs/websocket-client'
import StaticComponent from './Views/StaticComponent';
import SelectUsersScreen from "./Views/SelectUsers"
import SignUpScreen from "./Views/SignUp"

class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
    console.ignoredYellowBox = ['Remote debugger'];
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    var user = await AsyncStorage.getItem('user');
    if(userToken){
      user = JSON.parse(user);
      const ws = Ws('ws://' + StaticComponent.url, {
        query:{ msg:'hi' , userid: user.id },
        transport: {
          headers: { 'Cookie': 'foo=bar' }
        }
      })
      ws.connect()
      StaticComponent.ws = ws;
    }
    this.props.navigation.navigate(userToken ? 'App' : 'Auth');
  };

  componentDidMount(){
    // console.log("monto adonis web");
   
  }
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
  SelectUsers: {
    screen: SelectUsersScreen, 
    navigationOptions: {
      title: '      Nuevo grupo',
    }
  },
  SignedOut: {
    screen: AuthLoadingScreen
  },
});

const AuthStack = createStackNavigator({ 
  Login: { 
    screen: LoginScreen, 
    navigationOptions: navigationOptions
  },
  SignUp: { 
    screen: SignUpScreen, 
    navigationOptions: navigationOptions
  },
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