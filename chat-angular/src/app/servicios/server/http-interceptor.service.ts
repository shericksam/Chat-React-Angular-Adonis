import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
//import { AuthService } from './auth/auth.service';
<<<<<<< HEAD
import { Observable } from 'rxjs';
=======
// import { Observable } from 'rxjs/Observable';
>>>>>>> 1fddcda284e609817248bf43234bd133a7fad819

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
