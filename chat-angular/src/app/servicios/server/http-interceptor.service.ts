import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
//import { AuthService } from './auth/auth.service';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {
  
  intercept(request: HttpRequest<any>, next: HttpHandler):Observable<HttpEvent<any>>{
    console.log("HOLA");
    request = request.clone({
      setHeaders: {
        Authorization: 'Bearer '+localStorage.getItem("token")
      }
    });
    return next.handle(request);
  }
  constructor() { }
}
