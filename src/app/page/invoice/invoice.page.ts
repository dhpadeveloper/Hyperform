import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { InvoiceData } from 'src/app/pojo/invoice-data';
import { InvoiceService } from 'src/app/service/invoice.service';
import { ModalController } from '@ionic/angular';
import { ModalComponent } from 'src/app/page/modal/modal.component';
import { AuthService } from 'src/app/service/auth.service';
import { AlertifyService } from 'src/app/service/alertify.service';
import { GeneralService } from 'src/app/service/general.service';
import { AppConstant } from 'src/app/pojo/app-constant';
import { PayoutReviewService } from 'src/app/service/payout-review.service';
import { SprintExecutionDto } from 'src/app/pojo/sprint-execution-dto';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.page.html',
  styleUrls: ['./invoice.page.scss'],
})
export class InvoicePage implements OnInit {
  public invoiceList: InvoiceData[];
  private sprintList: SprintExecutionDto[];
  public filterMap = new Map();
  public isdataLoadOrNot; boolean = false;
  constructor(
    private _invoiceService: InvoiceService,
    private router: Router,
    private avRoute: ActivatedRoute,
    private modalController: ModalController,
    private _authService: AuthService,
    private _alertify: AlertifyService,
    private _generalService: GeneralService,
    private _prService: PayoutReviewService
  ) { }

  ngOnInit() {
    this.getGridData();

  }

  async getCurrentActiveUser(): Promise<any> {
    return await this._authService.getCurrentUser(AppConstant.USER_NAME_SESSION_ATTRIBUTE_NAME);
  }
  async getCurrentPayout(): Promise<any> {
    return await this._generalService.getCurrentPayoutTypeAsPromise();
  }
   getCurrentProduct(payoutType){
    let product = payoutType.type;
    return product.split("-")[1];
   }

  async getGridData() {

    const currentActiveUser = await this.getCurrentActiveUser();
    const currentPayout = await this.getCurrentPayout();
    let product =this.getCurrentProduct(currentPayout);

    this._prService.getSprintList(currentPayout.id).subscribe(data => {
      this.sprintList = data;
      this._generalService.changeCurrentSprint(this.sprintList[0]);
      let sprintId: number = this.sprintList[0].id;
      console.log("Sprints" + sprintId)
      this.filterMap.set(AppConstant.SprintExecutionId, sprintId);
      this.filterMap.set(AppConstant.userId, currentActiveUser.id);
      //this.filterMap.set(AppConstant.CaseCategory, 'All');
      this.setLoadDataFlag();
      this._invoiceService.getInvoiceList(currentActiveUser.id, sprintId, currentPayout.id)
        .subscribe(data => this.invoiceList = data, error => this._alertify.showError(error.message));

    }, error => {
      this.setLoadDataFlag();
      this._alertify.showError(error.message);

    });

  }


  async openFilter() {
    this.invoiceList = [];
    const modal = await this.modalController.create({
      component: ModalComponent,
      cssClass: 'my-custom-class',
      componentProps: { page: 'invoice', oldValues: this.filterMap }
    });
    await modal.present();
    const { data: map, role } = await modal.onWillDismiss();
    this.filterMap = map;
    console.log("Filter....." + this.filterMap);
    this.filterMap.set(AppConstant.SprintExecutionId, parseInt(this.filterMap.get(AppConstant.SprintExecutionId)))
    this.isdataLoadOrNot = false;
    this.setLoadDataFlag();

    this.getGridData();

  }


  setLoadDataFlag() {
    setTimeout(() => { this.isdataLoadOrNot = true }, 1000);
  }

  getInvoiceDetail(id) {
    console.log(id);
    let selectedCaseId = id;
    this.router.navigate(['invoice-detail', selectedCaseId], { relativeTo: this.avRoute })

  }


  approveOrReject(value) { }




}
