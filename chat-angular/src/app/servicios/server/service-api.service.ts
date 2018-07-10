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

  getConversation(withUser:number){
    var user = JSON.parse(localStorage.getItem("currentUser")).user;
    console.log("ME: ",user);
    console.log("USER: ",withUser);
    
    return this.http.get<Mensaje[]>(this.ep+"/conversacion/"+withUser+"?me="+user.id);
  }

  



}
