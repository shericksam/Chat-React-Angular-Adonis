/* @flow */

import * as React from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, AsyncStorage,
  TouchableHighlight, DeviceEventEmitter } from 'react-native';

import { createStackNavigator, NavigationActions } from 'react-navigation';
import StaticComponent from './StaticComponent';

export default class Contacts extends React.Component {
  constructor(props){
    super(props);
    this.state ={ isLoading: true }
// newM // para mensajes nuevos
    StaticComponent.chatGlobal = StaticComponent.ws.subscribe('chat:global');
    StaticComponent.chatGlobal.emit("connected",{ user: StaticComponent.me.id });
  }

  _renderItem = ({ item }) => (
      <TouchableHighlight
       onPress={() => this.onPress(item)}>
        <View
          style={ item.newM ? styles.itemM: styles.item}>
          <View style={styles.avatar}>
            <Text style={styles.letter}>{item.nombre.slice(0, 1).toUpperCase()}</Text>
          </View>
          <View style={styles.details}>
            <Text style={styles.name}>{item.nombre}</Text>
            <Text style={styles.number}>{item.mensaje ? item.mensaje : ""}</Text>
          </View>
        </View>
        </TouchableHighlight>
  );

  onPress = (item) => {
    // console.log("click", item)
    item.groupSelected = false;
    this.props.route.navigation.navigate("Chat", { user: item })
    // this.props.navigation.push('Chat');
  }

  _ItemSeparator = () => <View style={styles.separator} />;

  
  async componentDidMount(){
    StaticComponent.chatGlobal.on('receive-message',(data) => {
      console.log("SUBSCRITO: ", data);
      this.newMessage(data);
    });

    DeviceEventEmitter.addListener("getUsers", (users) => {
      if (this.isUnmounted) {
        return;
      }
      this.setState({
        isLoading: false,
        contacts: users,
      });
      // console.log("vienen users", users);
    })
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  newMessage(data){
    if (this.isUnmounted) {
      return;
    }
    var userInArray = this.state.contacts.find(x => x.id === data.from);
    if(!userInArray) return;
    userInArray.newM = true;
    userInArray.mensaje = data.mensaje;
    console.log("userInArray", userInArray)
    // this.state.contacts.forEach((element,i) => {
    //   (function(any){
    //       if(element.id == data.from){
    var contacts = this.state.contacts;
    this.setState({contacts:[]}, function(){
      this.setState({
        contacts: contacts,
      });
    });
    setTimeout(function(){
      userInArray.newM = false;
      var contacts = this.state.contacts;
      this.setState({contacts:[]}, function(){
        this.setState({
          contacts: contacts,
        });
      });
    }.bind(this), 7000);
    //       }
    //   })(this)
    // });
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
      <FlatList
        data={this.state.contacts}
        keyExtractor={(item, i) => String(i)}
        renderItem={this._renderItem}
        ItemSeparatorComponent={this._ItemSeparator}
      />
    );
  }
}

const navigateAction = NavigationActions.navigate({
  routeName: 'Chat',
  action: NavigationActions.navigate({routeName: 'Chat'}),
  params: {},
})

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
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
    borderRadius: 18,
    backgroundColor: '#e91e63',
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
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(0, 0, 0, .08)',
  },
});