import * as React from 'react';
import { View, StyleSheet, Dimensions, AsyncStorage, StatusBar } from 'react-native';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';

import Contacts from './Contacts';
import Groups from './Groups';
import { createStackNavigator, NavigationActions } from 'react-navigation';
import StaticComponent from './StaticComponent';

const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};

export default class Panel extends React.Component {
  state = {
    index: 0,
    routes: [
      { key: 'contacts', title: 'Usuarios', navigation: this.props.navigation },
      { key: 'groups', title: 'Grupos', navigation: this.props.navigation },
    ],
  };
  
  async componentDidMount(){
    var me = await AsyncStorage.getItem('user');
    StaticComponent.me = me;
  }

  render() {
    // console.log("this.props.navigation", this.props.navigation);
    
    
    // const { navigate } = this.props.navigation;
    return (
      <View style={styles.container1}>
        <StatusBar barStyle="light-content" />
        <TabView
          navigationState={this.state}
          renderScene={ SceneMap({
            contacts: Contacts,
            groups: Groups,
          })}
          onIndexChange={index => this.setState({ index })}
          initialLayout={initialLayout}
        />
      </View>
    );
  }
}



const styles = StyleSheet.create({
  container1: {
    flex: 1,
    backgroundColor: '#ecf0f1',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
