'use strict'

const User = use('App/Models/User')
const Conversacion = use('App/Models/Conversacion')

class ChatController {

  constructor ({ socket, request }) {
    this.socket = socket
    this.socket.userid = request._qs.userid;
    this.request = request
    //console.log("XD");
  }



  onSent(){

  }

  onReceived(){

  }

  async onConnected(data){
    console.log("CONNECTION: ",this.socket.userid);
    var user = await User.find(this.socket.userid);
    if(user){
      user.conectado = true;
      user.sid = this.socket.id;
      user.save();
    }
  }

  async onClose(){
    var user = await User.find(this.socket.userid);
    if(user){
      user.conectado = false;
      user.save();
    }
  }

  async onNewMessage(data){

    var user = await User.find(data.to);
    if(user)
      this.socket.emitTo("receive-message",data,[user.sid]);
    
    //this.socket.broadcast("receive-message",data);
    this.saveMessage(data);
  }

  async onNewMessageToGroup(data){
    this.socket.broadcast("receive-message",data);
    this.saveMessage(data);
  }

  async saveMessage(data){
    var conv = await Conversacion.query().where("user1",data.from)
    .orWhere("user2",data.from).first();
    //console.log("User: ",conv);
    if(conv == null){
      conv = new Conversacion();
      conv.user1 = data.from;
      conv.user2 = data.to;
      conv.conversacion = JSON.stringify([{mensaje:data.mensaje,from:data.from,to:data.to}]);
      conv.save();
    }else{
      console.log("ANTES: ",conv.conversacion);
      var json = JSON.parse(JSON.stringify(conv.conversacion));
      json.push({mensaje:data.mensaje,from:data.from,to:data.to});
      conv.conversacion =  JSON.stringify(json);
      conv.save();
      console.log("DESPUES: ",conv.conversacion);
    }
  }

}

module.exports = ChatController
