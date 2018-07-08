import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs";
import { LoginObject } from "../../componentes/login/shared/login-object.model";
import { map, filter, catchError, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(private http: Http) {}
  private basePath = '/api/authenticate/';
  login(loginObj: LoginObject): Observable<Session> {
  return this.http.post(this.basePath + 'login', loginObj).pipe(
    map(this.extractData)
  );
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