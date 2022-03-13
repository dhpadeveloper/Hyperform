import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./page/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'payout-review',canActivate:[AuthGuard],
    loadChildren: () => import('./page/payout-review/payout-review.module').then( m => m.PayoutReviewPageModule)
  },
  {
    path: 'forgot-password',canActivate:[AuthGuard],
    loadChildren: () => import('./page/forget-password/forget-password.module').then( m => m.ForgetPasswordPageModule)
  },
  {
    path: 'payout-review/cases/:id',canActivate:[AuthGuard],
    loadChildren: () => import('./page/case-detail/case-detail.module').then( m => m.CaseDetailPageModule)
  },
  {
    path: 'special',canActivate:[AuthGuard],
    loadChildren: () => import('./page/special-case/special-case.module').then( m => m.SpecialCasePageModule)
  },
  {
    path: 'invoice/invoice-detail/:id',canActivate:[AuthGuard],
    loadChildren: () => import('./page/invoice-detail/invoice-detail.module').then( m => m.InvoiceDetailPageModule)
  },
  {
    path: 'invoice',canActivate:[AuthGuard],
    loadChildren: () => import('./page/invoice/invoice.module').then( m => m.InvoicePageModule)
  },
  {
    path: 'home',canActivate:[AuthGuard],
    loadChildren: () => import('./page/home/home.module').then( m => m.HomePageModule)
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes,{preloadingStrategy: PreloadAllModules})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
