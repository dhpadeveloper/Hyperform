import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpResponse,
    HttpErrorResponse,
    HttpHeaders
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AlertifyService } from './service/alertify.service';
@Injectable({
    providedIn: 'root'
})

export class HttpErrorInterceptor implements HttpInterceptor {
    constructor(private alertifyService:AlertifyService){}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
       console.log("Error Interceptor");
       return next.handle(req).pipe(
           catchError((error:HttpErrorResponse)=>{
               console.log(error);
            if(error.error.status=='500' && error.error.message==null) error.error.message="500 Internal Server Error";           
             return throwError(error.error);
           })
       );
    }

  
}
