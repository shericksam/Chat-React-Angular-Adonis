import * as React from 'react';
import { View, StyleSheet, Dimensions, AsyncStorage, StatusBar, DeviceEventEmitter } from 'react-native';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';

import Contacts from './Contacts';
import Groups from './Groups';
import { createStackNavigator, NavigationActions } from 'react-navigation';
import StaticComponent from './StaticComponent';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import Dialog from "react-native-dialog";

const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};

export default class Panel extends React.Component {
  constructor(props){
    super(props);
    this.state = { 
      dialogVisible: false,
    }
  }
  state = {
    users: [],
    groups: []
  }
  stateN = {
    index: 0,
    routes: [
      { key: 'contacts', title: 'Usuarios', navigation: this.props.navigation, users: this.state.users },
      { key: 'groups', title: 'Grupos', navigation: this.props.navigation, groups: this.state.groups },
    ],
  };
  
  async componentDidMount(){
    var me = await AsyncStorage.getItem('user');
    var token = await AsyncStorage.getItem('userToken');
    StaticComponent.me = JSON.parse(me);
    StaticComponent.token = token;
    console.log("StaticComponent.token",StaticComponent.token)
    this.getContactsAll();
    this.getGroupsAll();
  }

  nuevoGrupo(){
    // console.log("props")
    this.props.navigation.navigate("SelectUsers")
  }

  handleCancel = () => {
    this.setState({ dialogVisible: false });
  }

  handleYes = () => {
    // The user has pressed the "Delete" button, so here you can do your own logic.
    // ...Your logic
    
    // console.log("handleYes")
    AsyncStorage.clear(()=>{
      StaticComponent.clear();
      this.setState({ dialogVisible: false });
      // this.props.navigation.navigate("Login");
    });
  }
  
  getGroupsAll(){
    var url = "http://" + StaticComponent.url;
    var token = StaticComponent.token;
    console.log(token);
    return fetch(url + '/grupos',{
      method: 'GET', 
      headers: {
        Authorization: 'Bearer '+ token
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("grup", responseJson)
        this.setState({
          groups: responseJson,
        });
        DeviceEventEmitter.emit('getGroups', this.state.groups);
        
      })
      .catch((error) =>{
        console.error(error);
      });
  
  }

  
  getContactsAll(){
    var url = "http://" + StaticComponent.url;
    var token = StaticComponent.token;
    // console.log("tokentokentokentokentoken", token)
    return fetch(url+'/usuarios',{
      method: 'GET', 
      headers: {
        Authorization: 'Bearer '+ token
      },
    })
    .then((response) => response.json())
    .then((responseJson) => {
      // console.log("users", responseJson)
      this.setState({
        users: responseJson,
      }, function(){
        // console.log("this.state.users", this.state.users)
      });
      // this.stateN.routes.users = responseJson;
      DeviceEventEmitter.emit('getUsers', this.state.users);
      var stateN = this.stateN;
      this.setState({stateN:[]}, function(){
        this.setState({
          stateN: stateN,
        });
      });
    })
    .catch((error) =>{
      console.error(error);
    });
  }

  render() {
    return (
      <View style={styles.container1}>
        <StatusBar barStyle="light-content" />
        <TabView
          navigationState = { this.stateN }
          renderScene={ SceneMap({
            contacts: Contacts,
            groups: Groups,
          })}
          onIndexChange={index => this.setState({ index })}
          initialLayout={initialLayout}
        />
        <ActionButton buttonColor="rgba(231,76,60,1)">
          {/* <ActionButton.Item buttonColor='#9b59b6' title="New Task" onPress={() => console.log("notes tapped!")}>
            <Icon name="md-create" style={styles.actionButtonIcon} />
          </ActionButton.Item> */}
          <ActionButton.Item buttonColor='#3498db' title="Nuevo Grupo" onPress={() => {this.nuevoGrupo()}}>
            <Icon name="md-people" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#1abc9c' title="Cerrar sesion" onPress={() => { this.setState({ dialogVisible: true }) }}>
            <Icon name="md-close" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>
        <Dialog.Container visible={ this.state.dialogVisible }>
          <Dialog.Title>Sesion</Dialog.Title>
          <Dialog.Description>
            ¿Deseas cerrar la sesion?.
          </Dialog.Description>
          <Dialog.Button label="Cancelar" onPress={this.handleCancel} />
          <Dialog.Button label="Simon" onPress={this.handleYes} />
        </Dialog.Container>
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
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
});
