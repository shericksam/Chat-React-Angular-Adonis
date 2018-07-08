import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../servicios/storage/storage.service';
import { AuthenticationService } from '../../servicios/authentication/authentication.service';
import { FormsModule } from '@angular/forms';
import Ws from '@adonisjs/websocket-client'


declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public user: Usuario;

  mensaje:string;
  title = 'app';
  nombre:string;
  ws = Ws('ws://localhost:3333')
  chat;
  contactSelected:string;

  constructor(
    private storageService: StorageService,
    private authenticationService: AuthenticationService
  ) {
    this.nombre = "Irving crespo"
    this.contactSelected = "http://emilcarlsson.se/assets/harveyspecter.png";
   }

  ngOnInit() {
    this.ws.connect()
    //this.ws.subscribe('chat:grupo1')
    this.ws.subscribe('chat:global')
    

    this.chat = this.ws.getSubscription("chat:global");
    console.log("SUBSCRIPTION: ",this.ws.getSubscription("chat"));

    this.chat.on('receive-message',(data) => {
      console.log(data);
      this.newMessage(data)
    });

    this.user = this.storageService.getCurrentUser();
  }


  newMessage(data){
    $('<li class="replies"><img src="http://emilcarlsson.se/assets/mikeross.png" alt="" /><p>' + data.mensaje + '</p></li>').appendTo($('.messages ul'));
    //$('.message-input input').val(null);
    $('.contact.active .preview').html('<span>You: </span>' + data.mensaje);
    $(".messages").animate({ scrollTop: $(document).height() }, "fast");
    console.log("Mensaje: ",data.mensaje);
    this.mensaje = ""
  }
  sendMessage(){
    if(this.mensaje && this.mensaje != ""){
      $('<li class="sent"><img src="http://emilcarlsson.se/assets/mikeross.png" alt="" /><p>' + this.mensaje + '</p></li>').appendTo($('.messages ul'));
      //$('.message-input input').val(null);
      $('.contact.active .preview').html('<span>You: </span>' + this.mensaje);
      $(".messages").animate({ scrollTop: $(document).height() }, "fast");
      console.log("WS: ",this.ws);
      
      console.log(this.ws.getSubscription('chat:global'));

      this.ws.getSubscription('chat:global').emit('newMessage',{
        mensaje:this.mensaje
      });

      //this.chat.emit('newMessage',{
      //  mensaje:this.mensaje
      //});
      //this.newMessage({mensaje:this.mensaje})
      this.mensaje = ""
      
    }
    
  }

  selectContact(event){
    
    console.log("Se eligio: ",event.target);

  }

  
  
  public logout(): void{
    this.authenticationService.logout().subscribe(
        response => {if(response) {this.storageService.logout();}}
    );
  }

}