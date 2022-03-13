import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { InvoiceDetailPageRoutingModule } from './invoice-detail-routing.module';
import { InvoiceDetailPage } from './invoice-detail.page';
//import {ModalComponent} from 'src/app/page/modal/modal.component'
import { File } from "@ionic-native/file/ngx";
import { PreviewAnyFile } from '@ionic-native/preview-any-file/ngx';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InvoiceDetailPageRoutingModule
  ],
  declarations: [InvoiceDetailPage],
  providers:[File,PreviewAnyFile]
})
export class InvoiceDetailPageModule {}
