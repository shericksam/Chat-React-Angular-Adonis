/* @flow */

import * as React from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, AsyncStorage,
  TouchableHighlight } from 'react-native';

import { createStackNavigator, NavigationActions } from 'react-navigation';
import StaticComponent from "./StaticComponent";

export default class Groups extends React.Component {
  constructor(props){
    super(props);
    this.state ={ isLoading: true }
  }

  _renderItem = ({ item }) => (
      <TouchableHighlight
       onPress={() => this.onPress(item)}>
        <View
          style={styles.item}>
          <View style={styles.avatar}>
            <Text style={styles.letter}>{item.nombre.slice(0, 1).toUpperCase()}</Text>
          </View>
          <View style={styles.details}>
            <Text style={styles.name}>{item.nombre}</Text>
            <Text style={styles.number}>{item.email}</Text>
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
    var url = "http://" + StaticComponent.url;
    var token = await AsyncStorage.getItem('userToken');
    // console.log(token)
    return fetch(url + '/grupos',{
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
        if(responseJson)
            responseJson.forEach(element => {
            (function(any){
                StaticComponent.ws.subscribe('chat:grupo'+element.id)
                console.log("SUBSCRITO: ",'chat:grupo'+element.id);
                // StaticComponent.ws.getSubscription("chat:grupo"+element.id).on('receive-message-group',(data) => {
                //     console.log("VAYA VAYA: ",data);
                //     StaticComponent.ws.newMessageFromGroup(data)
                // })
            })(this)
            });
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