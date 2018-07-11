import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import { LoginObject } from "../../componentes/login/shared/login-object.model";
import { map, filter, catchError, mergeMap } from 'rxjs/operators';
import { RegisterObject } from "../../componentes/login/shared/register-object.model";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) {}

  // private basePath = '/api/authenticate/';
  private basePath = 'http://192.168.1.80:3333/api/v1/';

  login(loginObj: LoginObject): Observable<Session> {
    // console.log("JEJE");
    // console.log("login: ",loginObj);
    return this.http.post<any>(this.basePath + 'user/login', loginObj);
  }
  
  register(registerObj: RegisterObject): Observable<Session> {
    return this.http.post<Session>(this.basePath + 'user', registerObj);
  }

  logout(): Observable<Boolean> {
    return this.http.post(this.basePath + 'logout', {}).pipe(
      map(this.extractData)
    );
  }

  private extractData(res: Response) {
    let body = res.json();
    return body;
  }
}