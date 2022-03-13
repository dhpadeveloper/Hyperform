import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import { map } from 'rxjs/operators';
import { ToastController } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class AlertifyService {
constructor( private http:HttpClient,private toast:ToastController ) { }


public  showError(error){
this.createToast(error);
}

private createToast(error) {
    const toast = this.toast.create({
      message: error,
      duration: 5000,
      color: 'danger',
      position: 'bottom',
      buttons: [{
        side: 'end',
        text: 'Close',
        role: 'cancel',
        handler: () => {
          console.log('Close clicked');
        }
      }]
    }).then((obj) => {
      obj.present();
    });
  }
}
