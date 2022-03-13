import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class HttpinterceptorService implements HttpInterceptor {

  constructor(private _authService:AuthService) { }


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // if (this._authService.isUserLoggedIn() && req.url.indexOf('basicauth') === -1) {
    //     const authReq = req.clone({
    //         headers: new HttpHeaders({
    //             'Content-Type': 'application/json',
    //             'Authorization': `Basic ${window.btoa(this._authService.username + ":" + this._authService.password)}`
    //         })
    //     });
    //     return next.handle(authReq);
    // } else {
        return next.handle(req);
    // }
}
}
