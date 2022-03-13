import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { delay, map, retry, retryWhen, take } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from '../pojo/user';
import { StorageService } from './storage.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient,
    private _storageService: StorageService) { }
  private USER_NAME_SESSION_ATTRIBUTE_NAME = 'authenticatedUser';
  private API_URL = environment.API_URL;
  private  authenticationState = new BehaviorSubject(false);


  public authenticateUser(username: string, password: string): Observable<User> {
    console.log("authenticateCall");
    const headers = new HttpHeaders({ Authorization: this.createBasicAuth(username, password) })
    return this.http.get<any>(this.API_URL + 'authenticate/'
      , { headers }).pipe(retryWhen(errors => errors.pipe(delay(1000), take(3))),map(user => {
        let userTemp = new User();
        userTemp.id = user.id;
        userTemp.authdata = this.createBasicAuth(username, password);
        userTemp.name = username;
        userTemp.positionType = user.positionType;
        userTemp.status = user.status;
        this._storageService.setData(this.USER_NAME_SESSION_ATTRIBUTE_NAME, userTemp);
        // this._storageService.setData("userId",userTemp.id);
        // this._storageService.setData("username",userTemp.name);
        // this._storageService.setData("positionType",userTemp.positionType);
        this.authenticationState.next(true);
        return userTemp;
      }));



  }
  public createBasicAuth(username: String, password: String) {
    return 'Basic ' + window.btoa(username + ":" + password)
  }

  

  async getCurrentUser(key): Promise<any> {
    return await this._storageService.getObject(key).then(res=> {return res;});
  }

  logout() {
   // sessionStorage.removeItem(this.USER_NAME_SESSION_ATTRIBUTE_NAME);
   this._storageService.remove(this.USER_NAME_SESSION_ATTRIBUTE_NAME).
   then(() => this.authenticationState.next(false));

   // Promise.all([this._storageService.remove("userId"),
    //  this._storageService.remove("username"),this._storageService.remove("positionType")])
    // .then(res=> this.authenticationState.next(false))
    // .catch(err => { /* handle errors here */})
  }

  isUserAuthenticated() {
    return this.authenticationState.value;
  }
  
  isUserAuthenticatedAsObservable() {
    return this.authenticationState.asObservable();
  }

  checkPermission(menuId): Observable<string> {
    let params = new HttpParams();
    params = params.set('menuId', menuId);
    //params = params.set('userId', userId);
    return this.http.get<string>(this.API_URL + 'authenticate/hasPermission', { params: params });
  }



//  public authenticateUser(username: string, password: string): Observable<User> {
    // console.log("authenticateCall");
    // const headers = new HttpHeaders({ Authorization: this.createBasicAuth(username, password) })
    // return this.http.get<any>(this.API_URL + 'authenticate/'
    //   , { headers }).pipe(map(user => {
    //     let userTemp = new User();
    //     userTemp.id = user.id;
    //     userTemp.authdata = this.createBasicAuth(username, password);
    //     userTemp.name = username;
    //     userTemp.positionType = user.positionType;
    //     userTemp.status = user.status;
    //     this.registerSuccessfulLogin(userTemp);
    //     console.log("guygeufy.");
    //     return userTemp;
    //   }));

//  }



  // registerSuccessfulLogin(user) {
  //   console.log("sessionStorage.....")
  //   sessionStorage.setItem(this.USER_NAME_SESSION_ATTRIBUTE_NAME, JSON.stringify(user));

  // }

  // public getCurrentUser(): User {
  //   return JSON.parse(sessionStorage.getItem(this.USER_NAME_SESSION_ATTRIBUTE_NAME));
  // }

  // isUserLoggedIn() {
  //   let user = sessionStorage.getItem(this.USER_NAME_SESSION_ATTRIBUTE_NAME)
  //   if (user == null) return false
  //   return true;
  // }




  

}
