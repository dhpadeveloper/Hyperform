import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable, switchMap } from 'rxjs';
import { User } from './pojo/user';
import { AuthService } from './service/auth.service';
import { StorageService } from './service/storage.service';
@Injectable({
    providedIn: 'root'
})

export class HttpConfigInterceptor implements HttpInterceptor {
    private USER_NAME_SESSION_ATTRIBUTE_NAME = 'authenticatedUser'
    constructor(private _storageService: StorageService,
        private _authService: AuthService) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log("Auth Interceptor");
        console.log(req);

        // if(sessionStorage.getItem(this.USER_NAME_SESSION_ATTRIBUTE_NAME)){
        //      let currentUser:User = JSON.parse(sessionStorage.getItem(this.USER_NAME_SESSION_ATTRIBUTE_NAME));
        //      console.log("CurrentUser"+currentUser.name);
        //       let request = req.clone({
        //         setHeaders: { 
        //             Authorization: currentUser.authdata
        //         }
        //     });
        //     return next.handle(request);
        //  }
        //  else
        //   return next.handle(req);


        //................................................................................................

        // return from(this._authService.ongetUser(this.USER_NAME_SESSION_ATTRIBUTE_NAME)).pipe(
        //     switchMap(user => {
        //       console.log("InterceptorUser......")
        //         console.log(user)

        //         if (user) {

        //             req = req.clone({
        //                 setHeaders: {
        //                     Authorization: user.authdata
        //                 }
        //             });
        //         }
        //         return next.handle(req);
        //     }));

       return from(this.handle(req, next)) 
    }



    async handle(req: HttpRequest<any>, next: HttpHandler) {
   
      const user=  await this._authService.getCurrentUser(this.USER_NAME_SESSION_ATTRIBUTE_NAME);

       
     
        if(user){

        const authReq = req.clone({
          setHeaders: {
            Authorization: user.authdata
          }
        })
        return next.handle(authReq).toPromise()
    }

        return next.handle(req).toPromise()
      }

}
