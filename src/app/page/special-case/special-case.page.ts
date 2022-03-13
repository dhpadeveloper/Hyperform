import { Component, OnInit } from "@angular/core";
import { ActivatedRoute,Router } from "@angular/router";
import { SpecialCase } from "src/app/pojo/special-case";
import { PayoutReviewService } from "src/app/service/payout-review.service";
import { ValidatorService } from "src/app/service/validator.service";
import { AlertController } from '@ionic/angular';
import { GeneralService } from "src/app/service/general.service";
import { AlertifyService } from "src/app/service/alertify.service";
class KeyValuePair {
  key: string;
  value: string;
}

@Component({
  selector: "app-special-case",
  templateUrl: "./special-case.page.html",
  styleUrls: ["./special-case.page.scss"],
})
export class SpecialCasePage implements OnInit {
  public selectedPayoutDetailId: number;
  public page_title: string;
  public specialType: KeyValuePair[] = [];
  public documentList: KeyValuePair[] = [];
  public selectedDocumentType: string;
  public special_case = new SpecialCase();
  public fileUploadMsg: string;
  public userFile: File;
  public userFileName: string;
  public remarkMsg: string;
  public valueMsg: string;
  public typeNotSelectedMsg: string;

  constructor(
    private activatedRouteInstance: ActivatedRoute,
    private router: Router,
    private _payoutService: PayoutReviewService,
    private _generalService:GeneralService,
    private _validateService: ValidatorService,
    private _alertify:AlertifyService,
    private alert: AlertController
  ) {

  }

  ngOnInit() {
    this.remarkMsg = "";
    this.valueMsg = "";
    this.typeNotSelectedMsg = "";
    this.fileUploadMsg = "";

    this.activatedRouteInstance.queryParams.subscribe((data) => {
      this.selectedPayoutDetailId = parseInt(data.id);
      let override = data.override;
      let type = data.type;
      this.setTypeForOverride(override, type,data.edit);
      if (data.edit == 'Y') {
        console.log('update call'+type);
        this._payoutService.getPerticularOverrideDetail(this.selectedPayoutDetailId, override, type).
          subscribe(data => {
            this.special_case = data;
            this.userFileName = this.special_case.fileName;
            console.log(this.special_case);
            
          });
      }
    });
  }


  public selectedType:string;
  setTypeForOverride(override, type: string,edit) {
    if (override === "special") {
      this.page_title = "Special Payout";
      this.specialType = [
        { key: "Payout %", value: "payout(%)" },
        { key: "Payout Amount", value: "payout(Amt)" },
        { key: "Processing Fee (%)", value: "procFee(%)" },
        { key: "Processing Fee (Amount)", value: "procFee(Amt)" },
        { key: "OD Payout (%)", value: "od" },
        { key: "Cut-off Payout Capping (Amount)", value: "capping" },
        { key: "GST (%)", value: "gst" },
      ];
    } else if (override === "insurance") {
      this.page_title = "Insurance Calculated";
      this.specialType = [
        { key: "KLI (%)", value: "kli(%)" },
        { key: "KLI Premium", value: "kli_prm" },
        { key: "KGI (%)", value: "kgi(%)" },
        { key: "KGI Premium", value: "kgi_prm" }
      ];
    } else if (override === "document") {
      console.log("inside document");
      
      this.page_title = "Document Details";
      this.specialType = [
        { key: "OTC", value: "otc" },
        { key: "PDD", value: "pdd" },
      ];
      this.documentList = [
        { key: "Critical Docs Pending", value: "CDP" },
        { key: "Non Critical Docs Pending", value: "NCDP" },
      ];
      console.log("..........................................."+type);
      this.special_case = new SpecialCase();
      this.selectedType=type;
      //this.specialType.filter(s=> s.value==type.trim())[0].value;
      this.special_case.type =  this.specialType[0].value;
      this.special_case.fileName = this.documentList[0].value;
      this.special_case.remarks=null;
      this.special_case.pendingOrNot=edit;
      



    }
    console.log(this.special_case)
  }

  public validateValue() {
    this.valueMsg = "";
    if (this.special_case.type == undefined || this.special_case.type == null) {
      this.valueMsg = "Please select type and enter value";
    } else {
      this.valueMsg = this._validateService.validateValue(this.special_case, this.selectedPayoutDetailId);



      if (this.valueMsg == '' && this.special_case.type.includes('payout') && this.special_case.value.toString().length > 3) {
        this._validateService.getLatestValue(this.selectedPayoutDetailId, this.special_case.type).subscribe(value => {
          if (this.special_case.value > value)
            this.valueMsg = this.special_case.type == "payout(%)" ?
              "Payout % can't be greater than the calculated value" :
              "Payout Amount can't be greater than the calculated value";
        }
        );
      }

    }

  }

  public validateRemark() {
    this.remarkMsg = "";

    if (this.special_case.remarks == undefined || this.special_case.remarks == null) {
      this.remarkMsg = "Please Enter Remark";
    } else {
      this.remarkMsg = this._validateService.validateRemark(this.special_case);
    }
  }

  onTypeSelected() {
    this.typeNotSelectedMsg = '';
    if (
      this.special_case.type == undefined ||
      this.special_case.type == null ||
      this.special_case.type == ""
    ) {
      this.typeNotSelectedMsg = "Please Select Type";
    } else {
      this.valueMsg = '';
    }
  }

  loadImageFromDevice(event) {
    this.fileUploadMsg = '';
    let file = event.target.files[0];
    this.fileUploadMsg = this._validateService.validateFile(file);
    if (this.fileUploadMsg == '') {
      this.userFile = file;
      this.userFileName = this.userFile.name;
      console.log(this.userFile);
    }
  }
  public onSubmit() {
    if (this.userFile == undefined) {
      this.fileUploadMsg = "Please upload file";
    }

    this.onTypeSelected();
    this.validateValue();
    this.validateRemark();

    if (this.valueMsg == '' && this.remarkMsg == '' && this.typeNotSelectedMsg == '' && this.fileUploadMsg == '') {

      console.log("start submit")
      this.special_case.payoutDetail_Id = this.selectedPayoutDetailId;
      this.special_case.overrideType =
        this.page_title == "Special Payout"
          ? "special"
          : this.page_title == "Insurance Calculated"
            ? "insurance"
            : "document";
      const formData = new FormData();
      formData.append("special", JSON.stringify(this.special_case));
      formData.append("file", this.userFile);
      this._payoutService.onSpecialSubmit(formData).subscribe(
        (response) => {
          console.log(response);
          this._generalService.changeCaseDetailRefreshNeeded(true);
          this.showAlert((response as any).message)
        },
        (error) => {
          console.log(error.message);
          this._alertify.showError(error.message);

        }
      );
    }
  }



  showAlert(msg) {
    console.log();
    
    this.alert.create({
      message: msg,
      buttons: [{
        text: 'Okay',
        handler: () => {
          console.log('Confirm Okay');
          this.router.navigate(['/payout-review/cases',this.selectedPayoutDetailId]);
        }
      }]
    }).then(res => {

      res.present();

    });
  }


}
