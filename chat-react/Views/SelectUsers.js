/* @flow */

import * as React from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, AsyncStorage,
  TouchableHighlight, Image, Alert, DeviceEventEmitter } from 'react-native';
// import { CheckBox } from 'react-native-elements'
import { createStackNavigator, NavigationActions } from 'react-navigation';
import StaticComponent from './StaticComponent';
import FAB from 'react-native-fab';
import Icon from 'react-native-vector-icons/Ionicons';
import Dialog from "react-native-dialog";

export default class Contacts extends React.Component {
  constructor(props){
    super(props);
    this.state ={ 
      isLoading: true, 
      checked: [],
      dialogVisible: false,
      description: "",
      nombreG: ""
    }
   
  }

  _renderItem = ({ item, index }) => (
      <TouchableHighlight
        onPress={() => this.onClick(item)}>
        <View
          style={ item.newM ? styles.itemM: styles.item}>
          <View>
            <Image
              style={styles.avatar}
              source={ item.checked ?  require('../assets/sign-check-icon.png') : require('../assets/uncheck.png') }/>
          </View>
          <View style={styles.details}>
            <Text style={styles.name}>{item.nombre + " " + item.apellido}</Text>
          </View>  
        </View>
        </TouchableHighlight>
  );

  handleChange = (index) => {
      console.log(index);
    let { checked } = this.state;
    checked[index] = !checked[index];
    this.setState({ checked });
  }

  onClick(item){
    var index;
    let { checked } = this.state;    
    let { contacts } = this.state;
    // console.log("this.state.checked", checked);
    var userInArray = index = this.state.checked.indexOf(item.id);
    var usuarioto = contacts.find(x => x.id === item.id);
        // console.log("userInArray", userInArray);
    if(userInArray != -1) {
      checked.splice(index, 1);        
      usuarioto.checked = false;
    }else{
      usuarioto.checked = true;
      checked.push(item.id);
    }

    this.setState({contacts:[]}, function(){
      this.setState({
        contacts: contacts,
      });
    });
    // console.log("this.state.checkeddddd", this.state.contacts);
  }

  _ItemSeparator = () => <View style={styles.separator} />;

  _showAlert = (mensaje) => {
    Alert.alert(
      'Verifica',
      mensaje,
      [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ],
      { cancelable: true }
    )
  }
  
  async componentDidMount(){    
    var url = "http://" + StaticComponent.url;
    var token = await AsyncStorage.getItem('userToken');
    // console.log(token)
    return fetch(url+'/usuarios',{
      method: 'GET', 
      headers: {
        Authorization: 'Bearer '+ token
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        // console.log(responseJson)
        this.setState({
          isLoading: false,
          contacts: responseJson,
        });
      })
      .catch((error) =>{
        console.error(error);
      });
  }

  showDialog = () => {
    if(this.state.checked.length > 0){
      this.setState({ dialogVisible: true });
    }else{
      this._showAlert('Aun no has seleccionado usuarios');
    }
  };

  handleCancel = () => {
    this.setState({ dialogVisible: false });
  };

  handleSave = () => {
    // The user has pressed the "Delete" button, so here you can do your own logic.
    // ...Your logic
    if(this.state.nombreG != ""){
      this.setState({ dialogVisible: false });
      this.saveGroup();
    }else{
      this._showAlert('Necesitas un nombre de grupo');
    }

  };

  saveGroup(){
    let url =  "http://" + StaticComponent.url;
    let token = StaticComponent.token;
    let { checked } = this.state;
    checked.push(StaticComponent.me.id);
    // console.log(JSON.stringify({
    //   users: this.state.checked,
    //   nombre: this.state.nombreG,
    //   owner: StaticComponent.me.id
    // }))

    return fetch(url + '/grupos',{
      method: 'POST', 
      headers: {
        Authorization: 'Bearer '+ token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },      
      body: JSON.stringify({
        users: this.state.checked,
        nombre: this.state.nombreG,
        owner: StaticComponent.me.id
      }),
      })
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        DeviceEventEmitter.emit('newGroup', response);
        Alert.alert(
          'Se ha creado el grupo',
          "Pueder revisar en tus grupos ",
          [
            {text: 'OK', onPress: () => this.props.navigation.goBack()},
          ],
          { cancelable: true }
        );
      })
      .catch((error) =>{
        console.error(error);
      });
  }
  
  render() {
    
    // console.log("this.props", this.props)
    if(this.state.isLoading){
      return(
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator/>
        </View>
      )
    }

    
    return (
      <View style={styles.container1}>
        <FlatList
          data={this.state.contacts}
          keyExtractor={(item, i) => String(i)}
          renderItem={this._renderItem}
          ItemSeparatorComponent={this._ItemSeparator}
        />
        <Dialog.Container visible={ this.state.dialogVisible }>
          <Dialog.Title>Nuevo Grupo</Dialog.Title>
          <Dialog.Input 
            label="Nombre del grupo" 
            value={this.state.nombreG} 
            onChangeText={(nombreG) => this.setState({nombreG})}
          />
          <Dialog.Button label="Cancelar" onPress={this.handleCancel} />
          <Dialog.Button label="Guardar" onPress={this.handleSave} />
        </Dialog.Container>
        <FAB 
          buttonColor="red" 
          iconTextColor="#FFFFFF" 
          onClickAction={() => { this.showDialog() }} 
          visible={true} 
          iconTextComponent={<Icon name="md-checkmark"/>} />
      </View>
    );
  }
}


const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  container1: {
    flex: 1,
    backgroundColor: '#ecf0f1',
  },
  itemM:{
    backgroundColor: 'gray',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  avatar: {
    height: 36,
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  letter: {
    color: 'white',
    fontWeight: 'bold',
  },
  details: {
    margin: 8,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 14,
    color: 'black',
  },
  number: {
    fontSize: 12,
    color: '#999',
  },
  check:{
    alignSelf: 'flex-end',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(0, 0, 0, .08)',
  },
});