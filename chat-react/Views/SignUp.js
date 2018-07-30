 /* @flow */

import * as React from 'react';
import { View, Text, FlatList, StyleSheet, KeyboardAvoidingView, AsyncStorage,
  ToastAndroid, Alert } from 'react-native';
import { Card, Button, FormLabel, FormInput } from "react-native-elements";
import StaticComponent from "./StaticComponent";
import Ws from '@adonisjs/websocket-client'

export default class SignUp extends React.Component {
  constructor(props){
    super(props);
    this.state ={ 
      isLoading: true,
      dataObject: {},
      nombre: "",
      apellido: "",
      correo: "",
      usuario: "",
      password: "",
    }
  }

  onSignIn(){    
    // console.log("state -> ", this.state.dataObject);
    // console.log("errar -> ", JSON.stringify(this.state.dataObject));
    return fetch('http://' + StaticComponent.url + '/api/v1/user', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.state.dataObject),
    }).then((response) => response.json())
    .then((responseJson) => {
      if (this.isUnmounted) {
        return;
      }
      this.correctLogin(responseJson)
    }).catch((error) => {
      // this.setState({isLoading:false});
      console.error("error", error);
      // console.log(error.error[0]);
      // if(error.error[0].field == "email")
      //   this.error = { code: 1, message: "No existe usuario con ese mail"};
      // if(error.error[0].field == "password")
      //   this.error = { code: 2, message: "Contraseña invalida"};
    });
  }
  
  componentWillUnmount() {
    this.isUnmounted = true;
  }

  _signInAsync = async (token, user) => {
    await AsyncStorage.setItem('userToken', token);
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

    this.props.navigation.navigate('App');
  };

  correctLogin(data){
    // console.log(data);
    if(data.user){
      this._signInAsync(data.token, data.user);
    }else{
      if(data.message){
        Alert.alert(
          'Aviso',
          'error '+ data.message,
          [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ],
          { cancelable: true }
        )
      }
    }
  }

  validate(){
    var errores = "";
    var isOk = true;
    let { dataObject } = this.state;

    if(this.state.nombre == ""){
      errores += "\n Falta nombre";
      isOk = false;
    }else{
      dataObject.nombre = this.state.nombre;
    }

    if(this.state.apellido == ""){
      errores += "\n Falta apellido";
      isOk = false;
    }else{
      dataObject.apellido = this.state.apellido;
    }

    if(this.state.correo == ""){
      errores += "\n Falta correo";
      isOk = false;
    }else{
      dataObject.email = this.state.correo;
    }

    if(this.state.usuario == ""){
      errores += "\n Falta usuario";
      isOk = false;
    }else{
      dataObject.username = this.state.usuario;
    }

    if(this.state.password == ""){
      errores += "\n Falta password";
      isOk = false;
    }else{
      dataObject.password = this.state.password;
    }
    var estaBien = isOk;
    if(estaBien){
      dataObject.foto = "";
      this.setState({ dataObject: dataObject });
      this.onSignIn();
    }else{
      Alert.alert(
        'Aviso',
        errores,
        [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ],
        { cancelable: true }
      )
    }
  }

  render() {
    // console.log("this.props", this.props)  
        
    return (
        <View style={styles.container}>
          <KeyboardAvoidingView 
            style={styles.container}
            behavior="padding">
            <Card>
              <FormLabel>Nombre</FormLabel>
              <FormInput
                onChangeText={(text) => this.setState({nombre: text})}  
                placeholder="Nombre" />
              <FormLabel>Apellido</FormLabel>
              <FormInput
                onChangeText={(text) => this.setState({apellido: text})}  
                 placeholder="Apellidos" />
              <FormLabel>Correo</FormLabel>
              <FormInput
                onChangeText={(text) => this.setState({correo: text})}  
                placeholder="Email ..." />
              <FormLabel>Usuario</FormLabel>
              <FormInput
                onChangeText={(text) => this.setState({usuario: text})}  
                placeholder="Usuario..." />
              <FormLabel>Contraseña</FormLabel>
              <FormInput
                onChangeText={(text) => this.setState({password: text})}  
                secureTextEntry 
                placeholder="Password..." />
        
              <Button
                buttonStyle={{ marginTop: 20 }}
                backgroundColor="#03A9F4"
                title="Registrar"
                onPress={() => {
                  this.validate();
                }}
              />
              <Button
                buttonStyle={{ marginTop: 20 }}
                backgroundColor="transparent"
                textStyle={{ color: "#bcbec1" }}
                title="Iniciar sesion"
                onPress={() => this.props.navigation.navigate("Login")}
              />
            </Card>
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
