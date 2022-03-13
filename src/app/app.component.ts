import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router'
import { GeneralService } from './service/general.service';
import { AuthService } from './service/auth.service';
import { PayoutReviewService } from './service/payout-review.service';
import { PayoutType } from './pojo/payout-type';
import * as loginMenu from 'src/assets/data/loginMenu.json';
import * as logoutMenu from 'src/assets/data/logoutMenu.json';
import { HttpClient } from '@angular/common/http';
import { User } from './pojo/user';
import { catchError, delay, flatMap, forkJoin, from, map, mergeMap, Observable, tap } from 'rxjs';
import { AppConstant } from './pojo/app-constant';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public selectedPayout: PayoutType;
  public payoutTypes: PayoutType[];
  public logoutMenu: any = (logoutMenu as any).default;
  public loginMenu: any = (loginMenu as any).default;
  public isPayoutLoaded: boolean = false;
  public loginMenuItem: any;
  public currentUser: User = new User();



  constructor(
    private httpClient: HttpClient,
    private _authService: AuthService,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private _generalService: GeneralService) {
    console.log("App Component Constructor")
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
  product: any = [];
  ngOnInit() {
    console.log("App Component Init")
    this._generalService.getPayoutTypeList().subscribe(list => {
      this.payoutTypes = list
      this.selectedPayout = this.payoutTypes[0];
      this.changePayoutType(this.selectedPayout);
    });


    // this._authService.isUserAuthenticatedAsObservable().pipe(delay(100)).subscribe(
    //   (status) => {

    //     if (status) {
    //       console.log("inside .................")


    //       let menuList = this.httpClient.get("assets/data/loginMenu.json");
    //       let user =  from(this._authService.getCurrentUser(AppConstant.USER_NAME_SESSION_ATTRIBUTE_NAME));
      
    //       console.log("fhwifu.............."+(user as any).id+menuList);
          
    //       forkJoin([menuList,user])
    //         .subscribe(dataArray => {
    //           let menuList = dataArray[0] as any;
    //           let user = dataArray[1];
    //           console.log("fhwifu.............."+user.id+menuList);
              
    //           menuList.filter(menu => menu.title != 'Logout' && menu.title != 'Dashboard').forEach(menu => {
    //             this._authService.checkPermission(menu.menuId, user.id).subscribe(result => {
    //               let hasPermisson = (result as any).message;
    //               if (hasPermisson == "true") {
    //                 menu.visible = true;
    //               } else menu.visible = false;
    //             }
    //             )
    //           });
    //           this.loginMenuItem = menuList;
    //         }, error => console.log(error))

    //     }
    //   }
    // )



    this._authService.isUserAuthenticatedAsObservable().subscribe(
      (status) => {
        if (status) {
          this.httpClient.get("assets/data/loginMenu.json").pipe(tap(menuList => console.log(menuList)),
            map((menuList: any) => {
              menuList.filter(menu => menu.title != 'Logout' && menu.title != 'Dashboard').forEach(menu => {
                this._authService.checkPermission(menu.menuId).subscribe(result => {
                  let hasPermisson = (result as any).message;
                  if (hasPermisson == "true") {
                    menu.visible = true;
                  } else menu.visible = false;
                }
                )
              });
              return menuList;
            })).subscribe(menuList => { console.log(menuList); this.loginMenuItem = menuList })
        }
      })


    this._authService.isUserAuthenticatedAsObservable()
      .pipe(
        delay(10),
        mergeMap(status =>

          from(
            this._authService.getCurrentUser(AppConstant.USER_NAME_SESSION_ATTRIBUTE_NAME)
          ).pipe(map(res => {
            return res;
          }))
        ),
        catchError(err => {
          return err;
        })

      ).subscribe(
        (res) => {
          console.log(res);
          this.currentUser = res;

        }, (err) => {

        }
      )






    // this._authService.isAuthenticated().subscribe((status) => {
    //   console.log("kiqgfiygfuy......................." + status);

    //   if (status) {
    //     this._authService.ongetUser(AppConstant.USER_NAME_SESSION_ATTRIBUTE_NAME).
    //       then(user => {
    //         console.log("kiqgfiygfuy.......................");

    //         console.log(user);
    //         this.currentUser = new User();

    //         this.currentUser.name = user.name;
    //         this.currentUser.email = user.email
    //       }).
    //       catch(error => console.log(error));
    //   }
    // })
  }

  changePayoutType(pType) {
    this._generalService.changeCurrentPayoutType(pType);
    this.router.navigate(['/home']);
  }  





  goto(title: string, url: string, i) {

    if (title === "Logout") {
      this.payoutTypes = undefined;
      this._authService.logout();
    }
    this.router.navigate([url]);
    this.selectedIndex = i;


  }

  isUserLoggedIn(): boolean {
    return this._authService.isUserAuthenticated();
  }

}
