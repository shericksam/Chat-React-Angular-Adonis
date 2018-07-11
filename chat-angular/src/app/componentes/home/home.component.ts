import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../servicios/storage/storage.service';
import { AuthenticationService } from '../../servicios/authentication/authentication.service';
import { FormsModule } from '@angular/forms';
import Ws from '@adonisjs/websocket-client'
import { ServiceApiService } from '../../servicios/server/service-api.service';
import { map } from 'rxjs/operators';
import { forEach } from '@angular/router/src/utils/collection';
import {NotificationsService} from 'angular2-notifications'


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
  private conversacion:any[];
  private listeners:any[];
  
  
  mensaje:string;
  title = 'app';
  nombre:string;
  idfake:number;
  lastRequest:number;
  lastRequestG:number;
  usersNewGroup;
  nameGroup:string;
  ws;

  chat;
  contactSelected:string;
  isConnected = false;
  userSelected:Usuario;
  groupSelected:Grupo;


 

  constructor(
    private storageService: StorageService,
    private authenticationService: AuthenticationService,
    private services:ServiceApiService,
    private notifi:NotificationsService
  ) {
    this.nombre = "Irving crespo"
    this.contactSelected = "http://emilcarlsson.se/assets/harveyspecter.png";
   }

  ngOnInit() {
    this.usersNewGroup = []
    this.nameGroup = ""

    this.services.getGrupos().subscribe(
      res=>{
        this.groups = res;
        console.log("Grupos: ",res);
      },
      error=>{
        console.log("Grupos ERROR: ",error);
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
    if(this.userSelected){
      if(data.from == this.userSelected.id){
        $('<li class="replies"><img src="http://emilcarlsson.se/assets/mikeross.png" alt="" /><p>' + data.mensaje + '</p></li>').appendTo($('.messages ul'));
        //$('.message-input input').val(null);
        $('.contact.active .preview').html('<span>'+data.nombre+': </span>' + data.mensaje);
        this.scrollToBottom();
        console.log("Mensaje: ",data.mensaje);
        this.mensaje = ""
      }else{
        this.receivedMessage(data);
        this.notify(data);
      }
    }else{
      this.receivedMessage(data);
      this.notify(data);
    }
      
  }
  newMessageFromGroup(data){
    if(this.groupSelected){
      if(data.grupo == this.groupSelected.id){
        $('<li class="replies"><p><strong style="margin: 0" *ngIf="groupSelected">'+data.nombre+'</strong>'
        +'<br>' + data.mensaje + '</p></li>').appendTo($('.messages ul'));
        //$('.message-input input').val(null);
        $('.contact.active .preview').html('<span>You: </span>' + data.mensaje);
        this.scrollToBottom();
        console.log("Mensaje: ",data.mensaje);
        this.mensaje = ""
      }else{
        this.receivedMessageGroup(data);
        this.notify(data);
      }
    }else{
      this.receivedMessageGroup(data);
      this.notify(data);
    }

    
    
  }

  notify(data){
    var template = "<li style='list-style-type: none;' class='contact'>\
    <div  style='display:inline-block' class='wrap'>\
        <span class='contact-status'></span>\
        <img style='width:50px;height:50px;border-radius:50%' src='http://emilcarlsson.se/assets/louislitt.png'  />\
        <div style='display:inline-block' class='meta'>\
          <p style='display:inline' class='name'>"+data.nombre+": </p>\
          <p style='display:inline' class='preview'>"+data.mensaje+"</p>\
        </div>\
      </div>\
    </li>";
    const toast = this.notifi.success("Nuevo mensaje",template,{
      timeOut: 3000,
      showProgressBar: true,
      pauseOnHover: true,
      clickToClose: false,
      clickIconToClose: true
    });
    
    toast.click.subscribe((event) => {
      this.clickNotif(data);
    });
    
  }

  clickNotif(data){
    console.log("Holiiii");

  }


  sendMessage(){

    this.notify({nombre:this.user.nombre,mensaje:this.mensaje});

    if(this.mensaje && this.mensaje != ""){
      $('<li class="sent"><img src="http://emilcarlsson.se/assets/mikeross.png" alt="" /><p>' + this.mensaje + '</p></li>').appendTo($('.messages ul'));
      //$('.message-input input').val(null);
      $('.contact.active .preview').html('<span>Yo: </span>' + this.mensaje);
      this.scrollToBottom();
      
      if(this.groupSelected != null){
        if(this.isConnected){
          console.log("****** LANZADO A GRUPO "+this.groupSelected.id+" ************");
          this.ws.getSubscription('chat:grupo'+this.groupSelected.id).emit('newMessageToGroup',{
            mensaje:this.mensaje,
            from:this.user.id,
            grupo:this.groupSelected.id
          });
        }else{
  
        }
      }else{
        if(this.isConnected){
          if(this.userSelected){
            console.log("****** LANZADO A USUARIO "+this.userSelected.id+" ************");
            this.ws.getSubscription('chat:global').emit('newMessage',{
              mensaje:this.mensaje,
              from:this.user.id,
              to:this.userSelected.id
            });
          }
        }else{
  
        }
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
  receivedMessageGroup(data){
    for (let i = 0; i < this.groups.length; i++) {
      const element = this.groups[i];
      if(element.id == data.grupo){
        $("li#grupo_"+data.grupo).css({"background-color":"red"});
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
    this.listeners = [];

    this.ws.subscribe('chat:global')
    this.chat = this.ws.getSubscription("chat:global");

    this.chat.emit("connected",{userid:this.user.id});

    this.ws.getSubscription("chat:global").on('receive-message',(data) => {
      console.log(data);
      this.newMessage(data)
    });


    this.groups.forEach(element => {

      (function(any){
        console.log();
        any.ws.subscribe('chat:grupo'+element.id)
        console.log("SUBSCRITO: ",'chat:grupo'+element.id);
        any.ws.getSubscription("chat:grupo"+element.id).on('receive-message-group',(data) => {
          console.log("VAYA VAYA: ",data);
          any.newMessageFromGroup(data)
        })
      })(this)
      //f(this.ws,element);
      //this.setListener(element);
    });

    
    console.log("WS: ",this.ws);
      
  }

  setListener(id){
    this.listeners.push(this.ws.getSubscription('chat:grupo'+id));
    this.listeners[this.listeners.length - 1].on('receive-message-group',(data) => {
      console.log("LLEGO POR GRUPO "+data.grupo);
      console.log(data);
      this.newMessageFromGroup(data)
    });

    console.log("Listeners: ",this.listeners);

    /*this.ws.getSubscription('chat:grupo'+id).on('receive-message-group',(data) => {
      console.log("LLEGO POR GRUPO "+data.grupo);
      console.log(data);
      this.newMessageFromGroup(data)
    });*/
  }

  selectContact(user){
    $("li#user_"+user.id).css({"background-color":"#2c3e50"});
    $("li").removeClass("active");
    $("li#user_"+user.id).addClass("active");
    
    this.lastRequestG = 0

    if(this.lastRequest == user.id)
      return false;
    $("div.messages > ul > li").remove();
    
    console.log("selected");

    
    this.userSelected = user;
    this.groupSelected = null;
    this.conversacion = []
    this.services.getConversation(user.id).subscribe(
      res=>{
        console.log("RES: ",res);
        this.lastRequest = user.id;
        this.conversacion = res;
        console.log("CONVERSACION: ", this.conversacion);
        this.scrollToBottom();
      },
      error=>{
        console.log("ERROR:",error);
      }
    );
    
  }
  selectGroup(grupo){

    $("li#grupo_"+grupo.id).css({"background-color":"#2c3e50"});
    $("li").removeClass("active");
    $("li#grupo_"+grupo.id).addClass("active");
    

    this.lastRequest = 0
    if(this.lastRequestG == grupo.id)
      return false;
    $("div.messages > ul > li").remove();
    
    this.userSelected = null;
    this.groupSelected = grupo;
    this.conversacion = [];

    console.log("Grupo: ",grupo);
    this.services.getConversationGroup(grupo.id).subscribe(
      res=>{
        console.log("RES: ",res);
        this.lastRequestG = grupo.id;

        this.conversacion = res;
        this.scrollToBottom();
        console.log("CONVERSACION: ", this.conversacion);
      },
      error=>{
        console.log("ERROR:",error);
      }
    );



  }

  scrollToBottom(){
    var h = $(".messages").prop("scrollHeight");
    console.log("Height: ",h);
    console.log($(document).height());
    $(".messages").animate({ scrollTop: h}, "fast");
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
