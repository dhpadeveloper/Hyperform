import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/pojo/user';
import {AuthService} from '../../service/auth.service';
import { Router} from '@angular/router';
import { GeneralService } from 'src/app/service/general.service';
import { PayoutReviewService } from 'src/app/service/payout-review.service';
import { PayoutType } from 'src/app/pojo/payout-type';
import { catchError, concatMap, delay, flatMap, mergeMap, retry, tap } from 'rxjs';
import { AppConstant } from 'src/app/pojo/app-constant';

 
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
public invalidUserMsg='';
public user= new User();
  constructor(private _authService:AuthService,
    private router:Router,private _gService:GeneralService,private _prService:PayoutReviewService ) { }

  ngOnInit() {
  }


  public handleLogin(){

if(this.user.name== undefined||this.user.name==null){
  this.invalidUserMsg="Please Enter UserName"
return 
}

if(this.user.password== undefined||this.user.password==null){
  this.invalidUserMsg="Please Enter Password"
return 
}
  this.invalidUserMsg='';
  console.log(this.user.getName);

  this._authService.authenticateUser(this.user.getName,this.user.getPassword).pipe(
    tap(user => console.log(user)),
    catchError(()=>this.invalidUserMsg="Invalid UserName Or Password"),delay(50),
    mergeMap((currentUser:User) => this._prService.getPayoutTypes(currentUser.id))).subscribe(
      (data:PayoutType[]) => {this._gService.setPayoutTypeList(data);
        this._gService.changeCurrentSprint(null);
        this.router.navigate(['/home']);
    }),error => {
      console.log(error)    
    };
      

  }

}
