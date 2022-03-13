import { Component, OnInit } from '@angular/core';
import { PayoutReviewService } from '../../service/payout-review.service'
import { PayoutReviewDataGridDto } from 'src/app/pojo/payout-review-data-grid-dto';
import { PayoutType } from 'src/app/pojo/payout-type';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { ModalComponent } from 'src/app/page/modal/modal.component';
import {  IonRouterOutlet } from '@ionic/angular';
import { SprintExecutionDto } from 'src/app/pojo/sprint-execution-dto';
import { AppConstant } from 'src/app/pojo/app-constant';
import { GeneralService } from 'src/app/service/general.service';
import { ActionDto } from 'src/app/pojo/action-dto';
import { Platform } from "@ionic/angular";
import { File, FileEntry } from "@ionic-native/file/ngx";
import { PreviewAnyFile } from '@ionic-native/preview-any-file/ngx';
import { AuthService } from 'src/app/service/auth.service';
import { AlertifyService } from 'src/app/service/alertify.service';



@Component({
  selector: 'app-payout-review',
  templateUrl: './payout-review.page.html',
  styleUrls: ['./payout-review.page.scss'],
})



export class PayoutReviewPage implements OnInit {
  selectedPayoutId: number;
  selectedSprintId: number;
  public caseList: PayoutReviewDataGridDto[];
  public payoutTypes: PayoutType[];
  public selectedSegment: string;
  public checkedCaseMap: Map<string, PayoutReviewDataGridDto>;
  public checkedPayoutMap: Map<string, PayoutReviewDataGridDto>;
  public approveOrRejectMsg: string;
  public isdataLoadOrNot; boolean = false;
  public selectedYear: string;
  public selectedMonth: string;
  public filterMap = new Map();
  public chipList = [];
  private sprintList: SprintExecutionDto[];
  public remarkAction: string;
  public emptyRemarkActionMsg: string = '';
  public isListEmpty: boolean = false;
  public isAgencyUser: boolean;
  public showSelectAllDiv: boolean = false;
  public serverErrorMsg: string = '';
  public showMoreOptionDiv: boolean = false;
  public pageNumber: number;
  private resultSet: number;
  public currentUserPosition: string;
  public multiSelect: boolean;
  public permissionList: any[] = [];
  

  constructor(private _prService: PayoutReviewService,
    private _generalService: GeneralService,
    private router: Router,
    private avRoute: ActivatedRoute,
    private modalController: ModalController,
    private routerOutlet: IonRouterOutlet,
    private platform: Platform,
    private file: File,
    private previewAnyFile: PreviewAnyFile,
    private alert: AlertController,
    private _authService: AuthService,
    private _alertify: AlertifyService
  ) {
    this.selectedSegment = "case";
    this.pageNumber = 1;
    this.resultSet = 50;
    this.isAgencyUser = false;
  }

  ngOnInit() {

    this.emptyRemarkActionMsg = '';
    this.checkedCaseMap = new Map();
    this.checkedPayoutMap = new Map();


    this.refershGrid(this.selectedSegment);
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
  
  async refershGrid(segment) {
    const currentActiveUser = await this.getCurrentActiveUser();
    const currentPayout = await this.getCurrentPayout();
    let product= this.getCurrentProduct(currentPayout);
    this.allowMultiSelect(currentActiveUser.positionType);
    const currentSprint = await this._generalService.getCurrentSprint();
    if(currentSprint==null) {this.getData(currentPayout.id,currentActiveUser.id,product)}
    else{
      console.log("data with sprint");
      this.filterMap.set(AppConstant.SprintExecutionId, currentSprint.id);
      this.filterMap.set(AppConstant.userId, currentActiveUser.id);
      //this.filterMap.set(AppConstant.CaseCategory, 'All');
      this.setLoadDataFlag();
      this.getGridData(currentActiveUser.id, this.selectedSegment, this.filterMap, this.resultSet, product);
    }
  }
  getData(payoutId,userId,product){
    console.log("data without sprint")
    this._prService.getSprintList(payoutId).subscribe(data => {
      this.sprintList = data;
      this._generalService.changeCurrentSprint(this.sprintList[0]);
      let sprintId: number = this.sprintList[0].id;
      this.filterMap.set(AppConstant.SprintExecutionId, sprintId);
      this.filterMap.set(AppConstant.userId, userId);
      //this.filterMap.set(AppConstant.CaseCategory, 'All');
      this.setLoadDataFlag();
      this.getGridData(userId, this.selectedSegment, this.filterMap, this.resultSet, product);

    }, error => {
      this.setLoadDataFlag();
      this._alertify.showError(error.message);

    });
  }



  
  allowMultiSelect(currentUserPosition) {


    if (this.selectedSegment == 'case' && ("BIU Checker" == currentUserPosition ||
      "BIU ADMIN" == currentUserPosition || "BIU checker user" == currentUserPosition
      || "BIU- Manager" == currentUserPosition)) {

      this.permissionList.push("basic_row_selection", "basic_row_selection_only_non_special");

      this.multiSelect = true;
    }
    else if ("agency" == currentUserPosition) {
      this.multiSelect = true;
      this.permissionList.push("basic_row_selection");
      this.isAgencyUser = true;
    }
    else if (("RM" == currentUserPosition ||
      "RSM" == currentUserPosition || "ASM" == currentUserPosition
      || "SM" == currentUserPosition || "ZSM" == currentUserPosition)) {
      this.permissionList = [];
      this.multiSelect = false;
    }
  }

  async onSegmentChanged(event) {
    this.pageNumber = 1;
    this.resultSet = 50;
    const currentActiveUser = await this.getCurrentActiveUser();
    this.checkedCaseMap = new Map();
    this.checkedPayoutMap = new Map();
    this.caseList = [];
    this.isdataLoadOrNot = false;
    this.setLoadDataFlag();
    this.selectedSegment = event.detail.value;
    const currentPayout = await this.getCurrentPayout();
    let product= this.getCurrentProduct(currentPayout);
    this.allowMultiSelect(currentActiveUser.positionType);
    this.getGridData(currentActiveUser.id, this.selectedSegment, this.filterMap, this.resultSet, product)
  }

  getGridData(userId, segment, filterMap, resultSet, currentProduct) {
    this.caseList = [];
    console.log(filterMap);
    this._prService.getGridData(userId, segment, filterMap, resultSet, currentProduct).subscribe(data => {
      // this.caseList = this.caseList.concat(data);
      this.caseList = data;
      console.log("Case Data" + this.caseList)
      //if(this.caseList.length<=0)this.serverErrorMsg="No Data Found"
    }, error => {
      console.log(error);
      this._alertify.showError(error.message);
    });
  }

  selectOrUnSelectCase(event) {
    if (event == 1) {
      this.caseList.forEach((item) => {
        if (!this.isAgencyUser){
          if (item.isSpecial != 'Y') item.isChecked = true
        }
        else item.isChecked = true;
      })
    }
    else if (event == 2) {
      this.caseList.forEach((item) => item.isChecked = false)
    }
  }


  setLoadDataFlag() {
    setTimeout(() => { this.isdataLoadOrNot = true }, 1000);
  }


  getCaseDetail(id) {
    if (this.isAgencyUser) {
      console.log("Agency User...");
    }
    else {
      let selectedCaseId = id;
      //this.router.navigate(['cases', selectedCaseId], { relativeTo: this.avRoute })
      this.router.navigate(['/payout-review/cases', selectedCaseId])
    }
  }





  onDownload(response, fileName) {
    var blob = new Blob([response], { type: 'application/vnd.ms.excel' });
    let filePath: string;
    let folderName = 'Incentivo_Download';
    fileName = "fileName" + new Date().getTime() + ".xlsx";
    console.log("path " + fileName);
    console.log("platform " + this.platform.platforms);
    if (this.platform.is("android")) {
      filePath = this.file.externalDataDirectory;
    } else {
      filePath = this.file.documentsDirectory;
    }


    //filePath='file:///storage/emulated/0/'
    console.log("path to store file " + filePath);

    this.file.checkDir(filePath, folderName).then(() => {

      this.file.writeFile(filePath + '/' + folderName + '/', fileName, blob, { replace: true }).then((fileEntry: FileEntry) => {

        console.log("File created!");

        this.previewAnyFile.preview(fileEntry.toURL())
          .then((res: any) => console.log(res))
          .catch((error: any) => console.error(error));
      })
        .catch((err) => {
          console.error("Error creating file: " + err);
          throw err;
        });

    }).catch(() => {

      this.file.createDir(filePath, folderName, false).then(() => {
        this.file.writeFile(filePath + '/' + folderName + '/', fileName, blob, { replace: true }).then((fileEntry: FileEntry) => {

          console.log("File created!");

          this.previewAnyFile.preview(fileEntry.toURL())
            .then((res: any) => console.log(res))
            .catch((error: any) => console.error(error));
        })
          .catch((err) => {
            console.error("Error creating file: " + err);
            throw err;
          });
      }).catch((err) => {
        console.log(err)
      })
    });
  }


  async downloadCaseDetailFile() {
    const currentActiveUser = await this.getCurrentActiveUser();
   // const sprintId = this.filterMap.get(AppConstant.SprintExecutionId);
    const sprintId = await this._generalService.getCurrentSprint();
    this._prService.downloadCaseDetailFile(currentActiveUser.id, sprintId).subscribe((response) => {
      console.log(response);
      this.onDownload(response as Blob, "CaseDetail_");
    },
      error => {
        console.log(error);
      }
    );
  }


  async onDownloadHoldRecords() {
    const currentActiveUser = await this.getCurrentActiveUser();
    //const sprintId = this.filterMap.get(AppConstant.SprintExecutionId);
    const sprintId = await this._generalService.getCurrentSprint();
    this._prService.downloadHoldRecordFile(currentActiveUser.id, sprintId).subscribe((response) => {
      console.log(response);
      this.onDownload(response as Blob, "HoldRecord_");
    },
      error => {
        console.log(error);
      }
    );
  }



  async doAction(event) {
    console.log(event + "   " + this.selectedSegment);

    const currentActiveUser = await this.getCurrentActiveUser();
    const sprintId = this.filterMap.get(AppConstant.SprintExecutionId);
    let value = event;
    let idList: number[] = [];
    let dto = new ActionDto();
    dto.action = value;
    dto.commentAction = null;
    dto.user_id = currentActiveUser.id,
      dto.selectedSprintExecutionId = sprintId;


    if ('case' == this.selectedSegment && this.checkedCaseMap.size < 1) {
      this.isListEmpty = true;
      return
    }
    if ('case' == this.selectedSegment) {
      if (this.remarkAction == undefined || this.remarkAction == null || this.remarkAction == '') {
        this.emptyRemarkActionMsg = 'Enter remark';
        return
      }
    }
    if ('case' == this.selectedSegment && this.checkedCaseMap.size > 0) {
      for (let val of this.checkedCaseMap.entries()) {
        console.log("Payout Id for Case " + val[0] + "is " + val[1].payoutDetail_Id);
        idList.push(val[1].payoutDetail_Id);
      }

      dto.type = 'case';
      dto.idList = idList;
      dto.remarksAction = this.remarkAction;
      this._prService.doAction(dto).subscribe(data => {
        this.approveOrRejectMsg = (data as any).message
        console.log(this.approveOrRejectMsg);
        this.showAlert(this.approveOrRejectMsg);
      }, error => console.log(error));
    }
    else if ('payout' == this.selectedSegment) {
      for (let val of this.checkedPayoutMap.entries()) {
        console.log("Payout Id for Case " + val[0] + "is " + val[1].payout_Id);
        idList.push(val[1].payout_Id);
      }

      dto.type = 'payout';
      dto.idList = idList;
      this._prService.doAction(dto).subscribe(data => {
        this.approveOrRejectMsg = (data as any).message; console.log(data);
        this.showAlert(this.approveOrRejectMsg);
      }, error => {
        //console.log(error);
        this._alertify.showError(error.message);
      });
    }
  }

  showAlert(msg) {
    this.alert.create({
      message: msg,
      buttons: [{
        text: 'Okay',
        handler: () => {
          console.log('Confirm Okay');
          this.refershGrid(this.selectedSegment);
        }
      }]
    }).then(res => {

      res.present();

    });
  }


  onCaseCheck(checkedCase: PayoutReviewDataGridDto, index, type) {

    console.log(type + "  " + index);
    if ('payout' == type) {
      if (this.checkedPayoutMap.has(checkedCase.payout_Id + '')) {
        this.checkedPayoutMap.delete(checkedCase.payout_Id.toString());
      }
      else {
        this.checkedPayoutMap.set(checkedCase.payout_Id + '', checkedCase);
      }
    }
    else if ('case' == type) {
      if (this.checkedCaseMap.has(checkedCase.applApac)) {
        this.checkedCaseMap.delete(checkedCase.applApac);
      }
      else {
        this.checkedCaseMap.set(checkedCase.applApac, checkedCase);
      }

      if (this.checkedCaseMap.size > 0) {
        this.showSelectAllDiv = true;
      }
    }

    console.log(this.checkedCaseMap);
    console.log(this.checkedPayoutMap);
  }


  async openFilter() {
    try {
      console.log("openFilter........");
      this.pageNumber = 1;
      this.resultSet = 50;
      const currentActiveUser = await this.getCurrentActiveUser();
      const currentPayout = await this.getCurrentPayout();
      let product= this.getCurrentProduct(currentPayout);
      this.chipList = [];
      const modal = await this.modalController.create({
        component: ModalComponent,
        cssClass: 'my-custom-class',
        presentingElement: this.routerOutlet.nativeEl,
        componentProps: { page: 'payout-review', oldValues: this.filterMap }
      });
      await modal.present();
      const { data: map, role } = await modal.onWillDismiss();
      this.filterMap = map;
      this.filterMap.set(AppConstant.SprintExecutionId, parseInt(this.filterMap.get(AppConstant.SprintExecutionId)))
      this.filterMap.set(AppConstant.userId, parseInt(this.filterMap.get(AppConstant.userId)))
      console.log("Filter....." + this.filterMap);
      this.populateChipMap(this.filterMap);
      this.isdataLoadOrNot = false;
      this.setLoadDataFlag();
      this.getGridData(currentActiveUser.id, this.selectedSegment, this.filterMap, this.resultSet, product);
    }
    catch (error) {
      console.log(error);
      const currentActiveUser = await this.getCurrentActiveUser();
      const currentSprint = await this._generalService.getCurrentSprint();
      this.filterMap= new Map();
      this.filterMap.set(AppConstant.SprintExecutionId, currentSprint.id);
      this.filterMap.set(AppConstant.userId, currentActiveUser.id);
      this._alertify.showError(error.message);
    }

  }

  populateChipMap(filterMap) {
    if (filterMap.has(AppConstant.AgrDate)) {
      let value: string = filterMap.get(AppConstant.AgrDate);
      if (value != null && value != '') {
        let arr = value.split("-");
        this.chipList.push({ name: 'Year', value: arr[0] })
        this.chipList.push({ name: 'Month', value: arr[1] })

      }
    }
    if (filterMap.has(AppConstant.AgencyCrn)) {
      let value: string = filterMap.get(AppConstant.AgencyCrn);
      if (value != null && value != '') {

        this.chipList.push({ name: 'CRN', value: value })

      }
    }
    if (filterMap.has(AppConstant.ProductCode)) {
      let value: string = filterMap.get(AppConstant.ProductCode);
      if (value != null && value != '') {
        this.chipList.push({ name: 'Product', value: value })

      }
    }
    if (filterMap.has(AppConstant.AgencyName)) {
      let value: string = filterMap.get(AppConstant.AgencyName);
      if (value != null && value != '') {
        this.chipList.push({ name: 'Agency', value: value })

      }
    }
    if (filterMap.has(AppConstant.ApplApac)) {
      let value: string = filterMap.get(AppConstant.ApplApac);
      if (value != null && value != '') {
        this.chipList.push({ name: 'ApplApac', value: value })

      }
    }

  }


  toogleMoreOptionDiv() {
    this.showMoreOptionDiv = !this.showMoreOptionDiv;
  }


  hideShowSelectAllDiv() {
    this.showSelectAllDiv = false;
  }


  async loadData(event) {
    try {
      console.log("currentPage........" + event);
      const currentActiveUser = await this.getCurrentActiveUser();
      const currentPayout = await this.getCurrentPayout();
      let product= this.getCurrentProduct(currentPayout);
      this.pageNumber = event;
    } catch (error) {
      console.log(error);
    }
  }

}