import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CaseDetailPageRoutingModule } from './case-detail-routing.module';

import { CaseDetailPage } from './case-detail.page';
 import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
 import { File } from '@ionic-native/file/ngx';
 import { PreviewAnyFile } from '@ionic-native/preview-any-file/ngx';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CaseDetailPageRoutingModule
  ],
  declarations: [CaseDetailPage],
  providers:[FileTransfer,FileTransferObject,File,PreviewAnyFile]
})
export class CaseDetailPageModule {}
