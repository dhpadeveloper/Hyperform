import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SpecialCasePage } from './special-case.page';

const routes: Routes = [
  {
    path: '',
    component: SpecialCasePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SpecialCasePageRoutingModule {}
