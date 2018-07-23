import * as React from 'react';
import { View, StyleSheet, Dimensions, AsyncStorage } from 'react-native';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';

import Chat from './Chat';
import Contacts from './Contacts';
import { createStackNavigator } from 'react-navigation';

const FirstRoute = () => (
  <View style={[styles.container, { backgroundColor: '#ff4081' }]} />
);
const SecondRoute = () => (
  <View style={[styles.container, { backgroundColor: '#673ab7' }]} />
);

const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};

export default class Panel extends React.Component {
  state = {
    index: 0,
    routes: [
      { key: 'contacts', title: 'Usuarios' },
      { key: 'second', title: 'Grupos' },
    ],
  };
 
  render() {
    console.log("this.props.navigation", this.props.navigation);
    
    // const { navigate } = this.props.navigation;
    return (
      <TabView
        navigationState={this.state}
        renderScene={ SceneMap({
          contacts: Contacts(this.props),
          second: SecondRoute,
        })}
        onIndexChange={index => this.setState({ index })}
        initialLayout={initialLayout}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
