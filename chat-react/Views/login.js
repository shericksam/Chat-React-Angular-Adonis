import React from 'react';
import { StyleSheet, Text, View,Image,
  Button,TextInput,KeyboardAvoidingView,
  ToastAndroid, ActivityIndicator,AsyncStorage } from 'react-native';
import Ws from '@adonisjs/websocket-client'
import StaticComponent from './StaticComponent';

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading:false,
      titleText: "Iniciar sesion",
      bodyText: 'This is not really a bird nest.',
      usuario:{},
      user:"",
      pass:"",
    };
  } 

  onEnter(){
    // console.log("Fierro");
    if(this.state.user != "" && this.state.pass != ""){
      this.setState({isLoading:true});
      this.login()
    }else{
      ToastAndroid.show('Llena los datos perro', ToastAndroid.SHORT);
    }
    
  }

  login(){
    const { navigate } = this.props.navigation;   

    return fetch('http://' + StaticComponent.url + '/api/v1/user/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: this.state.user,
        password: this.state.pass
      }),
    }).then((response) => response.json())
    .then((responseJson) => {
      this.setState({isLoading:false});
      // console.log("**************", responseJson)
      if(responseJson.user){
        this.setState({usuario:responseJson.user});
        console.log("**************")
        console.log(this.state.usuario.nombre)
        this._signInAsync(responseJson.token, responseJson.user);
      }else{
        if(responseJson[0].message)
          ToastAndroid.show('error '+ responseJson[0].message, ToastAndroid.SHORT);
      }
      //console.log(responseJson);
    }).catch((error) => {
      this.setState({isLoading:false});
      ToastAndroid.show('error '+error, ToastAndroid.SHORT);
      console.error(error);
    });
  }
  _signInAsync = async (token, user) => {
    await AsyncStorage.setItem('userToken',token);
    await AsyncStorage.setItem('user', JSON.stringify(user));
    // if(userToken){
    const ws = Ws('ws://' + StaticComponent.url, {
      query:{ msg:'hi' , userid: user.id },
      transport: {
        headers: { 'Cookie': 'foo=bar' }
      }
    })
    ws.connect()
    StaticComponent.ws = ws;
    // }
    this.props.navigation.navigate('App');
  };

  async componentDidMount(){
    
    // var token = await AsyncStorage.getItem('userToken');
    // console.log(token);
  }


  render() {
    if(this.state.isLoading){
      return(
        <View style={{flex: 1, padding: 20,backgroundColor:"transparent"}}>
          <ActivityIndicator/>
        </View>
      )
    }
    return (
      <View style={styles.container}>
       
        <KeyboardAvoidingView 
         style={styles.container}
         behavior="padding">
          <Image style={{width:50,height: 50}}
            source={require('../img/chatwhite.png')}
       // source={{uri:'https://facebook.github.io/react-native/docs/assets/favicon.png'}}
          />
          <Text style={styles.titleText} >
            {this.state.titleText}{'\n'}{'\n'}
          </Text>
          <TextInput
            style={{height: 40,width:150, borderColor: 'gray', 
            borderWidth: 1,color:"black",padding:10,margin:10, backgroundColor:"white"}}
            onChangeText={(text) => this.setState({user:text})}
            value={this.state.user}
            underlineColorAndroid='transparent'
            placeholder="usuario"
          />
        
          <TextInput
            style={{height: 40,width:150, borderColor: 'gray', 
            borderWidth: 1,color:"black",padding:10,margin:10, backgroundColor:"white"}}
            onChangeText={(text) => this.setState({pass:text})}
            value={this.state.pass}
            secureTextEntry={true}
            underlineColorAndroid='transparent'
            placeholder="password"
          />
          <View style={{flexDirection:'column',
              flex:.2,justifyContent:'space-between',}}>
            <Button
              style={{backgroundColor:'red',flex:2,}}
              onPress={this.onEnter.bind(this)}
              title="Entrar"
              color="#4CAF50"
              accessibilityLabel="Learn more about this purple button"
            />
            <Button
              buttonStyle={{ marginTop: 20 }}
              backgroundColor="transparent"
              textStyle={{ color: "#bcbec1" }}
              style={{flex:0.1}}
              title="Crear Cuenta"
              onPress={() => {
                this.props.navigation.navigate("SignUp");
              }}
            />
          </View>
        </KeyboardAvoidingView >
      </View>      
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#76b852',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color:"white"
  },
});
