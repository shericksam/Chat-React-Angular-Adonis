/* @flow */

import * as React from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, AsyncStorage,
  TouchableHighlight } from 'react-native';

import { createStackNavigator, NavigationActions } from 'react-navigation';


export default class Contacts extends React.Component {
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
    
    // console.log("click", item)
    this.props.route.navigation.navigate("Chat", { user: item })
    // this.props.navigation.push('Chat');
  }

  _ItemSeparator = () => <View style={styles.separator} />;

  
  async componentDidMount(){
    var url = "http://192.168.1.113:3333";
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
        }, function(){

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