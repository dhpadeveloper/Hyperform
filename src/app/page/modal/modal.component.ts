import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { concatMap, mergeMap, tap } from 'rxjs';
import { AppConstant } from 'src/app/pojo/app-constant';
import { PayoutType } from 'src/app/pojo/payout-type';
import { SprintExecutionDto } from 'src/app/pojo/sprint-execution-dto';
import { User } from 'src/app/pojo/user';
import { AuthService } from 'src/app/service/auth.service';
import { GeneralService } from 'src/app/service/general.service';
import { PayoutReviewService } from 'src/app/service/payout-review.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {

  public selectedSprint: SprintExecutionDto;   
  public selectedSprintId: number = null;
  public sprintList: SprintExecutionDto[];
  public bpname: string = null;
  public crnName: string = null;
  public disbursementDate: string = null;
  public applApac: string = null;
  public product: string = null;
  public childUserList: User[] = [];
  public selectedUser: User;
  private selectedPayoutType: PayoutType;
  public selectedCategory: string;
  public caseCategoryList: { key: string, value: string }[] = [{ key: 'ALL', value: 'All' }, { key: 'Require Attention', value: 'Y' }, { key: 'Normal', value: 'N' }];
  public filterList:any[];
  @Input() page: any;
  @Input() oldValues: Map<String, any>;

  constructor(private modalController: ModalController,
    private _prService: PayoutReviewService,
    private _generalService: GeneralService,
    private _authService: AuthService
  ) { 
    this.filterList=[];
  }

  async ngOnInit() {
    console.log("Filter request from page: " + this.page);
    console.log(this.oldValues);
    this.selectedCategory = 'All';

    const currentActiveUser:User = await this._authService.getCurrentUser(AppConstant.USER_NAME_SESSION_ATTRIBUTE_NAME);
    console.log("currentActiveUser......." + currentActiveUser.name);

    if('payout-review'==this.page && 'agency'!=currentActiveUser.positionType){
      this.filterList.push('payoutMonth','businessPartner','crn','disbursementDate','applApac','product','childUser','caseCategory')
    }
    else if('payout-review'==this.page && 'agency'==currentActiveUser.positionType){
      this.filterList.push('payoutMonth','applApac','product');
    }
    else if('invoice'==this.page){
      this.filterList.push('payoutMonth');
    }
    
    




    // this._generalService.getCurrentPayoutType().pipe(
    //   tap(payout => console.log(payout)),
    //   mergeMap(payout => this._prService.getSprintList(payout.id))).
    //   subscribe(data => {
    //     this.sprintList = data;
    //     this.selectedSprint = this.sprintList.filter(s => s.id == this.oldValues.get(AppConstant.SprintExecutionId))[0];
    //   });


      const currentPayout = await this._generalService.getCurrentPayoutTypeAsPromise();
      this._prService.getSprintList(currentPayout.id).subscribe(data => {
        this.sprintList = data;
        this.selectedSprint = this.sprintList.filter(s => s.id == this.oldValues.get(AppConstant.SprintExecutionId))[0];
        this.changePayoutMonth(this.selectedSprint);
      });




    if (this.oldValues.has(AppConstant.AgencyCrn))
      this.crnName = this.oldValues.get(AppConstant.AgencyCrn);
    if (this.oldValues.has(AppConstant.AgencyName))
      this.bpname = this.oldValues.get(AppConstant.AgencyName);
    if (this.oldValues.has(AppConstant.ProductCode))
      this.product = this.oldValues.get(AppConstant.ProductCode);
    if (this.oldValues.has(AppConstant.ApplApac))
      this.applApac = this.oldValues.get(AppConstant.ApplApac);
    if (this.oldValues.has(AppConstant.AgrDate))
      this.disbursementDate = this.oldValues.get(AppConstant.AgrDate);
    if (this.oldValues.has(AppConstant.SprintExecutionId))
      this.selectedSprintId = this.oldValues.get(AppConstant.SprintExecutionId);



    if(this.filterList.includes('childUser'))
    this._prService.getChildUserList(currentActiveUser.id).subscribe(data => {
      this.childUserList = data;
      this.selectedUser = this.childUserList.filter(s => s.id == this.oldValues.get(AppConstant.userId))[0];
    });
    else this.selectedUser = currentActiveUser;

}


changePayoutMonth(selectedSprint){
  
  this._generalService.changeCurrentSprint(selectedSprint);
}

  applyFilter() {
    console.log(this.selectedSprintId)
    let map = new Map<String, any>();
    if (this.selectedSprint != null)
      map.set(AppConstant.SprintExecutionId, this.selectedSprint.id);
    this._generalService.changeCurrentSprint(this.selectedSprint);
    if (this.crnName != null)
      map.set(AppConstant.AgencyCrn, this.crnName);
    if (this.bpname != null)
      map.set(AppConstant.AgencyName, this.bpname);
    if (this.product != null)
      map.set(AppConstant.ProductCode, this.product);
    if (this.applApac != null)
      map.set(AppConstant.ApplApac, this.applApac);
    if (this.disbursementDate != null)
      map.set(AppConstant.AgrDate, this.disbursementDate);
    // map.set(AppConstant.CaseCategory,this.selectedCategory);
    map.set(AppConstant.userId, this.selectedUser.id);
    this.modalController.dismiss(map, "filterData");
  }
}
