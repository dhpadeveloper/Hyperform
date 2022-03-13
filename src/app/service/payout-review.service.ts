import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { PayoutReviewDataGridDto } from 'src/app/pojo/payout-review-data-grid-dto'
import { PayoutType } from 'src/app/pojo/payout-type';
import { SprintExecutionDto } from 'src/app/pojo/sprint-execution-dto';
//import {catchError} from 'rxjs/operators'
import { catchError, map, retry } from 'rxjs/operators';
import { CaseDetailWrapperDto } from 'src/app/pojo/case-detail-wrapper-dto';
import { SpecialCase } from 'src/app/pojo/special-case';
import { User } from 'src/app/pojo/user';
import { ActionDto } from '../pojo/action-dto';
import { environment } from '../../environments/environment';
import { AppConstant } from '../pojo/app-constant';


@Injectable({
  providedIn: 'root'
})


export class PayoutReviewService {
  private API_URL = environment.API_URL + 'payout';
  constructor(private http: HttpClient) { }
  
  getPayoutTypes(userId: number): Observable<PayoutType[]> {
    console.log("get payout..........");
    let params = new HttpParams().set("user_id", userId);
    return this.http.get<PayoutType[]>(this.API_URL + '/types', { params: params });

  }

  getChildUserList(userId): Observable<User[]> {
    let user_id = userId.toString();
    return this.http.get<User[]>(this.API_URL + '/childUser/' + user_id);
  }


  getGridData(userId, segment, filtermap: Map<string, any>, resultSet, currentProduct): Observable<PayoutReviewDataGridDto[]> {
    let arr: { [key: string]: any } = {}

    filtermap.forEach((val: any, key: string) => {

      arr[key] = val;
    });
    let item = { "user_id": userId, "type": segment, "filterMap": arr, "productName": currentProduct, "resultSet": resultSet };
    console.log(item);
    return this.http.post<PayoutReviewDataGridDto[]>(this.API_URL + '/cases', item);

  }



  getCaseDetail(selectedCaseId, sprintId, userId, product): Observable<CaseDetailWrapperDto> {

    let params = new HttpParams();
    params = params.set("user_id", userId);
    params = params.set("sprint_id", sprintId);
    params = params.set("pName", product);
    return this.http.get<CaseDetailWrapperDto>(this.API_URL + '/cases/' + selectedCaseId, { params: params });
  }



  getSprintList(payout_id): Observable<SprintExecutionDto[]> {
    let params = new HttpParams();
    params = params.set("payout_id", payout_id);
    return this.http.get<SprintExecutionDto[]>(this.API_URL + '/sprints', { params: params });

  }

  downloadCaseDetailFile(userId, sprintId): Observable<Blob> {
    let item = {
      "user_id": userId,
      "type": "DSA",
      "filterMap": {
        "payoutDetail.payout.sprintExecution.id,payoutDeduction.payout.sprintExecution.id": sprintId
      }
    };
    console.log(item);
    return this.http.post<Blob>(this.API_URL + '/download', item,
      { responseType: 'blob' as 'json' }).pipe(catchError(this.errorHandler));
  }
  downloadHoldRecordFile(userId, sprintId): Observable<Blob> {
    let dto = {
      "user_id": userId,
      "filterMap": {
        "payoutDetail.payout.sprintExecution.id,payoutDeduction.payout.sprintExecution.id": sprintId
      }
    };
    console.log(dto);
    return this.http.post<Blob>(this.API_URL + '/downloadhr', dto,
      { responseType: 'blob' as 'json' }).pipe(catchError(this.errorHandler));
  }

  errorHandler(errorResponse: HttpErrorResponse) {
    if (errorResponse.error instanceof ErrorEvent) {
      console.log('Client Side Error ' + errorResponse.message);
      return throwError(errorResponse.error.message);
    }
    else {
      console.log('Server Side Error');
      return throwError("Failed To Download");

    }

  }

  downloadSpecialFile(id, type): Observable<Blob> {

    let params = new HttpParams();
    params = params.set('id', id);
    params = params.set('type', type);

    return this.http.get<Blob>(this.API_URL + '/special/download',
      { params: params, responseType: 'blob' as 'json' }).pipe(catchError(this.errorHandler));
  }




  doAction(dto: ActionDto): Observable<string> {

    return this.http.post<string>(this.API_URL + '/action', dto);
  }


  onSpecialSubmit(formdata: FormData): Observable<string> {
    return this.http.post<string>(this.API_URL + '/special', formdata);
  }


  getPerticularOverrideDetail(id, override, type): Observable<SpecialCase> {
    console.log(id + override + type);
    let params = new HttpParams();
    params = params.set("id", id);
    params = params.set("type", override + "/" + type);
    return this.http.get<SpecialCase>(this.API_URL + '/special', { params: params });
  }



  handleActionOnPayoutDetail(actionDto): Observable<any> {
    return this.http.post<any>(this.API_URL + '/cases/action', actionDto);
  }


  isRecomputeRequired(id): boolean {
    return;
  }



  recomputePayout(id): Observable<string> {
    return this.http.get<string>(this.API_URL + '/recompute/' + id);
  }

}
