import React from 'react';
import { StyleSheet, Text, View,Image } from 'react-native';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
       <Image style={{width:50,height: 50}}
       source={require('./img/chatwhite.png')}
       // source={{uri:'https://facebook.github.io/react-native/docs/assets/favicon.png'}}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
