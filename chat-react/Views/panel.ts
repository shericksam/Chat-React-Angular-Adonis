import React from 'react';
import { StyleSheet, Text, View,Image } from 'react-native';

export default class Panel extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Open up fucking App.js to start working on your app!</Text>
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
