import * as React from 'react';
import { View, StyleSheet, Dimensions, AsyncStorage, StatusBar } from 'react-native';
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
    this.state ={ 
      dialogVisible: false
    }
  }
  stateN = {
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

  nuevoGrupo(){
    console.log("props")
    this.props.navigation.navigate("SelectUsers")
  }

  cerrarSesion(){
    console.log("sesiooon")
    this.setState({ dialogVisible: true });
  }

  handleCancel = () => {
    this.setState({ dialogVisible: false });
  };

  handleYes = () => {
    // The user has pressed the "Delete" button, so here you can do your own logic.
    // ...Your logic
    this.setState({ dialogVisible: false });
  };

  render() {
    // console.log("this.props.navigation", this.props.navigation);
    
    
    // const { navigate } = this.props.navigation;
    return (
      <View style={styles.container1}>
        <StatusBar barStyle="light-content" />
        <TabView
          navigationState={this.stateN}
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
          <ActionButton.Item buttonColor='#1abc9c' title="Cerrar sesion" onPress={() => { this.cerrarSesion()}}>
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
