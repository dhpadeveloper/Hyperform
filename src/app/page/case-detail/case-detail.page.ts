import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PayoutReviewService } from '../../service/payout-review.service'
import { PayoutReviewDataGridDto } from 'src/app/pojo/payout-review-data-grid-dto'
import { CaseDetailWrapperDto } from 'src/app/pojo/case-detail-wrapper-dto'
import { Router, ActivatedRoute, ParamMap, NavigationEnd } from '@angular/router'
import { SpecialCase } from '../../pojo/special-case';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { Platform } from "@ionic/angular";
import { PreviewAnyFile } from '@ionic-native/preview-any-file/ngx';
import { AlertController } from '@ionic/angular';
import { ActionDto } from 'src/app/pojo/action-dto';
import { User } from 'src/app/pojo/user';
import { AuthService } from 'src/app/service/auth.service';
import { AlertifyService } from 'src/app/service/alertify.service';
import { AppConstant } from 'src/app/pojo/app-constant';
import { GeneralService } from 'src/app/service/general.service';
import { SprintExecutionDto } from 'src/app/pojo/sprint-execution-dto';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-case-detail',
  templateUrl: './case-detail.page.html',
  styleUrls: ['./case-detail.page.scss'],
})
export class CaseDetailPage implements OnInit {

  public detailedCase: PayoutReviewDataGridDto;
  public caseDetailWrapper: CaseDetailWrapperDto;
  public specialList: SpecialCase[];
  public insuranceList: SpecialCase[];
  public documentList: SpecialCase[];
  public otcPending: SpecialCase;
  public pddPending: SpecialCase;
  public remarkMap: Map<string, string>;
  public remarkList: { name: string, remark: string }[] = [];
  public selectedPayoutDetailId;
  public commentAction: string;
  public selectedRemarksAction: string;
  public emptySelectedRemarkActionMsg: string = '';
  public emptyCommentActionMsg: string = '';
  public toggleRemarkDiv: boolean = false;
  public showMoreOptionDiv: boolean = false;
  public isNotOverridable: boolean;
  //public itemLineProperty:string;

  constructor(private _prService: PayoutReviewService,
    private router: Router,
    private avRoute: ActivatedRoute,
    private file: File,
    private platform: Platform,
    private previewAnyFile: PreviewAnyFile,
    private alert: AlertController,
    private _authService: AuthService,
    private _generalService: GeneralService,
    private _alertify: AlertifyService) {

  }

  ngOnInit() {

    // if (this._authService.isUserLoggedIn()) {
    //   this.currentUser = this._authService.getCurrentUser();
    //   console.log("Current User Payout Review"+this.currentUser.name);

    // }
  

    this.avRoute.paramMap.subscribe((param: ParamMap) => {
      this.selectedPayoutDetailId = parseInt(param.get('id'));
      console.log(this.selectedPayoutDetailId)
    });


    this._generalService.getCaseDetailRefreshNeeded().subscribe(isNeeded => {
      if (isNeeded) {
        this.refreshCaseData(this.selectedPayoutDetailId);
      }
    })
    this.refreshCaseData(this.selectedPayoutDetailId);
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


  async refreshCaseData(selectedPayoutDetailId) {

    const currentSprint: SprintExecutionDto = await this._generalService.getCurrentSprint();
    const currentActiveUser = await this.getCurrentActiveUser();
    const currentPayout = await this.getCurrentPayout();
    let product = this.getCurrentProduct(currentPayout);

    this._prService.getCaseDetail(selectedPayoutDetailId, currentSprint.id, currentActiveUser.id, product).subscribe((data: CaseDetailWrapperDto) => {
      this.caseDetailWrapper = data;
      console.log(this.caseDetailWrapper);
      this.detailedCase = this.caseDetailWrapper.payoutReviewDto;
      this.remarkList = this.caseDetailWrapper.remarkList;
      this.specialList = this.caseDetailWrapper.payoutDetailOverrideList.filter(a => a.overrideType == 'special');
      this.insuranceList = this.caseDetailWrapper.payoutDetailOverrideList.filter(a => a.overrideType == 'insurance');
      this.documentList = this.caseDetailWrapper.payoutDetailOverrideList.filter(a => a.overrideType == 'document');
      this.otcPending = this.documentList.filter(d => d.type == 'otc')[0];
      this.pddPending = this.documentList.filter(d => d.type == 'pdd')[0];
      this.otcPending.pendingOrNot = this.detailedCase.otcPending;
      this.pddPending.pendingOrNot = this.detailedCase.pddPending;

      if (product != 'PL' && currentActiveUser.positionType != 'ASM' && currentActiveUser.positionType != 'RM' && 'Y' != this.detailedCase.isSpecial) {
        this.isNotOverridable = true;
      }
      else this.isNotOverridable = false;
      this._generalService.changeCaseDetailRefreshNeeded(false);

    });


  }



  onOverrideSpecial(override, edit, type) {

      this.router.navigate(['/special'], {
        queryParams: { "id": this.selectedPayoutDetailId, "override": override, "edit": edit, "type": type, }
      });
    
  }

  onOverrideDocument(edit, type,remark) {
if(edit=='Y'){
  if(remark==undefined || remark==null || remark=='' ){
edit='N'
  }
  this.router.navigate(['/special'], {
    queryParams: { "id": this.selectedPayoutDetailId, "override": 'document', "edit": edit, "type": type, }
  });
   } }




  doActionOnPayoutDetail(action) {
    console.log("Grid Value  - " + action);
    if ('rc' != action) {

      if ('hold' != action) {

        if (this.otcPending.pendingOrNot == 'Y' && (this.otcPending.remarks == undefined || this.otcPending.remarks == null)) {
          this._alertify.showError("Please Upload Document For OTC Special Marking");
          return;
        }
        if (this.pddPending.pendingOrNot == 'Y' && (this.pddPending.remarks == undefined || this.pddPending.remarks == null)) {
          this._alertify.showError("Please Upload Document For PDD Special Marking");
          return;
        }
      }




      if ('hold' == action) {
        if ("Y" == this.otcPending.pendingOrNot
          || "Y" == this.pddPending.pendingOrNot) {
          if (this.selectedRemarksAction == undefined || this.selectedRemarksAction == null) {
            this.emptySelectedRemarkActionMsg = "Please Select Remark";
            return;
          }
        }
      }

      if (this.commentAction == undefined || this.commentAction == null || this.commentAction == '') {
        this.emptyCommentActionMsg = 'Please enter remark';
        return;
      }

      this.handleActionOnPayoutDetail(action);

    }

    else {
      this.recomputePayout();
    }
  }

  recomputePayout() {

    this._prService.recomputePayout(this.selectedPayoutDetailId).subscribe(data => {
      let msg = (data as any).message;
      console.log(msg)
      this.showAlert(msg, 'rc');
      this.refreshCaseData(this.selectedPayoutDetailId)
    },error=>this._alertify.showError(error.message));

  }

  async handleActionOnPayoutDetail(action) {
    try {


      const currentActiveUser = await this.getCurrentActiveUser();
      const currentSprint: SprintExecutionDto = await this._generalService.getCurrentSprint();
      if (this._prService.isRecomputeRequired(this.selectedPayoutDetailId)) {
        return;
      }
      let dto = new ActionDto();
      dto.action = action;
      dto.payoutDetail_Id = this.selectedPayoutDetailId;
      dto.commentAction = this.commentAction;
      dto.selectedRemarksAction = this.selectedRemarksAction;
      dto.remarksAction = '';
      dto.user_id = currentActiveUser.id,
        dto.selectedSprintExecutionId = currentSprint.id;


      this._prService.handleActionOnPayoutDetail(dto).subscribe(response => {
        let msg = (response as any).message;
        console.log(msg);
        this.showAlert(msg, action);
      }, (error) => {
        this._alertify.showError(error.message)
      });


    }
    catch (error) {
      console.log(error);

    }
  }

  showAlert(msg, action) {
    console.log();

    this.alert.create({
      message: msg,
      buttons: [{
        text: 'Okay',
        handler: () => {
          console.log('Confirm Okay');
          if (action != 'rc')
            this.router.navigate(['/payout-review', { "task": "refersh"+Math.random() }])
        }
      }]
    }).then(res => {

      res.present();

    });
  }


  onDownload(fileName, type) {
    this._prService.downloadSpecialFile(this.selectedPayoutDetailId, type).subscribe(response => {
      console.log(response);
      var blob = new Blob([response]);
      let filePath: string;
      let folderName = 'Incentivo_Download';
      //fileName = "file_" + new Date().getTime() + ".xlsx";
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

    }, (error => {
      console.log(error)
      this._alertify.showError(error)
    }));
  }


  toggleShow() {

    this.toggleRemarkDiv = !this.toggleRemarkDiv;

  }

  toogleMoreOptionDiv() {
    this.showMoreOptionDiv = !this.showMoreOptionDiv;
  }

}
