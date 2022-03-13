import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PayoutReviewPage } from './payout-review.page';

const routes: Routes = [
  {
    path: '',
    component: PayoutReviewPage
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PayoutReviewPageRoutingModule {}
