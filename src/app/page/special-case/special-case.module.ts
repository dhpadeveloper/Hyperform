import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SpecialCasePageRoutingModule } from './special-case-routing.module';

import { SpecialCasePage } from './special-case.page';
import {MaterialModule} from 'src/app/material.module';
import {FileChooser} from '@ionic-native/file-chooser/ngx';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SpecialCasePageRoutingModule,
    MaterialModule
  ],
  declarations: [SpecialCasePage],
  providers:[FileChooser]
})
export class SpecialCasePageModule {}
