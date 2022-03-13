import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { InvoiceData } from "src/app/pojo/invoice-data";
import { File, FileEntry } from "@ionic-native/file/ngx";
import { InvoiceService } from "src/app/service/invoice.service";
import { Platform } from "@ionic/angular";
import { PreviewAnyFile } from '@ionic-native/preview-any-file/ngx';
import { InvoiceRequestDto } from 'src/app/pojo/invoice-request-dto'
import { error } from "protractor";
import { ValidatorService } from "src/app/service/validator.service";
import { AlertController } from '@ionic/angular';
import { AlertifyService } from 'src/app/service/alertify.service';
import { AuthService } from "src/app/service/auth.service";
import { AppConstant } from 'src/app/pojo/app-constant';
import { GeneralService } from "src/app/service/general.service";


@Component({
  selector: "app-invoice-detail",
  templateUrl: "./invoice-detail.page.html",
  styleUrls: ["./invoice-detail.page.scss"],
})
export class InvoiceDetailPage implements OnInit {
  private selectedInvoiceId: number;
  public currentInvoice = new InvoiceData();
  public remarkInvalidMsg: string = "";
  public dataInValidFlag: boolean = false;
  public hsnInvalidMsg: string = "";
  public invoiceNoInvalidMsg: string = "";
  public fileInvalidMsg: string = "";

  constructor(
    private avRoute: ActivatedRoute,
    private file: File,
    private _invoiceService: InvoiceService,
    private platform: Platform,
    private previewAnyFile: PreviewAnyFile,
    private _vlService: ValidatorService,
    private router: Router,
    private alert: AlertController,
    private _alertify: AlertifyService,
    private _authService: AuthService,
    private _generalService: GeneralService
  ) { }

  ngOnInit() {
    this.avRoute.paramMap.subscribe((params: ParamMap) => {
      this.selectedInvoiceId = parseInt(params.get("id"));
      this.currentInvoice.id = this.selectedInvoiceId;
      console.log(this.selectedInvoiceId);
    });



    this._invoiceService.getInvoice(this.selectedInvoiceId)
    .subscribe((response) => this.currentInvoice = response,
     (error) => this._alertify.showError(error.message));


  }


  validateInvoiceNo() {
    if (
      this.currentInvoice.invoiceNo == undefined ||
      this.currentInvoice.invoiceNo == null ||
      this.currentInvoice.invoiceNo == ""
    ) {
      this.invoiceNoInvalidMsg = "Please Enter Invoice No";
      this.dataInValidFlag = true;
    } else {
      this.invoiceNoInvalidMsg = "";
      this.dataInValidFlag = false;
    }
  }


  validateHsnValue() {
    let hsn_sacPattern = new RegExp("^[a-zA-Z0-9]{2,30}$");
    if (this.currentInvoice.hsnNo == undefined || this.currentInvoice.hsnNo == null || this.currentInvoice.hsnNo == "") {
      this.hsnInvalidMsg = "Please Enter Hsn";
      this.dataInValidFlag = true;
    } else if (!hsn_sacPattern.test(this.currentInvoice.hsnNo)) {
      this.hsnInvalidMsg =
        "Does not matches the policy Must Be Alpha/Numeric of length 2-30";
      this.dataInValidFlag = true;
    }
    else {
      this.hsnInvalidMsg = "";
      this.dataInValidFlag = false;

    }
  }

  validateRemark() {
    if (
      this.currentInvoice.remarks == undefined ||
      this.currentInvoice.remarks == null ||
      this.currentInvoice.remarks == ""
    ) {
      this.remarkInvalidMsg = "Please Enter Remarks";
      this.dataInValidFlag = true;
    } else {
      this.remarkInvalidMsg = "";
      this.dataInValidFlag = false;
    }
  }




  onInvoiceDownloadOrUpload(action, event) {
    console.log(action)
    if (action == 'download') {
      this.onInvoiceDownload();
    }
    else {
      this.fileInvalidMsg = '';
      this.onInvoiceUpload(event);
    }
  }


  onInvoiceDownload() {

    this.validateInvoiceNo();
    this.validateHsnValue();
    this.validateRemark();

    if (!this.dataInValidFlag) {
      this._invoiceService.onInvoiceDownload(this.currentInvoice).subscribe((response) => {
        console.log(response);
        const blob = new Blob([response], { type: 'application/pdf' });
        let filePath: string;
        let folderName = 'Invoice_Download';
        let fileName = "Invoice" + this.selectedInvoiceId + ".pdf";
        console.log("path " + fileName);
        console.log("platform " + this.platform.platforms);
        if (this.platform.is("android")) {
          filePath = this.file.externalDataDirectory;
        } else {
          filePath = this.file.documentsDirectory;
        }
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


      }, error => console.log(error));
    }
  }

  async onInvoiceUpload(event) {

    const currentActiveUser = await this._authService.getCurrentUser(AppConstant.USER_NAME_SESSION_ATTRIBUTE_NAME);
    const currentPayout = await this._generalService.getCurrentPayoutTypeAsPromise();
    const currentSprint = await this._generalService.getCurrentSprint();
    let file = event.target.files[0];
    if (!this._vlService.validateInvoiceFile(file, this.selectedInvoiceId)) {
      this.fileInvalidMsg = "File name should be : Invoice_" + this.selectedInvoiceId + ".pdf";
      return
    }
    console.log(file);
    let dataRequest = new InvoiceRequestDto();
    dataRequest.user_id = currentActiveUser.id;
    dataRequest.sprint_id = currentSprint.id;
    dataRequest.payout_invoice_id =this.selectedInvoiceId;
    this._invoiceService.onInvoiceUpload(file, dataRequest).subscribe(response => {
      console.log(response);
      this.showAlert((response as any).message);

    }, error => console.log(error));

  }


  showAlert(msg) {
    this.alert.create({
      message: msg,
      buttons: [{
        text: 'Okay',
        handler: () => {
          console.log('Confirm Okay');
          this.router.navigate(['/invoice']);
        }
      }]
    }).then(res => {

      res.present();

    });
  }





}
