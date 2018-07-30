import React, {
    Component,
  } from 'react';
import {
    View,
  } from 'react-native';


 class StaticComponent extends Component {
    static ws = null;
    static url = "192.168.43.43:3333";
    static isConnected = false;
    static chatGlobal = [];
    static me = [];
    static token = "";

    constructor(props) {
      super(props);
    }

    static clear(){
      console.log("limpiar", this.ws);
      if(this.ws)
        this.ws.close();
      this.ws = null;
      this.isConnected = false;
      this.token = "";
      this.chatGlobal = [];
      this.me = [];
    }
    componentDidMount() {
        // this.ws.on('open', () => {
        //     this.isConnected = true            
        // })
        // this.ws.on('close', () => {
        //     this.isConnected = false
        // })
        // this.ws.on('error', () => {
        //     this.isConnected = false
        // });
    }
}
export default StaticComponent;