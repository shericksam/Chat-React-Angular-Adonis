import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../servicios/storage/storage.service';
import { AuthenticationService } from '../../servicios/authentication/authentication.service';
import { FormsModule } from '@angular/forms';
import Ws from '@adonisjs/websocket-client'
import { ServiceApiService } from '../../servicios/server/service-api.service';


declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public user: Usuario;

  private users:Usuario[];

  
  mensaje:string;
  title = 'app';
  nombre:string;
  idfake:number;
  

  ws;

  chat;
  contactSelected:string;
  isConnected = false;
  userSelected:Usuario;

  constructor(
    private storageService: StorageService,
    private authenticationService: AuthenticationService,
    private services:ServiceApiService
  ) {
    this.nombre = "Irving crespo"
    this.contactSelected = "http://emilcarlsson.se/assets/harveyspecter.png";
   }

  ngOnInit() {
    this.services.usersService().subscribe(
      res=>{
        this.users = res;
        console.log(res);
      },
    error => {

    });


    this.ws = Ws('ws://localhost:3333',{
      query:{msg:'hi',userid:localStorage.getItem("userid")},
      transport: {
        headers: { 'Cookie': 'foo=bar' }
      }
    })
    
    this.ws.connect()
    this.ws.on('open', () => {
      this.isConnected = true
      this.setupListeners();
      
    })
    this.ws.on('close', () => {
      this.isConnected = false
    })
    this.user = this.storageService.getCurrentUser();
  }

  connect(){

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
      if(this.isConnected){
        this.ws.getSubscription('chat:global').emit('newMessage',{
          mensaje:this.mensaje,
          from:1,
          to:2
        });
      }else{

      }
      this.mensaje = ""
      
    }
    
  }

  setupListeners(){

    this.ws.subscribe('chat:global')
    this.chat = this.ws.getSubscription("chat:global");
    this.chat.emit("connected",{userid:1});
      
      this.chat.on('receive-message',(data) => {
        console.log(data);
        this.newMessage(data)
      });
      
  }

  selectContact(user){
    console.log("selected");
    this.userSelected = user;
    
  }
  saveGroup(){
    console.log("save grupo");
  }

  public logout(): void{
    this.authenticationService.logout().subscribe(
        response => {if(response) {this.storageService.logout();}}
    );
  }


}
