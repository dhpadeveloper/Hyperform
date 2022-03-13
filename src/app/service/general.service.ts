import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { PayoutType } from '../pojo/payout-type';
import { SprintExecutionDto } from '../pojo/sprint-execution-dto';


@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  private payoutTypes = new BehaviorSubject<PayoutType[]>(null);
  private currentPayoutType = new BehaviorSubject<PayoutType>(null);
  private currentSprint = new BehaviorSubject<SprintExecutionDto>(null);
  private caseDetailRefreshNeeded = new BehaviorSubject<boolean>(false);
  private payoutReviewRefreshNeeded = new BehaviorSubject<boolean>(false);
  constructor() {
    console.log("General Construtor")
  }


  public changeCurrentPayoutType(type: PayoutType) {
     console.log("Type Changed =" + type.type);
    this.currentPayoutType.next(type);
  }

  public getCurrentPayoutType():Observable<PayoutType> {
    return this.currentPayoutType;
  }


  public getCurrentPayoutTypeAsPromise():Promise<PayoutType> {
    console.log("get/....")

    return new Promise((resolve, reject) => {
      let subscription = this.currentPayoutType.subscribe( 
        result => { resolve(result) }, 
        error => { reject(error) }
        );
    });
  }




  public changeCurrentSprint(sprint: SprintExecutionDto) {
    console.log("Sprint Changed =" +sprint);
   this.currentSprint.next(sprint);
 }

 public getCurrentSprint():Promise<SprintExecutionDto> {
  return new Promise((resolve, reject) => {
    let subscription = this.currentSprint.subscribe( 
      result => { resolve(result) }, 
      error => { reject(error) }
      );
  }); 
 }


  setPayoutTypeList(payoutTypes: PayoutType[]) {
    this.payoutTypes.next(payoutTypes);
  }

  getPayoutTypeList(): Observable<PayoutType[]> {
    return this.payoutTypes;
  }




  public changeCaseDetailRefreshNeeded(value: boolean) {
   this.caseDetailRefreshNeeded.next(value);
 }

 public getCaseDetailRefreshNeeded():Observable<boolean> {
   return this.caseDetailRefreshNeeded.asObservable();
 }

 public changePayoutReviewRefreshNeeded(value: boolean) {
  this.payoutReviewRefreshNeeded.next(value);
}

public getPayoutReviewRefreshNeeded():Observable<boolean> {
  return this.payoutReviewRefreshNeeded.asObservable();
}


}
