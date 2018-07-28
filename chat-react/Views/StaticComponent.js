import React, {
    Component,
  } from 'react';
import {
    View,
  } from 'react-native';


 class StaticComponent extends Component {
    static ws = null;
    static url = "192.168.1.113:3333";
    static isConnected = false;
    static chatGlobal = [];
    static me = [];
    static token = "";

    constructor(props) {
      super(props);
    }

    clear(){
      this.ws.close();
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