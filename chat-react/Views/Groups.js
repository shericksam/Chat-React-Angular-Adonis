/* @flow */

import * as React from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, AsyncStorage,
  TouchableHighlight, DeviceEventEmitter, Alert, YellowBox } from 'react-native';

import { createStackNavigator, NavigationActions } from 'react-navigation';
import StaticComponent from "./StaticComponent";

export default class Groups extends React.Component {
  constructor(props){
    super(props);
    this.state ={ isLoading: true }
    YellowBox.ignoreWarnings(
      ['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader'
    ]);
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  _renderItem = ({ item }) => (
      <TouchableHighlight
       onPress={() => this.onPress(item)}>
        <View
          style={item.newM ? styles.itemM : styles.item }>
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
    item.groupSelected = true;
    // console.log("item", item)
    this.props.route.navigation.navigate("Chat", { user: item })
    // this.props.navigation.push('Chat');
  }

  _ItemSeparator = () => <View style={styles.separator} />;

  
  async componentDidMount(){
    if (this.isUnmounted) {
      return;
    }

    DeviceEventEmitter.addListener("getGroups", (groups) => {
      if (this.isUnmounted) {
        return;
      }
      this.setState({
        isLoading: false,
        contacts: groups,
      });      
      console.log(groups);
      groups.forEach(element => {
        try{
          StaticComponent.ws.subscribe('chat:grupo' + element.id);          
        }catch(err){
          return;
        }
        StaticComponent.ws.getSubscription("chat:grupo" + element.id).on('receive-message-group',(data) => {
          this.newMessageFromGroup(data);
        });
      });
      // console.log("vienen groups", groups);
    })

    DeviceEventEmitter.addListener("addGroup", (group) => {
      if (this.isUnmounted) {
        return;
      }
      // console.log("vienen groups", group);
      this.state.contacts.forEach(element => {
        if(element.id == group.id){
          console.log("YA EXISTEEE");
          return true;
        } 
      });
      let { contacts } = this.state;
      // console.log("contacts", contacts);
      // contacts.push(group)

      this.setState({contacts:[]}, function(){
        this.setState({
          contacts: contacts,
        });
      });

      StaticComponent.ws.subscribe('chat:grupo' + group.id);
      StaticComponent.ws.getSubscription("chat:grupo" + group.id).on('receive-message-group',(data) => {
        this.newMessageFromGroup(data);
      });
      
    })
    StaticComponent.ws.getSubscription("chat:global").on('new-group',(data) => {
      if (this.isUnmounted) {
        return;
      }

      let { contacts } = this.state;
      // console.log("contacts", contacts);
      contacts.push(data)

      this.setState({contacts:[]}, function(){
        this.setState({
          contacts: contacts,
        });
      });
      StaticComponent.ws.subscribe('chat:grupo' + data.id);
      StaticComponent.ws.getSubscription("chat:grupo" + data.id).on('receive-message-group',(data) => {
        this.newMessageFromGroup(data);
      });
      
      Alert.alert(
        'Aviso',
        "Te han agregado a el grupo "+ data.nombre,
        [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ],
        { cancelable: true }
      )
    });
  }

  newMessageFromGroup = async (data) => {
    if (this.isUnmounted) {
      return;
    }

    var userInArray = this.state.contacts.find(x => x.id === data.grupo);
    if(!userInArray) return;
    userInArray.newM = true;
    userInArray.mensaje = data.mensaje;
    var contacts = this.state.contacts;
    this.setState({contacts:[]}, function(){
      this.setState({
        contacts: contacts,
      });
    });
    
    setTimeout(function(){
      if (this.isUnmounted) {
        return;
      }
      userInArray.newM = false;
      var contacts = this.state.contacts;
      this.setState({contacts:[]}, function(){
        this.setState({
          contacts: contacts,
        });
      });
    }.bind(this), 7000);
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
    height: 70
  },
  itemM:{
    backgroundColor: 'gray',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,    
    height: 70
  },
  avatar: {
    height: 46,
    width: 46,
    borderRadius: 22,
    backgroundColor: '#e91e63',
    alignItems: 'center',
    justifyContent: 'center',
  },
  letter: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
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