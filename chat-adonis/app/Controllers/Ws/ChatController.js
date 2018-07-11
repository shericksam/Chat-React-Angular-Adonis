'use strict'
const Ws = use('Ws')
const User = use('App/Models/User')
const Conversacion = use('App/Models/Conversacion')
const ConversacionGrupo = use('App/Models/ConversacionGrupo')

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
    
    var user = await User.find(this.socket.userid);
    if(user){
      user.conectado = 1;
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
    
    this.saveMessage(data);
  }

  async onNewMessageToGroup(data){
    var user = await User.find(data.from);
    data.nombre = user.nombre+" "+user.apellido;
    console.log("MENSAJE TOPIC: ",this.socket.topic);
    console.log("Socket:",this.socket.channel);
    
    /*Ws
      .getChannel('chat:*')
      .topic('chat:grupo'+data.grupo)
      .broadcast("receive-message-group",data);*/

    this.socket.broadcast("receive-message-group",data);
    this.saveMessageToGroup(data);

  }

  async saveMessage(data){

    var conv = await Conversacion.query().where("user1",data.from).where("user2",data.to).first();
    if(!conv){
      conv = await Conversacion.query().where("user1",data.to).where("user2",data.from).first();
    }

    if(conv == null){
      conv = new Conversacion();
      conv.user1 = data.from;
      conv.user2 = data.to;
      conv.conversacion = JSON.stringify([{mensaje:data.mensaje,from:data.from,to:data.to}]);
      conv.save();
    }else{
  
      var json = JSON.parse(JSON.stringify(conv.conversacion));
      json.push({mensaje:data.mensaje,from:data.from,to:data.to});
      conv.conversacion =  JSON.stringify(json);
      conv.save();
      
    }
  }

  async saveMessageToGroup(data){
    try{
      var conv = await ConversacionGrupo.query().where("fk_grupo",data.grupo).first();
    }catch(error){
      throw error;
    }
    if(conv == null){
      conv = new ConversacionGrupo();
      conv.fk_grupo = data.grupo;
      conv.conversacion = JSON.stringify([{mensaje:data.mensaje,from:data.from,nombre:data.nombre}]);
      conv.save();
    }else{
     
      var json = JSON.parse(JSON.stringify(conv.conversacion));
      json.push({mensaje:data.mensaje,from:data.from,nombre:data.nombre});
      conv.conversacion =  JSON.stringify(json);
      conv.save();
    }

  }

}

module.exports = ChatController
