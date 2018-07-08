'use strict'

class ChatController {
  constructor ({ socket, request }) {
    this.socket = socket
    this.request = request
  }



  onSent(){

  }

  onReceived(){

  }

  onClose(){

  }

  onNewMessage(data){
    this.socket.broadcast("receive-message",data);
  }

}

module.exports = ChatController
