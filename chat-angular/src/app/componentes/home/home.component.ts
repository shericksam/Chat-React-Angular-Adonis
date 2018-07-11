import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../servicios/storage/storage.service';
import { AuthenticationService } from '../../servicios/authentication/authentication.service';
import { FormsModule } from '@angular/forms';
import Ws from '@adonisjs/websocket-client'
import { ServiceApiService } from '../../servicios/server/service-api.service';
import { map } from 'rxjs/operators';


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
  private groups:Grupo[];
  private conversacion:Mensaje[];
  
  mensaje:string;
  title = 'app';
  nombre:string;
  idfake:number;
  lastRequest:number;
  usersNewGroup;
  nameGroup:string;
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
    this.usersNewGroup = []
    this.nameGroup = ""

    this.services.getGrupos().subscribe(
      res=>{
        console.log("Grupos: ",res);
      },
      error=>{

      }
    );

    this.services.usersService().subscribe(
      res=>{
        this.users = res;
        this.user = JSON.parse(localStorage.getItem("currentUser")).user;
        console.log("ID: ",this.user.id);

        this.ws = Ws('ws://localhost:3333',{
          query:{msg:'hi',userid:this.user.id},
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
        console.log("RESPUESTA: ",res);
      },
    error => {

    });
    
    
    
    this.user = this.storageService.getCurrentUser();
  }
  

  connect(){

  }

  newMessage(data){
    this.receivedMessage(data);
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
          from:this.user.id,
          to:this.userSelected.id
        });
      }else{

      }
      this.mensaje = ""
      
    }
    
  }

  receivedMessage(data){
    for (let i = 0; i < this.users.length; i++) {
      const element = this.users[i];

      if(element.id == data.from){
        $("li#user_"+data.from).css({"background-color":"red"});

      }
      
    }
  }

  selectUserToGroup(user,event){
    if(event.target.checked){
      this.usersNewGroup.push(user.id);
      
    }else{
      let index = this.usersNewGroup.indexOf(user.id);
      this.usersNewGroup.pop(1);
    }
    console.log("Grupo: ",this.usersNewGroup);
    console.log("VALUE: ",event);
  }

  cleanCheckedUsers(checked){
    console.log("CLEAN: ");
    
    $("#checkeduser").removeAttr("checked");
    $("#checkeduser").attr("visibility","invisible");
    $("#checkeduser").attr("visibility","invisible");
    $("#checkeduser").css({'background-color': '#eee'});
    
  }

  setupListeners(){

    this.ws.subscribe('chat:global')
    this.chat = this.ws.getSubscription("chat:global");
    this.chat.emit("connected",{userid:this.user.id});
      
      this.chat.on('receive-message',(data) => {
        console.log(data);
        this.newMessage(data)
      });
      
  }

  selectContact(user){
    $("li#user_"+user.id).css({"background-color":"#2c3e50"});

    $("li").removeClass("active");

    $("li#user_"+user.id).addClass("active");

    if(this.lastRequest == user.id)
      return false;
    $("div.messages > ul > li").remove();
    
    console.log("selected");

    
    this.userSelected = user;
    this.conversacion = []
    this.services.getConversation(user.id).subscribe(
      res=>{
        console.log("RES: ",res);
        this.lastRequest = user.id;
        this.conversacion = res;
        console.log("CONVERSACION: ", this.conversacion);
      },
      error=>{
        console.log("ERROR:",error);
      }
    );
    
  }
  saveGroup(){
    console.log("save grupo");
    console.log("NAME G: ",this.nameGroup);
    if(this.usersNewGroup.length > 1){
      if(this.nameGroup != ""){
        this.usersNewGroup.push(this.user.id);
        this.services.newGroup(this.usersNewGroup,this.nameGroup).subscribe(
          res=>{
            console.log("Creado!!!!! JEJE: ",res);
          },
          error=>{
            console.log("ERROOOOR!!!!! JEJE: ",error);
          }
        );
        this.usersNewGroup = []
        this.cleanCheckedUsers(false);
      }else{
        alert("Debes elegir un nombre");
      }
    }else{
      alert("Tienes que invitar al menos a 2 amigos");
    }
    //this.services.
  }

  public logout(): void{
    this.authenticationService.logout().subscribe(
        response => {if(response) {this.storageService.logout();}}
    );
  }


}
