import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { PayoutReviewService } from './service/payout-review.service';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { InvoiceService } from './service/invoice.service';
import { HttpConfigInterceptor } from './httpConfig.interceptor';
import { HttpErrorInterceptor } from './httpError.interceptor';
import { AuthGuard } from './auth.guard';
import { IonicStorageModule } from '@ionic/storage-angular';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    IonicStorageModule.forRoot()

  ],
  providers: [
    AuthGuard,
    FileChooser,
    StatusBar,
    SplashScreen, PayoutReviewService, InvoiceService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {provide:HTTP_INTERCEPTORS, useClass:HttpConfigInterceptor,multi:true},
    {provide:HTTP_INTERCEPTORS, useClass:HttpErrorInterceptor,multi:true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
