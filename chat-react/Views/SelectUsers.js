/* @flow */

import * as React from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, AsyncStorage,
  TouchableHighlight, CheckBox } from 'react-native';

import { createStackNavigator, NavigationActions } from 'react-navigation';
import StaticComponent from './StaticComponent';

export default class Contacts extends React.Component {
  constructor(props){
    super(props);
    this.state ={ isLoading: true, checked: [] }
   
  }

  _renderItem = ({ item, index }) => (
      <TouchableHighlight>
        <View
          style={ item.newM ? styles.itemM: styles.item}>
          <View style={{flex: 1, padding: 10}}>
          <CheckBox
            center
            title={item.name}
            onPress={() => this.onClick(item)}
        />  
          </View>
          <View style={styles.details}>
            <Text style={styles.name}>{item.nombre}</Text>
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
    
    console.log("this.state.checked", this.state.checked);
    var userInArray = this.state.checked.find((x,i) => {
        if( x.id === item.id)
            index = i;
        return x.id === item.id
    });
    if(userInArray) {
        this.state.checked.splice(index, 1);
    }else{
        this.state.checked.push(item);
    }

    console.log("this.state.checked", this.state.checked);
  }

  _ItemSeparator = () => <View style={styles.separator} />;

  
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
  check:{
    alignSelf: 'flex-end',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(0, 0, 0, .08)',
  },
});