import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { truncate } from 'fs';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service'

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private _authService: AuthService
  ) { }
 
  canActivate() {

    // if (this._authService.isUserLoggedIn()) {
    //   return true;
    // }
    // else {
    //   this.router.navigate(["/login"]);
    //   return false;
    // }



//.......................................................
//const requiresLogin = route.data.requiresLogin || false;


    if (this._authService.isUserAuthenticated()) {
      return true;
    }
    else {
      this.router.navigate(["/login"]);
      return false;
    }



  }

}
