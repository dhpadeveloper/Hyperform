import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PayoutReviewPageRoutingModule } from './payout-review-routing.module';

import { PayoutReviewPage } from './payout-review.page';
import {HeaderComponent} from 'src/app/page/header/header.component';
import {ModalComponent} from 'src/app/page/modal/modal.component'
import { File } from "@ionic-native/file/ngx";
import { PreviewAnyFile } from '@ionic-native/preview-any-file/ngx';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PayoutReviewPageRoutingModule,NgxPaginationModule
  ],
  declarations: [PayoutReviewPage,HeaderComponent,ModalComponent],entryComponents:[ModalComponent],
  providers:[File,PreviewAnyFile]
})
export class PayoutReviewPageModule {}
