import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


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
    return this.http.get(this.ep+"/conversacion/"+withUser);
  }


}
