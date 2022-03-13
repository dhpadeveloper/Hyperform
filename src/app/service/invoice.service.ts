import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http'
import { Observable, throwError } from 'rxjs';
import { InvoiceData } from '../pojo/invoice-data';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private API_URL = environment.API_URL + 'invoices';

  constructor(private http: HttpClient) { }

  getInvoiceList(userId,sprintId,payoutId): Observable<InvoiceData[]> {
    let params = new HttpParams();
    params = params.set("user_id", userId);
    params = params.set("payoutType_id", payoutId);
    params = params.set("payoutInvoice.payout.sprintExecution.id", sprintId);
    return this.http.get<InvoiceData[]>(this.API_URL + '/', {params: params });
  }



  getInvoice(id): Observable<InvoiceData> {
    return this.http.get<InvoiceData>(this.API_URL + '/' + id);
  }


  onInvoiceDownload(invoice:InvoiceData): Observable<Blob> {
    console.log(invoice);

    return this.http.post<Blob>(this.API_URL + '/', invoice,
      { responseType: 'blob' as 'json' }).pipe(catchError(this.errorHandler));
  }

  errorHandler(errorResponse: HttpErrorResponse) {
    if (errorResponse.error instanceof ErrorEvent
    ) {
      console.log('Client Side Error ' + errorResponse.message);
    }
    else {
      console.log('Server Side Error ' + errorResponse.message);
    }
    return throwError(errorResponse);
  }



  onInvoiceUpload(file, dto): Observable<any> {
    let formData = new FormData();
    formData.append("file", file);
    formData.append("dataRequest", JSON.stringify(dto));
    console.log(formData.get("dataRequest"));
    return this.http.post<any>(this.API_URL + '/upload', formData).
      pipe(catchError(this.errorHandler));
  }


}
