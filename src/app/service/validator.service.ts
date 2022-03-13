import { Injectable } from '@angular/core';
import { SpecialCase } from "src/app/pojo/special-case"
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  constructor(private httpClient: HttpClient) { }

  private API_URL = environment.API_URL + 'payout';
 // url = 'http://192.168.0.112:8080/PCMS_V2_HomeLoan/api/payout';
  //url = 'http://localhost:8080/PCMS_V2_HomeLoan/api/payout';
  headers = new HttpHeaders({ Authorization: this.createBasicAuth('adminmaker', 'default') })
  public createBasicAuth(username: String, password: String) {
    return 'Basic ' + window.btoa(username + ":" + password)
  }

  getLatestValue(payoutDetail_Id, type): Observable<number> {
    let params = new HttpParams();
    params = params.set('type', type);
    return this.httpClient.get<number>(this.API_URL + '/value/' + payoutDetail_Id, { params: params});
  }

  public validateValue(special_case: SpecialCase, payoutDetail_Id): string {
    console.log("kebfjh.." + special_case.type)
    console.log("Validation call");
    let valueMsg = "";
    let overrideValue = special_case.value;
    let places = "Value must accept 2 Decimal Places";
    let placesAmt = " Value accept upto 2 Decimal Places";
    let percentPattern = new RegExp("^100$|^100.00$|^\\d{0,2}(\\.\\d{2}) *%?$");
    let amountPattern = new RegExp("^[0-9]+(\\.[0-9]{1,2})?$");
    let selected_type: string = special_case.type;


    if (selected_type.includes("payout")) {
      if (overrideValue == undefined || overrideValue == null) {
        valueMsg = "Please Enter Payout / Payout (%)";
      }
      else {
        if (selected_type == "payout(Amt)") {

          if (!amountPattern.test(String(overrideValue))) {
            valueMsg = "Incorrect Payout" + placesAmt;
          }
        }
        else {
          if (!percentPattern.test(String(overrideValue))) {
            valueMsg = "Incorrect Payout (%)" + places;
          }
        }

      }
    }




    if (selected_type.includes("procFee")) {
      if (overrideValue == undefined || overrideValue == null) {
        valueMsg = "Please Enter Processing Fee / Processing Fee (%)";
      } else {
        if (selected_type == "procFee(Amt)") {
          if (!amountPattern.test(String(overrideValue))) {
            valueMsg = "Incorrect Processing Fee" + placesAmt;
          }
        } else {
          if (!percentPattern.test(String(overrideValue))) {
            valueMsg = "Incorrect Processing Fee (%)" + places;
          }
        }
      }
    }
    if (selected_type == "od") {
      if (overrideValue == undefined || overrideValue == null) {
        valueMsg = "Please Enter OD Payout (%)";
      } else {
        if (!percentPattern.test(String(overrideValue))) {
          console.log("od percentage");
          valueMsg = "Incorrect OD Payout (%)" + places;
        }
      }
    }

    if (selected_type == "cutt-off") {
      if (overrideValue == undefined || overrideValue == null) {
        valueMsg = "Please Enter Cutoff Payout Capping Amount";
      } else {
        if (!amountPattern.test(String(overrideValue))) {
          valueMsg =
            "Incorrect Cutoff Payout Capping Amount" + placesAmt;
        }
      }
    }

    if (selected_type == "gst") {
      if (overrideValue == undefined || overrideValue == null) {
        valueMsg = "Please Enter GST (%)";
      } else {
        if (!percentPattern.test(String(overrideValue))) {
          valueMsg = "Incorrect GST (%)" + places;
        }
      }
    }



    if (selected_type == "kli") {
      if (overrideValue == undefined || overrideValue == null) {
        valueMsg = "Please Enter KLI (%)";
      } else {
        if (!percentPattern.test(String(overrideValue))) {
          valueMsg =
            "Incorrect KLI (%)" + places;
        }
      }
    }


    if (selected_type == "kgi") {
      if (overrideValue == undefined || overrideValue == null) {
        valueMsg = "Please Enter KGI (%)";
      } else {
        if (!percentPattern.test(String(overrideValue))) {
          valueMsg =
            "Incorrect KGI (%)" + placesAmt;
        }
      }
    }

    return valueMsg;
  }


  public validateRemark(special_case: SpecialCase): string {
    let remarkMsg = "";
    let remark = special_case.remarks;
    let selected_type: string = "";
    selected_type = special_case.type;
    if (selected_type.includes("payout")) {
      if (remark == undefined || remark == null || remark == "") {
        remarkMsg = "Remarks For Payout";
      }
    }

    if (selected_type.includes("processing")) {
      if (remark == undefined || remark == null || remark == "") {
        remarkMsg = "Remarks For Processing Fee ";
      }
    }
    if (selected_type == "od") {
      if (remark == undefined || remark == null || remark == "") {
        remarkMsg = "Remarks For OD Payout Special Marking";
      }
    }

    if (selected_type == "cutt-off") {
      if (remark == undefined || remark == null || remark == "") {
        remarkMsg = "Remarks For Cutoff Payout Special Marking";
      }
    }

    if (selected_type == "gst") {
      if (remark == undefined || remark == null || remark == "") {
        remarkMsg = "Remarks For GST Special Marking";
      }
    }


    if (selected_type == "kli") {
      if (remark == undefined || remark == null || remark == "") {
        remarkMsg = "Remarks For KLI Special Marking";
      }
    }
    if (selected_type == "kgi") {
      if (remark == undefined || remark == null || remark == "") {
        remarkMsg = "Remarks For KGI Special Marking";
      }
    }

    return remarkMsg;

  }


  public validateFile(file: File): string {
    console.log("file valid")
    //  let fileNamePattren = new RegExp("(([a-zA-Z0-9\\s_\\.\\-\\(\\):])+(\\.(?i)(pdf|jpe?g|png|docx|tiff|pst|eml|msg))$)");
    if (file.size < 4000 || file.size > 5000000) {
      console.log("size");
      return "File size must be between 4KB and 5MB."
    }
    // else if(!fileNamePattren.test(file.name)){
    //   return "Only pdf,jpeg,jpg,word,png,tiff,outlook item allowed."
    // }
    else {
      return "";
    }

  }

  validateInvoiceFile(file: File, invoiceId: number): boolean {
    if ("Invoice_" + 9 + ".pdf" === file.name) {
      return true;
    }
    else return false;

  }

}





