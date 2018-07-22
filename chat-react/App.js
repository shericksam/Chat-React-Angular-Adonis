import React from 'react';
import { StyleSheet, Text, View,Image,Button,TextInput,KeyboardAvoidingView,ToastAndroid } from 'react-native';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      titleText: "Iniciar sesion",
      bodyText: 'This is not really a bird nest.',
      user:"",
      pass:""
    };
  }

  onEnter(){
    console.log("Fierro");
    ToastAndroid.show('A pikachu appeared nearby !', ToastAndroid.SHORT);
  }

  render() {
    return (
     
      <View style={styles.container}>
       
        <KeyboardAvoidingView 
         style={styles.container}
         behavior="padding"
        >
         <Image style={{width:50,height: 50}}
       source={require('./img/chatwhite.png')}
       // source={{uri:'https://facebook.github.io/react-native/docs/assets/favicon.png'}}
        />
        <Text style={styles.titleText} >
          {this.state.titleText}{'\n'}{'\n'}
        </Text>
        <TextInput
        style={{height: 40,width:150, borderColor: 'gray', 
        borderWidth: 1,color:"white",padding:10,margin:10}}
        onChangeText={(text) => this.setState({user:text})}
        value={this.state.user}
        underlineColorAndroid='transparent'
        placeholder="usuario"
        />
        
        <TextInput
        style={{height: 40,width:150, borderColor: 'gray', 
        borderWidth: 1,color:"white",padding:10,margin:10}}
        onChangeText={(text) => this.setState({pass:text})}
        value={this.state.pass}
        underlineColorAndroid='transparent'
        placeholder="password"
        />
        <Button
          onPress={this.onEnter}
          title="Entrar"
          color="#0066ff"
          accessibilityLabel="Learn more about this purple button"
        />
        </KeyboardAvoidingView >
        
      

     
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
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color:"white"
  },
});
