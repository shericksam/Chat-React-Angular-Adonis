import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ServiceApiService {

  ep = "http://localhost:3333"
  constructor(private http:HttpClient) { }

  usersService(){
    return this.http.get<Usuario[]>(this.ep+"/usuarios",{});
  }

  newGroup(users,name){
    let par = new HttpParams();
    
    par.append("users",users);
    par.append("nombre",name);
    
    console.log("PARAMS: ",par);
    return this.http.post(this.ep+"/grupos",{users:users,nombre:name});
  }

  getConversation(withUser:number){
    var user = JSON.parse(localStorage.getItem("currentUser")).user;
    console.log("ME: ",user);
    console.log("USER: ",withUser);
    
    return this.http.get<Mensaje[]>(this.ep+"/conversacion/"+withUser+"?me="+user.id);
  }

  getGrupos(){
    return this.http.get<Grupo[]>(this.ep+"/grupos");
  }

  getConversationGroup(grupo){
    return this.http.get<MensajeGrupo[]>(this.ep+"/grupos/conversacion/"+grupo);
  }

  



}